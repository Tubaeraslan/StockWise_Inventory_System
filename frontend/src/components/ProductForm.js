import React, { useState } from 'react';

const ProductForm = ({ categories, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    threshold: '',
    price: '',
    categoryId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.threshold || !formData.price || !formData.categoryId) {
      alert('Tüm alanlar gerekli');
      return;
    }
    try {
      await onSubmit({
        name: formData.name,
        quantity: parseInt(formData.quantity),
        threshold: parseInt(formData.threshold),
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
      });
      setFormData({
        name: '',
        quantity: '',
        threshold: '',
        price: '',
        categoryId: ''
      });
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Yeni Ürün Ekle / Stok Yenile</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Ürün adı"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Kategori Seç</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Miktar"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="threshold"
            placeholder="Minimum stok"
            value={formData.threshold}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Fiyat"
            value={formData.price}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '⏳ Ekleniyor...' : '✅ Ürün Ekle'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;