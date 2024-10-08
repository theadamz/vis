<?php

namespace App\Http\Requests\Application;

use Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'uuid', Rule::exists('users', 'id')],
            "username" => ["required", "string", "min:5", "max:255", "regex:" . config("setting.regxp.forUsername")],
            "email" => ["required", "email", "min:10", "max:255"],
            "password" => ["string", "min:6", "max:100"],
            "name" => ["required", "string", "min:5", "max:255"],
            "role" => ["required", "uuid", Rule::exists('roles', 'id')],
            "site" => ["required", "uuid", Rule::exists('sites', 'id')],
            "is_active" => ["required", "boolean"],
        ];
    }
}
