<?php

declare(strict_types=1);

namespace App\Contracts\Repositories;

use App\Models\Tournament;
use Illuminate\Database\Eloquent\Collection;

interface TournamentRepositoryInterface
{
    public function all(): Collection;
    
    public function find(string $uuid): ?Tournament;
    
    public function create(array $data): Tournament;
    
    public function update(string $uuid, array $data): bool;
    
    public function delete(string $uuid): bool;
}
