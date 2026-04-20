<?php

declare(strict_types=1);

namespace App\Enums\Tournament;

enum SportType: string
{
    case PICKLEBALL = 'pickleball';
    case PADEL = 'padel';

    public function label(): string
    {
        return match($this) {
            self::PICKLEBALL => 'Pickleball',
            self::PADEL => 'Padel',
        };
    }
}
