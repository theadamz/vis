<?php

namespace App\Http\Requests\Application;

use Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccessCreateRequest extends FormRequest
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
            "role" => ["required", "uuid", Rule::exists("roles", "id")],
            "access_lists" => ["required", "array"],
            "access_lists.*" => ["required", "alpha_dash", "max:50", Rule::in(collect(config('access.lists'))->pluck("code")->toArray())],
        ];
    }
}
