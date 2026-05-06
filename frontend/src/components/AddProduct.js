import React, { useState, useEffect } from 'react';
import { createProduct, getCategories } from '../services/api';

export default function AddProduct({ user, darkMode }) {
  const [formData, setFormData] = useState({ name: '', quantity: '', threshold: '', price: '', categoryId: '' });
  const [barcode, setBarcode] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => { getCategories().then(res => setCategories(res.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return alert("Hata: Kullanıcı girişi algılanamadı!");
    if (barcode.length !== 8) return alert("Barkod 8 hane olmalı!");
    try {
      const data = {
        name: formData.name,
        barcode: barcode,
        quantity: parseInt(formData.quantity) || 0,
        threshold: parseInt(formData.threshold) || 0,
        price: parseFloat(formData.price) || 0,
        categoryId: parseInt(formData.categoryId),
        userId: user.id
      };
      await createProduct(data);
      alert("Ürün başarıyla kaydedildi!");
      setFormData({ name: '', quantity: '', threshold: '', price: '', categoryId: '' });
      setBarcode('');
    } catch (err) { alert("Hata: Ürün eklenemedi. Kategoriyi ve Barkodu kontrol edin."); }
  };

  const pageBg = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#fff';
  const textColor = darkMode ? '#f4f4f5' : '#1e293b';
  const borderColor = darkMode ? '#334155' : '#f1f5f9';
  const inputBg = darkMode ? '#0b1220' : '#fff';
  const inputBorder = darkMode ? '#475569' : '#e2e8f0';

  return (
    <div style={{padding: '40px', minHeight: '100vh', background: pageBg, color: textColor}}>
      <h2 style={{fontWeight: '800', marginBottom: '20px', color: textColor}}>Yeni Ürün Kaydı</h2>
      <div style={{background: cardBg, padding: '30px', borderRadius: '20px', border: `1px solid ${borderColor}`}}>
        <form onSubmit={handleSubmit} style={{display: 'grid', gap: '15px', maxWidth: '500px'}}>
          <input placeholder="Ürün Adı" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{...styles.inp, background: inputBg, border: `1px solid ${inputBorder}`, color: textColor}} required />
          <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} style={{...styles.inp, background: inputBg, border: `1px solid ${inputBorder}`, color: textColor}} required>
            <option value="">Kategori Seçin</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div style={{display: 'flex', gap: '10px'}}>
            <input type="number" placeholder="Stok Miktarı" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} style={{...styles.inp, background: inputBg, border: `1px solid ${inputBorder}`, color: textColor}} required />
            <input type="number" placeholder="Kritik Eşik" value={formData.threshold} onChange={e => setFormData({...formData, threshold: e.target.value})} style={{...styles.inp, background: inputBg, border: `1px solid ${inputBorder}`, color: textColor}} required />
          </div>
          <input type="number" step="0.01" placeholder="Birim Fiyat (TL)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{...styles.inp, background: inputBg, border: `1px solid ${inputBorder}`, color: textColor}} required />
          <input placeholder="Barkod (8 Rakam)" value={barcode} onChange={e => setBarcode(e.target.value.replace(/\D/g, '').slice(0,8))} style={{...styles.inp, background: inputBg, border: barcode.length === 8 ? '1px solid #22c55e' : '1px solid #ef4444', color: textColor}} required />
          <button type="submit" style={styles.btn}>Sisteme Kaydet</button>
        </form>
      </div>
    </div>
  );
}
const styles = { inp: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }, btn: { background: '#6366f1', color: '#fff', padding: '14px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' } };