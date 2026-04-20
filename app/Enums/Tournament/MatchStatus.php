<?php

declare(strict_types=1);

namespace App\Enums\Tournament;

enum MatchStatus: string
{
    case SCHEDULED = 'scheduled';
    case LIVE = 'live';
    case COMPLETED = 'completed';

    public function label(): string
    {
        return ucfirst($this->value);
    }
}
