<?php

use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

// Brands
Route::get('/brands', [BrandController::class, 'index']);

// Cart & Orders
Route::post('/cart/validate', [CartController::class, 'validate_cart']);
Route::post('/checkout', [CartController::class, 'checkout']);
