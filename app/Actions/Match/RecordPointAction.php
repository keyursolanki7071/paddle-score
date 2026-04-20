<?php

declare(strict_types=1);

namespace App\Actions\Match;

use App\Models\TournamentMatch;
use App\Services\Scoring\ScoringServiceFactory;

final readonly class RecordPointAction
{
    public function __construct(
        private ScoringServiceFactory $factory,
        private FinishMatchAction $finishAction,
    ) {}

    public function handle(TournamentMatch $match, string $winnerTeamId): array
    {
        $service = $this->factory->forMatch($match);
        $result  = $service->recordRally($match, $winnerTeamId);

        // Dynamic Finalization: If a match winner is found, close the match immediately
        if (!empty($result['match_winner'])) {
            $this->finishAction->handle($match, $result['match_winner']);
            $result['status'] = 'completed';
        }

        return $result;
    }
}
