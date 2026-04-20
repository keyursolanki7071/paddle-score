<?php

declare(strict_types=1);

namespace App\Enums\Tournament;

enum TournamentStatus: string
{
    case SCHEDULED = 'scheduled';
    case LIVE = 'live';
    case COMPLETED = 'completed';

    public function label(): string
    {
        return ucfirst($this->value);
    }
}
