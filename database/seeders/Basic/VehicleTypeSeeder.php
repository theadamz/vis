<?php

namespace Database\Seeders\Basic;

use App\Models\Basic\VehicleType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VehicleType::create([
            'name' => 'Container',
            'is_visible' => true,
        ]);

        VehicleType::create([
            'name' => 'Truck',
            'is_visible' => true,
        ]);

        VehicleType::create([
            'name' => 'Wing Box',
            'is_visible' => true,
        ]);

        VehicleType::create([
            'name' => 'Car',
            'is_visible' => true,
        ]);

        VehicleType::create([
            'name' => 'Motorcycle',
            'is_visible' => true,
        ]);
    }
}
