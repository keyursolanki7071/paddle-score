<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MatchSet extends Model
{
    use HasUuid;

    protected $fillable = [
        'match_id',
        'winner_id',
        'set_number',
        'team_a_score',
        'team_b_score',
        'team_a_games',
        'team_b_games',
        'is_active',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'set_number'   => 'integer',
            'team_a_score' => 'integer',
            'team_b_score' => 'integer',
            'team_a_games' => 'integer',
            'team_b_games' => 'integer',
            'is_active'    => 'boolean',
            'completed_at' => 'datetime',
        ];
    }

    public function match(): BelongsTo
    {
        return $this->belongsTo(TournamentMatch::class, 'match_id');
    }

    public function winner(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'winner_id');
    }

    public function points(): HasMany
    {
        return $this->hasMany(MatchPoint::class, 'set_id')->orderBy('created_at');
    }
}
