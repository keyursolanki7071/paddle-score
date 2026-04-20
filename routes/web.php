<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Match\MatchController;
use App\Http\Controllers\Notification\NotificationController;
use App\Http\Controllers\Profile\ProfileController;
use App\Http\Controllers\Team\TeamController;
use App\Http\Controllers\Tournament\TournamentController;
use Illuminate\Support\Facades\Route;

// ─── Guest routes (no auth) ───────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
});

// Logout (auth required)
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout')->middleware('auth');

// ─── Public spectator view (no auth needed) ───────────────────────────────────
Route::get('/t/{id}/public', [TournamentController::class, 'public'])->name('tournaments.public');

// ─── Authenticated routes ─────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Teams
    Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');

    // Tournaments
    Route::get('/tournaments', [TournamentController::class, 'index'])->name('tournaments.index');
    Route::get('/tournaments/create', [TournamentController::class, 'create'])->name('tournaments.create');
    Route::post('/tournaments', [TournamentController::class, 'store'])->name('tournaments.store');
    Route::get('/tournaments/{id}', [TournamentController::class, 'show'])->name('tournaments.show');
    Route::get('/tournaments/{id}/teams', [TournamentController::class, 'teams'])->name('tournaments.teams');
    Route::post('/tournaments/{id}/teams', [TournamentController::class, 'addTeam'])->name('tournaments.add-team');
    Route::delete('/tournaments/{id}/teams', [TournamentController::class, 'removeTeam'])->name('tournaments.remove-team');
    Route::post('/tournaments/{id}/brackets', [TournamentController::class, 'generateBrackets'])->name('tournaments.generate-brackets');
    Route::get('/tournaments/{id}/bracket', [TournamentController::class, 'bracket'])->name('tournaments.bracket');
    Route::delete('/tournaments/{id}', [TournamentController::class, 'destroy'])->name('tournaments.destroy');

    // Matches
    Route::post('/matches/{id}/start', [MatchController::class, 'start'])->name('matches.start');
    Route::get('/matches/{id}/score', [MatchController::class, 'score'])->name('matches.score');
    Route::post('/matches/{id}/point', [MatchController::class, 'recordPoint'])->name('matches.record-point');
    Route::delete('/matches/{id}/point', [MatchController::class, 'undoPoint'])->name('matches.undo-point');
    Route::post('/matches/{id}/serve', [MatchController::class, 'switchServe'])->name('matches.switch-serve');
    Route::post('/matches/{id}/finish', [MatchController::class, 'finish'])->name('matches.finish');
    Route::get('/matches/{id}/summary', [MatchController::class, 'summary'])->name('matches.summary');

    // Profile
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');
});
