<?php

namespace App\Http\Requests\Application;

use Auth;
use Illuminate\Foundation\Http\FormRequest;

class SiteCreateRequest extends FormRequest
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
            'code' => ['required', "max:5", "regex:" . config("setting.regxp.forCode")],
            'name' => ['required', 'string', 'min:3', "max:100"],
            'address' => ['required', 'string', 'min:3', "max:255"],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
