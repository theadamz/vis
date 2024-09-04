<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/basic/vehicle-types', [\App\Http\Controllers\Basic\VehicleTypeController::class, 'lists']);
Route::get('/inspections/forms', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'lists']);
