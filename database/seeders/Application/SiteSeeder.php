<?php

namespace Database\Seeders\Application;

use App\Models\Application\Site;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Site::create([
            'id' => '00000000-0000-0000-0000-000000000000',
            'code' => 'DMY',
            'name' => 'Dummy Site',
            'address' => 'Indonesia',
            'is_active' => true
        ]);
    }
}
