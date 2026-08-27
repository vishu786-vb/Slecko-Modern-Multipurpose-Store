<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * List all active categories.
     */
    public function index(): JsonResponse
    {
        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return response()->json($categories);
    }

    /**
     * Get a single category with its products.
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->withCount('products')
            ->firstOrFail();

        return response()->json($category);
    }
}
