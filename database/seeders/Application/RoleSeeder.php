<?php

namespace Database\Seeders\Application;

use App\Models\Application\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create([
            'id' => '00000000-0000-0000-0000-000000000000',
            'name' => 'Developer',
            'def_path' => '/dashboard'
        ]);

        Role::create([
            'id' => '00000000-0000-0000-0000-000000000001',
            'name' => 'Administrator',
            'def_path' => '/dashboard'
        ]);

        Role::create([
            'name' => 'Admin',
            'def_path' => '/dashboard'
        ]);

        Role::create([
            'name' => 'Inspector',
            'def_path' => '/dashboard'
        ]);
    }
}
