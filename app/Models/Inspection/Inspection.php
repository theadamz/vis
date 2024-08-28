<?php

namespace App\Models\Inspection;

use App\Models\User;
use Auth;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inspection extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = ['created_by', 'updated_by'];

    public function inspection_form(): BelongsTo
    {
        return $this->belongsTo(InspectionForm::class);
    }

    public function checked_in_user(): BelongsTo
    {
        return $this->belongsTo(User::class, "checked_in_by", "id");
    }

    public function loading_start_user(): BelongsTo
    {
        return $this->belongsTo(User::class, "loading_start_by", "id");
    }

    public function loading_end_user(): BelongsTo
    {
        return $this->belongsTo(User::class, "loading_end_by", "id");
    }

    public function checked_out_user(): BelongsTo
    {
        return $this->belongsTo(User::class, "checked_out_by", "id");
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Inspection $model) {
            $model->created_by = Auth::id();
        });

        static::updating(function (Inspection $model) {
            $model->updated_by = Auth::id();
        });
    }
}
