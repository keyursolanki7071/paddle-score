<?php

declare(strict_types=1);

namespace App\DTOs\Tournament;

use App\Enums\Tournament\RoundType;
use App\Enums\Tournament\SportType;
use App\Enums\Tournament\TournamentStatus;
use Illuminate\Foundation\Http\FormRequest;

final readonly class TournamentDTO
{
    public function __construct(
        public string           $title,
        public SportType        $sport,
        public ?string          $description,
        public ?int             $maxPlayers,
        public RoundType        $roundType,
        public int              $setsToWin,
        public int              $pointsToWin,
        public bool             $winByTwo,
        public int              $gamesToWinSet,
        public TournamentStatus $status = TournamentStatus::DRAFT,
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            title:        $request->validated('title'),
            sport:        SportType::from($request->validated('sport')),
            description:  $request->validated('description'),
            maxPlayers:   $request->validated('max_players'),
            roundType:    RoundType::from($request->validated('round_type')),
            setsToWin:    (int) $request->validated('sets_to_win'),
            pointsToWin:  (int) $request->validated('points_to_win'),
            winByTwo:     (bool) $request->validated('win_by_two'),
            gamesToWinSet:(int) $request->validated('games_to_win_set'),
        );
    }

    public function toArray(): array
    {
        return [
            'title'            => $this->title,
            'sport'            => $this->sport->value,
            'status'           => $this->status->value,
            'description'      => $this->description,
            'max_players'      => $this->maxPlayers,
            'round_type'       => $this->roundType->value,
            'sets_to_win'      => $this->setsToWin,
            'points_to_win'    => $this->pointsToWin,
            'win_by_two'       => $this->winByTwo,
            'games_to_win_set' => $this->gamesToWinSet,
        ];
    }
}
