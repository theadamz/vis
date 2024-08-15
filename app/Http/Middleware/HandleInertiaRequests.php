<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'app' => [
                'web_name' => config('setting.general.web_name'),
                'web_name_short' => config('setting.general.web_name_short'),
                'web_description' => config('setting.general.web_description'),
            ],
            'config' => [
                'url' => url('/'),
                'locale' => config('setting.local.locale_short'),
                'date_format' => config('setting.local.js_date_format'),
                'time_format' => config('setting.local.js_date_format'),
                'datetime_format' => config('setting.local.js_date_format'),
            ],
            'auth' => [
                'user' => auth()->check() ? [
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'def_path' => session('def_path')
                ] : null,
            ],
            'flash' => [
                'alert' => fn () => $request->session()->get('alert'),
                'toast' => fn () => $request->session()->get('toast'),
            ]
        ];
    }
}
