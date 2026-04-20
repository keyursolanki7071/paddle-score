<?php

declare(strict_types=1);

namespace App\Actions\Match;

use App\Enums\Tournament\MatchStatus;
use App\Models\MatchSet;
use App\Models\TournamentMatch;

final readonly class StartMatchAction
{
    public function handle(TournamentMatch $match): TournamentMatch
    {
        if ($match->status === MatchStatus::COMPLETED) {
            throw new \RuntimeException('Cannot start a match that is already completed.');
        }
        
        // Set match as live
        $match->update([
            'status'     => MatchStatus::LIVE,
            'started_at' => now(),
            // Default serve to team A if not set
            'server_team_id' => $match->server_team_id ?? $match->team_a_id,
        ]);

        // Create first set
        MatchSet::create([
            'match_id'     => $match->id,
            'set_number'   => 1,
            'team_a_score' => 0,
            'team_b_score' => 0,
            'team_a_games' => 0,
            'team_b_games' => 0,
            'is_active'    => true,
        ]);

        return $match->fresh()->load(['teamA', 'teamB', 'sets', 'serverTeam', 'tournament']);
    }
}
