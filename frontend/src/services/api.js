import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Products
export const getProducts = (params = {}) => api.get('/products', { params });
export const getFeaturedProducts = () => api.get('/products/featured');
export const getProduct = (slug) => api.get(`/products/${slug}`);

// Categories
export const getCategories = () => api.get('/categories');
export const getCategory = (slug) => api.get(`/categories/${slug}`);

// Brands
export const getBrands = () => api.get('/brands');

// Cart
export const validateCart = (items) => api.post('/cart/validate', { items });
export const checkout = (data) => api.post('/checkout', data);

export default api;
