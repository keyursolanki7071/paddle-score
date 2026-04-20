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

        $liveMatches = TournamentMatch::whereHas('tournament', fn ($q) => $q->where('creator_id', $userId))
            ->where('status', MatchStatus::LIVE->value)
            ->count();

        $upcomingMatches = TournamentMatch::with(['teamA', 'teamB', 'tournament'])
            ->whereHas('tournament', fn ($q) => $q->where('creator_id', $userId))
            ->where('status', MatchStatus::SCHEDULED->value)
            ->whereNotNull('scheduled_at')
            ->orderBy('scheduled_at')
            ->take(5)
            ->get()
            ->map(fn ($m) => [
                'id'           => $m->id,
                'team_a'       => $m->teamA->name,
                'team_b'       => $m->teamB->name,
                'tournament'   => $m->tournament->title,
                'scheduled_at' => $m->scheduled_at?->toDateTimeString(),
                'sport'        => $m->tournament->sport->value,
            ]);

        $totalPlayers = Player::count();

        return [
            'activeTournaments' => $activeTournaments,
            'liveMatches'       => $liveMatches,
            'totalPlayers'      => $totalPlayers,
            'upcomingMatches'   => $upcomingMatches,
        ];
    }
}
