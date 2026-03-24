import React, { useEffect, useState } from 'react';
import { getProducts, getCategories, createProduct } from '../services/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    threshold: '',
    price: '',
    categoryId: ''
  });

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data);
        setCategories(catRes.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Veri yüklenemedi: ' + err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.threshold || !formData.price || !formData.categoryId) {
      alert('Tüm alanlar gerekli');
      return;
    }
    
    try {
      setSubmitting(true);
      await createProduct({
        name: formData.name,
        quantity: parseInt(formData.quantity),
        threshold: parseInt(formData.threshold),
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId)
      });
      setFormData({ name: '', quantity: '', threshold: '', price: '', categoryId: '' });
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      alert('Hata: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#718096' }}>⏳ Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#667eea', fontSize: '2rem', fontWeight: 'bold' }}>📦 Ürünler</h1>
      
      <div className="form-section">
        <h3>Yeni Ürün Ekle</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Ürün Adı</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Laptop, Kalem, vs."
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Kategori</label>
              <select
                name="categoryId"
                className="form-control"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Kategori Seç</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Mevcut Miktar</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Min. Eşik</label>
              <input
                type="number"
                name="threshold"
                className="form-control"
                placeholder="Minimum stok"
                value={formData.threshold}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Fiyat (₺)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                className="form-control"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '⏳ Ekleniyor...' : '✅ Ürün Ekle'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-danger"><strong>❌ Hata:</strong> {error}</div>}

      <div style={{ marginTop: '2rem', overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Mevcut</th>
              <th>Min. Eşik</th>
              <th>Fiyat</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} style={prod.lowStock ? { backgroundColor: '#fff5f5' } : {}}>
                <td style={{ fontWeight: '500' }}>{prod.name}</td>
                <td>{prod.categoryName}</td>
                <td><strong>{prod.quantity}</strong></td>
                <td>{prod.threshold}</td>
                <td>₺{prod.price.toFixed(2)}</td>
                <td>
                  <span className={`badge ${prod.lowStock ? 'bg-danger' : 'bg-success'}`}>
                    {prod.lowStock ? '⚠️ Düşük' : '✅ Normal'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
