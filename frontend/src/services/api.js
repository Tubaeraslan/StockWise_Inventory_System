import axios from 'axios';
export const getSalesRanking = (year, month) =>
  api.get(`/api/analysis/sales-ranking?year=${year}&month=${month}`);


export const sellProduct = (productId, amount, userId) =>
  api.post('/api/products/sell', { productId, amount, userId });

export const sellByBarcode = (barcode, amount, userId) =>
  api.post('/api/products/sell-by-barcode', { barcode, amount, userId });

const API_BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const getCategories = () => api.get('/api/categories');
export const getProducts = () => api.get('/api/products');
export const getAlerts = () => api.get('/api/alerts/active');
export const createProduct = (product) => {
  const { userId, ...rest } = product;
  return api.post(`/api/products?userId=${userId}`, rest);
};
export const createCategory = (category) => {
  const { userId, ...rest } = category;
  return api.post(`/api/categories?userId=${userId}`, rest);
};
export const updateProduct = (id, product) => api.put(`/api/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
