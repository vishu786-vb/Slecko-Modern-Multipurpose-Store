# Slekco E-Commerce Database Schema

## Overview

The Slekco database uses MySQL (via XAMPP) and consists of 6 core tables that support the e-commerce platform's product catalog, user management, and order processing.

## Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │     orders       │       │  order_items │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ user_id (FK)     │       │ id (PK)      │
│ name         │       │ id (PK)          │◄──────│ order_id(FK) │
│ email        │       │ order_number     │       │ product_id(FK│
│ password     │       │ status           │       │ product_name │
│ timestamps   │       │ subtotal         │       │ price        │
└──────────────┘       │ tax              │       │ quantity     │
                       │ shipping         │       │ total        │
                       │ total            │       │ timestamps   │
                       │ customer_*       │       └──────┬───────┘
                       │ shipping_*       │              │
                       │ timestamps       │              │
                       └──────────────────┘              │
                                                         │
┌──────────────┐       ┌──────────────────┐              │
│  categories  │       │    products      │◄─────────────┘
├──────────────┤       ├──────────────────┤
│ id (PK)      │◄──────│ category_id (FK) │       ┌──────────────┐
│ name         │       │ brand_id (FK)    │──────►│   brands     │
│ slug         │       │ id (PK)          │       ├──────────────┤
│ description  │       │ name             │       │ id (PK)      │
│ image        │       │ slug             │       │ name         │
│ parent_id(FK)│──┐    │ description      │       │ slug         │
│ is_active    │  │    │ price            │       │ description  │
│ sort_order   │  │    │ compare_price    │       │ logo         │
│ timestamps   │◄─┘    │ sku              │       │ is_active    │
└──────────────┘       │ stock_quantity   │       │ timestamps   │
                       │ images (JSON)    │       └──────────────┘
                       │ thumbnail        │
                       │ is_active        │
                       │ is_featured      │
                       │ rating           │
                       │ reviews_count    │
                       │ timestamps       │
                       └──────────────────┘
```

## Table Definitions

### 1. users

Default Laravel users table for authentication.

| Column             | Type         | Constraints         | Description              |
| ------------------ | ------------ | ------------------- | ------------------------ |
| id                 | BIGINT       | PK, AUTO_INCREMENT  | Unique user identifier   |
| name               | VARCHAR(255) | NOT NULL            | Full name                |
| email              | VARCHAR(255) | NOT NULL, UNIQUE    | Email address            |
| email_verified_at  | TIMESTAMP    | NULLABLE            | Email verification date  |
| password           | VARCHAR(255) | NOT NULL            | Hashed password          |
| remember_token     | VARCHAR(100) | NULLABLE            | Remember me token        |
| created_at         | TIMESTAMP    | NULLABLE            | Record creation time     |
| updated_at         | TIMESTAMP    | NULLABLE            | Record update time       |

### 2. categories

Product categories with self-referencing parent for subcategories.

| Column      | Type         | Constraints            | Description                     |
| ----------- | ------------ | ---------------------- | ------------------------------- |
| id          | BIGINT       | PK, AUTO_INCREMENT     | Unique category ID              |
| name        | VARCHAR(255) | NOT NULL               | Category display name           |
| slug        | VARCHAR(255) | NOT NULL, UNIQUE       | URL-friendly identifier         |
| description | TEXT         | NULLABLE               | Category description            |
| image       | VARCHAR(255) | NULLABLE               | Category image URL              |
| parent_id   | BIGINT       | FK → categories.id     | Parent category (self-ref)      |
| is_active   | BOOLEAN      | DEFAULT true           | Visibility flag                 |
| sort_order  | INTEGER      | DEFAULT 0              | Display ordering                |
| created_at  | TIMESTAMP    | NULLABLE               | Record creation time            |
| updated_at  | TIMESTAMP    | NULLABLE               | Record update time              |

### 3. brands

Product brands/manufacturers.

| Column      | Type         | Constraints            | Description              |
| ----------- | ------------ | ---------------------- | ------------------------ |
| id          | BIGINT       | PK, AUTO_INCREMENT     | Unique brand ID          |
| name        | VARCHAR(255) | NOT NULL               | Brand name               |
| slug        | VARCHAR(255) | NOT NULL, UNIQUE       | URL-friendly identifier  |
| description | TEXT         | NULLABLE               | Brand description        |
| logo        | VARCHAR(255) | NULLABLE               | Brand logo URL           |
| is_active   | BOOLEAN      | DEFAULT true           | Visibility flag          |
| created_at  | TIMESTAMP    | NULLABLE               | Record creation time     |
| updated_at  | TIMESTAMP    | NULLABLE               | Record update time       |

### 4. products

The main product catalog table.

| Column           | Type          | Constraints            | Description                      |
| ---------------- | ------------- | ---------------------- | -------------------------------- |
| id               | BIGINT        | PK, AUTO_INCREMENT     | Unique product ID                |
| name             | VARCHAR(255)  | NOT NULL               | Product name                     |
| slug             | VARCHAR(255)  | NOT NULL, UNIQUE       | URL-friendly identifier          |
| description      | TEXT          | NOT NULL               | Full product description         |
| short_description| TEXT          | NULLABLE               | Brief product summary            |
| price            | DECIMAL(10,2) | NOT NULL               | Current selling price            |
| compare_price    | DECIMAL(10,2) | NULLABLE               | Original/compare-at price        |
| sku              | VARCHAR(255)  | UNIQUE, NULLABLE       | Stock Keeping Unit               |
| stock_quantity   | INTEGER       | DEFAULT 0              | Available inventory count        |
| category_id      | BIGINT        | FK → categories.id     | Product category                 |
| brand_id         | BIGINT        | FK → brands.id, NULL   | Product brand                    |
| images           | JSON          | NULLABLE               | Array of image URLs              |
| thumbnail        | VARCHAR(255)  | NULLABLE               | Main thumbnail image URL         |
| is_active        | BOOLEAN       | DEFAULT true           | Visibility flag                  |
| is_featured      | BOOLEAN       | DEFAULT false          | Featured on homepage             |
| rating           | DECIMAL(3,2)  | DEFAULT 0              | Average rating (0-5)             |
| reviews_count    | INTEGER       | DEFAULT 0              | Number of reviews                |
| created_at       | TIMESTAMP     | NULLABLE               | Record creation time             |
| updated_at       | TIMESTAMP     | NULLABLE               | Record update time               |

### 5. orders

Customer orders containing shipping and billing details.

| Column           | Type          | Constraints            | Description                      |
| ---------------- | ------------- | ---------------------- | -------------------------------- |
| id               | BIGINT        | PK, AUTO_INCREMENT     | Unique order ID                  |
| order_number     | VARCHAR(255)  | NOT NULL, UNIQUE       | Public order reference           |
| user_id          | BIGINT        | FK → users.id, NULL    | Associated user (if logged in)   |
| status           | ENUM          | DEFAULT 'pending'      | pending/processing/shipped/delivered/cancelled |
| subtotal         | DECIMAL(10,2) | NOT NULL               | Sum of item totals               |
| tax              | DECIMAL(10,2) | DEFAULT 0              | Calculated tax amount            |
| shipping         | DECIMAL(10,2) | DEFAULT 0              | Shipping cost                    |
| total            | DECIMAL(10,2) | NOT NULL               | Final order total                |
| customer_name    | VARCHAR(255)  | NOT NULL               | Customer full name               |
| customer_email   | VARCHAR(255)  | NOT NULL               | Customer email                   |
| customer_phone   | VARCHAR(255)  | NULLABLE               | Customer phone number            |
| shipping_address | TEXT          | NOT NULL               | Delivery street address          |
| shipping_city    | VARCHAR(255)  | NOT NULL               | Delivery city                    |
| shipping_state   | VARCHAR(255)  | NULLABLE               | Delivery state/province          |
| shipping_zip     | VARCHAR(255)  | NOT NULL               | Delivery postal code             |
| shipping_country | VARCHAR(255)  | DEFAULT 'US'           | Delivery country                 |
| notes            | TEXT          | NULLABLE               | Special instructions             |
| created_at       | TIMESTAMP     | NULLABLE               | Order placement time             |
| updated_at       | TIMESTAMP     | NULLABLE               | Last order update                |

### 6. order_items

Line items for each order, linking orders to products.

| Column       | Type          | Constraints               | Description                |
| ------------ | ------------- | ------------------------- | -------------------------- |
| id           | BIGINT        | PK, AUTO_INCREMENT        | Unique line item ID        |
| order_id     | BIGINT        | FK → orders.id, CASCADE   | Parent order               |
| product_id   | BIGINT        | FK → products.id, CASCADE | Referenced product         |
| product_name | VARCHAR(255)  | NOT NULL                  | Product name at purchase   |
| price        | DECIMAL(10,2) | NOT NULL                  | Unit price at purchase     |
| quantity     | INTEGER       | NOT NULL                  | Quantity ordered           |
| total        | DECIMAL(10,2) | NOT NULL                  | Line total (price × qty)  |
| created_at   | TIMESTAMP     | NULLABLE                  | Record creation time       |
| updated_at   | TIMESTAMP     | NULLABLE                  | Record update time         |

## Relationships

| Relationship               | Type         | Description                                           |
| -------------------------- | ------------ | ----------------------------------------------------- |
| Category → Products        | One-to-Many  | A category has many products                          |
| Category → Category        | Self-ref     | A category can have a parent (subcategories)          |
| Brand → Products           | One-to-Many  | A brand has many products                             |
| Product → Category         | Many-to-One  | A product belongs to one category                     |
| Product → Brand            | Many-to-One  | A product belongs to one brand (optional)             |
| User → Orders              | One-to-Many  | A user can have many orders                           |
| Order → Order Items        | One-to-Many  | An order contains multiple line items                 |
| Order Item → Product       | Many-to-One  | Each line item references a product                   |

## Indexes

- `users.email` — UNIQUE
- `categories.slug` — UNIQUE
- `brands.slug` — UNIQUE
- `products.slug` — UNIQUE
- `products.sku` — UNIQUE
- `products.category_id` — INDEX (FK)
- `products.brand_id` — INDEX (FK)
- `orders.order_number` — UNIQUE
- `orders.user_id` — INDEX (FK)
- `order_items.order_id` — INDEX (FK)
- `order_items.product_id` — INDEX (FK)

## MySQL Setup (XAMPP)

1. Start Apache and MySQL from the XAMPP Control Panel
2. Open phpMyAdmin at http://localhost/phpmyadmin
3. Create a new database named `slekco` with charset `utf8mb4_unicode_ci`
4. The Laravel migrations will create all tables automatically:
   ```bash
   cd backend
   php artisan migrate --seed
   ```
