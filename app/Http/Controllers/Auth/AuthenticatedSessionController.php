<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SignInRequest;
use App\Models\Application\Role;
use App\Models\Application\SignInHistory;
use App\Models\Sanctum\PersonalAccessToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Jenssegers\Agent\Agent;
use Symfony\Component\HttpFoundation\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): \Inertia\Response
    {
        return Inertia::render('Auth/SignIn', [
            'canResetPassword' => Route::has('password.request'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(SignInRequest $request): RedirectResponse|JsonResponse
    {
        // authenticate
        $request->authenticate();

        // check if route has prefix api
        if ($request->is('api/*')) {
            return $this->authenticateApi($request);
        }

        $request->session()->regenerate();

        // get role
        $role = Role::where('id', Auth::user()->role_id)->first();

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

    private function authenticateApi(SignInRequest $request): JsonResponse
    {
        try {
            // delete previous token
            PersonalAccessToken::where('tokenable_id', $request->user()->id)->delete();

            // check if user has access to api with gate
            if (!Gate::allows('as-inspector')) {
                return response()->json([
                    'message' => "You don't have access as inspector.",
                ])->setStatusCode(Response::HTTP_UNAUTHORIZED);
            }

            // create new token
            $token = $request->user()->createToken('auth_token')->plainTextToken;

            // create sign in history
            $this->createSignInHistory();

            return response()->json([
                'message' => 'Success',
                'access_token' => $token,
                'token_type' => 'Bearer'
            ])->setStatusCode(Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "message" => $e->getMessage(),
            ])->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR);
        }
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
            'user_id' => Auth::id(),
            'created_at' => now()
        ]);

        // update last login
        $user = User::find(Auth::id());
        $user->last_login_at = now();
        $user->save();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse|JsonResponse
    {
        // if request comes from api
        if ($request->is('api/*')) {
            // delete previous token
            PersonalAccessToken::where('tokenable_id', $request->user()->id)->delete();

            return response()->json([
                'message' => 'Sign out success',
            ])->setStatusCode(Response::HTTP_OK);
        }

        // logout
        Auth::guard('web')->logout();

        // reset session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
