<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SignInRequest;
use App\Models\Application\Role;
use App\Models\Application\SignInHistory;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Jenssegers\Agent\Agent;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/SignIn', [
            'canResetPassword' => Route::has('password.request'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(SignInRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // get role
        $role = Role::where('id', auth()->user()->role_id)->first();

        // save store
        $sessionStore = [
            'role_id' => $role->id,
            'def_path' => $role->def_path,
        ];
        session($sessionStore);

        // create sign in history
        $this->createSignInHistory();

        return redirect($role['def_path']);
    }

    private function createSignInHistory(): void
    {
        // ambil info ip address dan lokasi
        $data = app()->general->getInfoIPPublic();

        // variables
        $ip = empty($data) ? request()->getClientIp() : $data['ip'];
        $os = (new Agent)->getUserAgent();
        $platform = (new Agent)->platform();
        $browser = (new Agent)->browser();
        $country = empty($data) ? null : $data['country'];
        $city = empty($data) ? null : $data['city'];

        // create sign in history
        SignInHistory::create([
            'ip' => $ip,
            'os' => $os,
            'platform' => $platform,
            'browser' => $browser,
            'country' => $country,
            'city' => $city,
            'user_id' => auth()->user()->id,
            'created_at' => now()
        ]);

        // update last login
        $user = User::find(auth()->user()->id);
        $user->last_login_at = now();
        $user->save();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
