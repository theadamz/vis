<?php

namespace Database\Seeders\Application;

use App\Models\Application\Access;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // get roles
        $roles = config('access.roleIdExceptions');

        // loop $roles
        foreach ($roles as $role) {

            // get permission list by code
            $menuPermissionLists = collect(config('access.lists'));

            // looping $menuPermissionLists
            foreach ($menuPermissionLists as $permissionLists) {

                // get permissions
                $permissions = $permissionLists['permissions'];

                // looping $permissionLists
                foreach ($permissions as $permission) {

                    // create data
                    Access::create([
                        'role_id' => $role,
                        'code' => $permissionLists['code'],
                        'permission' => $permission,
                        'is_allowed' => true,
                    ]);
                }
            }
        }
    }
}
