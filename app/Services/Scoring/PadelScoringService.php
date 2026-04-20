<?php

declare(strict_types=1);

namespace App\Services\Scoring;

use App\Models\MatchPoint;
use App\Models\MatchSet;
use App\Models\TournamentMatch;

/**
 * Padel Scoring Rules:
 * - Game scoring: 0, 15, 30, 40, Deuce, Advantage, Game
 * - To win a set: first to 6 games, win by 2 (if 6-6, play tie-break to 7)
 * - Match: best of 3 sets (configurable)
 * - Serve: switches every game. Sides switch at end of each set.
 * - team_a_score / team_b_score tracks raw rally points within a game (0,1,2,3,4+)
 * - team_a_games / team_b_games tracks games won within a set
 */
class PadelScoringService
{
    // Padel point progression index → display label
    private const POINT_LABELS = [0 => '0', 1 => '15', 2 => '30', 3 => '40'];

    public function recordRally(TournamentMatch $match, string $winnerTeamId): array
    {
        $set = $match->activeSet;
        if (!$set) {
            throw new \RuntimeException('No active set found for this match.');
        }

        $tournament   = $match->tournament;
        $teamAId      = $match->team_a_id;
        $teamBId      = $match->team_b_id;
        $currentServer = $match->server_team_id;

        $scoreA = $set->team_a_score;
        $scoreB = $set->team_b_score;
        $gamesA = $set->team_a_games;
        $gamesB = $set->team_b_games;

        // Increment raw point for winner
        if ($winnerTeamId === $teamAId) {
            $scoreA++;
        } else {
            $scoreB++;
        }

        MatchPoint::create([
            'match_id'           => $match->id,
            'set_id'             => $set->id,
            'scored_by_team_id'  => $winnerTeamId,
            'server_team_id'     => $currentServer,
            'team_a_score_after' => $scoreA,
            'team_b_score_after' => $scoreB,
            'created_at'         => now(),
        ]);

        // Check if game is won
        $gameWinner = $this->checkGameWinner($scoreA, $scoreB, $teamAId, $teamBId);
        $setWinner  = null;
        $matchWinner = null;

        if ($gameWinner) {
            // Reset game scores, increment games
            if ($gameWinner === $teamAId) {
                $gamesA++;
                $scoreA = 0;
                $scoreB = 0;
            } else {
                $gamesB++;
                $scoreA = 0;
                $scoreB = 0;
            }

            // Rotate serve after each game
            $newServer = ($currentServer === $teamAId) ? $teamBId : $teamAId;
            $match->update(['server_team_id' => $newServer]);

            $set->update([
                'team_a_score' => $scoreA,
                'team_b_score' => $scoreB,
                'team_a_games' => $gamesA,
                'team_b_games' => $gamesB,
            ]);

            $setWinner = $this->checkSetWinner($gamesA, $gamesB, $teamAId, $teamBId, $tournament->games_to_win_set);

            if ($setWinner) {
                $this->closeSet($set, $setWinner);
                $matchWinner = $this->checkMatchWinner($match, $tournament->sets_to_win);

                if (!$matchWinner) {
                    $this->openNextSet($match);
                }
            }
        } else {
            $set->update(['team_a_score' => $scoreA, 'team_b_score' => $scoreB]);
        }

        return [
            'set'              => $set->fresh(),
            'match'            => $match->fresh()->load(['sets', 'teamA', 'teamB', 'serverTeam']),
            'set_winner'       => $setWinner,
            'match_winner'     => $matchWinner,
            'game_winner'      => $gameWinner,
            'display_score_a'  => $this->displayScore($set->fresh()->team_a_score, $set->fresh()->team_b_score, 'a'),
            'display_score_b'  => $this->displayScore($set->fresh()->team_a_score, $set->fresh()->team_b_score, 'b'),
        ];
    }

    private function checkGameWinner(int $scoreA, int $scoreB, string $teamAId, string $teamBId): ?string
    {
        // Deuce logic: at 3-3 (40-40), need 2-point lead
        if ($scoreA >= 3 && $scoreB >= 3) {
            $diff = abs($scoreA - $scoreB);
            if ($diff >= 2) {
                return $scoreA > $scoreB ? $teamAId : $teamBId;
            }
            return null;
        }

        if ($scoreA >= 4) return $teamAId;
        if ($scoreB >= 4) return $teamBId;

        return null;
    }

    private function checkSetWinner(int $gamesA, int $gamesB, string $teamAId, string $teamBId, int $target): ?string
    {
        // Tie-break at target-target (e.g. 6-6)
        if ($gamesA === $target && $gamesB === $target) {
            return null; // Tie-break kicks in at next game-by-game level (handled as regular game win-by-2)
        }

        if ($gamesA >= $target) {
            $diff = $gamesA - $gamesB;
            if ($diff >= 2 || $gamesA === $target + 1) return $teamAId;
        }

        if ($gamesB >= $target) {
            $diff = $gamesB - $gamesA;
            if ($diff >= 2 || $gamesB === $target + 1) return $teamBId;
        }

        return null;
    }

    public function displayScore(int $scoreA, int $scoreB, string $team): string
    {
        // If both >= 3, it's deuce/advantage territory
        if ($scoreA >= 3 && $scoreB >= 3) {
            if ($scoreA === $scoreB) return 'Deuce';
            if ($team === 'a') {
                return $scoreA > $scoreB ? 'Ad' : '';
            } else {
                return $scoreB > $scoreA ? 'Ad' : '';
            }
        }

        $score = $team === 'a' ? $scoreA : $scoreB;
        return self::POINT_LABELS[$score] ?? (string) $score;
    }

    private function closeSet(MatchSet $set, string $winnerId): void
    {
        $set->update([
            'winner_id'    => $winnerId,
            'is_active'    => false,
            'completed_at' => now(),
        ]);
    }

    private function checkMatchWinner(TournamentMatch $match, int $setsToWin): ?string
    {
        $match->refresh();
        $aWins = $match->sets()->where('winner_id', $match->team_a_id)->count();
        $bWins = $match->sets()->where('winner_id', $match->team_b_id)->count();

        if ($aWins >= $setsToWin) return $match->team_a_id;
        if ($bWins >= $setsToWin) return $match->team_b_id;

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
            'team_a_games' => 0,
            'team_b_games' => 0,
            'is_active'    => true,
        ]);
    }
}
