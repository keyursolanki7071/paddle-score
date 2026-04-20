<?php

declare(strict_types=1);

namespace App\Http\Requests\Tournament;

use App\Enums\Tournament\RoundType;
use App\Enums\Tournament\SportType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreTournamentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Auth middleware handles this
    }

    public function rules(): array
    {
        return [
            'title'            => ['required', 'string', 'min:3', 'max:100'],
            'sport'            => ['required', new Enum(SportType::class)],
            'description'      => ['nullable', 'string', 'max:500'],
            'max_players'      => ['required', 'integer', 'min:2', 'max:256'],
            'round_type'       => ['required', new Enum(RoundType::class)],
            'sets_to_win'      => ['required', 'integer', 'min:1', 'max:5'],
            'points_to_win'    => ['required', 'integer', 'min:7', 'max:21'],
            'win_by_two'       => ['required', 'boolean'],
            'games_to_win_set' => ['required', 'integer', 'min:4', 'max:9'],
        ];
    }
}
