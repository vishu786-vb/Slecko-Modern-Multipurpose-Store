# Slekco - Modern Multipurpose E-Commerce Platform

A full-stack e-commerce application with a React frontend and Laravel API backend, built for the Slekco multipurpose brand.

## Tech Stack

- **Frontend:** React 18, React Router, Axios, Vite
- **Backend:** PHP/Laravel 12, Eloquent ORM
- **Database:** MySQL (via XAMPP)
- **Styling:** Custom CSS design system (no frameworks)

## Features

### Frontend
- Responsive homepage with hero, categories, and featured products
- Product listing with search, category/brand filters, and sorting
- Product detail page with image gallery and quantity selector
- Shopping cart with add/remove/quantity controls and total calculation
- Checkout form with client-side validation
- Mobile-first responsive design with hamburger navigation
- Skeleton loading states
- Cart state persisted in localStorage

### Backend API
- RESTful product API with search, filter, and pagination
- Category and brand endpoints
- Cart validation endpoint
- Order placement (checkout) with stock management
- Seeded with 18 products across 6 categories and 6 brands

## Project Structure

```
slekco/
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── ProductController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── BrandController.php
│   │   │   └── CartController.php
│   │   └── Models/
│   │       ├── Product.php
│   │       ├── Category.php
│   │       ├── Brand.php
│   │       ├── Order.php
│   │       └── OrderItem.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/DatabaseSeeder.php
│   └── routes/api.php
│
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # CartContext (state management)
│   │   ├── pages/            # Route pages
│   │   ├── services/         # API service layer
│   │   └── styles/           # Design system (CSS)
│   └── vite.config.js
│
├── DATABASE.md               # Database schema documentation
└── README.md
```

## Setup Instructions

### Prerequisites

- XAMPP (with PHP 8.2+ and MySQL)
- Composer
- Node.js 18+
- npm

### 1. Database Setup

1. Open XAMPP Control Panel and start **Apache** and **MySQL**
2. Open phpMyAdmin at http://localhost/phpmyadmin
3. Create a new database:
   - Name: `slekco`
   - Collation: `utf8mb4_unicode_ci`

### 2. Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Run migrations and seed data
php artisan migrate --seed

# Start the Laravel dev server
php artisan serve
```

The API will be available at http://localhost:8000/api

### 3. Frontend Setup

```bash
cd frontend

# Install JS dependencies
npm install

# Start the Vite dev server
npm run dev
```

The frontend will be available at http://localhost:3000

The Vite config proxies `/api` requests to the Laravel backend, so both should be running simultaneously.

## API Endpoints

| Method | Endpoint              | Description                        |
| ------ | --------------------- | ---------------------------------- |
| GET    | /api/products         | List products (search, filter, paginate) |
| GET    | /api/products/featured| Get featured products              |
| GET    | /api/products/{slug}  | Get single product + related       |
| GET    | /api/categories       | List all categories                |
| GET    | /api/categories/{slug}| Get single category                |
| GET    | /api/brands           | List all brands                    |
| POST   | /api/cart/validate    | Validate cart items & get totals   |
| POST   | /api/checkout         | Place an order                     |

### Product Query Parameters

| Param      | Description                  | Example              |
| ---------- | ---------------------------- | -------------------- |
| search     | Search by name/description   | ?search=headphones   |
| category   | Filter by category slug      | ?category=electronics|
| brand      | Filter by brand slug         | ?brand=techvault     |
| min_price  | Minimum price filter         | ?min_price=50        |
| max_price  | Maximum price filter         | ?max_price=200       |
| featured   | Only featured products       | ?featured=1          |
| sort_by    | Sort field (price, name, rating, created_at) | ?sort_by=price |
| sort_order | Sort direction (asc/desc)    | ?sort_order=asc      |
| per_page   | Items per page (max 50)      | ?per_page=12         |
| page       | Page number                  | ?page=2              |

## Design System

The frontend uses CSS custom properties for consistent theming:

- **Typography:** Inter font family with 8 weight/size variants
- **Colors:** Primary (dark navy), Accent (coral red), Success/Warning/Error
- **Spacing:** 4px base unit scale (4–96px)
- **Shadows:** 4 depth levels (sm, md, lg, xl)
- **Border Radius:** sm through full (pill)
- **Responsive Breakpoints:** 480px, 768px, 1024px

## Seed Data

The seeder creates:
- 1 admin user (admin@slekco.com / password)
- 6 brands: TechVault, UrbanThread, HomeNest, FitPulse, Luxora, GreenLeaf
- 6 categories: Electronics, Fashion, Home & Living, Sports & Fitness, Accessories, Beauty & Care
- 18 products with real Unsplash images, descriptions, and pricing


---

## AI Usage Disclosure

### Which AI tools did you use?

- **Kiro** (AI-powered IDE built on VS Code) — used for code generation, project scaffolding, and iterating on the full-stack architecture.

### Where did AI help you?

- Initial project scaffolding (Laravel backend structure, React + Vite setup)
- Database schema design and migration files
- Writing API controllers with search/filter/pagination logic
- Generating the CSS design system (variables, responsive breakpoints, component styles)
- Creating seed data with realistic product descriptions and Unsplash image URLs
- Building React components (ProductCard, CartContext, checkout form validation)

### One example of an AI-generated solution that you modified or improved

> The AI-generated `CartContext` initially stored the full product object in localStorage, including descriptions and image arrays, which bloated storage. I modified it to only persist the minimal fields needed (id, name, price, thumbnail, slug, quantity), reducing the localStorage payload significantly and preventing quota issues on mobile browsers.

---
