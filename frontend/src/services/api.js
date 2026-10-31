// Static JSON API — reads from /public/data/*.json
// No backend server required. Works on Netlify or any static host.

const BASE = import.meta.env.BASE_URL + 'data';

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

let _products = null;
let _categories = null;

async function loadProducts() {
  if (!_products) _products = await get(`${BASE}/products.json`);
  return _products;
}

async function loadCategories() {
  if (!_categories) _categories = await get(`${BASE}/categories.json`);
  return _categories;
}

// ── Products ──────────────────────────────────────────────

export async function getProducts(params = {}) {
  let products = await loadProducts();

  // Search
  if (params.search) {
    const q = params.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (params.category) {
    products = products.filter(p => p.category?.slug === params.category);
  }

  // Brand filter
  if (params.brand) {
    products = products.filter(p => p.brand?.slug === params.brand);
  }

  // Price range
  if (params.min_price) products = products.filter(p => parseFloat(p.price) >= parseFloat(params.min_price));
  if (params.max_price) products = products.filter(p => parseFloat(p.price) <= parseFloat(params.max_price));

  // Featured
  if (params.featured) products = products.filter(p => p.is_featured);

  // Sort
  const sortBy = params.sort_by || 'id';
  const sortOrder = params.sort_order || 'asc';
  products = [...products].sort((a, b) => {
    let av = a[sortBy], bv = b[sortBy];
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return sortOrder === 'asc' ? -1 : 1;
    if (av > bv) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate
  const perPage = parseInt(params.per_page) || 12;
  const page = parseInt(params.page) || 1;
  const total = products.length;
  const lastPage = Math.ceil(total / perPage);
  const data = products.slice((page - 1) * perPage, page * perPage);

  // Match Laravel's paginate() response shape
  return {
    data: {
      data,
      current_page: page,
      last_page: lastPage,
      total,
    }
  };
}

export async function getFeaturedProducts() {
  const products = await loadProducts();
  return { data: products.filter(p => p.is_featured) };
}

export async function getProduct(slug) {
  const products = await loadProducts();
  const product = products.find(p => p.slug === slug);
  if (!product) throw new Error('Product not found');
  const related = products
    .filter(p => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);
  return { data: { product, related } };
}

// ── Categories ────────────────────────────────────────────

export async function getCategories() {
  const categories = await loadCategories();
  return { data: categories };
}

export async function getCategory(slug) {
  const categories = await loadCategories();
  const category = categories.find(c => c.slug === slug);
  if (!category) throw new Error('Category not found');
  return { data: category };
}

// ── Brands ────────────────────────────────────────────────

export async function getBrands() {
  const products = await loadProducts();
  const map = {};
  products.forEach(p => {
    if (p.brand && !map[p.brand.id]) {
      map[p.brand.id] = {
        ...p.brand,
        products_count: products.filter(x => x.brand_id === p.brand.id).length,
      };
    }
  });
  return { data: Object.values(map) };
}

// ── Cart / Checkout (client-side simulation) ──────────────

export async function validateCart(items) {
  const products = await loadProducts();
  let subtotal = 0;
  const result = items.map(item => {
    const product = products.find(p => p.id === item.product_id);
    const itemTotal = parseFloat(product.price) * item.quantity;
    subtotal += itemTotal;
    return {
      product_id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: item.quantity,
      total: itemTotal,
      thumbnail: product.thumbnail,
      in_stock: product.stock_quantity >= item.quantity,
    };
  });
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  return { data: { items: result, subtotal, tax, shipping, total: subtotal + tax + shipping } };
}

export async function checkout(data) {
  // Simulate a successful order (no real DB on static hosting)
  await new Promise(r => setTimeout(r, 800));
  return {
    data: {
      message: 'Order placed successfully',
      order: {
        order_number: 'SLK-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        customer_email: data.customer_email,
        total: data.total,
        status: 'pending',
      }
    }
  };
}
