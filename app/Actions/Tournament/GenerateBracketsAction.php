<?php

declare(strict_types=1);

namespace App\Actions\Tournament;

use App\Enums\Tournament\MatchStatus;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Support\Collection;

final readonly class GenerateBracketsAction
{
    public function handle(Tournament $tournament): Collection
    {
        $teams = $tournament->registrations()
            ->with('team')
            ->get()
            ->sortBy('seed')
            ->pluck('team');

        $count = $teams->count();
        if ($count < 2) {
            throw new \RuntimeException('Need at least 2 registered teams to generate brackets.');
        }

        // 1. Calculate bracket depth (nearest power of 2)
        $roundsNeeded = (int) ceil(log($count, 2));
        $totalMatchesExpected = (1 << $roundsNeeded) - 1; // 2^R - 1
        
        $matches = collect();

        // 2. Generate placeholders for ALL rounds first
        // We do this so we can easily find 'next' match in FinishMatchAction
        for ($r = 1; $r <= $roundsNeeded; $r++) {
            $matchesInRound = 1 << ($roundsNeeded - $r); // Round 1 has 2^(R-1) matches
            for ($i = 0; $i < $matchesInRound; $i++) {
                $match = TournamentMatch::create([
                    'tournament_id' => $tournament->id,
                    'status'        => MatchStatus::SCHEDULED,
                    'round'         => $r,
                    'sort_order'    => $i,
                ]);
                $matches->push($match);
            }
        }

        // 3. Fill Round 1 with registered teams
        $round1Matches = $matches->where('round', 1)->sortBy('sort_order')->values();
        $teamList      = $teams->values();
        
        foreach ($round1Matches as $index => $match) {
            $teamA = $teamList->get($index * 2);
            $teamB = $teamList->get($index * 2 + 1);

            $match->update([
                'team_a_id'      => $teamA?->id,
                'team_b_id'      => $teamB?->id,
                'server_team_id' => $teamA?->id,
            ]);

            // 4. Handle Byes (If only Team A exists, move to next round automatically)
            if ($teamA && !$teamB) {
                $this->advanceToNextRound($match, $teamA->id);
            }
        }

        // Mark tournament as ongoing
        $tournament->update(['status' => \App\Enums\Tournament\TournamentStatus::ONGOING]);

        return $matches;
    }

    private function advanceToNextRound(TournamentMatch $match, string $winnerId): void
    {
        $match->update([
            'status'    => MatchStatus::COMPLETED,
            'winner_id' => $winnerId,
            'completed_at' => now(),
        ]);

        $nextPos = $match->nextMatchPosition();
        if ($nextPos) {
            TournamentMatch::where('tournament_id', $match->tournament_id)
                ->where('round', $nextPos['round'])
                ->where('sort_order', $nextPos['sort_order'])
                ->update([
                    $nextPos['side'] . '_id' => $winnerId
                ]);
        }
    }
}
