import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';
import { register } from '../services/api';

export default function Register({ onRegister, onGoToLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '', permission: 'STAFF' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDark(localStorage.getItem('theme') === 'dark');
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await register(formData.username, formData.password, formData.permission);
      setLoading(false);
      onRegister(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Kayıt başarısız oldu');
      setLoading(false);
    }
  };

  const dynamicStyles = {
    container: { ...authStyles.container, background: isDark ? '#0f172a' : '#f1f5f9' },
    card: { ...authStyles.card, background: isDark ? '#1e293b' : '#fff', border: isDark ? '1px solid #334155' : 'none' },
    title: { ...authStyles.title, color: isDark ? '#f8fafc' : '#1e293b' },
    subtitle: { ...authStyles.subtitle, color: isDark ? '#94a3b8' : '#64748b' },
    input: { ...authStyles.input, background: isDark ? '#334155' : '#f8fafc', border: isDark ? '1px solid #475569' : '1px solid #e2e8f0', color: isDark ? '#f8fafc' : '#1e293b' },
    footer: { ...authStyles.footer, color: isDark ? '#94a3b8' : '#64748b' },
    logo: { ...styles.logo, color: isDark ? '#f8fafc' : '#1e293b' }
  };

  return (
    <div style={dynamicStyles.container}>
      <div style={dynamicStyles.card}>
        <div style={dynamicStyles.logo}>
          <span style={{ color: '#6366f1' }}>Stock</span>Wise ⚛️
        </div>
        <h2 style={dynamicStyles.title}>Yeni Hesap Oluştur</h2>
        <p style={dynamicStyles.subtitle}>Ekibinize yeni bir üye ekleyin.</p>

        {error && <div style={authStyles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={authStyles.form}>
          <div style={authStyles.inputWrapper}>
            <FaUser style={authStyles.icon} />
            <input 
              style={dynamicStyles.input} 
              placeholder="Kullanıcı Adı" 
              onChange={e => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>
          <div style={authStyles.inputWrapper}>
            <FaLock style={authStyles.icon} />
            <input 
              type="password" 
              style={dynamicStyles.input} 
              placeholder="Şifre" 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          <select 
            style={{...dynamicStyles.input, paddingLeft: '16px'}} 
            onChange={e => setFormData({...formData, permission: e.target.value})}
          >
            <option value="STAFF">Personel Yetkisi</option>
            <option value="ADMIN">Yönetici Yetkisi</option>
          </select>
          <button type="submit" style={{...authStyles.submitBtn, background: isDark ? '#6366f1' : '#1e293b'}} disabled={loading}>
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'} <FaUserPlus />
          </button>
        </form>

        <div style={dynamicStyles.footer}>
          Zaten hesabınız var mı? <button onClick={onGoToLogin} style={authStyles.linkBtn}><FaArrowLeft size={10}/> Girişe Dön</button>
        </div>
      </div>
    </div>
  );
}

const authStyles = {
    container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Inter", sans-serif', transition: 'all 0.3s' },
    card: { padding: '48px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', textAlign: 'center', transition: 'all 0.3s' },
    title: { fontSize: '24px', fontWeight: '800', marginBottom: '8px' },
    subtitle: { fontSize: '14px', marginBottom: '32px' },
    error: { background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '16px', color: '#94a3b8', zIndex: 1 },
    input: { width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', outline: 'none', fontSize: '15px', transition: 'all 0.2s' },
    submitBtn: { padding: '14px', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
    footer: { marginTop: '24px', fontSize: '14px' },
    linkBtn: { background: 'none', border: 'none', color: '#6366f1', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', margin: '8px auto' }
};

const styles = {
    logo: { fontSize: '28px', fontWeight: '800', marginBottom: '24px' },
};