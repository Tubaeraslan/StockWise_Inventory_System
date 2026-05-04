import React, { useState } from 'react';

const ProductTable = ({ products, onSell, user }) => {
  const [sellAmounts, setSellAmounts] = useState({});
  const [selling, setSelling] = useState({});

  const handleSell = async (productId) => {
    const amount = parseInt(sellAmounts[productId], 10);
    if (!amount || amount <= 0) {
      alert('Geçerli bir miktar girin');
      return;
    }
    if (!user || !user.id) {
      alert('Kullanıcı bilgisi bulunamadı!');
      return;
    }
    setSelling(s => ({ ...s, [productId]: true }));
    try {
      await onSell(productId, amount, user.id);
      setSellAmounts(a => ({ ...a, [productId]: '' }));
    } catch (err) {
      alert('Satış hatası: ' + (err.response?.data?.message || err.message));
    } finally {
      setSelling(s => ({ ...s, [productId]: false }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ürün</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kategori</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Miktar</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Eşik</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Fiyat</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Durum</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Satış</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id} className={`border-t border-gray-200 ${prod.lowStock ? 'bg-red-50' : ''}`}>
              <td className="px-4 py-3 font-medium text-gray-900">{prod.name}</td>
              <td className="px-4 py-3 text-gray-700">{prod.categoryName}</td>
              <td className="px-4 py-3 text-right text-gray-700">{prod.quantity}</td>
              <td className="px-4 py-3 text-right text-gray-700">{prod.threshold}</td>
              <td className="px-4 py-3 text-right text-gray-700">₺{prod.price.toFixed(2)}</td>
              <td className="px-4 py-3 text-center">
                {prod.lowStock ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ⚠️ Düşük
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Normal
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="number"
                    min="1"
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sellAmounts[prod.id] || ''}
                    onChange={e => setSellAmounts(a => ({ ...a, [prod.id]: e.target.value }))}
                    disabled={selling[prod.id]}
                  />
                  <button
                    onClick={() => handleSell(prod.id)}
                    disabled={selling[prod.id]}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selling[prod.id] ? 'Satılıyor...' : 'Sat'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;