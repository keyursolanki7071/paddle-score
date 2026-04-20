<?php

declare(strict_types=1);

namespace App\Actions\Tournament;

use App\Contracts\Repositories\TournamentRepositoryInterface;
use App\DTOs\Tournament\TournamentDTO;
use App\Models\Tournament;
use Illuminate\Support\Facades\Auth;

final readonly class CreateTournamentAction
{
    public function __construct(
        private TournamentRepositoryInterface $repository
    ) {}

    public function handle(TournamentDTO $dto): Tournament
    {
        $data = $dto->toArray();
        $data['creator_id'] = Auth::id();

        return $this->repository->create($data);
    }
}
