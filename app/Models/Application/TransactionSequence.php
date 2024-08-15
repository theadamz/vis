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
 * @property string $site_id
 * @property int $year
 * @property int $month
 * @property string $transaction_type_id
 * @property int $next_no
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence query()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereNextNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereSiteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereTransactionTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionSequence whereYear($value)
 * @mixin \Eloquent
 */
class TransactionSequence extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['site_id', 'year', 'month', 'transaction_type_id', 'next_no', 'created_by', 'updated_by'];

    public function transaction_type(): BelongsTo
    {
        return $this->belongsTo(TransactionType::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function (TransactionSequence $model) {
            $model->created_by = auth()->id();
        });

        static::updating(function (TransactionSequence $model) {
            $model->updated_by = auth()->id();
        });
    }
}
