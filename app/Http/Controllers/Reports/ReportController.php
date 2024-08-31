<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Report/Index', [
            'reportLists' => fn() => $this->reportLists()
        ]);
    }

    private function reportLists(): array
    {
        return [
            [
                'name' => 'Vehicle Types',
                'description' => 'List of vehicle types',
                'path' => '/reports/vehicle-types'
            ],
            [
                'name' => 'Vehicle Inspection',
                'description' => 'Vehicle Inspection Reports',
                'path' => '/reports/inspection-vehicle'
            ],
        ];
    }
}
