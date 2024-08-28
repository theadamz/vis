<?php

namespace App\Http\Requests\Inspection;

use App\Enums\InspectionTypes;
use App\Enums\Stages;
use Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InspectionFormCreateRequest extends FormRequest
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
            "vehicle_type_id" => ['required', 'uuid', Rule::exists("vehicle_types", "id")],
            "type" => ['required', 'string', 'max:20', Rule::in(InspectionTypes::cases())],
            "code" => ['required', 'string', 'min:3', 'max:20', "regex:" . config("setting.regxp.forCode")],
            "name" => ['required', 'string', 'min:3', 'max:50'],
            "use_eta_dest" => ['required', 'boolean'],
            "use_ata_dest" => ['required', 'boolean'],
            "is_publish" => ['required', 'boolean'],
            "checklists" => ['required', 'array'],
            "checklists.*.stage" => ['required', 'string', 'max:20', Rule::in(Stages::cases())],
            "checklists.*.description" => ['required', 'string', 'max:100'],
            "checklists.*.order" => ['required', 'integer', 'max_digits:2'],
            "checklists.*.is_separate_page" => ['required', 'boolean'],
            "checklists.*.checks" => ['required', 'array'],
            "checklists.*.checks.*.description" => ['required', 'string', 'min:3', 'max:100'],
            "checklists.*.checks.*.type" => ['required', 'string', 'min:3', 'max:20', Rule::in(['select', 'photo'])],
            "checklists.*.checks.*.order" => ['required', 'integer', 'max_digits:2'],
        ];
    }
}
