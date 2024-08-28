<?php

namespace Database\Seeders\Application;

use App\Models\Application\Site;
use App\Models\Application\UserSite;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // get sites
        $sites = Site::all();

        // get user
        $users = User::all();

        // loop $sites
        foreach ($sites as $site) {

            // looping $users
            foreach ($users as $user) {

                UserSite::create([
                    'site_id' => $site->id,
                    'user_id' => $user->id,
                    'is_allowed' => true
                ]);
            }
        }
    }
}
