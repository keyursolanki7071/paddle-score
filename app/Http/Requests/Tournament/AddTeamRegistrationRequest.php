<?php

declare(strict_types=1);

namespace App\Http\Requests\Tournament;

use Illuminate\Foundation\Http\FormRequest;

class AddTeamRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'team_id' => ['required', 'uuid', 'exists:teams,id'],
        ];
    }
}
