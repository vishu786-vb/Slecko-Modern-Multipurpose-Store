<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * List products with filtering, search, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'brand'])->where('is_active', true);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->has('category') && $request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Brand filter
        if ($request->has('brand') && $request->brand) {
            $query->whereHas('brand', function ($q) use ($request) {
                $q->where('slug', $request->brand);
            });
        }

        // Price range filter
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Featured filter
        if ($request->has('featured') && $request->featured) {
            $query->where('is_featured', true);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['price', 'name', 'created_at', 'rating'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = min($request->get('per_page', 12), 50);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Get a single product by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::with(['category', 'brand'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Get related products from same category
        $related = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->limit(4)
            ->get();

        return response()->json([
            'product' => $product,
            'related' => $related,
        ]);
    }

    /**
     * Get featured products.
     */
    public function featured(): JsonResponse
    {
        $products = Product::with(['category', 'brand'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->limit(8)
            ->get();

        return response()->json($products);
    }
}
