<?php

declare(strict_types=1);

namespace App\Actions\Dashboard;

use App\Enums\Tournament\MatchStatus;
use App\Enums\Tournament\TournamentStatus;
use App\Models\Player;
use App\Models\Tournament;
use App\Models\TournamentMatch;
use Illuminate\Support\Facades\Auth;

final readonly class GetDashboardStatsAction
{
    public function handle(): array
    {
        $userId = Auth::id();

        $activeTournaments = Tournament::where('creator_id', $userId)
            ->whereIn('status', [TournamentStatus::DRAFT->value, TournamentStatus::ONGOING->value])
            ->count();

        $liveMatchesCount = TournamentMatch::whereHas('tournament', fn ($q) => $q->where('creator_id', $userId))
            ->where('status', MatchStatus::LIVE->value)
            ->count();

        $liveMatches = TournamentMatch::with(['teamA', 'teamB', 'tournament', 'sets'])
            ->whereHas('tournament', fn ($q) => $q->where('creator_id', $userId))
            ->where('status', MatchStatus::LIVE->value)
            ->orderBy('updated_at', 'desc')
            ->take(10)
            ->get()
            ->map(fn ($m) => [
                'id'           => $m->id,
                'team_a'       => $m->teamA->name,
                'team_b'       => $m->teamB->name,
                'tournament'   => $m->tournament->title,
                'sport'        => $m->tournament->sport->value,
                'score'        => [
                    'team_a' => $m->sets->where('is_active', true)->first()?->team_a_score ?? 0,
                    'team_b' => $m->sets->where('is_active', true)->first()?->team_b_score ?? 0,
                    'is_pickleball' => $m->tournament->sport->value === 'pickleball'
                ]
            ]);

        $totalPlayers = Player::count();

        return [
            'activeTournaments' => $activeTournaments,
            'liveMatchesCount'  => $liveMatchesCount,
            'totalPlayers'      => $totalPlayers,
            'liveMatches'       => $liveMatches,
        ];
    }
}
