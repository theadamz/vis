<?php

namespace App\Http\Controllers\Application;

use App\Http\Controllers\Controller;
use App\Http\Requests\Application\TransactionTypeCreateRequest;
use App\Http\Requests\Application\TransactionTypeUpdateRequest;
use App\Models\Application\TransactionType;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Str;
use Symfony\Component\HttpFoundation\Response;
use Validator;

class TransactionTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        return Inertia::render('App/Transaction/Type/Index', [
            'formatSeqArray' => config('setting.sequence.array_format'),
            'formatSeqDefault' => config('setting.sequence.format_seq_default'),
            'datatable' => fn () => $this->datatable()
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
        $data = TransactionType::query();

        // filter with search
        $data->when(!empty($search), function ($query) use ($search) {
            $query->where('code', 'ilike', "%{$search}%")
                ->orWhere('name', 'ilike', "%{$search}%")
                ->orWhere('prefix', 'ilike', "%{$search}%")
                ->orWhere('suffix', 'ilike', "%{$search}%")
                ->orWhere('format_seq', 'ilike', "%{$search}%");
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn ($rec) => [
                'id' => $rec->id,
                'code' => $rec->code,
                'name' => $rec->name,
                'prefix' => $rec->prefix,
                'suffix' => $rec->suffix,
                'length_seq' => $rec->length_seq,
                'format_seq' => $rec->format_seq,
            ]);

        return $data;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TransactionTypeCreateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        // check if code already exist
        $exist = TransactionType::where(function ($query) use ($validated) {
            $query->whereRaw("LOWER(code)=?", [Str::lower($validated['code'])]);
        })->exists();

        if ($exist) {
            return back()->withErrors([
                "code" => ["Kode sudah ada."],
            ]);
        }

        try {

            // save
            $model = new TransactionType($validated);
            $model->save();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_CREATED],
                'message' => "Data berhasil dibuat.",
            ]);

            Route::inertia('app.transaction.type.index', 'App/Transaction/Type/Index');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(TransactionType $model, string $id): JsonResponse
    {
        // validate query parameter
        $validated = Validator::make(['id' => $id], [
            'id' => ['required', "string", "uuid"],
        ])->validate();

        // get data
        $data = $model->where('id', $validated['id'])->select(['id', 'code', 'name', 'prefix', 'suffix', 'length_seq', 'format_seq'])->first();

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
    public function update(TransactionTypeUpdateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        // check if code already exist
        $exist = TransactionType::where(function ($query) use ($validated) {
            $query->whereRaw("LOWER(code)=?", [Str::lower($validated['code'])])->where('id', '!=', $validated['id']);
        })->exists();

        if ($exist) {
            return back()->withErrors([
                "code" => ["Kode sudah ada."],
            ]);
        }

        try {

            // update
            $data = TransactionType::find($validated['id']);
            $data->fill($validated);
            if (empty($validated['suffix'])) {
                $data->suffix = "";
            }
            $data->save();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => "Data berhasil diperbaharui.",
            ]);

            Route::inertia('app.transaction.type.index', 'App/Transaction/Type/Index');
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
            'ids.*' => ['required', 'string', "uuid", Rule::exists('transaction_types', 'id')],
        ])->validated();

        try {

            // execute
            TransactionType::whereIn('id', $validated['ids'])->delete();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => count($validated['ids']) . " data berhasil dihapus.",
            ]);

            Route::inertia('app.transaction.type.index', 'App/Transaction/Type/Index');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }
}
