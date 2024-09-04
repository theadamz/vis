<?php

namespace App\Http\Controllers\Basic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Basic\VehicleTypeCreateRequest;
use App\Http\Requests\Basic\VehicleTypeUpdateRequest;
use App\Models\Basic\VehicleType;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Route;
use Symfony\Component\HttpFoundation\Response;
use Validator;

class VehicleTypeController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Basic/VehicleType', [
            'datatable' => fn() => $this->datatable(),
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
        $data = VehicleType::query();

        // filter with search
        $data->when(!empty($search), function ($query) use ($search) {
            $query->where('name', 'ilike', "%{$search}%");
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'name' => $rec->name,
                'is_visible' => $rec->is_visible
            ]);

        return $data;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(VehicleTypeCreateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        try {
            // save
            $model = new VehicleType($validated);
            $model->save();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_CREATED],
                'message' => "Data successfully created.",
            ]);

            Route::inertia('app.vhc-type.index', 'Basic/VehicleType');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(VehicleType $model, string $id)
    {
        // validate query parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', "string", "uuid"],
        ])->validate();

        // get data
        $data = $model->where('id', $validated['id'])->select(['id', 'name', 'is_visible'])->first();

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
    public function update(VehicleTypeUpdateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        try {

            // update
            $data = VehicleType::find($validated['id']);
            $data->fill($validated);
            $data->save();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => "Data successfully saved.",
            ]);

            Route::inertia('app.vhc-type.index', 'Basic/VehicleType');
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
            'ids.*' => ['required', 'string', "uuid", Rule::exists('vehicle_types', 'id')],
        ])->validated();

        try {

            // execute
            VehicleType::whereIn('id', $validated['ids'])->delete();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => count($validated['ids']) . " data successfully deleted.",
            ]);

            Route::inertia('app.vhc-type.index', 'Basic/VehicleType');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function lists(): JsonResponse
    {
        // get data
        $data = VehicleType::where('is_visible', true)->get(['id', 'name']);

        return response()->json(['message' => 'Ok', 'data' => $data])->setStatusCode(Response::HTTP_OK);
    }
}
