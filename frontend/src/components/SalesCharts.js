import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export function SalesBarChart({ data }) {
  const chartData = {
    labels: data.map(item => item.productName),
    datasets: [
      {
        label: 'Toplam Satış',
        data: data.map(item => item.totalSold),
        backgroundColor: '#667eea',
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Ürün Satışları (Çubuk Grafik)' },
    },
  };
  return <Bar data={chartData} options={options} />;
}

export function SalesPieChart({ data }) {
  const chartData = {
    labels: data.map(item => item.productName),
    datasets: [
      {
        label: 'Toplam Satış',
        data: data.map(item => item.totalSold),
        backgroundColor: [
          '#667eea', '#48bb78', '#f56565', '#ecc94b', '#ed8936', '#38b2ac', '#a0aec0', '#805ad5', '#f6ad55', '#e53e3e'
        ],
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Ürün Satışları (Pasta Grafik)' },
    },
  };
  return <Pie data={chartData} options={options} />;
}
