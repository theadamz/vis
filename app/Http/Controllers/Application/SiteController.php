<?php

namespace App\Http\Controllers\Application;

use App\Http\Controllers\Controller;
use App\Http\Requests\Application\SiteCreateRequest;
use App\Http\Requests\Application\SiteUpdateRequest;
use App\Models\Application\Site;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Str;
use Symfony\Component\HttpFoundation\Response;

class SiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        return Inertia::render('App/Site/Index', [
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
        $data = Site::query();

        // filter active
        $data->when($request->has('active') && is_bool(filter_var($request->get('active'), FILTER_VALIDATE_BOOLEAN)), function (Builder $query) use ($request) {
            $query->where('is_active', filter_var($request->get('active'), FILTER_VALIDATE_BOOLEAN));
        });

        // filter with search
        $data->when(!empty($search), function (Builder $query) use ($search) {
            $query->where(function (Builder $query) use ($search) {
                $query->where('code', 'ilike', "%{$search}%")->orWhere('name', 'ilike', "%{$search}%");
            });
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'code' => $rec->code,
                'name' => $rec->name,
                'address' => $rec->address,
                'is_active' => $rec->is_active
            ]);

        return $data;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SiteCreateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        // check if code already exist
        $exist = Site::where(function ($query) use ($validated) {
            $query->whereRaw("LOWER(code)=?", [Str::lower($validated['code'])]);
        })->exists();

        if ($exist) {
            return back()->withErrors([
                "code" => ["Code already used."],
            ]);
        }

        try {

            // save
            $model = new Site($validated);
            $model->save();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_CREATED],
                'message' => "Data successfully created.",
            ]);

            Route::inertia('app.site.index', 'App/Site/Index');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Site $site, string $id): JsonResponse
    {
        // validate query parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', "string", "uuid"],
        ])->validate();

        // get data
        $data = $site->where('id', $validated['id'])->select(['id', 'code', 'name', 'address', 'is_active'])->first();

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
    public function update(SiteUpdateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        // check if code already exist
        $exist = Site::where(function ($query) use ($validated) {
            $query->whereRaw("LOWER(code)=?", [Str::lower($validated['code'])])->where('id', '!=', $validated['id']);
        })->exists();

        if ($exist) {
            return back()->withErrors([
                "code" => ["Code already used."],
            ]);
        }

        try {

            // update
            $data = Site::find($validated['id']);
            $data->fill($validated);
            $data->save();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => "Data successfully saved.",
            ]);

            Route::inertia('app.site.index', 'App/Site/Index');
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
            'ids.*' => ['required', 'string', "uuid", Rule::exists('sites', 'id')],
        ])->validated();

        try {

            // execute
            Site::whereIn('id', $validated['ids'])->delete();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => count($validated['ids']) . " data successfully deleted.",
            ]);

            Route::inertia('app.site.index', 'App/Site/Index');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }
}
