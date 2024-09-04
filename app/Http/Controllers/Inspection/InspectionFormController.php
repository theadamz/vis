<?php

namespace App\Http\Controllers\Inspection;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inspection\InspectionFormCreateRequest;
use App\Http\Requests\Inspection\InspectionFormUpdateRequest;
use App\Models\Basic\VehicleType;
use App\Models\Inspection\InspectionForm;
use App\Models\Inspection\InspectionFormCategory;
use App\Models\Inspection\InspectionFormCheck;
use DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use PhpParser\Node\Stmt\Foreach_;
use Route;
use Str;
use Symfony\Component\HttpFoundation\Response;
use Validator;

class InspectionFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        // get vehicle types
        $vehicleTypes = VehicleType::where('is_visible', true)->get(['id', 'name', 'is_visible']);

        return Inertia::render('Inspection/Form/Index', [
            'vehicleTypes' => $vehicleTypes,
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
        $data = InspectionForm::query()->select(['id', 'vehicle_type_id', 'type', 'code', 'name', 'use_eta_dest', 'use_ata_dest', 'is_publish']);

        // get relations
        $data->with([
            'vehicle_type' => function ($query) {
                $query->select(['id', 'name']);
            },
        ]);

        // filter vehicle_type
        $data->when($request->has('vehicle_type') && $request->filled('vehicle_type'), function (Builder $query) use ($request) {
            $query->where('vehicle_type_id', $request->get('vehicle_type'));
        });

        // filter with search
        $data->when(!empty($search), function (Builder $query) use ($search) {
            // query table
            $queries = $query->where('code', 'ilike', "%{$search}%")->orWhere('name', 'ilike', "%{$search}%")->orWhere('name', 'ilike', "%{$search}%");

            // query relations
            $queries = $queries->orWhereHas('vehicle_type', function (Builder $query) use ($search) {
                $query->where('name', 'ilike', "%{$search}%");
            });

            return $queries;
        });

        // filter use_eta_dest
        $data->when($request->has('use_eta_dest') && is_bool(filter_var($request->get('use_eta_dest'), FILTER_VALIDATE_BOOLEAN)), function (Builder $query) use ($request) {
            $query->where('use_eta_dest', filter_var($request->get('use_eta_dest'), FILTER_VALIDATE_BOOLEAN));
        });

        // filter use_ata_dest
        $data->when($request->has('use_ata_dest') && is_bool(filter_var($request->get('use_ata_dest'), FILTER_VALIDATE_BOOLEAN)), function (Builder $query) use ($request) {
            $query->where('use_ata_dest', filter_var($request->get('use_ata_dest'), FILTER_VALIDATE_BOOLEAN));
        });

        // filter is_publish
        $data->when($request->has('is_publish') && is_bool(filter_var($request->get('is_publish'), FILTER_VALIDATE_BOOLEAN)), function (Builder $query) use ($request) {
            $query->where('is_publish', filter_var($request->get('is_publish'), FILTER_VALIDATE_BOOLEAN));
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'vehicle_type_name' => $rec->vehicle_type->name,
                'type' => $rec->type,
                'code' => $rec->code,
                'name' => $rec->name,
                'use_eta_dest' => $rec->use_eta_dest,
                'use_ata_dest' => $rec->use_ata_dest,
                'is_publish' => $rec->is_publish
            ]);

        return $data;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // get vehicle types
        $vehicleTypes = VehicleType::where('is_visible', true)->get(['id', 'name', 'is_visible']);

        return Inertia::render('Inspection/Form/Create', [
            'vehicleTypes' => $vehicleTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(InspectionFormCreateRequest $request)
    {
        // validate request
        $validated = $request->validated();

        // check for duplicate
        $exist = InspectionForm::where(function (Builder $query) use ($validated) {
            $query->where(function (Builder $query) use ($validated) {
                $query->whereRaw("LOWER(code)=?", [Str::lower($validated['code'])]);
            });
        })->exists();

        if ($exist) {
            return back()->withErrors([
                "message" => ["Code already exist."],
            ]);
        }

        try {
            // begin trans
            DB::beginTransaction();

            // insert inspection forms
            $inspectionForm = InspectionForm::create([
                'vehicle_type_id' => $validated['vehicle_type_id'],
                'type' => $validated['type'],
                'code' => $validated['code'],
                'name' => $validated['name'],
                'use_eta_dest' => $validated['use_eta_dest'],
                'use_ata_dest' => $validated['use_ata_dest'],
                'is_publish' => $validated['is_publish'],
            ]);

            // loop checklists array
            foreach ($validated['checklists'] as $checklist) {
                // insert inspection form categories
                $inspectionFormCategory = InspectionFormCategory::create([
                    'inspection_form_id' => $inspectionForm->id,
                    'stage' => $checklist['stage'],
                    'description' => $checklist['description'],
                    'order' => $checklist['order'],
                    'is_separate_page' => $checklist['is_separate_page'],
                ]);

                // loop checklist > checks
                foreach ($checklist['checks'] as $check) {
                    // insert into inspection form checks
                    InspectionFormCheck::create([
                        'inspection_form_category_id' => $inspectionFormCategory->id,
                        'description' => $check['description'],
                        'type' => $check['type'],
                        'order' => $check['order'],
                    ]);
                }
            }

            // commit changes
            DB::commit();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_CREATED],
                'message' => "Data successfully created.",
            ]);

            Route::inertia('ins.form.create', 'Inspection/Form/Create');
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
    public function show(InspectionForm $InspectionForm)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): \Inertia\Response
    {
        // variables
        $data = [];
        $checklists = [];

        // get inspection form data
        $inspectionForm = InspectionForm::where('id', $id)->exists();

        // if not exist then 404
        if (!$inspectionForm) {
            abort(Response::HTTP_NOT_FOUND);
        }

        // retrive form inspection data
        $data = InspectionForm::where('id', $id)->first(['id', 'vehicle_type_id', 'type', 'code', 'name', 'use_eta_dest', 'use_ata_dest', 'is_publish']);

        // retrive form inspection categories data
        $inspectionFormCategories = InspectionFormCategory::where('inspection_form_id', $data->id)->orderBy('order')->get(['id', 'inspection_form_id', 'stage', 'description', 'order', 'is_separate_page']);

        // loop inspectionFormCategories
        foreach ($inspectionFormCategories as $category) {
            // retrive form inspection check by category id
            $checks = InspectionFormCheck::where('inspection_form_category_id', $category->id)->orderBy('order')->get(['id', 'inspection_form_category_id', 'description', 'type', 'order']);

            // adding category and checks to checklists
            $newCategoryChecks = $category->toArray();
            $newCategoryChecks['checks'] = $checks->toArray();

            $checklists[] = $newCategoryChecks;
        }

        // join the data
        $data['checklists'] = $checklists;

        // get vehicle types
        $vehicleTypes = VehicleType::where('is_visible', true)->get(['id', 'name', 'is_visible']);

        return Inertia::render('Inspection/Form/Edit', [
            'vehicleTypes' => $vehicleTypes,
            'inspectionData' => $data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(InspectionFormUpdateRequest $request)
    {
        // variables
        $inspectionId = null;
        $inspectionCategoryId = null;

        // validate request
        $validated = $request->validated();

        // check for duplicate
        $exist = InspectionForm::where(function (Builder $query) use ($validated) {
            $query->where(function (Builder $query) use ($validated) {
                $query->whereRaw("LOWER(code)=?", [Str::lower($validated['code'])]);
            })->where('id', '!=', $validated['id']);
        })->exists();

        if ($exist) {
            return back()->withErrors([
                "message" => ["Code already exist."],
            ]);
        }

        // set inspection id
        $inspectionId = $validated['id'];

        try {
            // begin trans
            DB::beginTransaction();

            // insert inspection forms
            InspectionForm::where('id', $inspectionId)->update([
                'vehicle_type_id' => $validated['vehicle_type_id'],
                'type' => $validated['type'],
                'code' => $validated['code'],
                'name' => $validated['name'],
                'use_eta_dest' => $validated['use_eta_dest'],
                'use_ata_dest' => $validated['use_ata_dest'],
                'is_publish' => $validated['is_publish'],
            ]);

            // loop checklists array
            foreach ($validated['checklists'] as $checklist) {
                // get if category already exist
                $categoryExist = InspectionFormCategory::where('id', (string) $checklist['id'])->exists();

                // if category exist then update
                if ($categoryExist) {
                    // update inspection form categories
                    InspectionFormCategory::where('id', $checklist['id'])->update([
                        'inspection_form_id' => $inspectionId,
                        'stage' => $checklist['stage'],
                        'description' => $checklist['description'],
                        'order' => $checklist['order'],
                        'is_separate_page' => $checklist['is_separate_page'],
                    ]);

                    // set inspection category id
                    $inspectionCategoryId = $checklist['id'];
                } else {
                    // insert inspection form categories
                    $inspectionFormCategory = InspectionFormCategory::create([
                        'inspection_form_id' => $inspectionId,
                        'stage' => $checklist['stage'],
                        'description' => $checklist['description'],
                        'order' => $checklist['order'],
                        'is_separate_page' => $checklist['is_separate_page'],
                    ]);

                    // set inspection category id
                    $inspectionCategoryId = $inspectionFormCategory->id;
                }

                // loop checklist > checks
                foreach ($checklist['checks'] as $check) {
                    // get if category already exist
                    $checkExist = InspectionFormCheck::where('id', (string) $check['id'])->exists();

                    // if check exist then update
                    if ($checkExist) {
                        // insert inspection form checks
                        InspectionFormCheck::where('id', $check['id'])->update([
                            'inspection_form_category_id' => $inspectionCategoryId,
                            'description' => $check['description'],
                            'type' => $check['type'],
                            'order' => $check['order'],
                        ]);
                    } else {
                        // insert inspection form checks
                        InspectionFormCheck::create([
                            'inspection_form_category_id' => $inspectionCategoryId,
                            'description' => $check['description'],
                            'type' => $check['type'],
                            'order' => $check['order'],
                        ]);
                    }
                }
            }

            // commit changes
            DB::commit();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => "Data successfully saved.",
            ]);

            Route::inertia('ins.form.edit', 'Inspection/Form/Edit');
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
            'ids' => ['required', "array"],
            'ids.*' => ['required', 'string', "uuid", Rule::exists('inspection_forms', 'id')],
        ])->validated();

        try {
            // delete
            InspectionForm::whereIn('id', $validated['ids'])->delete();

            // set toast
            Session::flash('toast', [
                'variant' => 'success',
                'title' => Response::$statusTexts[Response::HTTP_OK],
                'message' => count($validated['ids']) . " data deleted.",
            ]);

            Route::inertia('ins.form.index', 'Inspection/Form/Index');
        } catch (\Exception $e) {
            return back()->withErrors([
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function lists(): JsonResponse
    {
        // get data
        $data = InspectionForm::where('is_publish', true)
            ->with(['vehicle_type' => function (Builder $query) {
                $query->select(['id', 'name']);
            }])
            ->get(['id', 'vehicle_type_id', 'code', 'name', 'use_eta_dest', 'use_ata_dest']);

        return response()->json(['message' => 'Ok', 'data' => $data])->setStatusCode(Response::HTTP_OK);
    }
}
