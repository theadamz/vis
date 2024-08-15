<?php

namespace App\Http\Controllers\Application;

use App\Http\Controllers\Controller;
use App\Http\Requests\Application\RoleCreateRequest;
use App\Http\Requests\Application\RoleUpdateRequest;
use App\Models\Application\Role;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        // get roleDataTable
        $roleDataTable = $this->datatable();

        return Inertia::render('App/Role', [
            'datatable' => fn () => $roleDataTable
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
        $data = Role::query();

        // filter with search
        $data->when(!empty($search), function ($query) use ($search) {
            $query->where('name', 'ilike', "%{$search}%")
                ->orWhere('def_path', 'ilike', "%{$search}%");
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn ($rec) => [
                'id' => $rec->id,
                'name' => $rec->name,
                'def_path' => $rec->def_path
            ]);

        return $data;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleCreateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        try {

            // save
            $model = new Role($validated);
            $model->save();

            // check if success
            if (!$model->exists()) {
                return back()->withErrors([
                    "message" => "Duplikat data.",
                ]);
            }

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_CREATED],
                'message' => "Data berhasil dibuat.",
            ]);

            Route::inertia('app.role.index', 'App/Role');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role, string $id): JsonResponse
    {
        // validate query parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', "string", "uuid"],
        ])->validate();

        // get data
        $data = $role->where('id', $validated['id'])->select(['id', 'name', 'def_path'])->first();

        // jika data kosong maka kirim pesan
        if ($data === null) {
            throw new HttpResponseException(response([
                "message" => "Data tidak ditemukan.",
            ], Response::HTTP_NOT_FOUND));
        }

        return response()->json(['message' => 'Ok', 'data' => $data])->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleUpdateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        try {

            // update
            $data = Role::find($validated['id']);
            $data->fill($validated);
            $data->save();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => "Data berhasil diperbaharui.",
            ]);

            Route::inertia('app.role.index', 'App/Role');
        } catch (\Exception $e) {
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
            'ids' => ['required', "array"],
            'ids.*' => ['required', 'string', "uuid", Rule::exists('roles', 'id')],
        ])->validated();

        try {

            // execute
            Role::whereIn('id', $validated['ids'])->delete();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => count($validated['ids']) . " data berhasil dihapus.",
            ]);

            Route::inertia('app.role.index', 'App/Role');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }
}
