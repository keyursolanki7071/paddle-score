<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Tournament\SportType;
use App\Enums\Tournament\TournamentStatus;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tournament extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'creator_id',
        'title',
        'sport',
        'status',
        'description',
        'max_players',
    ];

    protected function casts(): array
    {
        return [
            'sport' => SportType::class,
            'status' => TournamentStatus::class,
            'max_players' => 'integer',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function matches(): HasMany
    {
        return $this->hasMany(TournamentMatch::class);
    }
}

