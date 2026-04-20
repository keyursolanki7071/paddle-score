<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Tournament\RoundType;
use App\Enums\Tournament\SportType;
use App\Enums\Tournament\TournamentStatus;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

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
        'round_type',
        'sets_to_win',
        'points_to_win',
        'win_by_two',
        'games_to_win_set',
    ];

    protected function casts(): array
    {
        return [
            'sport'            => SportType::class,
            'status'           => TournamentStatus::class,
            'round_type'       => RoundType::class,
            'max_players'      => 'integer',
            'sets_to_win'      => 'integer',
            'points_to_win'    => 'integer',
            'win_by_two'       => 'boolean',
            'games_to_win_set' => 'integer',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(TournamentRegistration::class);
    }

    public function teams(): HasManyThrough
    {
        return $this->hasManyThrough(Team::class, TournamentRegistration::class, 'tournament_id', 'id', 'id', 'team_id');
    }

    public function matches(): HasMany
    {
        return $this->hasMany(TournamentMatch::class);
    }

    public function liveMatch(): ?TournamentMatch
    {
        return $this->matches()->where('status', 'live')->with(['teamA', 'teamB'])->first();
    }

    public function scopeActive($query): void
    {
        $query->where('status', TournamentStatus::ONGOING->value);
    }
}
