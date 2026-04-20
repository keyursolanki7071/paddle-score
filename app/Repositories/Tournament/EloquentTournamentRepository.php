<?php

declare(strict_types=1);

namespace App\Repositories\Tournament;

use App\Contracts\Repositories\TournamentRepositoryInterface;
use App\Models\Tournament;
use Illuminate\Database\Eloquent\Collection;

class EloquentTournamentRepository implements TournamentRepositoryInterface
{
    public function all(): Collection
    {
        return Tournament::with(['creator'])->latest()->get();
    }

    public function find(string $uuid): ?Tournament
    {
        return Tournament::with(['creator', 'matches'])->find($uuid);
    }

    public function create(array $data): Tournament
    {
        return Tournament::create($data);
    }

    public function update(string $uuid, array $data): bool
    {
        $tournament = Tournament::find($uuid);
        if (!$tournament) {
            return false;
        }
        return $tournament->update($data);
    }

    public function delete(string $uuid): bool
    {
        $tournament = Tournament::find($uuid);
        if (!$tournament) {
            return false;
        }
        return $tournament->delete();
    }
}
