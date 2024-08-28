<?php

namespace App\Models\Inspection;

use Auth;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InspectionFormCheck extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];

    public function inspection_form_category(): BelongsTo
    {
        return $this->belongsTo(InspectionFormCategory::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionFormCheck $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (InspectionFormCheck $model) {
            $model->updated_by = Auth::id();
        });
    }
}
