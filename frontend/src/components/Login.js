import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { login } from '../services/api';

export default function Login({ onLogin, onGoToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      const response = await login(username, password);
      onLogin(response.data);
    } catch (err) {
      setError('Kullanıcı adı veya şifre hatalı');
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
          <span style={{ color: '#6366f1' }}>Stock</span>Wise
        </div>
        <h2 style={dynamicStyles.title}>Tekrar Hoş Geldiniz</h2>
        <p style={dynamicStyles.subtitle}>Devam etmek için lütfen giriş yapın.</p>

        {error && <div style={authStyles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={authStyles.form}>
          <div style={authStyles.inputWrapper}>
            <FaUser style={authStyles.icon} />
            <input 
              type="text" 
              placeholder="Kullanıcı Adı" 
              style={dynamicStyles.input} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div style={authStyles.inputWrapper}>
            <FaLock style={authStyles.icon} />
            <input 
              type="password" 
              placeholder="Şifre" 
              style={dynamicStyles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" style={authStyles.submitBtn} disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'} <FaSignInAlt />
          </button>
        </form>

        <div style={dynamicStyles.footer}>
          Hesabınız yok mu? <button onClick={onGoToRegister} style={authStyles.linkBtn}>Kayıt Ol</button>
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
  input: { width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', outline: 'none', transition: '0.2s', fontSize: '15px' },
  submitBtn: { padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '16px' },
  footer: { marginTop: '24px', fontSize: '14px' },
  linkBtn: { background: 'none', border: 'none', color: '#6366f1', fontWeight: '700', cursor: 'pointer', padding: 0 }
};

const styles = {
  logo: { fontSize: '28px', fontWeight: '800', marginBottom: '24px' },
};