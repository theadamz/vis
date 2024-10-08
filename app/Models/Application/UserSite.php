<?php

namespace App\Models\Application;

use App\Models\User;
use Auth;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSite extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'site_id',
        'is_allowed',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_allowed' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (UserSite $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (UserSite $model) {
            $model->updated_by = Auth::id();
        });
    }
}
