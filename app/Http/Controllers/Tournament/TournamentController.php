<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tournament;

use App\Actions\Tournament\AddTeamToTournamentAction;
use App\Actions\Tournament\DeleteTournamentAction;
use App\Actions\Tournament\GenerateBracketsAction;
use App\Actions\Tournament\ListTournamentsAction;
use App\Actions\Tournament\RemoveTeamFromTournamentAction;
use App\DTOs\Tournament\TournamentDTO;
use App\Enums\Tournament\RoundType;
use App\Enums\Tournament\SportType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tournament\AddTeamRegistrationRequest;
use App\Http\Requests\Tournament\RemoveTeamRegistrationRequest;
use App\Http\Requests\Tournament\StoreTournamentRequest;
use App\Models\Team;
use App\Models\Tournament;
use App\Models\TournamentRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TournamentController extends Controller
{
    public function index(ListTournamentsAction $action): Response
    {
        return Inertia::render('Tournament/Index', [
            'tournaments' => $action->handle()->map(fn ($t) => [
                'id'           => $t->id,
                'name'         => $t->title,
                'sport'        => $t->sport->value,
                'status'       => $t->status->value,
                'players'      => $t->registrations()->count(),
                'teams_count'  => $t->registrations()->count(),
                'matches_count' => $t->matches()->count(),
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Tournament/Create', [
            'sports'      => SportType::cases(),
            'roundTypes'  => RoundType::cases(),
        ]);
    }

    public function store(StoreTournamentRequest $request, CreateTournamentAction $action): RedirectResponse
    {
        $dto = TournamentDTO::fromRequest($request);
        $tournament = $action->handle($dto);

        return redirect()->route('tournaments.teams', $tournament->id)
            ->with('success', 'Tournament created! Now add your teams.');
    }

    public function show(string $id): Response
    {
        $tournament = Tournament::with([
            'matches.teamA.players',
            'matches.teamB.players',
            'matches.sets',
            'matches.winner',
            'registrations.team.players',
        ])->findOrFail($id);

        $matchesByRound = $tournament->matches
            ->sortBy(['round', 'sort_order'])
            ->groupBy('round')
            ->map(fn ($round) => $round->map(fn ($m) => [
                'id'          => $m->id,
                'tournament_id' => $m->tournament_id,
                'team_a'      => $m->teamA ? ['id' => $m->teamA->id, 'name' => $m->teamA->name] : null,
                'team_b'      => $m->teamB ? ['id' => $m->teamB->id, 'name' => $m->teamB->name] : null,
                'status'      => $m->status->value,
                'round'       => $m->round,
                'sets'        => $m->sets->map(fn ($s) => [
                    'set_number'   => $s->set_number,
                    'team_a_score' => $s->team_a_score,
                    'team_b_score' => $s->team_b_score,
                    'team_a_games' => $s->team_a_games,
                    'team_b_games' => $s->team_b_games,
                    'winner_id'    => $s->winner_id,
                    'is_active'    => $s->is_active,
                ]),
                'winner_id'   => $m->winner_id,
                'scheduled_at' => $m->scheduled_at?->toDateTimeString(),
            ]));

        return Inertia::render('Tournament/Show', [
            'tournament' => [
                'id'               => $tournament->id,
                'name'             => $tournament->title,
                'sport'            => $tournament->sport->value,
                'status'           => $tournament->status->value,
                'description'      => $tournament->description,
                'round_type'       => $tournament->round_type->value,
                'sets_to_win'      => $tournament->sets_to_win,
                'points_to_win'    => $tournament->points_to_win,
                'win_by_two'       => $tournament->win_by_two,
                'games_to_win_set' => $tournament->games_to_win_set,
                'teams_count'      => $tournament->registrations->count(),
            ],
            'registrations' => $tournament->registrations->map(fn ($r) => [
                'id'      => $r->id,
                'seed'    => $r->seed,
                'team'    => ['id' => $r->team->id, 'name' => $r->team->name, 'players' => $r->team->players->map(fn ($p) => ['id' => $p->id, 'name' => $p->name, 'rank' => $p->rank->value])],
            ]),
            'matchesByRound' => $matchesByRound,
        ]);
    }

    public function teams(string $id): Response
    {
        $tournament = Tournament::with(['registrations.team.players'])->findOrFail($id);
        $allTeams   = Team::with('players')->get()->map(fn ($t) => [
            'id'      => $t->id,
            'name'    => $t->name,
            'players' => $t->players->map(fn ($p) => ['id' => $p->id, 'name' => $p->name]),
        ]);

        $registeredTeamIds = $tournament->registrations->pluck('team_id')->toArray();

        return Inertia::render('Tournament/Teams', [
            'tournament'       => ['id' => $tournament->id, 'name' => $tournament->title, 'sport' => $tournament->sport->value, 'max_players' => $tournament->max_players],
            'allTeams'         => $allTeams,
            'registeredTeamIds' => $registeredTeamIds,
        ]);
    }

    public function addTeam(AddTeamRegistrationRequest $request, string $id, AddTeamToTournamentAction $action): RedirectResponse
    {
        $tournament = Tournament::findOrFail($id);
        $action->handle($tournament, $request->validated('team_id'));

        return back()->with('success', 'Team registered.');
    }

    public function removeTeam(RemoveTeamRegistrationRequest $request, string $id, RemoveTeamFromTournamentAction $action): RedirectResponse
    {
        $action->handle($id, $request->validated('team_id'));

        return back()->with('success', 'Team removed.');
    }

    public function generateBrackets(string $id, GenerateBracketsAction $action): RedirectResponse
    {
        $tournament = Tournament::findOrFail($id);
        $action->handle($tournament);

        return redirect()->route('tournaments.show', $id)
            ->with('success', 'Brackets generated!');
    }

    public function destroy(string $id, DeleteTournamentAction $action): RedirectResponse
    {
        $action->handle($id);

        return redirect()->route('tournaments.index')
            ->with('success', 'Tournament deleted successfully.');
    }

    public function bracket(string $id): Response
    {
        $tournament = Tournament::with(['matches.teamA', 'matches.teamB', 'matches.sets', 'matches.winner'])->findOrFail($id);

        $rounds = $tournament->matches
            ->sortBy('round')
            ->groupBy('round')
            ->map(fn ($matches, $round) => [
                'round'   => $round,
                'label'   => $this->roundLabel($round, $tournament->matches->max('round')),
                'matches' => $matches->values()->map(fn ($m) => [
                    'id'        => $m->id,
                    'team_a'    => ['id' => $m->teamA->id, 'name' => $m->teamA->name],
                    'team_b'    => ['id' => $m->teamB->id, 'name' => $m->teamB->name],
                    'status'    => $m->status->value,
                    'winner_id' => $m->winner_id,
                    'set_score' => $m->sets->map(fn ($s) => $s->team_a_score . '-' . $s->team_b_score)->implode(', '),
                ]),
            ])->values();

        return Inertia::render('Tournament/Bracket', [
            'tournament' => ['id' => $tournament->id, 'name' => $tournament->title, 'sport' => $tournament->sport->value],
            'rounds'     => $rounds,
        ]);
    }

    public function public(string $id): Response
    {
        $tournament = Tournament::with(['matches.teamA', 'matches.teamB', 'matches.sets', 'matches.winner'])->findOrFail($id);

        return Inertia::render('Tournament/Public', [
            'tournament' => [
                'id'     => $tournament->id,
                'name'   => $tournament->title,
                'sport'  => $tournament->sport->value,
                'status' => $tournament->status->value,
            ],
            'rounds' => $tournament->matches
                ->groupBy('round')
                ->map(fn ($matches) => $matches->map(fn ($m) => [
                    'id'        => $m->id,
                    'team_a'    => $m->teamA->name,
                    'team_b'    => $m->teamB->name,
                    'status'    => $m->status->value,
                    'winner_id' => $m->winner_id,
                    'set_score' => $m->sets->map(fn ($s) => $s->team_a_score . '-' . $s->team_b_score)->implode(', '),
                ]))->values(),
        ]);
    }

    private function roundLabel(int $round, int $maxRound): string
    {
        $fromEnd = $maxRound - $round;
        return match($fromEnd) {
            0 => 'Final',
            1 => 'Semi Finals',
            2 => 'Quarter Finals',
            default => "Round {$round}",
        };
    }
}
