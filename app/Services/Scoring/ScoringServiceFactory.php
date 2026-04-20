<?php

declare(strict_types=1);

namespace App\Services\Scoring;

use App\Enums\Tournament\SportType;
use App\Models\TournamentMatch;

class ScoringServiceFactory
{
    public function __construct(
        private readonly PickleballScoringService $pickleball,
        private readonly PadelScoringService $padel,
    ) {}

    public function forMatch(TournamentMatch $match): PickleballScoringService|PadelScoringService
    {
        return match($match->tournament->sport) {
            SportType::PICKLEBALL => $this->pickleball,
            SportType::PADEL      => $this->padel,
        };
    }
}
