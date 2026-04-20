<?php

declare(strict_types=1);

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\Player;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TeamController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'min:2', 'max:60'],
            'player1' => ['required', 'string', 'min:2', 'max:60'],
            'player2' => ['nullable', 'string', 'min:2', 'max:60'],
        ]);

        $team = Team::create([
            'creator_id' => Auth::id(),
            'name'       => $validated['name'],
        ]);

        $player1 = Player::create(['name' => $validated['player1']]);
        $team->players()->attach($player1->id);

        if (!empty($validated['player2'])) {
            $player2 = Player::create(['name' => $validated['player2']]);
            $team->players()->attach($player2->id);
        }

        return back()->with('success', 'Team created.');
    }
}
