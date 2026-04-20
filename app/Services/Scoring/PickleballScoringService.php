<?php

declare(strict_types=1);

namespace App\Services\Scoring;

use App\Models\MatchPoint;
use App\Models\MatchSet;
use App\Models\Team;
use App\Models\TournamentMatch;

/**
 * Pickleball Scoring Rules:
 * - Games played to N points (default 11), win by 2
 * - Side-out serving: ONLY the serving team can score a point
 * - If non-serving team wins rally → side-out (serve switches), no point awarded
 * - Match is best of N sets (default 1)
 */
class PickleballScoringService
{
    /**
     * Process a rally result.
     * $winnerTeamId = team that won the rally (not necessarily scored a point)
     */
    public function recordRally(TournamentMatch $match, string $winnerTeamId): array
    {
        $set = $match->activeSet;
        if (!$set) {
            throw new \RuntimeException('No active set found for this match.');
        }

        $tournament = $match->tournament;
        $pointsToWin = $tournament->points_to_win;
        $winByTwo = $tournament->win_by_two;
        $currentServer = $match->server_team_id;

        $isServerWon = ($winnerTeamId === $currentServer);
        $pointScored = $isServerWon; // Only server can score a point
        $newServer = $isServerWon ? $currentServer : $winnerTeamId; // If server loses, switch serve

        $teamAId = $match->team_a_id;
        $teamBId = $match->team_b_id;

        $newScoreA = $set->team_a_score;
        $newScoreB = $set->team_b_score;

        if ($pointScored) {
            if ($winnerTeamId === $teamAId) {
                $newScoreA++;
            } else {
                $newScoreB++;
            }
        }

        // Log the point (even if it's a side-out with no score change, log for history)
        MatchPoint::create([
            'match_id'           => $match->id,
            'set_id'             => $set->id,
            'scored_by_team_id'  => $winnerTeamId,
            'server_team_id'     => $currentServer,
            'team_a_score_after' => $newScoreA,
            'team_b_score_after' => $newScoreB,
            'created_at'         => now(),
        ]);

        // Update set scores
        $set->update([
            'team_a_score' => $newScoreA,
            'team_b_score' => $newScoreB,
        ]);

        // Update server on match
        $match->update(['server_team_id' => $newServer]);
        $match->refresh();

        // Check if set is won
        $setWinner = $this->checkSetWinner($newScoreA, $newScoreB, $pointsToWin, $winByTwo, $teamAId, $teamBId);
        $matchWinner = null;

        if ($setWinner) {
            $this->closeSet($set, $setWinner, $match);
            $matchWinner = $this->checkMatchWinner($match, $tournament->sets_to_win, $setWinner);

            if (!$matchWinner) {
                // Open next set
                $this->openNextSet($match);
            }
        }

        return [
            'set'          => $set->fresh(),
            'match'        => $match->fresh()->load(['sets', 'teamA', 'teamB', 'serverTeam']),
            'set_winner'   => $setWinner,
            'match_winner' => $matchWinner,
            'serve_switch' => !$isServerWon,
            'point_scored' => $pointScored,
        ];
    }

    private function checkSetWinner(
        int $scoreA, int $scoreB,
        int $pointsToWin, bool $winByTwo,
        string $teamAId, string $teamBId
    ): ?string {
        $minScore = max($scoreA, $scoreB);
        if ($minScore < $pointsToWin) {
            return null;
        }

        $diff = abs($scoreA - $scoreB);

        if ($winByTwo && $diff < 2) {
            return null; // Win by two not satisfied
        }

        return $scoreA > $scoreB ? $teamAId : $teamBId;
    }

    private function closeSet(MatchSet $set, string $winnerId, TournamentMatch $match): void
    {
        $set->update([
            'winner_id'    => $winnerId,
            'is_active'    => false,
            'completed_at' => now(),
        ]);
    }

    private function checkMatchWinner(TournamentMatch $match, int $setsToWin, string $lastSetWinnerId): ?string
    {
        $match->refresh();
        $aWins = $match->sets()->where('winner_id', $match->team_a_id)->count();
        $bWins = $match->sets()->where('winner_id', $match->team_b_id)->count();

        if ($aWins >= $setsToWin) {
            return $match->team_a_id;
        }
        if ($bWins >= $setsToWin) {
            return $match->team_b_id;
        }

        return null;
    }

    private function openNextSet(TournamentMatch $match): MatchSet
    {
        $nextNumber = $match->sets()->count() + 1;

        return MatchSet::create([
            'match_id'     => $match->id,
            'set_number'   => $nextNumber,
            'team_a_score' => 0,
            'team_b_score' => 0,
            'is_active'    => true,
        ]);
    }
}
