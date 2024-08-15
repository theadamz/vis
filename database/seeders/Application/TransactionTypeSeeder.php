<?php

namespace Database\Seeders\Application;

use App\Enums\TransactionTypes;
use App\Models\Application\TransactionType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransactionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $transactions = TransactionTypes::cases();

        foreach ($transactions as $transaction) {
            TransactionType::create([
                'code' => $transaction->value,
                'name' => $transaction->getName(),
                'prefix' => $transaction->value,
                'suffix' => '',
                'length_seq' => 3,
                'format_seq' => config('setting.sequence.format_seq_default'),
            ]);
        }
    }
}
