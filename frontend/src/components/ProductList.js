import React, { useEffect, useState } from 'react';
import { getProducts, getCategories, createProduct, sellProduct, sellByBarcode } from '../services/api';
import { FaBarcode } from 'react-icons/fa';

export default function ProductList({ isAdmin, user }) {
  const [sellAmounts, setSellAmounts] = useState({});
  const [selling, setSelling] = useState({});
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
  const [barcode, setBarcode] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeAmount, setBarcodeAmount] = useState(1);
  const [barcodeSubmitting, setBarcodeSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
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
  };

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
    if (barcode.length !== 8) {
      alert('Barkod tam 8 rakam olmalıdır!');
      return;
    }
    try {
      setSubmitting(true);
      await createProduct({
        name: formData.name,
        quantity: parseInt(formData.quantity),
        threshold: parseInt(formData.threshold),
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        barcode: barcode,
        userId: user && user.id
      });
      setFormData({
        name: '',
        quantity: '',
        threshold: '',
        price: '',
        categoryId: ''
      });
      setBarcode('');
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      alert('Hata: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSell = async (productId) => {
    const amount = parseInt(sellAmounts[productId] || 1);
    try {
      setSelling(prev => ({ ...prev, [productId]: true }));
      await sellProduct(productId, amount, user.id);
      const res = await getProducts();
      setProducts(res.data);
      setSellAmounts(prev => ({ ...prev, [productId]: '' }));
    } catch (err) {
      alert('Satış hatası: ' + (err.response?.data?.message || err.message));
    } finally {
      setSelling(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleBarcodeSell = async (e) => {
    e.preventDefault();
    if (!barcodeInput) return;
    try {
      setBarcodeSubmitting(true);
      await sellByBarcode(barcodeInput, barcodeAmount, user.id);
      const res = await getProducts();
      setProducts(res.data);
      setBarcodeInput('');
      setBarcodeAmount(1);
    } catch (err) {
      alert('Barkod satış hatası: ' + (err.response?.data?.message || err.message));
    } finally {
      setBarcodeSubmitting(false);
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
      <h1 style={{ marginBottom: '2rem', color: '#667eea', fontSize: '2rem', fontWeight: 'bold' }}>
        📦 Ürünler
      </h1>

      {isAdmin && (
        <div className="form-section">
          <h3>Yeni Ürün Ekle / Stok Yenile</h3>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <input type="text" name="name" placeholder="Ürün adı"
                value={formData.name} onChange={handleChange} required />
              
              <select name="categoryId"
                value={formData.categoryId}
                onChange={handleChange} required>
                <option value="">Kategori Seç</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <input type="number" name="quantity"
                placeholder="Miktar"
                value={formData.quantity}
                onChange={handleChange} required />

              <input type="number" name="threshold"
                placeholder="Minimum stok"
                value={formData.threshold}
                onChange={handleChange} required />

              <input type="number" step="0.01" name="price"
                placeholder="Fiyat"
                value={formData.price}
                onChange={handleChange} required />

              <input
                type="text"
                placeholder="Barkod (8 Rakam)"
                value={barcode}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val.length <= 8) setBarcode(val);
                }}
                required
                style={{ border: barcode.length === 8 ? '2px solid #48bb78' : '1px solid #cbd5e0' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '⏳ Ekleniyor...' : '✅ Ürün Ekle'}
            </button>
          </form>
        </div>
      )}

      {error && <div className="alert alert-danger">❌ {error}</div>}

      <div className="form-section" style={{ marginTop: '2rem', background: '#ebf4ff' }}>
        <form onSubmit={handleBarcodeSell} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Barkod okut (veya gir)" 
            value={barcodeInput} 
            onChange={(e) => setBarcodeInput(e.target.value)}
            style={{ flex: 2 }}
          />
          <input 
            type="number" 
            value={barcodeAmount} 
            onChange={(e) => setBarcodeAmount(e.target.value)}
            min="1"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-success" disabled={barcodeSubmitting}>
            {barcodeSubmitting ? '...' : 'Satış (Barkod)'}
          </button>
        </form>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 24
      }}>
        <thead style={{ background: '#f6f8fa' }}>
          <tr>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>Ürün</th>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>Barkod</th>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>Kategori</th>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Miktar</th>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Eşik</th>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Fiyat</th>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #e2e8f0', textAlign: 'center' }}>Durum</th>
            <th style={{ padding: '12px 8px', borderBottom: '2px solid #e2e8f0', textAlign: 'center' }}>Satış</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id} style={{ borderBottom: '1px solid #e2e8f0', background: prod.quantity <= prod.threshold ? '#fff5f5' : 'inherit' }}>
              <td style={{ padding: '10px 8px', fontWeight: 500 }}>{prod.name}</td>
              <td style={{ padding: '10px 8px', color: '#4c51bf', fontWeight: '500', fontSize: '0.9rem' }}>
                <FaBarcode style={{ marginRight: '5px' }} />
                {prod.barcode || '---'}
              </td>
              <td style={{ padding: '10px 8px' }}>{prod.category?.name || prod.categoryName}</td>
              <td style={{ padding: '10px 8px', textAlign: 'right' }}>{prod.quantity}</td>
              <td style={{ padding: '10px 8px', textAlign: 'right' }}>{prod.threshold}</td>
              <td style={{ padding: '10px 8px', textAlign: 'right' }}>₺{prod.price?.toFixed(2)}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                {prod.quantity <= prod.threshold ? (
                  <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>⚠️ Düşük</span>
                ) : (
                  <span style={{ color: '#38a169', fontWeight: 'bold' }}>✅ Normal</span>
                )}
              </td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                  <input 
                    type="number" 
                    style={{ width: '50px' }} 
                    value={sellAmounts[prod.id] || ''} 
                    onChange={(e) => setSellAmounts({...sellAmounts, [prod.id]: e.target.value})}
                    placeholder="1"
                  />
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleSell(prod.id)}
                    disabled={selling[prod.id]}
                  >
                    {selling[prod.id] ? '...' : 'Sat'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}