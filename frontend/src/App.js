import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import CategoryList from './components/CategoryList';
import AddProduct from './components/AddProduct';
import StockUpdate from './components/StockUpdate';
import { FaChartLine, FaBox, FaThLarge, FaPlusCircle, FaSignOutAlt, FaWarehouse } from 'react-icons/fa';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActivePage('dashboard');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!user) {
    if (showRegister) {
      return <Register onRegister={() => setShowRegister(false)} onGoToLogin={() => setShowRegister(false)} />;
    }
    return <Login onLogin={handleLogin} onGoToRegister={() => setShowRegister(true)} />;
  }

  const isAdmin = user.permission === 'ADMIN';

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'products': return <ProductList isAdmin={isAdmin} user={user} />;
      case 'categories': return <CategoryList user={user} />;
      case 'add-product': return isAdmin ? <AddProduct user={user} /> : <Dashboard user={user} />;
      case 'stock-update': return isAdmin ? <StockUpdate user={user} isAdmin={isAdmin} /> : <Dashboard user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <div style={{
      ...styles.appLayout,
      background: darkMode ? '#0f172a' : '#f8fafc'
    }}>
      <aside style={{
        ...styles.sidebar,
        background: darkMode ? '#1e293b' : '#fff',
        borderRight: darkMode ? '1px solid #334155' : '1px solid #f1f5f9'
      }}>
        <div style={{
          ...styles.logo,
          color: darkMode ? '#f8fafc' : '#1e293b'
        }}>
          <span style={{ color: '#6366f1' }}>Stock</span>Wise
        </div>

        <div style={{
          ...styles.userSection,
          background: darkMode ? '#334155' : '#f8fafc'
        }}>
          <div style={styles.avatar}>{user.username?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{
              ...styles.userName,
              color: darkMode ? '#f8fafc' : '#1e293b'
            }}>{user.username}</div>
            <div style={{
              ...styles.userRole,
              color: darkMode ? '#94a3b8' : '#64748b'
            }}>{isAdmin ? 'Yönetici' : 'Personel'}</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <button onClick={() => setActivePage('dashboard')} style={activePage === 'dashboard' ? styles.activeLink : (darkMode ? styles.darkLink : styles.link)}>
            <FaChartLine /> Özet Panel
          </button>
          <button onClick={() => setActivePage('products')} style={activePage === 'products' ? styles.activeLink : (darkMode ? styles.darkLink : styles.link)}>
            <FaBox /> Ürünler
          </button>
          <button onClick={() => setActivePage('categories')} style={activePage === 'categories' ? styles.activeLink : (darkMode ? styles.darkLink : styles.link)}>
            <FaThLarge /> Kategoriler
          </button>
          {isAdmin && (
            <button onClick={() => setActivePage('add-product')} style={activePage === 'add-product' ? styles.activeLink : (darkMode ? styles.darkLink : styles.link)}>
              <FaPlusCircle /> Yeni Ürün Ekle
            </button>
          )}
          {isAdmin && (
            <button onClick={() => setActivePage('stock-update')} style={activePage === 'stock-update' ? styles.activeLink : (darkMode ? styles.darkLink : styles.link)}>
              <FaWarehouse /> Stok Güncelle
            </button>
          )}
        </nav>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          <FaSignOutAlt /> Çıkış Yap
        </button>
      </aside>

      <main style={styles.mainContent}>
        {renderPage()}
      </main>
    </div>
  );
}

const styles = {
  appLayout: { display: 'flex', minHeight: '100vh', fontFamily: '"Inter", sans-serif' },
  sidebar: { width: '260px', height: '100vh', position: 'fixed', left: 0, top: 0, padding: '40px 24px', display: 'flex', flexDirection: 'column', zIndex: 100 },
  logo: { fontSize: '24px', fontWeight: '800', marginBottom: '40px' },
  userSection: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', marginBottom: '32px' },
  avatar: { width: '40px', height: '40px', background: '#6366f1', color: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
  userName: { fontSize: '14px', fontWeight: '700' },
  userRole: { fontSize: '12px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  link: { color: '#64748b', border: 'none', background: 'transparent', padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' },
  darkLink: { color: '#94a3b8', border: 'none', background: 'transparent', padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' },
  activeLink: { color: '#6366f1', background: '#eef2ff', border: 'none', padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700', cursor: 'pointer', textAlign: 'left' },
  mainContent: { flex: 1, marginLeft: '260px', padding: '0' },
  logoutBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }
};

export default App;