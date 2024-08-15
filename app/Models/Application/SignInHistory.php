<?php

namespace App\Models\Application;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 *
 *
 * @property string $id
 * @property string $ip
 * @property string|null $os
 * @property string|null $platform
 * @property string|null $browser
 * @property string|null $country
 * @property string|null $city
 * @property string $user_id
 * @property string $created_at
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory query()
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereBrowser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereCountry($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereIp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereOs($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SignInHistory whereUserId($value)
 * @mixin \Eloquent
 */
class SignInHistory extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'ip',
        'os',
        'platform',
        'browser',
        'country',
        'city',
        'user_id',
        'created_at',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (SignInHistory $model) {
            $model->created_at = now();
        });
    }
}
