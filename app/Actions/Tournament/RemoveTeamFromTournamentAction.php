<?php

declare(strict_types=1);

namespace App\Actions\Tournament;

use App\Models\TournamentRegistration;

final readonly class RemoveTeamFromTournamentAction
{
    public function handle(string $tournamentId, string $teamId): void
    {
        TournamentRegistration::where('tournament_id', $tournamentId)
            ->where('team_id', $teamId)
            ->delete();
    }
}
