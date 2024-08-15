<?php

namespace App\Models\Application;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 *
 *
 * @property string $id
 * @property string $code
 * @property string $name
 * @property string $prefix
 * @property string $suffix
 * @property int $length_seq
 * @property string $format_seq
 * @property string|null $created_by
 * @property string|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType query()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereFormatSeq($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereLengthSeq($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType wherePrefix($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereSuffix($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionType whereUpdatedBy($value)
 * @mixin \Eloquent
 */
class TransactionType extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['code', 'name', 'prefix', 'suffix', 'length', 'format_seq', 'created_by', 'updated_by'];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (TransactionType $model) {
            $model->created_by = auth()->id();
        });

        static::updating(function (TransactionType $model) {
            $model->updated_by = auth()->id();
        });
    }
}
