<?php

use App\Http\Controllers\Tournament\TournamentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard/Index', [
        'stats' => [
            'activeTournaments' => 3,
            'upcomingMatches' => 5,
            'totalPlayers' => 124,
        ]
    ]);
})->name('dashboard');

Route::get('/tournaments', [TournamentController::class, 'index'])->name('tournaments.index');
Route::get('/tournaments/{id}', [TournamentController::class, 'show'])->name('tournaments.show');


Route::get('/profile', function () {
    return Inertia::render('Profile/Index', [
        'user' => [
            'name' => 'Alex Rivera',
            'rank' => 'Gold',
            'matchesPlayed' => 42,
            'winRate' => '68%',
        ]
    ]);
})->name('profile');

Route::get('/tournaments/{id}/scoring', function ($id) {
    return Inertia::render('Tournament/Scoring', [
        'match' => [
            'id' => 'm1',
            'tournamentId' => $id,
            'teamA' => 'Alpha Strikers',
            'teamB' => 'Beta Smashers',
            'sport' => 'pickleball',
            'settings' => ['maxScore' => 11, 'winByTwo' => true],
        ]
    ]);
})->name('tournaments.scoring');

