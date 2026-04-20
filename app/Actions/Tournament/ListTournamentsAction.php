<?php

declare(strict_types=1);

namespace App\Actions\Tournament;

use App\Contracts\Repositories\TournamentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

final readonly class ListTournamentsAction
{
    public function __construct(
        private TournamentRepositoryInterface $repository
    ) {
    }

    public function handle(): Collection
    {
        return $this->repository->all();
    }
}
