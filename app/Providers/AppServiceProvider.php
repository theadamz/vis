<?php

namespace App\Providers;

use App\Helpers\GeneralHelper;
use App\Models\Sanctum\PersonalAccessToken;
use App\Services\AccessService;
use Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * All of the container singletons that should be registered.
     *
     * @var array
     */
    public $singletons = [
        'access' => AccessService::class,
        'general' => GeneralHelper::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Define gate
        $menuPermissionLists = config('access.lists');

        // loop $menuPermissionLists
        foreach ($menuPermissionLists as $menuPermission) {

            // loop $menuPermissions
            foreach ($menuPermission['permissions'] as $permission) {
                Gate::define($menuPermission['code'], function () use ($menuPermission) {
                    if (!Auth::check()) {
                        return false;
                    }

                    return app()->access->hasAccess(Auth::user()->role_id, $menuPermission['code']);
                });

                Gate::define($menuPermission['code'] . '-' . $permission, function () use ($menuPermission, $permission) {
                    if (!Auth::check()) {
                        return false;
                    }

                    return app()->access->isAllowed(Auth::user()->role_id, $menuPermission['code'], $permission);
                });
            }
        }

        // sanctum
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }
}
