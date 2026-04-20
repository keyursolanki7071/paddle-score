<?php

declare(strict_types=1);

namespace App\Http\Requests\Match;

use Illuminate\Foundation\Http\FormRequest;

class RecordPointRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'winner_team_id' => ['required', 'uuid'],
        ];
    }
}
