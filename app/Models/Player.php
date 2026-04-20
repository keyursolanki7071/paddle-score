<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Player\PlayerRank;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Player extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'user_id',
        'name',
        'rank',
    ];

    protected function casts(): array
    {
        return [
            'rank' => PlayerRank::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_player');
    }
}
