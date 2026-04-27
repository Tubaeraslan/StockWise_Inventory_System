import React, { useEffect, useState } from 'react';
import { getCategories, createCategory } from '../services/api';

export default function CategoryList({ user }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError('Kategoriler yüklenemedi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Kategori adı gerekli');
      return;
    }
    if (!user || !user.id) {
      alert('Kullanıcı bilgisi bulunamadı!');
      return;
    }
    try {
      setSubmitting(true);
      await createCategory({ name, description, userId: user.id });
      setName('');
      setDescription('');
      fetchCategories();
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
      <h1 style={{ marginBottom: '2rem', color: '#667eea', fontSize: '2rem', fontWeight: 'bold' }}>📂 Kategoriler</h1>
      
      <div className="form-section">
        <h3>Yeni Kategori Ekle</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Kategori Adı</label>
            <input
              type="text"
              className="form-control"
              placeholder="Elektronik, Ofis Malzemeleri, vb."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Açıklama</label>
            <input
              type="text"
              className="form-control"
              placeholder="Kategori açıklaması (opsiyonel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '⏳ Ekleniyor...' : '✅ Kategori Ekle'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-danger"><strong>❌ Hata:</strong> {error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {categories.map((cat) => (
          <div key={cat.id} className="card">
            <div style={{ padding: '1.5rem' }}>
              <h5 style={{ color: '#667eea', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600' }}>📌 {cat.name}</h5>
              <p style={{ color: '#718096', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: 0 }}>
                {cat.description || 'Açıklama yok'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
