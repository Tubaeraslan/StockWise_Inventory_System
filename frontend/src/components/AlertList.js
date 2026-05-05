import React, { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';
import { FaExclamationCircle, FaCheckCircle, FaHistory } from 'react-icons/fa';

export default function AlertList() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts().then(res => setAlerts(res.data));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Uyarı Merkezi</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Stok durumu kritik olan tüm ürünler burada listelenir.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {alerts.length === 0 ? (
          <div style={alertStyles.emptyState}>
            <FaCheckCircle color="#22c55e" size={48} />
            <h4>Harika!</h4>
            <p>Şu an için kritik stok uyarısı bulunmuyor.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} style={alertStyles.alertCard}>
              <div style={alertStyles.iconBox}><FaExclamationCircle color="#ef4444" size={20} /></div>
              <div style={{ flex: 1 }}>
                <div style={alertStyles.productName}>{alert.productName}</div>
                <div style={alertStyles.alertMsg}>{alert.message}</div>
              </div>
              <div style={alertStyles.statusBadge}>DÜŞÜK STOK</div>
              <div style={alertStyles.timeBox}><FaHistory /> {new Date(alert.createdAt).toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const alertStyles = {
  alertCard: { display: 'flex', alignItems: 'center', background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #fee2e2', gap: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  iconBox: { padding: '12px', background: '#fef2f2', borderRadius: '12px' },
  productName: { fontSize: '16px', fontWeight: '700', color: '#1e293b' },
  alertMsg: { fontSize: '13px', color: '#64748b', marginTop: '2px' },
  statusBadge: { padding: '4px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: '20px', fontSize: '11px', fontWeight: '800' },
  timeBox: { fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' },
  emptyState: { textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '24px', border: '1px dashed #e2e8f0' }
};