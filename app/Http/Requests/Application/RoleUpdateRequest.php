<?php

namespace App\Http\Requests\Application;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Rule;

class RoleUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return \auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'uuid', Rule::exists('roles', 'id')],
            'name' => ['required', 'string', 'min:3', "max:50"],
            'def_path' => ['required', 'string', 'min:3', "max:255"],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            "id" => $this->route("id"),
        ]);
    }
}
