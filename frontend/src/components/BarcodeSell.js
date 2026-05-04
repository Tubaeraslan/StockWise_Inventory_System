import React, { useState } from 'react';

const BarcodeSell = ({ onSell, submitting }) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeAmount, setBarcodeAmount] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    try {
      await onSell(barcodeInput.trim(), barcodeAmount);
      setBarcodeInput('');
      setBarcodeAmount(1);
    } catch (err) {
      alert('Barkod satış hatası: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Barkod ile Satış</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          placeholder="Barkod okut (veya gir)"
          value={barcodeInput}
          onChange={e => setBarcodeInput(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
        <input
          type="number"
          min="1"
          value={barcodeAmount}
          onChange={e => setBarcodeAmount(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Satılıyor...' : 'Satış'}
        </button>
      </form>
    </div>
  );
};

export default BarcodeSell;