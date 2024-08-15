<?php

namespace App\Http\Requests\Application;

use Illuminate\Foundation\Http\FormRequest;

class TransactionTypeCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', "min:2", "max:5", "regex:" . config("setting.regxp.forTransType")],
            'name' => ['required', 'string', 'min:3', "max:100"],
            'prefix' => ['required', 'string', 'min:2', "max:20", "regex:" . config("setting.regxp.forCode")],
            'suffix' => ['nullable', 'string', 'min:2', "max:20", "regex:" . config("setting.regxp.forCode")],
            'length_seq' => ['required', 'integer', "min:1", "max:9"],
            'format_seq' => ['required', 'string', "max:255"],
        ];
    }
}
