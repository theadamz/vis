<?php

namespace App\Http\Controllers\Application;

use App\Http\Controllers\Controller;
use App\Http\Requests\Application\UserCreateRequest;
use App\Http\Requests\Application\UserUpdateRequest;
use App\Models\Application\Role;
use App\Models\Application\Site;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        // get active sites
        $sites = Site::where('is_active', true)->get(['id', 'code', 'name']);

        // get roles
        $roles = Role::get(['id', 'name']);

        return Inertia::render('App/User/Index', [
            'sites' => $sites,
            'roles' => $roles,
            'datatable' => fn() => $this->datatable()
        ]);
    }

    public function datatable(): LengthAwarePaginator
    {
        // init the container
        $request = app(Request::class);

        // prepare filters
        $perPage = $request->has("per_page") && !empty($request->get('per_page')) && is_numeric($request->get('per_page')) && in_array($request->get('per_page'), config('setting.page.limits')) ? $request->get('per_page') : config('setting.page.default_limit');
        $page = $request->has("page") && !empty($request->get('page')) && is_numeric($request->get('page')) ? $request->get('page') : 1;
        $search = $request->has("search") && str($request->get('search'))->isNotEmpty() ? $request->get('search') : null;

        // handling sort filter
        $sort = ['id', 'asc'];
        if ($request->has("sort") && !empty($request->get('sort'))) {
            $sort = str($request->get('sort'))->explode('.');
            if (!in_array($sort[1], ['asc', 'desc'])) {
                $sort[1] = 'asc';
            }
        }

        // prepare paginate and order by
        $data = User::query()->select(['id', 'username', 'email', 'name', 'role_id', 'is_active', 'site_id']);

        // get relations
        $data->with([
            'role' => function ($query) {
                $query->select(['id', 'name']);
            },
            'site' => function ($query) {
                $query->select(['id', 'name']);
            },
        ]);

        // filter with search
        $data->when(!empty($search), function (Builder $query) use ($search) {
            // query table
            $queries = $query->where('username', 'ilike', "%{$search}%")->orWhere('email', 'ilike', "%{$search}%");

            // query relations
            $queries = $queries->orWhereHas('role', function (Builder $query) use ($search) {
                $query->where('name', 'ilike', "%{$search}%");
            })->orWhereHas('site', function (Builder $query) use ($search) {
                $query->where('name', 'ilike', "%{$search}%");
            });

            return $queries;
        });

        // filter active
        $data->when($request->has('active') && is_bool(filter_var($request->get('active'), FILTER_VALIDATE_BOOLEAN)), function (Builder $query) use ($request) {
            $query->where('is_active', filter_var($request->get('active'), FILTER_VALIDATE_BOOLEAN));
        });

        // filter role
        $data->when($request->has('role') && $request->filled('role'), function (Builder $query) use ($request) {
            $query->where('role_id', $request->get('role'));
        });

        // filter site
        $data->when($request->has('site') && $request->filled('site'), function (Builder $query) use ($request) {
            $query->where('site_id', $request->get('site'));
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'username' => $rec->username,
                'email' => $rec->email,
                'name' => $rec->name,
                'role_name' => $rec->role->name,
                'site_name' => $rec->site->name,
                'is_active' => $rec->is_active
            ]);

        return $data;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserCreateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        // check if code already exist
        $exist = User::where(function (Builder $query) use ($validated) {
            $query->whereRaw("LOWER(username)=?", [Str::lower($validated['username'])])->orWhereRaw('LOWER(email)=?', [Str::lower($validated['email'])]);
        })->exists();

        if ($exist) {
            return back()->withErrors([
                "username" => ["Username / email already used."],
                "email" => ["Username / email already used."],
            ]);
        }

        try {

            // save
            $model = new User($validated);
            $model->role_id = $validated['role'];
            $model->site_id = $validated['site'];
            $model->email_verified_at = now();
            $model->save();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_CREATED],
                'message' => "User successfully created.",
            ]);

            Route::inertia('app.user.index', 'App/User/Index');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $model, string $id): JsonResponse
    {
        // validate query parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', "string", "uuid"],
        ])->validate();

        // get data
        $data = $model->where('id', $validated['id'])->select('id', 'username', 'email', 'name', 'is_active', 'role_id AS role', 'site_id AS site')->first();

        // jika data kosong maka kirim pesan
        if ($data === null) {
            throw new HttpResponseException(response([
                "message" => "Data not found.",
            ], Response::HTTP_NOT_FOUND));
        }

        return response()->json(['message' => 'Ok', 'data' => $data])->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        // check if code already exist
        $exist = User::where(function (Builder $query) use ($validated) {
            $query->where(function (Builder $query) use ($validated) {
                $query->whereRaw("LOWER(username)=?", [Str::lower($validated['username'])])->orWhereRaw('LOWER(email)=?', [Str::lower($validated['email'])]);
            })->where('id', '!=', $validated['id']);
        })->exists();

        if ($exist) {
            return back()->withErrors([
                "username" => ["Username / email already used."],
                "email" => ["Username / email already used."],
            ]);
        }

        // update
        $data = User::find($validated['id']);
        $data->fill($validated);
        $data->role_id = $validated['role'];
        $data->site_id = $validated['site'];
        $data->save();

        // set toast
        Session::flash('toast', [
            'variant' => 'success',
            'title' => Response::$statusTexts[Response::HTTP_OK],
            'message' => "User sucessfully saved.",
        ]);

        Route::inertia('app.user.index', 'App/User/Index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        // validate request
        $validated = Validator::make($request->post(), [
            'ids' => ['required', "array"],
            'ids.*' => ['required', 'string', "uuid", Rule::exists('users', 'id')],
        ])->validated();

        try {
            // update status is_active = false
            User::whereIn('id', $validated['ids'])->update([
                'is_active' => false
            ]);

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => count($validated['ids']) . " user(s) successfully disabled.",
            ]);

            Route::inertia('app.user.index', 'App/User/Index');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }
}
