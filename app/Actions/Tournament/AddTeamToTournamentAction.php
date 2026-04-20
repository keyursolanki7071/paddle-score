<?php

declare(strict_types=1);

namespace App\Actions\Tournament;

use App\Models\Tournament;
use App\Models\TournamentRegistration;

final readonly class AddTeamToTournamentAction
{
    public function handle(Tournament $tournament, string $teamId): TournamentRegistration
    {
        return TournamentRegistration::firstOrCreate([
            'tournament_id' => $tournament->id,
            'team_id'       => $teamId,
        ]);
    }
}
