<?php

namespace App\Http\Controllers\Inspection;

use App\Http\Controllers\Controller;
use App\Models\Basic\VehicleType;
use App\Models\Inspection\Inspection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class InspectionController extends Controller
{
    public function index(): \Inertia\Response
    {
        // get vehicle types
        $vehicleTypes = VehicleType::where('is_visible', true)->get(['id', 'name', 'is_visible']);

        return Inertia::render('Inspection/Vehicle/Index', [
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
        $dateStart = $request->has('date_start') && $request->filled('date_start') && app()->general->isValidDate($request->get('date_start')) ? $request->get('date_start') : Carbon::now()->subMonths(3);
        $dateEnd = $request->has('date_end') && $request->filled('date_end') && app()->general->isValidDate($request->get('date_end')) ? $request->get('date_end') : Carbon::now();

        // handling sort filter
        $sort = ['id', 'asc'];
        if ($request->has("sort") && !empty($request->get('sort'))) {
            $sort = str($request->get('sort'))->explode('.');
            if (!in_array($sort[1], ['asc', 'desc'])) {
                $sort[1] = 'asc';
            }
        }

        // prepare paginate and order by
        $data = Inspection::query()->select([
            'id',
            'inspection_form_id',
            'doc_no',
            'doc_date',
            'container_no',
            'seal_no',
            'inspected_by',
            'driver_name',
            'driver_id_no',
            'driver_pic',
            'driver_phone_no',
            'vehicle_reg_no',
            'vehicle_paper_no',
            'vehicle_paper_pic',
            'checked_in_by',
            'checked_in_at',
            'loading_start_by',
            'loading_start_at',
            'loading_end_by',
            'loading_end_at',
            'checked_out_by',
            'checked_out_at',
            'arrival_time_at_fty',
            'depart_time_from_fty',
            'eta_to_dest',
            'actual_time_arrival_to_dest',
            'export_notified_by',
            'remarks',
            'stage',
        ]);

        // get relations
        $data->with([
            'inspection_form' => function ($query) {
                $query->select(['id', 'vehicle_type_id', 'code', 'name'])->with(['vehicle_type', function ($query) {
                    $query->select(['id', 'name']);
                }]);
            },
            'inspected_by' => function ($query) {
                $query->select(['id', 'name']);
            },
        ]);

        // filter date
        $data->whereBetween('doc_date', [$dateStart, $dateEnd]);

        // filter vehicle_type
        $data->when($request->has('vehicle_type') && $request->filled('vehicle_type'), function (Builder $query) use ($request) {
            $query->whereHas('inspection_form', function (Builder $query) use ($request) {
                $query->where('vehicle_type_id', $request->get('vehicle_type'));
            });
        });

        // filter with search
        $data->when(!empty($search), function (Builder $query) use ($search) {
            // query table
            $queries = $query->where('doc_no', 'ilike', "%{$search}%")
                ->orWhere('container_no', 'ilike', "%{$search}%")
                ->orWhere('seal_no', 'ilike', "%{$search}%")
                ->orWhere('driver_name', 'ilike', "%{$search}%")
                ->orWhere('driver_id_no', 'ilike', "%{$search}%")
                ->orWhere('driver_phone_no', 'ilike', "%{$search}%")
                ->orWhere('vehicle_reg_no', 'ilike', "%{$search}%");

            // query relations
            $queries = $queries->orWhereHas('vehicle_type', function (Builder $query) use ($search) {
                $query->where('name', 'ilike', "%{$search}%");
            });

            return $queries;
        });

        // filter stage
        $data->when($request->has('stage') && $request->filled('stage'), function (Builder $query) use ($request) {
            $query->where('stage', $request->get('stage'));
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn($rec) => [
                'id' => $rec->id,
                'vehicle_type' => $rec->inspection_form->vehicle_type->name,
                'doc_no' => $rec->doc_no,
                'doc_date' => $rec->doc_date,
                'container_no' => $rec->container_no,
                'seal_no' => $rec->seal_no,
                'inspected_by' => $rec->inspected_by->name,
                'driver_name' => $rec->driver_name,
                'driver_id_no' => $rec->driver_id_no,
                'driver_pic' => $rec->driver_pic,
                'driver_phone_no' => $rec->driver_phone_no,
                'vehicle_reg_no' => $rec->vehicle_reg_no,
                'vehicle_paper_no' => $rec->vehicle_paper_no,
                'vehicle_paper_pic' => $rec->vehicle_paper_pic,
                'checked_in_by' => $rec->checked_in_by,
                'checked_in_at' => $rec->checked_in_at,
                'loading_start_by' => $rec->loading_start_by,
                'loading_start_at' => $rec->loading_start_at,
                'loading_end_by' => $rec->loading_end_by,
                'loading_end_at' => $rec->loading_end_at,
                'checked_out_by' => $rec->checked_out_by,
                'checked_out_at' => $rec->checked_out_at,
                'arrival_time_at_fty' => $rec->arrival_time_at_fty,
                'depart_time_from_fty' => $rec->depart_time_from_fty,
                'eta_to_dest' => $rec->eta_to_dest,
                'actual_time_arrival_to_dest' => $rec->actual_time_arrival_to_dest,
                'export_notified_by' => $rec->export_notified_by,
                'remarks' => $rec->remarks,
                'stage' => $rec->stage,
            ]);

        return $data;
    }
}
