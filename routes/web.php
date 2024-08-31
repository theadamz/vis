<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn() => redirect('sign-in'))->name('/');
Route::get('/login', fn() => redirect('sign-in'))->name('login');
Route::get('/accesses/menus', [\App\Http\Controllers\Application\AccessController::class, 'getMenu'])->middleware(['auth'])->name('accesses.menu');
Route::get('/accesses/check', [\App\Http\Controllers\Application\AccessController::class, 'check'])->name('accesses.auth.check');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/change-site', [\App\Http\Controllers\ProfileController::class, 'updateSite'])->name('profile.update.site');
});

// app - Application
Route::prefix('app')->middleware(['auth'])->group(function () {
    // role
    Route::middleware(['can:app-role', 'access:app-role'])->group(function () {
        Route::get('/roles', [\App\Http\Controllers\Application\RoleController::class, 'index'])->name('app.role.index');
        Route::post('/roles', [\App\Http\Controllers\Application\RoleController::class, 'store'])->can('app-role-create')->name('app.role.store');
        Route::get('/roles/{id}', [\App\Http\Controllers\Application\RoleController::class, 'show'])->can('app-role-read')->name('app.role.read');
        Route::put('/roles/{id}', [\App\Http\Controllers\Application\RoleController::class, 'update'])->can('app-role-edit')->name('app.role.update');
        Route::delete('/roles', [\App\Http\Controllers\Application\RoleController::class, 'destroy'])->can('app-role-delete')->name('app.role.destroy');
    });

    // site
    Route::middleware(['can:app-site', 'access:app-site'])->group(function () {
        Route::get('/sites', [\App\Http\Controllers\Application\SiteController::class, 'index'])->name('app.site.index');
        Route::post('/sites', [\App\Http\Controllers\Application\SiteController::class, 'store'])->can('app-site-create')->name('app.site.store');
        Route::get('/sites/{id}', [\App\Http\Controllers\Application\SiteController::class, 'show'])->can('app-site-read')->name('app.site.read');
        Route::put('/sites/{id}', [\App\Http\Controllers\Application\SiteController::class, 'update'])->can('app-site-edit')->name('app.site.update');
        Route::delete('/sites', [\App\Http\Controllers\Application\SiteController::class, 'destroy'])->can('app-site-delete')->name('app.site.destroy');
    });

    // access
    Route::middleware(['can:app-access', 'access:app-access'])->group(function () {
        Route::get('/accesses', [\App\Http\Controllers\Application\AccessController::class, 'index'])->name('app.access.index');
        Route::get('/accesses/{roleId}/{accessCode}', [\App\Http\Controllers\Application\AccessController::class, 'show'])->can('app-access-read')->name('app.access.read');
        Route::get('/accesses/{roleId}', [\App\Http\Controllers\Application\AccessController::class, 'retriveRoleAccesses'])->can('app-access-read')->name('app.access.get-role-access');
        Route::post('/accesses', [\App\Http\Controllers\Application\AccessController::class, 'store'])->can('app-access-create')->name('app.access.store');
        Route::put('/accesses', [\App\Http\Controllers\Application\AccessController::class, 'update'])->can('app-access-edit')->name('app.access.update');
        Route::delete('/accesses', [\App\Http\Controllers\Application\AccessController::class, 'destroy'])->can('app-access-delete')->name('app.access.destroy');
        Route::post('/accesses/duplicate', [\App\Http\Controllers\Application\AccessController::class, 'duplicate'])->can('app-access-create')->name('app.access.duplicate');
    });

    // user
    Route::middleware(['can:app-user', 'access:app-user'])->group(function () {
        Route::get('/users', [\App\Http\Controllers\Application\UserController::class, 'index'])->name('app.user.index');
        Route::post('/users', [\App\Http\Controllers\Application\UserController::class, 'store'])->can('app-user-create')->name('app.user.store');
        Route::get('/users/{id}', [\App\Http\Controllers\Application\UserController::class, 'show'])->can('app-user-read')->name('app.user.read');
        Route::put('/users/{id}', [\App\Http\Controllers\Application\UserController::class, 'update'])->can('app-user-edit')->name('app.user.update');
        Route::delete('/users', [\App\Http\Controllers\Application\UserController::class, 'destroy'])->can('app-user-delete')->name('app.user.destroy');
    });

    // transaction type
    Route::middleware(['can:app-transaction-type', 'access:app-transaction-type'])->prefix('/transactions')->group(function () {
        Route::get('/types', [\App\Http\Controllers\Application\TransactionTypeController::class, 'index'])->name('app.transaction.type.index');
        Route::post('/types', [\App\Http\Controllers\Application\TransactionTypeController::class, 'store'])->can('app-transaction-type-create')->name('app.transaction.type.store');
        Route::get('/types/{id}', [\App\Http\Controllers\Application\TransactionTypeController::class, 'show'])->can('app-transaction-type-read')->name('app.transaction.type.read');
        Route::put('/types/{id}', [\App\Http\Controllers\Application\TransactionTypeController::class, 'update'])->can('app-transaction-type-edit')->name('app.transaction.type.update');
        Route::delete('/types', [\App\Http\Controllers\Application\TransactionTypeController::class, 'destroy'])->can('app-transaction-type-delete')->name('app.transaction.type.destroy');
        Route::get('/sequences', [\App\Http\Controllers\Application\TransactionSequenceController::class, 'index'])->name('app.transaction.sequence.index');
    });
});

// dsh - Dashboard
Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->middleware(['auth', 'access:dashboard', 'verified'])->name('dashboard');

// bsc - Basic
Route::prefix('basic')->middleware(['auth'])->group(function () {
    // Tipe kendaraan
    Route::middleware(['can:bsc-vhc-type', 'access:bsc-vhc-type'])->group(function () {
        Route::get('/vehicle-types', [\App\Http\Controllers\Basic\VehicleTypeController::class, 'index'])->name('bsc.vhc-type.index');
        Route::post('/vehicle-types', [\App\Http\Controllers\Basic\VehicleTypeController::class, 'store'])->can('bsc-vhc-type-create')->name('bsc.vhc-type.store');
        Route::get('/vehicle-types/{id}', [\App\Http\Controllers\Basic\VehicleTypeController::class, 'show'])->can('bsc-vhc-type-read')->name('bsc.vhc-type.read');
        Route::put('/vehicle-types/{id}', [\App\Http\Controllers\Basic\VehicleTypeController::class, 'update'])->can('bsc-vhc-type-edit')->name('bsc.vhc-type.update');
        Route::delete('/vehicle-types', [\App\Http\Controllers\Basic\VehicleTypeController::class, 'destroy'])->can('bsc-vhc-type-delete')->name('bsc.vhc-type.destroy');
    });
});

// ins - Inspeksi
Route::prefix('inspections')->middleware(['auth'])->group(function () {
    // formulir
    Route::middleware(['can:ins-form', 'access:ins-form'])->group(function () {
        Route::get('/forms', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'index'])->name('ins.form.index');
        Route::get('/forms/create', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'create'])->can('ins-form-create')->name('ins.form.create');
        Route::post('/forms', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'store'])->can('ins-form-create')->name('ins.form.store');
        Route::get('/forms/{id}', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'show'])->can('ins-form-read')->name('ins.form.read');
        Route::get('/forms/{id}/edit', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'edit'])->can('ins-form-edit')->name('ins.form.edit');
        Route::put('/forms/{id}', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'update'])->can('ins-form-edit')->name('ins.form.update');
        Route::delete('/forms', [\App\Http\Controllers\Inspection\InspectionFormController::class, 'destroy'])->can('ins-form-delete')->name('ins.form.destroy');
    });

    // vehicle inspection
    Route::middleware(['can:ins-inspection', 'access:ins-inspection'])->group(function () {
        Route::get('/', [\App\Http\Controllers\Inspection\InspectionController::class, 'index'])->name('ins.inspection.index');
        Route::get('/create', [\App\Http\Controllers\Inspection\InspectionController::class, 'create'])->can('ins-inspection-create')->name('ins.inspection.create');
        Route::post('/', [\App\Http\Controllers\Inspection\InspectionController::class, 'store'])->can('ins-inspection-create')->name('ins.inspection.store');
        Route::get('/{id}', [\App\Http\Controllers\Inspection\InspectionController::class, 'show'])->can('ins-inspection-read')->name('ins.inspection.read');
        Route::get('/{id}/edit', [\App\Http\Controllers\Inspection\InspectionController::class, 'edit'])->can('ins-inspection-edit')->name('ins.inspection.edit');
        Route::put('/{id}', [\App\Http\Controllers\Inspection\InspectionController::class, 'update'])->can('ins-inspection-edit')->name('ins.inspection.update');
        Route::delete('/', [\App\Http\Controllers\Inspection\InspectionController::class, 'destroy'])->can('ins-inspection-delete')->name('ins.inspection.destroy');
    });
});

// rpt - Reports
Route::prefix('reports')->middleware(['auth'])->group(function () {
    // formulir
    Route::middleware(['can:rpt-list', 'access:rpt-list'])->group(function () {
        Route::get('/', [\App\Http\Controllers\Reports\ReportController::class, 'index'])->name('rpt.list.index');
    });
});

require_once __DIR__ . '/auth.php';
