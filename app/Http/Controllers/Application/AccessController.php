<?php

namespace App\Http\Controllers\Application;

use App\Http\Controllers\Controller;
use App\Http\Requests\Application\AccessCreateRequest;
use App\Http\Requests\Application\AccessDuplicateRequest;
use App\Http\Requests\Application\AccessUpdateRequest;
use App\Models\Application\Access;
use App\Models\Application\Role;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class AccessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        // get roles
        $roles = Role::get(['id', 'name']);

        // get accesses
        $accesses = config('access.lists');

        return Inertia::render('App/Access/Index', [
            'roles' => $roles,
            'accesses' => $accesses,
        ]);
    }

    public function retriveRoleAccesses(Access $model, string $roleId): JsonResponse
    {
        // check if roleId empty
        if (empty($roleId)) {
            throw new HttpResponseException(response([
                "message" => "Data tidak ditemukan.",
            ], Response::HTTP_NOT_FOUND));
        }

        // get access
        $accesses = $model->where('role_id', $roleId)->orderBy('code')->get(['id', 'role_id', 'code', 'permission', 'is_allowed'])->toArray();

        // if access empty
        if (empty($accesses)) {
            return response()->json(['message' => 'Tidak ditemukan', 'data' => []])->setStatusCode(Response::HTTP_NOT_FOUND);
        }

        // variables
        $data = [];
        $code = "";
        $prevAccess = [];
        $permissions = [];

        // loop
        foreach ($accesses as $idx => $access) {
            // if $idx = 0
            if ($idx === 0) {
                $code = $access['code'];
            }

            // jika $code tidak kosong atau berbeda dengan data yang akan datang maka masukkan ke $data
            if (!empty($code) && $code !== $access['code']) {
                // push to $data
                $data[] = [
                    'code' => $prevAccess['code'],
                    'name' => collect(config('access.lists'))->firstWhere('code', $prevAccess['code'])['name'] ?? null,
                    'permissions' => $permissions
                ];

                // clear $permission and fill $code
                $permissions = [];
                $code = $access['code'];
            }

            // push permission
            $permissions[$access['permission']] = boolval($access['is_allowed']);

            // set code
            $prevAccess = $access;
        }

        // push data terakhir ke $data
        $data[] = [
            'code' => $prevAccess['code'],
            'name' => collect(config('access.lists'))->firstWhere('code', $prevAccess['code'])['name'],
            'permissions' => $permissions
        ];

        return response()->json(['message' => 'Ok', 'data' => $data])->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AccessCreateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        // variable
        $inserted = 0;

        try {
            // begin trans
            DB::beginTransaction();

            // Looping access_lists
            foreach ($validated['access_lists'] as $accessCode) {
                // get access list by code
                $access = collect(config("access.lists"))->firstWhere('code', $accessCode);

                // if empty then just skip it
                if (empty($access)) {
                    continue;
                }

                // check if access already exist for the role
                $isExist = Access::where([
                    ['role_id', '=', $validated['role']],
                    ['code', '=', $accessCode],
                    ['permission', '=', $access['permissions'][0]],
                ])->exists();

                // if access already exist then skip it
                if ($isExist) {
                    continue;
                }

                // create
                Access::create([
                    'role_id' => $validated['role'],
                    'code' => $accessCode,
                    'permission' => $access['permissions'][0],
                    'is_allowed' => true
                ]);

                $inserted++;
            }

            // commit changes
            DB::commit();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_CREATED],
                'message' => $inserted . " akses berhasil ditambahkan.",
            ]);

            Route::inertia('app.access.index', 'App/Access/Index');
        } catch (\Exception $e) {
            // rollback
            DB::rollBack();

            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Access $model, string $roleId, string $accessCode): JsonResponse
    {
        // check if $roleId or $accessCode empty
        if (empty($roleId) || empty($accessCode)) {
            throw new HttpResponseException(response([
                "message" => "Data tidak ditemukan.",
            ], Response::HTTP_NOT_FOUND));
        }

        // get access
        $accesses = $model->where('role_id', $roleId)->where('code', $accessCode)->get(['id', 'code', 'permission', 'is_allowed'])->toArray();

        // if access empty
        if (empty($accesses)) {
            return response()->json(['message' => 'Tidak ditemukan', 'data' => []])->setStatusCode(Response::HTTP_NOT_FOUND);
        }

        // get access data from config
        $accessConfig = collect(config('access.lists'))->firstWhere('code', $accessCode);

        // loop
        $permissions = [];
        $permissionsFromConfig = $accessConfig['permissions']; // get access data permissions values
        foreach ($accesses as $access) {
            // search key by parsing value access permission to permissionsFromConfig
            $key = array_search($access['permission'], $permissionsFromConfig);
            unset($permissionsFromConfig[$key]);

            // add permission and value is_allowed
            $permissions[$access['permission']] = boolval($access['is_allowed']);
        }

        // loop permissionFromConfig to add the rest of things
        foreach ($permissionsFromConfig as $permission) {
            // add permission and value to false
            $permissions[$permission] = false;
        }

        // data to respon
        $data = [
            'code' => $access['code'],
            'name' => $accessConfig['name'],
            'permissions' => $permissions
        ];

        return response()->json(['message' => 'Ok', 'data' => $data])->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AccessUpdateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        try {
            // begin trans
            DB::beginTransaction();

            // Looping accesses
            foreach ($validated['permissions'] as $permission => $isAllowed) {
                // check if already exist
                $isExist = Access::where([
                    ['role_id', '=', $validated['role']],
                    ['code', '=', $validated['code']],
                    ['permission', '=', $permission],
                ])->exists();

                // model
                $model = Access::where([
                    ['role_id', '=', $validated['role']],
                    ['code', '=', $validated['code']],
                    ['permission', '=', $permission],
                ]);

                if ($isExist) {
                    $model->update([
                        'is_allowed' => $isAllowed
                    ]);
                } else {
                    $model->create([
                        'role_id' => $validated['role'],
                        'code' => $validated['code'],
                        'permission' => $permission,
                        'is_allowed' => $isAllowed
                    ]);
                }
            }


            // commit changes
            DB::commit();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => "Akses berhasil diperbaharui.",
            ]);

            Route::inertia('app.access.index', 'App/Access/Index');
        } catch (\Exception $e) {
            // rollback
            DB::rollBack();

            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        // validate request
        $validated = Validator::make($request->post(), [
            'role*' => ['required', "uuid", Rule::exists('roles', 'id')],
            'ids' => ['required', "array"],
            'ids.*' => ['required', "alpha_dash", Rule::in(collect(config('access.lists'))->pluck("code")->toArray())],
        ])->validated();

        try {

            // execute
            Access::whereIn('code', $validated['ids'])->where('role_id', $validated['role'])->delete();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => count($validated['ids']) . " akses berhasil dihapus.",
            ]);

            Route::inertia('app.access.index', 'App/Access/Index');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function duplicate(AccessDuplicateRequest $request)
    {
        // validasi request
        $validated = $request->validated();

        // Jika role sama
        if ($validated['from_role'] === $validated['to_role']) {
            return back()->withErrors([
                "message" => "Role tidak bisa sama.",
            ]);
        }

        // get id access from destination role
        $excludeAccessIds = Access::where('role_id', $validated['to_role'])->get('id');

        // get access
        $accesses = Access::where("role_id", $validated['from_role'])->whereNotIn('id', $excludeAccessIds)->get()->toArray();

        try {
            // begin trans
            DB::beginTransaction();

            // loop
            foreach ($accesses as $access) {
                // check if access already exist
                $isExist = Access::where([
                    ['role_id', '=', $validated['to_role']],
                    ['code', '=', $access['code']],
                    ['permission', '=', $access['permission']],
                ])->exists();

                // if already exist then skip
                if ($isExist) {
                    continue;
                }

                // buat data akses
                Access::create([
                    'role_id' => $validated['to_role'],
                    'code' => $access['code'],
                    'permission' => $access['permission'],
                    'is_allowed' => $access['is_allowed'],
                ]);
            }

            // commit changes
            DB::commit();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_CREATED],
                'message' => "Duplikat akses berhasil.",
            ]);

            Route::inertia('app.access.index', 'App/Access/Index');
        } catch (\Exception $e) {
            // rollback
            DB::rollBack();

            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function getMenu(): JsonResponse
    {
        // variables
        $menuData = [];
        $data = [
            'groups' => [],
            'menus' => [],
        ];

        // get from cache if production
        if (app()->environment(['production'])) {
            $menuData = Cache::get(session('role_id'));
        }

        // if menuData null
        if (empty($menuData)) {
            // delete cache
            Cache::forget(session('role_id'));

            // get access menu
            $menuData = app()->access->getAccessByRole(session('role_id'));
            $menuData = app()->access->retiveAccessMenuByCodes($menuData);

            // set menus
            $data['menus'] = $menuData;

            // get group
            $menuGroupData = app()->access->retriveMenuGroupsByMenuCodes($menuData);

            // set menu group
            $data['groups'] = $menuGroupData;

            // if menuData empty then 403
            if (empty($menuData)) {
                return response(['message' => 'Tidak ditemukan.'], Response::HTTP_NOT_FOUND)->json();
            }

            // save cache with key role_id and save menuData for (2 jam)
            Cache::put(session('role_id'), $menuData, (60 * 60 * 2));
        }

        return response()->json(['data' => $data, 'message' => 'OK'])->setStatusCode(Response::HTTP_OK);
    }
}
