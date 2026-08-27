<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;

class BrandController extends Controller
{
    /**
     * List all active brands.
     */
    public function index(): JsonResponse
    {
        $brands = Brand::where('is_active', true)
            ->withCount('products')
            ->get();

        return response()->json($brands);
    }
}
