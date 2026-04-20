<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Tournament\MatchStatus;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TournamentMatch extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'tournament_id',
        'team_a_id',
        'team_b_id',
        'server_team_id',
        'winner_id',
        'status',
        'round',
        'sort_order',
        'scheduled_at',
        'started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status'       => MatchStatus::class,
            'round'        => 'integer',
            'sort_order'   => 'integer',
            'scheduled_at' => 'datetime',
            'started_at'   => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    public function teamA(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_a_id');
    }

    public function teamB(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_b_id');
    }

    public function serverTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'server_team_id');
    }

    public function winner(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'winner_id');
    }

    public function sets(): HasMany
    {
        return $this->hasMany(MatchSet::class, 'match_id')->orderBy('set_number');
    }

    public function activeSet(): HasOne
    {
        return $this->hasOne(MatchSet::class, 'match_id')->where('is_active', true)->latestOfMany('set_number');
    }

    public function points(): HasMany
    {
        return $this->hasMany(MatchPoint::class, 'match_id')->orderBy('created_at');
    }

    public function teamASetWins(): int
    {
        return $this->sets()->where('winner_id', $this->team_a_id)->count();
    }

    public function teamBSetWins(): int
    {
        return $this->sets()->where('winner_id', $this->team_b_id)->count();
    }

    /**
     * Calculate the position in the bracket where the winner of this match advances.
     */
    public function nextMatchPosition(): ?array
    {
        // If this was the Final (only one match in the round), no where else to go
        $sameRoundMatches = self::where('tournament_id', $this->tournament_id)
            ->where('round', $this->round)
            ->count();

        if ($sameRoundMatches === 1) {
            return null;
        }

        return [
            'round'      => $this->round + 1,
            'sort_order' => (int) floor($this->sort_order / 2),
            'side'       => ($this->sort_order % 2 === 0) ? 'team_a' : 'team_b',
        ];
    }
}
