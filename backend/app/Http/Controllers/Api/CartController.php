<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Validate cart items and return pricing info.
     */
    public function validate_cart(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $items = [];
        $subtotal = 0;

        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);

            if (!$product || !$product->is_active) {
                continue;
            }

            $itemTotal = $product->price * $item['quantity'];
            $subtotal += $itemTotal;

            $items[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => (float) $product->price,
                'quantity' => $item['quantity'],
                'total' => $itemTotal,
                'thumbnail' => $product->thumbnail,
                'in_stock' => $product->stock_quantity >= $item['quantity'],
            ];
        }

        $tax = round($subtotal * 0.08, 2); // 8% tax
        $shipping = $subtotal >= 100 ? 0 : 9.99;
        $total = $subtotal + $tax + $shipping;

        return response()->json([
            'items' => $items,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'free_shipping_threshold' => 100,
        ]);
    }

    /**
     * Place an order (checkout).
     */
    public function checkout(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'shipping_address' => 'required|string|max:500',
            'shipping_city' => 'required|string|max:100',
            'shipping_state' => 'nullable|string|max:100',
            'shipping_zip' => 'required|string|max:20',
            'shipping_country' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $subtotal = 0;
        $orderItems = [];

        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);

            if (!$product || !$product->is_active) {
                return response()->json([
                    'error' => "Product '{$product->name}' is no longer available."
                ], 400);
            }

            if ($product->stock_quantity < $item['quantity']) {
                return response()->json([
                    'error' => "Insufficient stock for '{$product->name}'."
                ], 400);
            }

            $itemTotal = $product->price * $item['quantity'];
            $subtotal += $itemTotal;

            $orderItems[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'price' => $product->price,
                'quantity' => $item['quantity'],
                'total' => $itemTotal,
            ];
        }

        $tax = round($subtotal * 0.08, 2);
        $shipping = $subtotal >= 100 ? 0 : 9.99;
        $total = $subtotal + $tax + $shipping;

        // Create order
        $order = Order::create([
            'order_number' => Order::generateOrderNumber(),
            'status' => 'pending',
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'shipping_address' => $request->shipping_address,
            'shipping_city' => $request->shipping_city,
            'shipping_state' => $request->shipping_state,
            'shipping_zip' => $request->shipping_zip,
            'shipping_country' => $request->shipping_country ?? 'US',
            'notes' => $request->notes,
        ]);

        // Create order items and reduce stock
        foreach ($orderItems as $item) {
            OrderItem::create(array_merge($item, ['order_id' => $order->id]));
            Product::where('id', $item['product_id'])
                ->decrement('stock_quantity', $item['quantity']);
        }

        return response()->json([
            'message' => 'Order placed successfully',
            'order' => $order->load('items'),
        ], 201);
    }
}
