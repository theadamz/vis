<?php

namespace App\Models\Application;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 *
 *
 * @property string $id
 * @property string $role_id
 * @property string $code
 * @property string $permission read,edit,delete,validation,etc
 * @property bool $is_allowed
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Access newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Access newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Access query()
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereIsAllowed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access wherePermission($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Access whereUpdatedBy($value)
 * @mixin \Eloquent
 */
class Access extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['role_id', 'code', 'permission', 'is_allowed', 'created_by', 'updated_by'];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Access $model) {
            $model->created_by = auth()->id();
        });

        static::updating(function (Access $model) {
            $model->updated_by = auth()->id();
        });
    }
}
