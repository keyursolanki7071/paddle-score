<?php

declare(strict_types=1);

namespace App\Actions\Match;

use App\Models\MatchSet;
use App\Models\TournamentMatch;

final readonly class UndoLastPointAction
{
    public function handle(TournamentMatch $match): array
    {
        $lastPoint = $match->points()
            ->where('is_undone', false)
            ->latest('created_at')
            ->first();

        if (!$lastPoint) {
            return ['error' => 'No points to undo.'];
        }

        // Mark as undone
        $lastPoint->update(['is_undone' => true]);

        // Recalculate set scores from remaining non-undone points
        $set = $match->activeSet ?? MatchSet::find($lastPoint->set_id);

        $lastActivePoint = $set->points()
            ->where('is_undone', false)
            ->latest('created_at')
            ->first();

        if ($lastActivePoint) {
            $set->update([
                'team_a_score' => $lastActivePoint->team_a_score_after,
                'team_b_score' => $lastActivePoint->team_b_score_after,
            ]);
        } else {
            // No points left in this set
            $set->update(['team_a_score' => 0, 'team_b_score' => 0]);
        }

        // Restore previous server
        $previousPoint = $set->points()
            ->where('is_undone', false)
            ->latest('created_at')
            ->first();

        if ($previousPoint) {
            $match->update(['server_team_id' => $previousPoint->server_team_id]);
        }

        return [
            'match'  => $match->fresh()->load(['sets', 'teamA', 'teamB', 'serverTeam', 'tournament']),
            'set'    => $set->fresh(),
            'undone' => $lastPoint,
        ];
    }
}
