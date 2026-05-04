import React, { useState } from 'react';
import axios from 'axios';

export default function Register({ onRegister, onGoToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [permission, setPermission] = useState('STAFF');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Kullanıcı adı ve şifre zorunlu!');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı!');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/users', { username, password, permission });
      onRegister && onRegister();
    } catch (err) {
      setError(err.response?.data?.error || 'Kayıt başarısız!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2.5rem 2rem', borderRadius: 12, boxShadow: '0 8px 32px rgba(44,62,80,0.15)', minWidth: 320, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <h2 style={{ textAlign: 'center', color: '#667eea', marginBottom: '1rem', fontWeight: 700 }}>Kayıt Ol</h2>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '1rem' }}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: '0.7rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '1rem' }}
        />
        <select value={permission} onChange={e => setPermission(e.target.value)} style={{ padding: '0.7rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '1rem' }}>
          <option value="STAFF">Personel</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" disabled={loading} style={{ background: '#667eea', color: 'white', border: 'none', borderRadius: 6, padding: '0.8rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}>
          {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </button>
        {error && <div style={{ color: '#e53e3e', textAlign: 'center', marginTop: '0.5rem' }}>{error}</div>}
        <button type="button" onClick={onGoToLogin} style={{ background: 'transparent', color: '#667eea', border: 'none', marginTop: 8, cursor: 'pointer', fontWeight: 500 }}>
          Girişe Dön
        </button>
      </form>
    </div>
  );
}
