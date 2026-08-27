<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@slekco.com',
            'password' => bcrypt('password'),
        ]);

        // Create brands
        $brands = [
            ['name' => 'TechVault', 'slug' => 'techvault', 'description' => 'Premium technology and gadgets'],
            ['name' => 'UrbanThread', 'slug' => 'urbanthread', 'description' => 'Contemporary urban fashion'],
            ['name' => 'HomeNest', 'slug' => 'homenest', 'description' => 'Modern home essentials'],
            ['name' => 'FitPulse', 'slug' => 'fitpulse', 'description' => 'Performance fitness gear'],
            ['name' => 'Luxora', 'slug' => 'luxora', 'description' => 'Luxury accessories and lifestyle'],
            ['name' => 'GreenLeaf', 'slug' => 'greenleaf', 'description' => 'Sustainable living products'],
        ];

        foreach ($brands as $brand) {
            Brand::create($brand);
        }

        // Create categories
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Latest gadgets and tech', 'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'],
            ['name' => 'Fashion', 'slug' => 'fashion', 'description' => 'Trendy clothing and accessories', 'image' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'],
            ['name' => 'Home & Living', 'slug' => 'home-living', 'description' => 'Furniture and decor', 'image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
            ['name' => 'Sports & Fitness', 'slug' => 'sports-fitness', 'description' => 'Workout gear and equipment', 'image' => 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'description' => 'Watches, bags, and more', 'image' => 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400'],
            ['name' => 'Beauty & Care', 'slug' => 'beauty-care', 'description' => 'Skincare and wellness', 'image' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Create products
        $products = [
            // Electronics
            [
                'name' => 'Wireless Noise-Cancelling Headphones',
                'slug' => 'wireless-noise-cancelling-headphones',
                'description' => 'Experience immersive sound with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and ultra-comfortable over-ear design. Perfect for music lovers and professionals who demand crystal-clear audio quality.',
                'short_description' => 'Premium ANC headphones with 30hr battery',
                'price' => 299.99,
                'compare_price' => 399.99,
                'sku' => 'TECH-HP-001',
                'stock_quantity' => 50,
                'category_id' => 1,
                'brand_id' => 1,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600',
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
                'is_featured' => true,
                'rating' => 4.8,
                'reviews_count' => 234,
            ],
            [
                'name' => 'Smart Watch Pro X',
                'slug' => 'smart-watch-pro-x',
                'description' => 'Stay connected and track your health with the Smart Watch Pro X. Features include heart rate monitoring, GPS tracking, sleep analysis, and 100+ workout modes. Water-resistant up to 50 meters with a stunning AMOLED display.',
                'short_description' => 'Advanced smartwatch with health tracking',
                'price' => 449.99,
                'compare_price' => 549.99,
                'sku' => 'TECH-SW-002',
                'stock_quantity' => 35,
                'category_id' => 1,
                'brand_id' => 1,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600',
                    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400',
                'is_featured' => true,
                'rating' => 4.6,
                'reviews_count' => 189,
            ],
            [
                'name' => 'Portable Bluetooth Speaker',
                'slug' => 'portable-bluetooth-speaker',
                'description' => 'Take your music anywhere with this compact yet powerful Bluetooth speaker. Features 360-degree sound, waterproof design (IPX7), and 20 hours of playtime. Perfect for outdoor adventures and pool parties.',
                'short_description' => 'Waterproof speaker with 360° sound',
                'price' => 79.99,
                'compare_price' => 99.99,
                'sku' => 'TECH-SP-003',
                'stock_quantity' => 100,
                'category_id' => 1,
                'brand_id' => 1,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
                    'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
                'is_featured' => false,
                'rating' => 4.5,
                'reviews_count' => 412,
            ],
            [
                'name' => 'Ultra-Thin Laptop Stand',
                'slug' => 'ultra-thin-laptop-stand',
                'description' => 'Ergonomic aluminum laptop stand that elevates your screen to eye level. Foldable, portable design with adjustable angles. Compatible with all laptops from 10" to 17". Improves posture and reduces neck strain.',
                'short_description' => 'Ergonomic foldable aluminum stand',
                'price' => 49.99,
                'compare_price' => null,
                'sku' => 'TECH-LS-004',
                'stock_quantity' => 200,
                'category_id' => 1,
                'brand_id' => 1,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
                'is_featured' => false,
                'rating' => 4.3,
                'reviews_count' => 87,
            ],

            // Fashion
            [
                'name' => 'Premium Leather Jacket',
                'slug' => 'premium-leather-jacket',
                'description' => 'Crafted from genuine full-grain leather, this jacket combines timeless style with modern comfort. Features a silk lining, multiple pockets, and antique brass hardware. A wardrobe essential that gets better with age.',
                'short_description' => 'Genuine full-grain leather jacket',
                'price' => 389.99,
                'compare_price' => 499.99,
                'sku' => 'FASH-LJ-005',
                'stock_quantity' => 20,
                'category_id' => 2,
                'brand_id' => 2,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
                    'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
                'is_featured' => true,
                'rating' => 4.9,
                'reviews_count' => 156,
            ],
            [
                'name' => 'Classic Denim Collection',
                'slug' => 'classic-denim-collection',
                'description' => 'Timeless straight-fit jeans made from premium Japanese selvedge denim. Features a classic five-pocket design, reinforced stitching, and a comfortable stretch blend. Available in multiple washes.',
                'short_description' => 'Japanese selvedge denim jeans',
                'price' => 129.99,
                'compare_price' => 159.99,
                'sku' => 'FASH-DN-006',
                'stock_quantity' => 75,
                'category_id' => 2,
                'brand_id' => 2,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
                    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
                'is_featured' => false,
                'rating' => 4.4,
                'reviews_count' => 298,
            ],
            [
                'name' => 'Minimalist White Sneakers',
                'slug' => 'minimalist-white-sneakers',
                'description' => 'Clean, versatile white sneakers crafted from Italian leather with a cushioned insole and durable rubber outsole. The perfect everyday shoe that pairs with anything from casual to semi-formal.',
                'short_description' => 'Italian leather everyday sneakers',
                'price' => 159.99,
                'compare_price' => 199.99,
                'sku' => 'FASH-SN-007',
                'stock_quantity' => 60,
                'category_id' => 2,
                'brand_id' => 2,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
                    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
                'is_featured' => true,
                'rating' => 4.7,
                'reviews_count' => 342,
            ],

            // Home & Living
            [
                'name' => 'Scandinavian Floor Lamp',
                'slug' => 'scandinavian-floor-lamp',
                'description' => 'Elevate your space with this elegant Scandinavian-inspired floor lamp. Features a solid oak wood base, adjustable arm, and linen shade that creates warm, ambient lighting. Perfect for living rooms and reading nooks.',
                'short_description' => 'Oak wood floor lamp with linen shade',
                'price' => 219.99,
                'compare_price' => 279.99,
                'sku' => 'HOME-FL-008',
                'stock_quantity' => 30,
                'category_id' => 3,
                'brand_id' => 3,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600',
                    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400',
                'is_featured' => false,
                'rating' => 4.6,
                'reviews_count' => 67,
            ],
            [
                'name' => 'Artisan Ceramic Vase Set',
                'slug' => 'artisan-ceramic-vase-set',
                'description' => 'Hand-crafted ceramic vase set of three in complementary earth tones. Each piece is unique with organic shapes and a matte glaze finish. Ideal for fresh or dried flower arrangements.',
                'short_description' => 'Hand-crafted ceramic vase trio',
                'price' => 89.99,
                'compare_price' => null,
                'sku' => 'HOME-VS-009',
                'stock_quantity' => 45,
                'category_id' => 3,
                'brand_id' => 3,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400',
                'is_featured' => false,
                'rating' => 4.8,
                'reviews_count' => 45,
            ],
            [
                'name' => 'Luxury Throw Blanket',
                'slug' => 'luxury-throw-blanket',
                'description' => 'Ultra-soft cashmere-blend throw blanket with a herringbone weave pattern. Generous 60"x80" size perfect for cozying up on the couch. Machine washable for easy care.',
                'short_description' => 'Cashmere-blend herringbone throw',
                'price' => 149.99,
                'compare_price' => 189.99,
                'sku' => 'HOME-TB-010',
                'stock_quantity' => 55,
                'category_id' => 3,
                'brand_id' => 3,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400',
                'is_featured' => true,
                'rating' => 4.7,
                'reviews_count' => 123,
            ],

            // Sports & Fitness
            [
                'name' => 'Performance Running Shoes',
                'slug' => 'performance-running-shoes',
                'description' => 'Engineered for speed and comfort, these running shoes feature responsive foam cushioning, breathable mesh upper, and a carbon-fiber plate for energy return. Ideal for both training and race day.',
                'short_description' => 'Carbon-plate responsive running shoes',
                'price' => 189.99,
                'compare_price' => 229.99,
                'sku' => 'SPORT-RS-011',
                'stock_quantity' => 80,
                'category_id' => 4,
                'brand_id' => 4,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
                    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
                'is_featured' => true,
                'rating' => 4.8,
                'reviews_count' => 567,
            ],
            [
                'name' => 'Yoga Mat Premium',
                'slug' => 'yoga-mat-premium',
                'description' => 'Eco-friendly natural rubber yoga mat with superior grip and cushioning. 6mm thick for joint protection, antimicrobial surface, and comes with a carrying strap. Perfect for all yoga styles.',
                'short_description' => 'Eco-friendly natural rubber yoga mat',
                'price' => 69.99,
                'compare_price' => 89.99,
                'sku' => 'SPORT-YM-012',
                'stock_quantity' => 120,
                'category_id' => 4,
                'brand_id' => 4,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
                'is_featured' => false,
                'rating' => 4.5,
                'reviews_count' => 234,
            ],
            [
                'name' => 'Adjustable Dumbbell Set',
                'slug' => 'adjustable-dumbbell-set',
                'description' => 'Space-saving adjustable dumbbells ranging from 5 to 52.5 lbs per hand. Quick-change weight selection mechanism lets you switch between 15 weight settings in seconds. Replaces 15 pairs of dumbbells.',
                'short_description' => 'Adjustable 5-52.5 lb dumbbells',
                'price' => 349.99,
                'compare_price' => 449.99,
                'sku' => 'SPORT-DB-013',
                'stock_quantity' => 25,
                'category_id' => 4,
                'brand_id' => 4,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400',
                'is_featured' => false,
                'rating' => 4.9,
                'reviews_count' => 178,
            ],

            // Accessories
            [
                'name' => 'Minimalist Leather Watch',
                'slug' => 'minimalist-leather-watch',
                'description' => 'Sophisticated minimalist watch with a Swiss quartz movement, sapphire crystal glass, and genuine Italian leather strap. 40mm case in brushed stainless steel. Water-resistant to 50 meters.',
                'short_description' => 'Swiss quartz minimalist timepiece',
                'price' => 259.99,
                'compare_price' => 329.99,
                'sku' => 'ACC-WA-014',
                'stock_quantity' => 40,
                'category_id' => 5,
                'brand_id' => 5,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
                    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
                'is_featured' => true,
                'rating' => 4.7,
                'reviews_count' => 203,
            ],
            [
                'name' => 'Canvas Weekender Bag',
                'slug' => 'canvas-weekender-bag',
                'description' => 'Versatile waxed canvas weekender bag with leather trim and brass hardware. Features a padded laptop sleeve, shoe compartment, and multiple organizer pockets. Ideal for short trips or gym use.',
                'short_description' => 'Waxed canvas travel weekender',
                'price' => 179.99,
                'compare_price' => 219.99,
                'sku' => 'ACC-BG-015',
                'stock_quantity' => 35,
                'category_id' => 5,
                'brand_id' => 5,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
                'is_featured' => false,
                'rating' => 4.6,
                'reviews_count' => 89,
            ],
            [
                'name' => 'Polarized Sunglasses',
                'slug' => 'polarized-sunglasses',
                'description' => 'Handcrafted acetate frame sunglasses with premium polarized lenses offering 100% UV protection. Classic aviator shape with a modern twist. Comes with a leather case and microfiber cloth.',
                'short_description' => 'Handcrafted acetate polarized shades',
                'price' => 139.99,
                'compare_price' => null,
                'sku' => 'ACC-SG-016',
                'stock_quantity' => 65,
                'category_id' => 5,
                'brand_id' => 5,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
                'is_featured' => false,
                'rating' => 4.4,
                'reviews_count' => 156,
            ],

            // Beauty & Care
            [
                'name' => 'Organic Skincare Set',
                'slug' => 'organic-skincare-set',
                'description' => 'Complete organic skincare routine including cleanser, toner, serum, and moisturizer. Made with botanical extracts, hyaluronic acid, and vitamin C. Suitable for all skin types. Cruelty-free and vegan.',
                'short_description' => 'Complete 4-step organic skincare',
                'price' => 119.99,
                'compare_price' => 159.99,
                'sku' => 'BEAUTY-SK-017',
                'stock_quantity' => 90,
                'category_id' => 6,
                'brand_id' => 6,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
                    'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
                'is_featured' => true,
                'rating' => 4.8,
                'reviews_count' => 445,
            ],
            [
                'name' => 'Aromatherapy Diffuser',
                'slug' => 'aromatherapy-diffuser',
                'description' => 'Elegant wood-grain ultrasonic aromatherapy diffuser with color-changing LED lights and timer settings. Covers up to 300 sq ft. Includes a starter set of 3 essential oil blends.',
                'short_description' => 'Ultrasonic diffuser with LED lights',
                'price' => 59.99,
                'compare_price' => 79.99,
                'sku' => 'BEAUTY-DF-018',
                'stock_quantity' => 150,
                'category_id' => 6,
                'brand_id' => 6,
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600',
                ]),
                'thumbnail' => 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400',
                'is_featured' => false,
                'rating' => 4.3,
                'reviews_count' => 267,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
