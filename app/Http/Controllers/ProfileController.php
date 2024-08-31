<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Application\Site;
use App\Models\Application\UserSite;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Validator;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        // get user sites
        $userSitesIds = UserSite::where('user_id', Auth::id())->where('is_allowed', true)->pluck('site_id');

        // get sites
        $sites = Site::whereIn('id', $userSitesIds)->where('is_active', true)->get(['id', 'code', 'name']);

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'sites' => $sites,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function updateSite(Request $request): RedirectResponse
    {
        $validated = Validator::make($request->post(), [
            'site' => ['required', 'uuid', Rule::exists('sites', 'id')]
        ])->validated();

        $data = [
            'site_id' => $validated['site'],
        ];

        try {

            $request->user()->fill($data);
            $request->user()->save();

            return Redirect::route('profile.edit');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }
}
