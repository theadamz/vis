<?php

namespace App\Models\Inspection;

use App\Models\Basic\VehicleType;
use Auth;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class InspectionForm extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];

    protected $casts = [
        'use_eta_dest' => 'bool', // Flag to show Estimatin Time Arrival datetime in form inspection
        'use_ata_dest' => 'bool', // Flag to show Actual Time Arrival datetime in form inspection
        'is_publish' => 'bool',
    ];

    public function vehicle_type(): BelongsTo
    {
        return $this->belongsTo(VehicleType::class);
    }

    public function inspection_form_categories(): HasMany
    {
        return $this->hasMany(InspectionFormCategory::class);
    }

    public function inspection_form_checks(): HasManyThrough
    {
        return $this->HasManyThrough(InspectionFormCheck::class, InspectionFormCategory::class, 'inspection_form_id', 'inspection_form_category_id', 'id', 'id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionForm $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (InspectionForm $model) {
            $model->updated_by = Auth::id();
        });
    }
}
