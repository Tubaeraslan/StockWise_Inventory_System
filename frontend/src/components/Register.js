import React, { useState } from 'react';
import { FaUserPlus, FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';

export default function Register({ onRegister, onGoToLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'STAFF' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <div style={styles.logo}>
          <span style={{ color: '#6366f1' }}>Stock</span>Wise ⚛️
        </div>
        <h2 style={authStyles.title}>Yeni Hesap Oluştur</h2>
        <p style={authStyles.subtitle}>Ekibinize yeni bir üye ekleyin.</p>

        <form onSubmit={handleSubmit} style={authStyles.form}>
          <div style={authStyles.inputWrapper}>
            <FaUser style={authStyles.icon} />
            <input 
              style={authStyles.input} 
              placeholder="Kullanıcı Adı" 
              onChange={e => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>
          <div style={authStyles.inputWrapper}>
            <FaLock style={authStyles.icon} />
            <input 
              type="password" 
              style={authStyles.input} 
              placeholder="Şifre" 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          <select 
            style={{...authStyles.input, paddingLeft: '16px'}} 
            onChange={e => setFormData({...formData, role: e.target.value})}
          >
            <option value="STAFF">Personel Yetkisi</option>
            <option value="ADMIN">Yönetici Yetkisi</option>
          </select>
          <button type="submit" style={authStyles.submitBtn}>
            Kayıt Ol <FaUserPlus />
          </button>
        </form>

        <div style={authStyles.footer}>
          Zaten hesabınız var mı? <button onClick={onGoToLogin} style={authStyles.linkBtn}><FaArrowLeft size={10}/> Girişe Dön</button>
        </div>
      </div>
    </div>
  );
}

const authStyles = {
    // Login ile aynı stiller...
    container: { background: '#f1f5f9', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Inter", sans-serif' },
    card: { background: '#fff', padding: '48px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', textAlign: 'center' },
    title: { fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' },
    subtitle: { color: '#64748b', fontSize: '14px', marginBottom: '32px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '16px', color: '#94a3b8' },
    input: { width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: '15px' },
    submitBtn: { padding: '14px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
    footer: { marginTop: '24px', fontSize: '14px', color: '#64748b' },
    linkBtn: { background: 'none', border: 'none', color: '#6366f1', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', margin: '8px auto' }
};

const styles = {
    logo: { fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '24px' },
};