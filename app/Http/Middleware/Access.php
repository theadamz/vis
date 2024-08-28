<?php

namespace App\Http\Middleware;

use Auth;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class Access
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $accessCode = null, bool $checkAuthorization = true): Response
    {
        // check if logged in
        if (!Auth::check()) {
            to_route('sign-in');
        }

        // send to client
        $access = [
            'menu' => null,
            'permissions' => null,
        ];

        // get menu data by code
        $menu = app()->general->getMenuByCode($accessCode);

        // if menu is null then 404
        abort_if(empty($menu) && $checkAuthorization, Response::HTTP_NOT_FOUND);

        // set menu
        $access['menu'] = $menu;

        // share previous url
        Inertia::share('prev_url', url()->previous());

        // check authorization
        if ($checkAuthorization) {
            // get permissions
            $permissions = app()->access->getPermissions(Auth::user()->role->id, $accessCode);

            // if $permission null then 403
            if (empty($permissions)) {
                abort(Response::HTTP_FORBIDDEN);
            }

            // set permission
            $access['permissions'] = $permissions;

            // share access
            Inertia::share('access', $access);
        }

        return $next($request);
    }
}
