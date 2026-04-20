<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tournament;

use App\Actions\Tournament\ListTournamentsAction;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TournamentController extends Controller
{
    public function index(ListTournamentsAction $action): Response
    {
        return Inertia::render('Tournament/Index', [
            'tournaments' => $action->handle()->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->title,
                'sport' => $t->sport->value,
                'status' => $t->status->value,
                'players' => $t->max_players ?? 0,
            ])
        ]);
    }

    public function show(string $id): Response
    {
        // To be implemented with GetTournamentOverviewAction
        return Inertia::render('Tournament/Show', [
            'tournament' => [
                'id' => $id,
                'name' => 'Spring Pickleball Open',
                'sport' => 'pickleball',
                'status' => 'live',
                'description' => 'Persisted matches coming soon...',
            ]
        ]);
    }
}
