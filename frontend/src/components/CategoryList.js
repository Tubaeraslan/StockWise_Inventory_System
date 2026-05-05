import React, { useEffect, useState } from 'react';
import { getCategories, createCategory } from '../services/api';
import { updateCategory as apiUpdateCategory, deleteCategory as apiDeleteCategory } from '../services/categoryApi';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

export default function CategoryList({ user }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editCat, setEditCat] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

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

  const openEditModal = (cat) => {
    setEditCat(cat);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
  };

  const handleEditSave = async () => {
    try {
      if (!editCat || !user?.id) return;
      await apiUpdateCategory(
        editCat.id, 
        { name: editName, description: editDescription }, 
        user.id
      );
      setEditCat(null);
      fetchCategories();
    } catch (err) {
      alert("Güncelleme hatası: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!id || !user?.id) return;
    if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz? (İçindeki ürünler, onlara bağlı satışlar ve uyarılar da silinecektir)")) {
      try {
        await apiDeleteCategory(id, user.id);
        fetchCategories();
      } catch (err) {
        console.error("Silme hatası detayı:", err.response?.data);
        alert("Silme hatası: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Kategori adı gerekli');
    if (!user?.id) return alert('Kullanıcı bilgisi bulunamadı!');
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

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>⏳ Yükleniyor...</div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#667eea', fontSize: '2rem', fontWeight: 'bold' }}>📂 Kategoriler</h1>
      <div className="form-section">
        <h3>Yeni Kategori Ekle</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control"
            placeholder="Kategori Adı"
            style={{ marginBottom: '1rem' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Açıklama"
            style={{ marginBottom: '1.5rem' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '⏳ Ekleniyor...' : '✅ Kategori Ekle'}
          </button>
        </form>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {categories.map((cat) => (
          <div key={cat.id} className="card">
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h5 style={{ color: '#667eea', fontWeight: '600' }}>📌 {cat.name}</h5>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openEditModal(cat)} style={{ border: 'none', background: 'none', color: '#4c51bf', cursor: 'pointer', fontSize: '1.1rem' }}><FaEdit /></button>
                  <button onClick={() => handleDelete(cat.id)} style={{ border: 'none', background: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '1.1rem' }}><FaTrash /></button>
                </div>
              </div>
              <p style={{ color: '#718096', fontSize: '0.9rem', marginTop: '0.5rem' }}>{cat.description || 'Açıklama yok'}</p>
            </div>
          </div>
        ))}
      </div>
      {editCat && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', padding: '2rem' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1.5rem' }}>Kategoriyi Düzenle</h3>
            <input 
              type="text" 
              className="form-control" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
              style={{ marginBottom: '1rem' }}
            />
            <textarea 
              className="form-control" 
              value={editDescription} 
              onChange={(e) => setEditDescription(e.target.value)} 
              style={{ marginBottom: '1.5rem', height: '100px' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleEditSave} className="btn btn-primary" style={{ flex: 1 }}><FaCheck /> Kaydet</button>
              <button onClick={() => setEditCat(null)} className="btn btn-secondary" style={{ flex: 1, backgroundColor: '#a0aec0' }}><FaTimes /> İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}