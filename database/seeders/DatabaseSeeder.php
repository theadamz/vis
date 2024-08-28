<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\Application\AccessSeeder;
use Database\Seeders\Application\RoleSeeder;
use Database\Seeders\Application\SiteSeeder;
use Database\Seeders\Application\TransactionSequenceSeeder;
use Database\Seeders\Application\TransactionTypeSeeder;
use Database\Seeders\Application\UserSeeder;
use Database\Seeders\Application\UserSiteSeeder;
use Database\Seeders\Basic\VehicleTypeSeeder;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SiteSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            UserSiteSeeder::class,
            AccessSeeder::class,
            TransactionTypeSeeder::class,
            TransactionSequenceSeeder::class,
            VehicleTypeSeeder::class,
        ]);
    }
}
