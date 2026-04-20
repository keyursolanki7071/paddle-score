<?php

declare(strict_types=1);

namespace App\DTOs\Tournament;

use App\Enums\Tournament\SportType;
use App\Enums\Tournament\TournamentStatus;
use Illuminate\Http\Request;

final readonly class TournamentDTO
{
    public function __construct(
        public string $title,
        public SportType $sport,
        public string $description,
        public ?int $maxPlayers = null,
        public TournamentStatus $status = TournamentStatus::SCHEDULED,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->validated('title'),
            SportType::from($request->validated('sport')),
            $request->validated('description'),
            $request->validated('max_players'),
            $request->validated('status') 
                ? TournamentStatus::from($request->validated('status')) 
                : TournamentStatus::SCHEDULED,
        );
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'sport' => $this->sport->value,
            'status' => $this->status->value,
            'description' => $this->description,
            'max_players' => $this->maxPlayers,
        ];
    }
}
