import { useState, useEffect } from 'react';
import { getProducts, getCategories, createProduct, sellProduct, sellByBarcode } from '../services/api';

export const useProducts = (user) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      setError('Veri yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addProduct = async (productData) => {
    await createProduct(productData);
    await fetchData(); // Refresh data
  };

  const sellProductById = async (productId, amount, userId) => {
    await sellProduct(productId, amount, userId);
    await fetchData();
  };

  const sellByBarcodeFunc = async (barcode, amount, userId) => {
    await sellByBarcode(barcode, amount, userId);
    await fetchData();
  };

  return {
    products,
    categories,
    loading,
    error,
    addProduct,
    sellProductById,
    sellByBarcodeFunc,
    refreshData: fetchData,
  };
};