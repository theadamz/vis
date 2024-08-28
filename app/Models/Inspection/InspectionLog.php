<?php

namespace App\Models\Inspection;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InspectionLog extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $guarded = ['user_id'];

    public function inspection(): BelongsTo
    {
        return $this->belongsTo(Inspection::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (InspectionLog $model) {
            $model->created_at = now();
        });
    }
}
