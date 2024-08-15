<?php

namespace App\Http\Controllers\Application;

use App\Http\Controllers\Controller;
use App\Models\Application\Role;
use App\Models\Application\Site;
use App\Models\Application\TransactionSequence;
use App\Models\Application\TransactionType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class TransactionSequenceController extends Controller
{
    public function index(): \Inertia\Response
    {
        // get transaction types
        $transactionTypes = TransactionType::get(['id', 'code', 'name']);

        // get sites
        $sites = Site::where('is_active', true)->get(['id', 'code', 'name']);

        return Inertia::render('App/Transaction/Sequence', [
            'transactionTypes' => $transactionTypes,
            'sites' => $sites,
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
        $data = TransactionSequence::query();

        // get relations
        $data->with([
            'transaction_type' => function ($query) {
                $query->select(['id', 'name']);
            },
            'site' => function ($query) {
                $query->select(['id', 'name']);
            },
        ]);

        // filter with search
        $data->when(!empty($search), function (Builder $query) use ($search) {
            // query table
            $queryAll = $query->where('month', 'ilike', "%{$search}%")->orWhere('year', 'ilike', "%{$search}%");

            // query relations
            $queryAll = $queryAll->orWhereHas('transaction_type', function (Builder $query) use ($search) {
                $query->where('name', 'ilike', "%{$search}%");
            })->orWhereHas('site', function (Builder $query) use ($search) {
                $query->where('name', 'ilike', "%{$search}%");
            });

            return $queryAll;
        });

        // filter site
        $data->when($request->has('transaction_type') && $request->filled('transaction_type'), function (Builder $query) use ($request) {
            $query->where('transaction_type_id', $request->get('transaction_type'));
        });

        // filter site
        $data->when($request->has('site') && $request->filled('site'), function (Builder $query) use ($request) {
            $query->where('site_id', $request->get('site'));
        });

        // order by
        $data->orderBy($sort[0], $sort[1]);

        // send link with query string and only send needed data
        $data = $data->paginate($perPage, page: $page)->withQueryString()
            ->through(fn ($rec) => [
                'transaction_type_name' => $rec->transaction_type->name,
                'site_name' => $rec->site->name,
                'year' => $rec->year,
                'month' => $rec->month,
                'next_no' => $rec->next_no,
            ]);

        return $data;
    }
}
