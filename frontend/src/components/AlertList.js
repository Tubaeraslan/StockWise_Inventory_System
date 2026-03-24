import React, { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';

export default function AlertList() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await getAlerts();
        setAlerts(response.data);
        setError(null);
      } catch (err) {
        setError('Uyarılar yüklenemedi: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#718096' }}>⏳ Yükleniyor...</div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="container">
        <h1 style={{ marginBottom: '2rem', color: '#667eea', fontSize: '2rem', fontWeight: 'bold' }}>🔔 Stok Uyarıları</h1>
        <div className="alert alert-success">
          <strong>✅ Harika!</strong> Ürünlerin hepsi yeterli stok seviyesinde. Ürün ekle veya miktarları düşürerek uyarıları görünteleyebilirsin.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#f56565', fontSize: '2rem', fontWeight: 'bold' }}>🔔 Stok Uyarıları ({alerts.length})</h1>
      
      {error && <div className="alert alert-danger"><strong>❌ Hata:</strong> {error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {alerts.map((alert) => (
          <div key={alert.productId} className="card" style={{ borderLeft: '4px solid #f56565' }}>
            <div style={{ padding: '1.5rem' }}>
              <h5 style={{ color: '#f56565', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
                ⚠️ {alert.productName}
              </h5>
              <div style={{ color: '#718096', fontSize: '0.95rem', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Kategori:</strong> {alert.categoryName}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Mevcut Stok:</strong> <span style={{ color: '#f56565', fontWeight: 'bold' }}>{alert.quantity}</span>
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Min. Eşik:</strong> {alert.threshold}
                </div>
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff5f5', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#718096' }}>Eksik Miktar</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f56565' }}>-{alert.shortage}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#edf2f7', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
        <strong>💡 İpucu:</strong> Bu sayfada görünen ürünlerin stok miktarı minimum eşiğinin altındadır. Lütfen tedarikçiyle iletişime geçin veya yeni ürün siparişi verin.
      </div>
    </div>
  );
}
