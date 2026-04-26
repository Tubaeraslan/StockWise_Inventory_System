import React, { useState, useEffect } from 'react';
import CategoryList from './CategoryList';
import ProductList from './ProductList';
import AlertList from './AlertList';
import { getCategories, getProducts, getAlerts, getSalesRanking } from '../services/api';


export default function Dashboard({ user, onLogout }) {

  // Yetki kontrolü örneği
  const isAdmin = user && user.permission === 'ADMIN';

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ categories: 0, products: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);

    // Satış ranking state
    const [rankingMonth, setRankingMonth] = useState(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [salesRanking, setSalesRanking] = useState([]);
    const [rankingLoading, setRankingLoading] = useState(false);
    const [rankingError, setRankingError] = useState(null);

    useEffect(() => {
      if (!isAdmin || activeTab !== 'dashboard') return;
      const [year, month] = rankingMonth.split('-');
      setRankingLoading(true);
      setRankingError(null);
      getSalesRanking(Number(year), Number(month))
        .then(res => setSalesRanking(res.data))
        .catch(err => setRankingError('Satış verisi alınamadı'))
        .finally(() => setRankingLoading(false));
    }, [rankingMonth, isAdmin, activeTab]);

  // Şifreyle erişim isteyen örnek fonksiyon
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [staffPassword, setStaffPassword] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessError, setAccessError] = useState('');

  const handleRestrictedAccess = () => {
    setShowPasswordPrompt(true);
    setAccessGranted(false);
    setAccessError('');
  };

  const checkStaffPassword = async (e) => {
    e.preventDefault();
    // Burada gerçek backend doğrulaması yapılmalı
    if (staffPassword === 'staff123') {
      setAccessGranted(true);
      setShowPasswordPrompt(false);
      setAccessError('');
    } else {
      setAccessError('Şifre yanlış!');
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catRes, prodRes, alertRes] = await Promise.all([
          getCategories(),
          getProducts(),
          getAlerts()
        ]);
        setStats({
          categories: catRes.data.length,
          products: prodRes.data.length,
          alerts: alertRes.data.length
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-brand">
            <span>📦</span>
            <span>StockWise</span>
          </div>
          <div style={{ color: 'white', fontSize: '0.9rem' }}>Envanter Yönetim Sistemi</div>
          <button style={{ marginLeft: 'auto', background: '#e53e3e', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1rem', cursor: 'pointer' }} onClick={onLogout}>
            Çıkış Yap
          </button>
        </div>
      </nav>

      <nav className="nav-tabs">
        <button
          className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Özet
        </button>
        <button
          className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📂 Kategoriler
        </button>
        <button
          className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Ürünler
        </button>
        <button
          className={`nav-link ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🔔 Uyarılar
        </button>
      </nav>

      <div style={{ flex: 1 }}>
        {activeTab === 'dashboard' && (
          <div className="container">
            <h1 style={{ marginBottom: '2rem', color: '#667eea', fontSize: '2rem', fontWeight: 'bold' }}>
              Ana Sayfa
            </h1>

            {/* Ortak istatistikler */}
            {!loading && (
              <div className="dashboard-stats">
                <div className="stat-card">
                  <h3>Toplam Kategoriler</h3>
                  <div className="number">{stats.categories}</div>
                </div>
                <div className="stat-card">
                  <h3>Toplam Ürünler</h3>
                  <div className="number">{stats.products}</div>
                </div>
                <div className="stat-card">
                  <h3>Stok Uyarıları</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: stats.alerts > 0 ? '#f56565' : '#48bb78' }}>
                    {stats.alerts}
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN'e özel alan */}
            {isAdmin && (
              <div className="card" style={{ marginTop: '2rem', borderLeft: '4px solid #667eea' }}>
                <div className="card-header">
                  <h4 style={{ margin: 0, color: '#667eea' }}>Admin Paneli</h4>
                </div>
                <div style={{ padding: '2rem' }}>
                  <p style={{ fontSize: '1.1rem', color: '#4a5568' }}>
                    Burada sadece admin kullanıcılar için özel yönetim ve raporlama araçları olabilir.<br/>
                    (Örneğin: Kullanıcı yönetimi, sistem ayarları, gelişmiş raporlar...)
                  </p>
                  <div style={{ marginTop: 32 }}>
                    <h5 style={{ color: '#667eea', marginBottom: 12 }}>Ay Bazlı Ürün Satış Sıralaması</h5>
                    <label style={{ fontWeight: 500, marginRight: 8 }}>Ay seç:</label>
                    <input
                      type="month"
                      value={rankingMonth}
                      onChange={e => setRankingMonth(e.target.value)}
                      style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 4, marginBottom: 16 }}
                    />
                    {rankingLoading ? (
                      <div style={{ color: '#718096', marginTop: 8 }}>Yükleniyor...</div>
                    ) : rankingError ? (
                      <div style={{ color: '#e53e3e', marginTop: 8 }}>{rankingError}</div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: 8, overflow: 'hidden', marginTop: 12 }}>
                        <thead style={{ background: '#f6f8fa' }}>
                          <tr>
                            <th style={{ padding: '10px 8px', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>#</th>
                            <th style={{ padding: '10px 8px', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>Ürün</th>
                            <th style={{ padding: '10px 8px', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Toplam Satış</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesRanking.length === 0 ? (
                            <tr><td colSpan={3} style={{ textAlign: 'center', color: '#718096', padding: 16 }}>Kayıt yok</td></tr>
                          ) : salesRanking.map((row, idx) => (
                            <tr key={row.productId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '8px 8px', fontWeight: 500 }}>{idx + 1}</td>
                              <td style={{ padding: '8px 8px' }}>{row.productName}</td>
                              <td style={{ padding: '8px 8px', textAlign: 'right', fontWeight: 600 }}>{row.totalSold}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STAFF'a özel alan */}
            {!isAdmin && (
              <div className="card" style={{ marginTop: '2rem', borderLeft: '4px solid #48bb78' }}>
                <div className="card-header">
                  <h4 style={{ margin: 0, color: '#48bb78' }}>Personel Paneli</h4>
                </div>
                <div style={{ padding: '2rem' }}>
                  <p style={{ fontSize: '1.1rem', color: '#4a5568' }}>
                    Burada sadece staff kullanıcılar için özel işlemler olabilir.<br/>
                    (Örneğin: Kendi işlemlerini görme, hızlı ürün ekleme...)
                  </p>
                </div>
              </div>
            )}

            {/* Hoş geldiniz kartı */}
            <div className="card" style={{ marginTop: '2rem' }}>
              <div className="card-header">
                <h4 style={{ margin: 0, color: 'white' }}>Hoş Geldiniz</h4>
              </div>
              <div style={{ padding: '2rem' }}>
                <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.8' }}>
                  <strong>StockWise</strong>, işletmenizi envanter yönetiminin tüm yönlerine hızla kontrol etmenizi sağlar. 
                  Sol menüyü kullanarak kategorileri yönetin, ürünleri ekleyin veya güncelleyin ve 
                  gerçek zamanlı stok uyarılarını takip edin.
                </p>
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#edf2f7', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                  <strong>💡 İpucu:</strong> Ürün miktarı minimum eşiğin altına düştüğünde otomatik olarak uyarı alacaksınız.
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'categories' && <CategoryList />}
        {activeTab === 'products' && <ProductList isAdmin={isAdmin} user={user} />}
        {activeTab === 'alerts' && <AlertList />}
      </div>

      <footer className="footer">
        <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>StockWise © 2026</p>
        <p style={{ fontSize: '0.9rem' }}>Spring Boot + React ile geliştirilmiştir</p>
      </footer>
    </div>
  );
}
