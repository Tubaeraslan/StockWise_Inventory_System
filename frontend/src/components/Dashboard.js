import React, { useState, useEffect } from 'react';
import { getCategories, getProducts, getAlerts, getSalesRanking } from '../services/api';
import { FaBox, FaBell, FaBoxes } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ categories: 0, products: 0, alerts: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const now = new Date();
    Promise.all([
      getCategories(), getProducts(), getAlerts(),
      getSalesRanking(now.getFullYear(), now.getMonth() + 1)
    ]).then(([catRes, prodRes, alertRes, rankRes]) => {
      setStats({ categories: catRes.data.length, products: prodRes.data.length, alerts: alertRes.data.length });
      setProducts(prodRes.data.slice(0, 5));
      setChartData(rankRes.data);
    }).catch(err => console.error("Yükleme hatası:", err));
  }, []);

  return (
    <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh' }}>
      <h2 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '24px' }}>Özet Panel</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <div style={cardStyle}><FaBoxes color="#6366f1" size={24}/> <div><p>Kategoriler</p><h4>{stats.categories}</h4></div></div>
        <div style={cardStyle}><FaBox color="#22c55e" size={24}/> <div><p>Ürün Sayısı</p><h4>{stats.products}</h4></div></div>
        <div style={{...cardStyle, border: stats.alerts > 0 ? '1px solid #ef4444' : 'none'}}>
          <FaBell color="#ef4444" size={24}/> <div><p>Stok Uyarıları</p><h4>{stats.alerts}</h4></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <div style={sectionStyle}>
          <h4 style={{ marginBottom: '20px' }}>Satış Analizi (Bu Ay)</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="productName" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}} />
                <Bar dataKey="totalSold" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={sectionStyle}>
          <h4 style={{ marginBottom: '15px' }}>Son Ürünler</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead><tr style={{ textAlign: 'left', color: '#94a3b8' }}><th>Ürün</th><th>Stok</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid #f8fafc' }}>
                  <td style={{ padding: '10px 0', fontWeight: '600' }}>{p.name}</td>
                  <td>{p.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const cardStyle = { flex: 1, background: '#fff', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const sectionStyle = { background: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9' };