<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// auth
Route::post('/sign-in', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
Route::post('/sign-out', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

Route::get('/profile', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// route v1
Route::prefix('v1')->middleware(['auth:sanctum', 'can:as-inspector'])->group(fn() => require_once __DIR__ . '/api_v1.php');

// Test
Route::get('/test', function () {
    return ['message' => 'Online'];
});
