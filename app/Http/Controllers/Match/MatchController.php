<?php

declare(strict_types=1);

namespace App\Http\Controllers\Match;

use App\Actions\Match\FinishMatchAction;
use App\Actions\Match\RecordPointAction;
use App\Actions\Match\StartMatchAction;
use App\Actions\Match\UndoLastPointAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Match\RecordPointRequest;
use App\Models\TournamentMatch;
use App\Services\Scoring\PadelScoringService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MatchController extends Controller
{
    public function score(string $id): Response
    {
        $match = TournamentMatch::with([
            'teamA', 'teamB', 'serverTeam',
            'tournament',
            'sets' => fn ($q) => $q->orderBy('set_number'),
            'sets.points' => fn ($q) => $q->where('is_undone', false)->latest('created_at')->take(10),
        ])->findOrFail($id);

        $activeSet = $match->sets->firstWhere('is_active', true);

        return Inertia::render('Match/Score', [
            'match' => [
                'id'            => $match->id,
                'tournament_id' => $match->tournament_id,
                'team_a'        => ['id' => $match->teamA->id, 'name' => $match->teamA->name],
                'team_b'        => ['id' => $match->teamB->id, 'name' => $match->teamB->name],
                'server_team_id' => $match->server_team_id,
                'status'        => $match->status->value,
                'sport'         => $match->tournament->sport->value,
                'sets_to_win'   => $match->tournament->sets_to_win,
                'points_to_win' => $match->tournament->points_to_win,
                'win_by_two'    => $match->tournament->win_by_two,
                'games_to_win_set' => $match->tournament->games_to_win_set,
            ],
            'activeSet' => $activeSet ? [
                'id'           => $activeSet->id,
                'set_number'   => $activeSet->set_number,
                'team_a_score' => $activeSet->team_a_score,
                'team_b_score' => $activeSet->team_b_score,
                'team_a_games' => $activeSet->team_a_games,
                'team_b_games' => $activeSet->team_b_games,
            ] : null,
            'sets' => $match->sets->map(fn ($s) => [
                'set_number'   => $s->set_number,
                'team_a_score' => $s->team_a_score,
                'team_b_score' => $s->team_b_score,
                'team_a_games' => $s->team_a_games,
                'team_b_games' => $s->team_b_games,
                'winner_id'    => $s->winner_id,
                'is_active'    => $s->is_active,
            ]),
        ]);
    }

    public function start(string $id, StartMatchAction $action): RedirectResponse
    {
        $match = TournamentMatch::findOrFail($id);
        $action->handle($match);

        return redirect()->route('matches.score', $id);
    }

    public function recordPoint(RecordPointRequest $request, string $id, RecordPointAction $action): JsonResponse
    {
        $match  = TournamentMatch::with(['tournament', 'sets', 'activeSet'])->findOrFail($id);
        $result = $action->handle($match, $request->validated('winner_team_id'));

        // If sport is padel, enrich with display scores
        if ($match->tournament->sport->value === 'padel') {
            $activeSet = $result['set']->fresh();
            $padel     = app(PadelScoringService::class);
            $result['display_score_a'] = $padel->displayScore($activeSet->team_a_score, $activeSet->team_b_score, 'a');
            $result['display_score_b'] = $padel->displayScore($activeSet->team_a_score, $activeSet->team_b_score, 'b');
        }

        return response()->json($result);
    }

    public function undoPoint(string $id, UndoLastPointAction $action): JsonResponse
    {
        $match  = TournamentMatch::with(['sets', 'activeSet', 'points'])->findOrFail($id);
        $result = $action->handle($match);

        return response()->json($result);
    }

    public function switchServe(Request $request, string $id): JsonResponse
    {
        $match = TournamentMatch::findOrFail($id);

        $newServer = ($match->server_team_id === $match->team_a_id)
            ? $match->team_b_id
            : $match->team_a_id;

        $match->update(['server_team_id' => $newServer]);

        return response()->json(['server_team_id' => $newServer]);
    }

    public function finish(RecordPointRequest $request, string $id, FinishMatchAction $action): RedirectResponse
    {
        $match = TournamentMatch::findOrFail($id);
        $action->handle($match, $request->validated('winner_team_id'));

        return redirect()->route('matches.summary', $id);
    }

    public function summary(string $id): Response
    {
        $match = TournamentMatch::with([
            'teamA', 'teamB', 'winner', 'tournament',
            'sets.points.scoredByTeam',
        ])->findOrFail($id);

        $pointLog = $match->sets->flatMap(fn ($s) => $s->points->map(fn ($p) => [
            'set_number'     => $s->set_number,
            'scored_by'      => $p->scoredByTeam->name,
            'team_a_score'   => $p->team_a_score_after,
            'team_b_score'   => $p->team_b_score_after,
            'created_at'     => $p->created_at->toTimeString(),
        ]));

        return Inertia::render('Match/Summary', [
            'match' => [
                'id'          => $match->id,
                'team_a'      => ['id' => $match->teamA->id, 'name' => $match->teamA->name],
                'team_b'      => ['id' => $match->teamB->id, 'name' => $match->teamB->name],
                'winner'      => $match->winner ? ['id' => $match->winner->id, 'name' => $match->winner->name] : null,
                'tournament'  => ['id' => $match->tournament->id, 'name' => $match->tournament->title],
                'sport'       => $match->tournament->sport->value,
                'completed_at' => $match->completed_at?->toDateTimeString(),
            ],
            'sets'     => $match->sets->map(fn ($s) => [
                'set_number'   => $s->set_number,
                'team_a_score' => $s->team_a_score,
                'team_b_score' => $s->team_b_score,
                'team_a_games' => $s->team_a_games,
                'team_b_games' => $s->team_b_games,
                'winner_id'    => $s->winner_id,
            ]),
            'pointLog' => $pointLog,
        ]);
    }
}
