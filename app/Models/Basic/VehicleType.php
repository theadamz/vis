<?php

namespace App\Models\Basic;

use Auth;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleType extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['name', 'is_visible'];

    protected $casts = [
        'is_visible' => 'bool',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (VehicleType $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (VehicleType $model) {
            $model->updated_by = Auth::id();
        });
    }
}
