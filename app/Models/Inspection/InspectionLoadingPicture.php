<?php

namespace App\Models\Inspection;

use Auth;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InspectionLoadingPicture extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $guarded = ['created_by', 'updated_by'];

    public function inspection(): BelongsTo
    {
        return $this->belongsTo(Inspection::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionLoadingPicture $model) {
            $model->created_by = Auth::id();
            $model->created_at = now();
        });
    }
}
