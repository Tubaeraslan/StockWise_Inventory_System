import React, { useState, useEffect } from 'react';
import { getCategories, getProducts, getAlerts, getSalesRanking } from '../services/api';
import { FaBox, FaBell, FaBoxes } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ categories: 0, products: 0, alerts: 0 });
  const [chartData, setChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [productAnalytics, setProductAnalytics] = useState([]);

  useEffect(() => {
    Promise.all([
      getCategories(), 
      getProducts(), 
      getAlerts(),
      getSalesRanking(selectedYear, selectedMonth)
    ]).then(([catRes, prodRes, alertRes, rankRes]) => {
      setStats({ categories: catRes.data.length, products: prodRes.data.length, alerts: alertRes.data.length });
      setProducts(prodRes.data);
      setChartData(rankRes.data);
      
      // Ürün bazlı toplam satış analizi
      const totalByProduct = rankRes.data.reduce((acc, item) => {
        acc.push({ name: item.productName, value: item.totalSold, id: item.productId });
        return acc;
      }, []).sort((a, b) => b.value - a.value).slice(0, 8);
      setProductAnalytics(totalByProduct);
    }).catch(err => console.error("Yükleme hatası:", err));
  }, [selectedYear, selectedMonth]);

  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const years = [2023, 2024, 2025, 2026];
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#22c55e'];

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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: 0 }}>Satış Analizi</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={selectStyle}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                style={selectStyle}
              >
                {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>
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
          <h4 style={{ marginBottom: '15px', marginTop: 0 }}>En Çok Satan Ürünler</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={productAnalytics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productAnalytics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h4 style={{ marginBottom: '15px', marginTop: 0 }}>Tüm Ürünler ({products.length} adet)</h4>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead><tr style={{ textAlign: 'left', color: '#94a3b8', position: 'sticky', top: 0, background: '#f8fafc' }}>
              <th style={{padding: '10px 0'}}>Ürün</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Eşik</th>
            </tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid #f8fafc', backgroundColor: p.quantity <= p.threshold ? '#fef2f2' : 'transparent' }}>
                  <td style={{ padding: '10px 0', fontWeight: '600' }}>{p.name}</td>
                  <td style={{ color: '#64748b' }}>{p.categoryName || '---'}</td>
                  <td style={{ color: p.quantity <= p.threshold ? '#dc2626' : '#22c55e', fontWeight: 'bold' }}>{p.quantity}</td>
                  <td style={{ color: '#94a3b8' }}>{p.threshold}</td>
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
const selectStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', cursor: 'pointer', background: '#fff' };