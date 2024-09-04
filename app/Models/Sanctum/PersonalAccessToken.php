<?php

namespace App\Models\Sanctum;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use Str;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function (PersonalAccessToken $model) {
            $model->id = Str::uuid()->toString();
        });
    }
}
