<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchPoint extends Model
{
    use HasUuid;

    public $timestamps = false;

    protected $fillable = [
        'match_id',
        'set_id',
        'scored_by_team_id',
        'server_team_id',
        'team_a_score_after',
        'team_b_score_after',
        'is_undone',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'team_a_score_after' => 'integer',
            'team_b_score_after' => 'integer',
            'is_undone'          => 'boolean',
            'created_at'         => 'datetime',
        ];
    }

    public function match(): BelongsTo
    {
        return $this->belongsTo(TournamentMatch::class, 'match_id');
    }

    public function set(): BelongsTo
    {
        return $this->belongsTo(MatchSet::class, 'set_id');
    }

    public function scoredByTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'scored_by_team_id');
    }

    public function serverTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'server_team_id');
    }
}
