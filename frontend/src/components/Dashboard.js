import React, { useState, useEffect } from 'react';
import CategoryList from './CategoryList';
import ProductList from './ProductList';
import AlertList from './AlertList';
import { getCategories, getProducts, getAlerts } from '../services/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ categories: 0, products: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);

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

            <div className="card">
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
        {activeTab === 'products' && <ProductList />}
        {activeTab === 'alerts' && <AlertList />}
      </div>

      <footer className="footer">
        <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>StockWise © 2026</p>
        <p style={{ fontSize: '0.9rem' }}>Spring Boot + React ile geliştirilmiştir</p>
      </footer>
    </div>
  );
}
