<?php

declare(strict_types=1);

namespace App\Enums\Tournament;

enum RoundType: string
{
    case SINGLE_ELIMINATION = 'single_elimination';
    case ROUND_ROBIN = 'round_robin';

    public function label(): string
    {
        return match($this) {
            self::SINGLE_ELIMINATION => 'Single Elimination',
            self::ROUND_ROBIN        => 'Round Robin',
        };
    }
}
