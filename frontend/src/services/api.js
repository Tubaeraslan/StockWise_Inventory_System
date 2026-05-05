import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Auth İşlemleri
export const login = (username, password) => api.post('/api/auth/login', { username, password });
export const register = (username, password, permission) => api.post('/api/users', { username, password, permission });

export const getSalesRanking = (year, month) => api.get(`/api/analysis/sales-ranking?year=${year}&month=${month}`);
export const getCategories = () => api.get('/api/categories');
export const getProducts = () => api.get('/api/products');
export const getAlerts = () => api.get('/api/alerts/active');

// Ürün İşlemleri
export const createProduct = (product) => api.post(`/api/products?userId=${product.userId}`, product);
export const deleteProduct = (id, userId) => api.delete(`/api/products/${id}?userId=${userId}`);
export const sellProduct = (productId, amount, userId) => api.post('/api/products/sell', { productId, amount, userId });
export const sellByBarcode = (barcode, amount, userId) => api.post('/api/products/sell-by-barcode', { barcode, amount, userId });
export const addStock = (productId, amount, userId) => api.post(`/api/products/${productId}/stock`, { amount, userId });

// Kategori İşlemleri (userId URL'ye ekleniyor)
export const createCategory = (category) => api.post(`/api/categories?userId=${category.userId}`, category);
export const updateCategory = (id, category, userId) => api.put(`/api/categories/${id}?userId=${userId}`, category);
export const deleteCategory = (id, userId) => api.delete(`/api/categories/${id}?userId=${userId}`);