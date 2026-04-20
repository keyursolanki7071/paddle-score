<?php

declare(strict_types=1);

namespace App\Actions\Match;

use App\Enums\Tournament\MatchStatus;
use App\Enums\Tournament\TournamentStatus;
use App\Models\TournamentMatch;

final readonly class FinishMatchAction
{
    public function handle(TournamentMatch $match, string $winnerTeamId): TournamentMatch
    {
        $match->update([
            'status'       => MatchStatus::COMPLETED,
            'winner_id'    => $winnerTeamId,
            'completed_at' => now(),
        ]);

        // 1. Advance to next round if applicable
        $nextPos = $match->nextMatchPosition();
        if ($nextPos) {
            TournamentMatch::where('tournament_id', $match->tournament_id)
                ->where('round', $nextPos['round'])
                ->where('sort_order', $nextPos['sort_order'])
                ->update([
                    $nextPos['side'] . '_id' => $winnerTeamId
                ]);
        }

        // 2. Close any still-active set
        $match->sets()->where('is_active', true)->update([
            'is_active'    => false,
            'completed_at' => now(),
        ]);

        // 3. Check if whole tournament is done
        $tournament = $match->tournament;
        $remaining  = $tournament->matches()
            ->whereIn('status', [MatchStatus::SCHEDULED->value, MatchStatus::LIVE->value])
            ->count();

        if ($remaining === 0) {
            $tournament->update(['status' => TournamentStatus::COMPLETED]);
        }

        return $match->fresh()->load(['teamA', 'teamB', 'sets', 'winner', 'points', 'tournament']);
    }
}
