import React, { useEffect, useMemo, useState } from 'react';
import { getProducts, addStock } from '../services/api';
import { FaBoxes, FaPlusCircle, FaSearch, FaShieldAlt } from 'react-icons/fa';

export default function StockUpdate({ user, isAdmin, darkMode }) {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [amount, setAmount] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = () => {
    getProducts().then(res => {
      setProducts(res.data);
      if (!selectedProductId && res.data.length > 0) {
        setSelectedProductId(String(res.data[0].id));
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find(product => String(product.id) === String(selectedProductId));
  }, [products, selectedProductId]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.barcode || '').includes(searchTerm)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      alert('Bu sayfaya yalnızca admin erişebilir.');
      return;
    }

    const stockAmount = parseInt(amount, 10);
    if (!selectedProductId) return alert('Lütfen bir ürün seçin.');
    if (!stockAmount || stockAmount <= 0) return alert('Eklenen stok miktarı 1 veya daha büyük olmalı.');

    try {
      await addStock(selectedProductId, stockAmount, user.id);
      alert('Stok başarıyla güncellendi!');
      setAmount(1);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Stok güncellenemedi.');
    }
  };

  const themeStyles = darkMode ? darkStyles : styles;
  const searchIconColor = darkMode ? '#94a3b8' : '#94a3b8';

  if (!isAdmin) {
    return (
      <div style={themeStyles.container}>
        <div style={themeStyles.restrictedCard}>
          <FaShieldAlt size={36} color="#ef4444" />
          <h2 style={themeStyles.title}>Erişim Kısıtlı</h2>
          <p style={themeStyles.subtitle}>Stok güncelleme sayfasına yalnızca admin kullanıcılar erişebilir.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={themeStyles.container}>
      <div style={themeStyles.header}>
        <div>
          <h2 style={themeStyles.title}>Stok Güncelleme</h2>
          <p style={themeStyles.subtitle}>Admin olarak mevcut ürünlerin stoklarına ekleme yapabilirsiniz.</p>
        </div>
      </div>

      <div style={themeStyles.grid}>
        <section style={themeStyles.card}>
          <div style={themeStyles.cardHeader}>
            <FaPlusCircle color="#6366f1" />
            <h3 style={themeStyles.cardTitle}>Stoğa Ekle</h3>
          </div>

          <form onSubmit={handleSubmit} style={themeStyles.form}>
            <label style={themeStyles.label}>Ürün Seç</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={themeStyles.select}
            >
              <option value="">Ürün seçin</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - Stok: {product.quantity}
                </option>
              ))}
            </select>

            <label style={themeStyles.label}>Eklenecek Adet</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={themeStyles.input}
              placeholder="Örn: 10"
            />

            <div style={themeStyles.previewBox}>
              <div>
                <span style={themeStyles.previewLabel}>Seçili Ürün</span>
                <strong style={themeStyles.previewValue}>{selectedProduct?.name || 'Henüz seçilmedi'}</strong>
              </div>
              <div>
                <span style={themeStyles.previewLabel}>Mevcut Stok</span>
                <strong style={themeStyles.previewValue}>{selectedProduct ? selectedProduct.quantity : '-'}</strong>
              </div>
              <div>
                <span style={themeStyles.previewLabel}>Yeni Stok</span>
                <strong style={themeStyles.previewValue}>
                  {selectedProduct ? selectedProduct.quantity + (parseInt(amount, 10) || 0) : '-'}
                </strong>
              </div>
            </div>

            <button type="submit" style={themeStyles.button}>Stoğa Ekle</button>
          </form>
        </section>

        <section style={themeStyles.card}>
          <div style={themeStyles.cardHeader}>
            <FaBoxes color="#22c55e" />
            <h3 style={themeStyles.cardTitle}>Ürün Stokları</h3>
          </div>

          <div style={themeStyles.searchBox}>
            <FaSearch color={searchIconColor} />
            <input
              style={themeStyles.searchInput}
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={themeStyles.tableWrap}>
            <table style={themeStyles.table}>
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Kategori</th>
                  <th>Stok</th>
                  <th>Eşik</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.categoryName || '---'}</td>
                    <td style={{ color: product.quantity <= product.threshold ? '#dc2626' : '#16a34a', fontWeight: '700' }}>
                      {product.quantity}
                    </td>
                    <td>{product.threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', background: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontWeight: '800', color: '#1e293b', fontSize: '28px', margin: 0 },
  subtitle: { color: '#64748b', marginTop: '6px', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', alignItems: 'start' },
  card: { background: '#fff', borderRadius: '20px', border: '1px solid #eef2ff', padding: '24px', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' },
  cardTitle: { margin: 0, color: '#1e293b', fontSize: '18px' },
  form: { display: 'grid', gap: '12px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#334155' },
  input: { padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
  select: { padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', background: '#fff' },
  button: { background: '#6366f1', color: '#fff', border: 'none', padding: '13px 16px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '6px' },
  previewBox: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', marginTop: '4px' },
  previewLabel: { display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '6px' },
  previewValue: { display: 'block', color: '#0f172a', fontSize: '14px' },
  searchBox: { background: '#fff', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '100%' },
  tableWrap: { maxHeight: '520px', overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  restrictedCard: { background: '#fff', borderRadius: '20px', border: '1px solid #fee2e2', padding: '40px', textAlign: 'center', maxWidth: '520px', margin: '40px auto', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)' }
};

const darkStyles = {
  container: { padding: '40px', background: '#0f172a', minHeight: '100vh', color: '#f4f4f5' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontWeight: '800', color: '#f4f4f5', fontSize: '28px', margin: 0 },
  subtitle: { color: '#94a3b8', marginTop: '6px', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', alignItems: 'start' },
  card: { background: '#1e293b', borderRadius: '20px', border: '1px solid #334155', padding: '24px', boxShadow: '0 8px 20px rgba(2, 6, 23, 0.25)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' },
  cardTitle: { margin: 0, color: '#f4f4f5', fontSize: '18px' },
  form: { display: 'grid', gap: '12px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#cbd5e1' },
  input: { padding: '12px 14px', borderRadius: '12px', border: '1px solid #475569', outline: 'none', fontSize: '14px', background: '#0f172a', color: '#f4f4f5' },
  select: { padding: '12px 14px', borderRadius: '12px', border: '1px solid #475569', outline: 'none', fontSize: '14px', background: '#0f172a', color: '#f4f4f5' },
  button: { background: '#6366f1', color: '#fff', border: 'none', padding: '13px 16px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '6px' },
  previewBox: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '14px', marginTop: '4px' },
  previewLabel: { display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' },
  previewValue: { display: 'block', color: '#e2e8f0', fontSize: '14px' },
  searchBox: { background: '#0f172a', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #475569', marginBottom: '14px' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '100%', background: 'transparent', color: '#f4f4f5' },
  tableWrap: { maxHeight: '520px', overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px', color: '#e2e8f0' },
  restrictedCard: { background: '#1e293b', borderRadius: '20px', border: '1px solid #7f1d1d', padding: '40px', textAlign: 'center', maxWidth: '520px', margin: '40px auto', boxShadow: '0 8px 20px rgba(2, 6, 23, 0.25)' }
};
