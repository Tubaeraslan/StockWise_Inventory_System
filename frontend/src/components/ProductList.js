import React, { useEffect, useState } from 'react';
import { getProducts, getCategories, sellProduct, sellByBarcode, deleteProduct } from '../services/api';
import { FaBarcode, FaPrint, FaFileExcel, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

export default function ProductList({ isAdmin, user }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [sellAmounts, setSellAmounts] = useState({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    Promise.all([getProducts(), getCategories()]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data);
      setCategories(catRes.data);
    });
  };

  const handleBarcodeSell = async (e) => {
    e.preventDefault();
    if (barcodeInput.length !== 8) return alert("Barkod 8 hane olmalı!");
    try {
      await sellByBarcode(barcodeInput, 1, user.id);
      setBarcodeInput('');
      fetchData();
      alert("Satış başarılı!");
    } catch (err) { alert("Hata: Stok yetersiz veya barkod hatalı!"); }
  };

  const handleSell = async (productId) => {
    const amount = parseInt(sellAmounts[productId] || 1);
    try {
      await sellProduct(productId, amount, user.id);
      fetchData();
    } catch (err) { alert("Hata: Stok yetersiz veya yetki hatası!"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ürünü silmek istediğine emin misin?")) {
      await deleteProduct(id);
      fetchData();
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm)
  );

  return (
    <div style={{padding: '30px', background: '#f8fafc', minHeight: '100vh'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <h2 style={{fontWeight: '800'}}>Ürün ve Stok Yönetimi</h2>
        <div style={{display: 'flex', gap: '10px'}}>
          <div style={styles.searchBox}>
            <FaSearch color="#94a3b8" />
            <input style={styles.searchInput} placeholder="Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      {/* BARKODLA SATIŞ ALANI - GERİ GELDİ */}
      <div style={styles.barcodeSection}>
        <form onSubmit={handleBarcodeSell} style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
          <FaBarcode size={24} color="#6366f1" />
          <input 
            style={styles.input} 
            placeholder="Hızlı Satış için Barkod Okut..." 
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value.replace(/\D/g, '').slice(0,8))}
          />
          <button type="submit" style={styles.sellBtn}>Hızlı Sat</button>
        </form>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Barkod</th>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Eşik</th>
              <th>Stok</th>
              <th style={{textAlign: 'center'}}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(prod => (
              <tr key={prod.id} style={styles.tr}>
                <td style={{color: '#6366f1', fontWeight: 'bold'}}>{prod.barcode}</td>
                <td>{prod.name}</td>
                <td>{prod.category?.name || '---'}</td>
                <td>₺{prod.price?.toFixed(2)}</td>
                <td>{prod.threshold}</td>
                <td style={{fontWeight: 'bold', color: prod.quantity <= prod.threshold ? 'red' : 'inherit'}}>{prod.quantity}</td>
                <td style={{display: 'flex', gap: '5px', justifyContent: 'center'}}>
                  <input type="number" style={styles.miniInput} defaultValue="1" onChange={(e) => setSellAmounts({...sellAmounts, [prod.id]: e.target.value})} />
                  <button onClick={() => handleSell(prod.id)} style={styles.actionBtn}>Sat</button>
                  {isAdmin && <button onClick={() => handleDelete(prod.id)} style={{...styles.actionBtn, background: '#ef4444'}}><FaTrash /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  searchBox: { background: '#fff', padding: '8px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e2e8f0' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px' },
  barcodeSection: { background: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #eef2ff' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: 1 },
  sellBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  tableCard: { background: '#fff', borderRadius: '15px', overflow: 'hidden', border: '1px solid #f1f5f9' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  tr: { borderBottom: '1px solid #f8fafc' },
  miniInput: { width: '40px', textAlign: 'center', borderRadius: '4px', border: '1px solid #ccc' },
  actionBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }
};