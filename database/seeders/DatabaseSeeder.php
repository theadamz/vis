<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\Application\AccessSeeder;
use Database\Seeders\Application\RoleSeeder;
use Database\Seeders\Application\TransactionSequenceSeeder;
use Database\Seeders\Application\TransactionTypeSeeder;
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
            AccessSeeder::class,
            TransactionTypeSeeder::class,
            TransactionSequenceSeeder::class,
        ]);

        $this->createUsers();
    }

    private function createUsers(): void
    {
        User::create([
            'id' => '00000000-0000-0000-0000-000000000000',
            'username' => 'dev',
            'email' => 'theadamz91@gmail.com',
            'password' => '123456',
            'name' => 'Developer',
            'role_id' => '00000000-0000-0000-0000-000000000000',
            'email_verified_at' => now(),
            'is_active' => true,
            'site_id' => '00000000-0000-0000-0000-000000000000',
        ]);

        User::create([
            'id' => '00000000-0000-0000-0000-000000000001',
            'username' => 'administrator',
            'email' => 'adam.malik@busanagroup.com',
            'password' => '123456',
            'name' => 'administrator',
            'role_id' => '00000000-0000-0000-0000-000000000001',
            'email_verified_at' => now(),
            'is_active' => true,
            'site_id' => '00000000-0000-0000-0000-000000000000',
        ]);
    }
}
