<?php

namespace App\Models\Inspection;

use Auth;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InspectionCheck extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];

    public function inspection(): BelongsTo
    {
        return $this->belongsTo(Inspection::class);
    }

    public function inspection_form_check(): BelongsTo
    {
        return $this->belongsTo(InspectionFormCheck::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionCheck $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (InspectionCheck $model) {
            $model->updated_by = Auth::id();
        });
    }
}
