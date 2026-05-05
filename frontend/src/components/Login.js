import React, { useState } from 'react';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

export default function Login({ onLogin, onGoToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Senin mevcut login mantığın (setUser vb.)
    onLogin({ username, permission: username === 'admin' ? 'ADMIN' : 'STAFF' });
  };

  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <div style={styles.logo}>
          <span style={{ color: '#6366f1' }}>Stock</span>Wise
        </div>
        <h2 style={authStyles.title}>Tekrar Hoş Geldiniz</h2>
        <p style={authStyles.subtitle}>Devam etmek için lütfen giriş yapın.</p>

        <form onSubmit={handleSubmit} style={authStyles.form}>
          <div style={authStyles.inputWrapper}>
            <FaUser style={authStyles.icon} />
            <input 
              type="text" 
              placeholder="Kullanıcı Adı" 
              style={authStyles.input} 
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
              style={authStyles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" style={authStyles.submitBtn}>
            Giriş Yap <FaSignInAlt />
          </button>
        </form>

        <div style={authStyles.footer}>
          Hesabınız yok mu? <button onClick={onGoToRegister} style={authStyles.linkBtn}>Kayıt Ol</button>
        </div>
      </div>
    </div>
  );
}

const authStyles = {
  container: { background: '#f1f5f9', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: '"Inter", sans-serif' },
  card: { background: '#fff', padding: '48px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', textAlign: 'center' },
  title: { fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' },
  subtitle: { color: '#64748b', fontSize: '14px', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: '16px', color: '#94a3b8' },
  input: { width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', transition: '0.2s', fontSize: '15px' },
  submitBtn: { padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '16px', transition: '0.3s' },
  footer: { marginTop: '24px', fontSize: '14px', color: '#64748b' },
  linkBtn: { background: 'none', border: 'none', color: '#6366f1', fontWeight: '700', cursor: 'pointer', padding: 0 }
};

const styles = {
  logo: { fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '24px' },
};