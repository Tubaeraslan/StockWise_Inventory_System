import React, { useEffect, useState } from 'react';
import { getProducts, getCategories, sellProduct, sellByBarcode, deleteProduct } from '../services/api';
import { FaBarcode, FaPrint, FaFileExcel, FaSearch, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';

export default function ProductList({ isAdmin, user, darkMode }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeAmount, setBarcodeAmount] = useState(1);
  const [sellAmounts, setSellAmounts] = useState({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    Promise.all([getProducts(), getCategories()]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data);
      setCategories(catRes.data);
    });
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredProducts.map(prod => ({
      Barkod: prod.barcode,
      'Ürün Adı': prod.name,
      Kategori: prod.categoryName || '---',
      Fiyat: prod.price,
      Eşik: prod.threshold,
      Stok: prod.quantity
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ürünler');
    XLSX.writeFile(wb, 'urunler.xlsx');
  };

  const handlePrint = () => {
    const printContent = document.getElementById('product-table-print');
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write('<html><head><title>Ürünler</title>');
    printWindow.document.write('<style>body{background:#fff;color:#222;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;text-align:left;}th{background:#f1f5f9;}</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContent.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleBarcodeSell = async (e) => {
    e.preventDefault();
    if (barcodeInput.length !== 8) return alert("Barkod 8 hane olmalı!");
    const amount = parseInt(barcodeAmount, 10);
    if (!amount || amount <= 0) return alert("Satış miktarı 1 veya daha büyük olmalı!");
    try {
      await sellByBarcode(barcodeInput, amount, user.id);
      setBarcodeInput('');
      setBarcodeAmount(1);
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
      try {
        await deleteProduct(id, user.id);
        fetchData();
      } catch (err) {
        alert('Ürün silinemedi!');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm)
  );

  const themeStyles = darkMode ? darkStyles : styles;
  const pageBg = darkMode ? '#18181b' : '#f8fafc';
  const cardBg = darkMode ? '#23232a' : '#fff';
  const textColor = darkMode ? '#f4f4f5' : '#1e293b';

  return (
    <div style={{padding: '30px', background: pageBg, minHeight: '100vh', color: textColor, transition: 'all 0.2s'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center'}}>
        <h2 style={{fontWeight: '800', color: textColor}}>Ürün ve Stok Yönetimi</h2>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <button onClick={handleExportExcel} style={{...themeStyles.actionBtn, background: '#22c55e'}}><FaFileExcel /> Excel'e Aktar</button>
          <button onClick={handlePrint} style={{...themeStyles.actionBtn, background: '#64748b'}}><FaPrint /> Yazdır</button>
          <div style={themeStyles.searchBox}>
            <FaSearch color={darkMode ? '#a1a1aa' : '#94a3b8'} />
            <input style={themeStyles.searchInput} placeholder="Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>
      <div style={{...themeStyles.barcodeSection, background: cardBg}}>
        <form onSubmit={handleBarcodeSell} style={{display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
          <FaBarcode size={24} color="#6366f1" />
          <input 
            style={themeStyles.input} 
            placeholder="Hızlı Satış için Barkod Okut..." 
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value.replace(/\D/g, '').slice(0,8))}
          />
          <input
            type="number"
            min="1"
            style={{...themeStyles.input, maxWidth: '120px'}}
            placeholder="Adet"
            value={barcodeAmount}
            onChange={(e) => setBarcodeAmount(e.target.value)}
          />
          <button type="submit" style={themeStyles.sellBtn}>Hızlı Sat</button>
        </form>
      </div>
      <div style={{...themeStyles.tableCard, background: cardBg}}>
        <div id="product-table-print">
        <table style={themeStyles.table}>
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
              <tr key={prod.id} style={themeStyles.tr}>
                <td style={{color: '#6366f1', fontWeight: 'bold'}}>{prod.barcode}</td>
                <td>{prod.name}</td>
                <td>{prod.categoryName || '---'}</td>
                <td>₺{prod.price?.toFixed(2)}</td>
                <td>{prod.threshold}</td>
                <td style={{fontWeight: 'bold', color: prod.quantity <= prod.threshold ? 'red' : 'inherit'}}>{prod.quantity}</td>
                <td style={{display: 'flex', gap: '5px', justifyContent: 'center'}}>
                  <input type="number" style={themeStyles.miniInput} defaultValue="1" onChange={(e) => setSellAmounts({...sellAmounts, [prod.id]: e.target.value})} />
                  <button onClick={() => handleSell(prod.id)} style={themeStyles.actionBtn}>Sat</button>
                  {isAdmin && <button onClick={() => handleDelete(prod.id)} style={{...themeStyles.actionBtn, background: '#ef4444'}}><FaTrash /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  searchBox: { background: '#fff', padding: '8px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e2e8f0' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', background: 'transparent', color: '#1e293b' },
  barcodeSection: { background: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #eef2ff' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: 1, background: 'transparent', color: '#1e293b' },
  sellBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  tableCard: { background: '#fff', borderRadius: '15px', overflow: 'hidden', border: '1px solid #f1f5f9' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  tr: { borderBottom: '1px solid #f8fafc' },
  miniInput: { width: '40px', textAlign: 'center', borderRadius: '4px', border: '1px solid #ccc', background: 'transparent', color: '#1e293b' },
  actionBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }
};

const darkStyles = {
  searchBox: { background: '#23232a', padding: '8px 15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #27272a' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', background: 'transparent', color: '#f4f4f5' },
  barcodeSection: { background: '#23232a', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #27272a' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #52525b', flex: 1, background: 'transparent', color: '#f4f4f5' },
  sellBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  tableCard: { background: '#23232a', borderRadius: '15px', overflow: 'hidden', border: '1px solid #27272a' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px', background: '#23232a', color: '#f4f4f5' },
  tr: { borderBottom: '1px solid #18181b' },
  miniInput: { width: '40px', textAlign: 'center', borderRadius: '4px', border: '1px solid #52525b', background: 'transparent', color: '#f4f4f5' },
  actionBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }
};