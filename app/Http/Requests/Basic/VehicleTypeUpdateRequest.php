<?php

namespace App\Http\Requests\Basic;

use Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleTypeUpdateRequest extends FormRequest
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
            'id' => ['required', 'uuid', Rule::exists("vehicle_types", "id")],
            'name' => ['required', 'string', 'min:3', 'max:50'],
            'is_visible' => ['required', 'boolean'],
        ];
    }
}
