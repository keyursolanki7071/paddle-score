<?php

declare(strict_types=1);

namespace App\Enums\Player;

enum PlayerRank: string
{
    case BRONZE = 'bronze';
    case SILVER = 'silver';
    case GOLD = 'gold';
    case DIAMOND = 'diamond';

    public function label(): string
    {
        return ucfirst($this->value);
    }

    public function emoji(): string
    {
        return match($this) {
            self::BRONZE  => '🥉',
            self::SILVER  => '🥈',
            self::GOLD    => '🥇',
            self::DIAMOND => '💎',
        };
    }
}
