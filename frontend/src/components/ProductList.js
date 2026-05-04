import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductForm from './ProductForm';
import BarcodeSell from './BarcodeSell';
import ProductTable from './ProductTable';

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
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeAmount, setBarcodeAmount] = useState(1);
  const [barcodeSubmitting, setBarcodeSubmitting] = useState(false);

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
        categoryId: parseInt(formData.categoryId),
        userId: user && user.id
      });

      setFormData({
        name: '',
        quantity: '',
        threshold: '',
        price: '',
        categoryId: ''
      });

      const res = await getProducts();
      setProducts(res.data);

    } catch (err) {
      alert('Hata: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBarcodeSubmit = async (e) => {
    e && e.preventDefault && e.preventDefault();
    if (!barcodeInput || !barcodeInput.trim()) return;
    if (!user || !user.id) { alert('Kullanıcı bilgisi bulunamadı!'); return; }
    const amount = parseInt(barcodeAmount, 10) || 1;
    try {
      setBarcodeSubmitting(true);
      await sellByBarcode(barcodeInput.trim(), amount, user.id);
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
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-xl text-gray-600">⏳ Yükleniyor...</div>
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? '⏳ Ekleniyor...' : '✅ Ürün Ekle'}
            </button>
          </form>
        </div>
      )}

      {error && <div>❌ {error}</div>}

      <div style={{ margin: '1rem 0', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          placeholder="Barkod okut (veya gir)"
          value={barcodeInput}
          onChange={e => setBarcodeInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleBarcodeSubmit(); }}
          style={{ padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', width: 220 }}
        />
        <input
          type="number"
          min="1"
          value={barcodeAmount}
          onChange={e => setBarcodeAmount(e.target.value)}
          style={{ width: 80, padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1' }}
        />
        <button onClick={handleBarcodeSubmit} disabled={barcodeSubmitting} style={{ background: '#48bb78', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6 }}>
          {barcodeSubmitting ? 'Satılıyor...' : 'Satış (Barkod)'}
        </button>
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
            <tr key={prod.id} style={{ borderBottom: '1px solid #e2e8f0', background: prod.lowStock ? '#fff5f5' : 'inherit' }}>
              <td style={{ padding: '10px 8px', fontWeight: 500 }}>{prod.name}</td>
              <td style={{ padding: '10px 8px' }}>{prod.categoryName}</td>
              <td style={{ padding: '10px 8px', textAlign: 'right' }}>{prod.quantity}</td>
              <td style={{ padding: '10px 8px', textAlign: 'right' }}>{prod.threshold}</td>
              <td style={{ padding: '10px 8px', textAlign: 'right' }}>₺{prod.price.toFixed(2)}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                {prod.lowStock ? <span style={{ color: '#e53e3e', fontWeight: 600 }}>⚠️ Düşük</span> : <span style={{ color: '#38a169', fontWeight: 600 }}>✅ Normal</span>}
              </td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                <input
                  type="number"
                  min="1"
                  style={{ width: 60, marginRight: 8, border: '1px solid #cbd5e1', borderRadius: 4, padding: '4px 6px' }}
                  value={sellAmounts[prod.id] || ''}
                  onChange={e => setSellAmounts(a => ({ ...a, [prod.id]: e.target.value }))}
                  disabled={selling[prod.id]}
                />
                <button
                  onClick={async () => {
                    const amount = parseInt(sellAmounts[prod.id], 10);
                    if (!amount || amount <= 0) {
                      alert('Geçerli bir miktar girin');
                      return;
                    }
                    if (!user || !user.id) {
                      alert('Kullanıcı bilgisi bulunamadı!');
                      return;
                    }
                    setSelling(s => ({ ...s, [prod.id]: true }));
                    try {
                      await sellProduct(prod.id, amount, user.id);
                      const res = await getProducts();
                      setProducts(res.data);
                      setSellAmounts(a => ({ ...a, [prod.id]: '' }));
                    } catch (err) {
                      alert('Satış hatası: ' + (err.response?.data?.message || err.message));
                    } finally {
                      setSelling(s => ({ ...s, [prod.id]: false }));
                    }
                  }}
                  disabled={selling[prod.id]}
                  style={{
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 14px',
                    fontWeight: 500,
                    cursor: selling[prod.id] ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {selling[prod.id] ? 'Satılıyor...' : 'Sat'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}