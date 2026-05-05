import React, { useEffect, useMemo, useState } from 'react';
import { getProducts, addStock } from '../services/api';
import { FaBoxes, FaPlusCircle, FaSearch, FaShieldAlt } from 'react-icons/fa';

export default function StockUpdate({ user, isAdmin }) {
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

  if (!isAdmin) {
    return (
      <div style={styles.container}>
        <div style={styles.restrictedCard}>
          <FaShieldAlt size={36} color="#ef4444" />
          <h2 style={styles.title}>Erişim Kısıtlı</h2>
          <p style={styles.subtitle}>Stok güncelleme sayfasına yalnızca admin kullanıcılar erişebilir.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Stok Güncelleme</h2>
          <p style={styles.subtitle}>Admin olarak mevcut ürünlerin stoklarına ekleme yapabilirsiniz.</p>
        </div>
      </div>

      <div style={styles.grid}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <FaPlusCircle color="#6366f1" />
            <h3 style={styles.cardTitle}>Stoğa Ekle</h3>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Ürün Seç</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={styles.select}
            >
              <option value="">Ürün seçin</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - Stok: {product.quantity}
                </option>
              ))}
            </select>

            <label style={styles.label}>Eklenecek Adet</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
              placeholder="Örn: 10"
            />

            <div style={styles.previewBox}>
              <div>
                <span style={styles.previewLabel}>Seçili Ürün</span>
                <strong style={styles.previewValue}>{selectedProduct?.name || 'Henüz seçilmedi'}</strong>
              </div>
              <div>
                <span style={styles.previewLabel}>Mevcut Stok</span>
                <strong style={styles.previewValue}>{selectedProduct ? selectedProduct.quantity : '-'}</strong>
              </div>
              <div>
                <span style={styles.previewLabel}>Yeni Stok</span>
                <strong style={styles.previewValue}>
                  {selectedProduct ? selectedProduct.quantity + (parseInt(amount, 10) || 0) : '-'}
                </strong>
              </div>
            </div>

            <button type="submit" style={styles.button}>Stoğa Ekle</button>
          </form>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <FaBoxes color="#22c55e" />
            <h3 style={styles.cardTitle}>Ürün Stokları</h3>
          </div>

          <div style={styles.searchBox}>
            <FaSearch color="#94a3b8" />
            <input
              style={styles.searchInput}
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
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
