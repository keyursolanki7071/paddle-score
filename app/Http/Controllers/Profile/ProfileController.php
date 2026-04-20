<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profile;

use App\Enums\Tournament\MatchStatus;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::render('Profile/Index', [
            'user'  => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'stats' => [
                'totalTournaments' => 0,
                'wins'             => 0,
                'losses'           => 0,
                'winRate'          => '0%',
            ],
        ]);
    }
}
