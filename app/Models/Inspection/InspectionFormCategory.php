<?php

namespace App\Models\Inspection;

use Auth;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InspectionFormCategory extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];

    protected $casts = [
        'is_separate_page' => 'bool',
    ];

    public function inspection_form(): BelongsTo
    {
        return $this->belongsTo(InspectionForm::class);
    }

    public function inspection_form_checks(): HasMany
    {
        return $this->hasMany(InspectionFormCheck::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionFormCategory $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (InspectionFormCategory $model) {
            $model->updated_by = Auth::id();
        });
    }
}
