import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../services/api';
import { FaPlus, FaFolderOpen, FaInfoCircle, FaTrash, FaEdit } from 'react-icons/fa';

export default function CategoryList({ user }) {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const isAdmin = user && (user.permission === 'ADMIN' || user.username === 'tuba');

  const fetchData = () => {
    getCategories().then(res => setCategories(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: newCat.name,
        description: newCat.description || 'Açıklama belirtilmemiş'
      };

      if (editingId) {
        await updateCategory(editingId, categoryData, user.id);
        setEditingId(null);
      } else {
        await createCategory({ ...categoryData, userId: user.id });
      }
      setNewCat({ name: '', description: '' });
      fetchData();
    } catch (err) {
      alert('İşlem başarısız! Verileri kontrol edin.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
      try {
        await deleteCategory(id, user.id);
        fetchData();
      } catch (err) {
        alert('Kategori silinemedi! (Bağlı ürünler olabilir)');
      }
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setNewCat({ name: cat.name, description: cat.description || '' });
    window.scrollTo(0, 0);
  };

  return (
    <div style={catStyles.container}>
      <div style={catStyles.headerSection}>
        <div>
          <h2 style={catStyles.title}>Kategori Yönetimi</h2>
          <p style={catStyles.subtitle}>Ürünlerinizi düzenlemek için kategorileri kullanın.</p>
        </div>
        {isAdmin && (
          <form onSubmit={handleSave} style={catStyles.topForm}>
            <div style={catStyles.formGroup}>
              <input 
                style={catStyles.input} 
                placeholder="Kategori Adı" 
                value={newCat.name} 
                onChange={e => setNewCat({...newCat, name: e.target.value})} 
                required
              />
              <textarea 
                style={{...catStyles.input, minHeight: '80px', resize: 'none'}} 
                placeholder="Açıklama" 
                value={newCat.description} 
                onChange={e => setNewCat({...newCat, description: e.target.value})}
              />
            </div>
            <div style={{display: 'flex', gap: '12px'}}>
              <button style={catStyles.addBtn} type="submit">
                {editingId ? <FaEdit /> : <FaPlus />} {editingId ? 'Güncelle' : 'Yeni Ekle'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {setEditingId(null); setNewCat({name:'', description:''});}}
                  style={{...catStyles.addBtn, background: '#94a3b8'}}
                >
                  İptal
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div style={catStyles.grid}>
        {categories.map(cat => (
          <div key={cat.id} style={catStyles.card}>
            <div style={catStyles.cardTop}>
              <div style={catStyles.iconBox}><FaFolderOpen color="#6366f1" /></div>
              <div style={{display: 'flex', gap: '5px'}}>
                {isAdmin && (
                  <>
                    <button onClick={() => handleEdit(cat)} style={catStyles.actionIconBtn}><FaEdit color="#f59e0b" /></button>
                    <button onClick={() => handleDelete(cat.id)} style={catStyles.actionIconBtn}><FaTrash color="#ef4444" /></button>
                  </>
                )}
                <div style={catStyles.badge}>ID: #{cat.id}</div>
              </div>
            </div>
            <h4 style={catStyles.catName}>{cat.name}</h4>
            <div style={catStyles.descBox}>
              <FaInfoCircle size={12} color="#94a3b8" />
              <p style={catStyles.catDesc}>{cat.description || 'Açıklama belirtilmemiş.'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const catStyles = {
  container: { padding: '20px', fontFamily: '"Inter", sans-serif' },
  headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
  topForm: { display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '300px' },
  input: { padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', width: '100%', fontSize: '14px', fontFamily: '"Inter", sans-serif' },
  addBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  card: { background: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  iconBox: { width: '48px', height: '48px', background: '#eef2ff', borderRadius: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  badge: { fontSize: '11px', fontWeight: '700', color: '#6366f1', background: '#eef2ff', padding: '4px 10px', borderRadius: '20px' },
  catName: { fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px 0' },
  descBox: { display: 'flex', gap: '8px', alignItems: 'flex-start' },
  catDesc: { fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' },
  actionIconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }
};