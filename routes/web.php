<?php

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

Route::get('/tournaments', function () {
    return Inertia::render('Tournament/Index', [
        'tournaments' => [
            ['id' => '1', 'name' => 'Spring Pickleball Open', 'sport' => 'pickleball', 'status' => 'live', 'players' => 32],
            ['id' => '2', 'name' => 'Sunset Padel Classic', 'sport' => 'padel', 'status' => 'scheduled', 'players' => 16],
            ['id' => '3', 'name' => 'Elite Masters Invitational', 'sport' => 'pickleball', 'status' => 'completed', 'players' => 64],
        ]
    ]);
})->name('tournaments.index');

Route::get('/tournaments/{id}', function ($id) {
    return Inertia::render('Tournament/Show', [
        'tournament' => [
            'id' => $id,
            'name' => 'Spring Pickleball Open',
            'sport' => 'pickleball',
            'status' => 'live',
            'description' => 'The premier spring tournament for high-performance players.',
        ]
    ]);
})->name('tournaments.show');

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

