import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { username, password });
      onLogin(res.data);
    } catch (err) {
      setError('Kullanıcı adı veya şifre hatalı!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2.5rem 2rem', borderRadius: 12, boxShadow: '0 8px 32px rgba(44,62,80,0.15)', minWidth: 320, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <h2 style={{ textAlign: 'center', color: '#667eea', marginBottom: '1rem', fontWeight: 700 }}>StockWise Giriş</h2>
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
        <button type="submit" disabled={loading} style={{ background: '#667eea', color: 'white', border: 'none', borderRadius: 6, padding: '0.8rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}>
          {loading ? 'Giriş...' : 'Giriş Yap'}
        </button>
        {error && <div style={{ color: '#e53e3e', textAlign: 'center', marginTop: '0.5rem' }}>{error}</div>}
      </form>
    </div>
  );
}
