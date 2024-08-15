<?php

namespace Database\Seeders\Application;

use App\Models\Application\Site;
use App\Models\Application\TransactionSequence;
use App\Models\Application\TransactionType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransactionSequenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sites = Site::all();
        $transactionTypes = TransactionType::all();

        // loop bu
        foreach ($sites as $site) {
            // loop trans type
            foreach ($transactionTypes as $transactionType) {
                TransactionSequence::create([
                    'site_id' => $site->id,
                    'year' => date('Y'),
                    'month' => date('m'),
                    'transaction_type_id' => $transactionType->id,
                    'next_no' => 1
                ]);
            }
        }
    }
}
