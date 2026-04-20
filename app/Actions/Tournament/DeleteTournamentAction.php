<?php

declare(strict_types=1);

namespace App\Actions\Tournament;

use App\Models\Tournament;

final readonly class DeleteTournamentAction
{
    public function handle(string $id): void
    {
        $tournament = Tournament::findOrFail($id);
        $tournament->delete();
    }
}
