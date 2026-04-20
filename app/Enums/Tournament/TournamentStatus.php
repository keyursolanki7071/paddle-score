<?php

declare(strict_types=1);

namespace App\Enums\Tournament;

enum TournamentStatus: string
{
    case DRAFT     = 'draft';
    case ONGOING   = 'ongoing';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return ucfirst($this->value);
    }
}
