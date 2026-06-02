import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, CheckCircle, AlertCircle, AlertTriangle, Search, Plus 
} from 'lucide-react';

// Components
import PredictiveAlertBar from '../components/dashboard/PredictiveAlertBar';
import SummaryCard from '../components/dashboard/SummaryCard';
import TrendCard from '../components/dashboard/TrendCard';
import FilterBar from '../components/dashboard/FilterBar';
import AssetTable from '../components/dashboard/AssetTable';

// Hooks
import useDashboard from '../hooks/useDashboard';
import useDashboardFilter from '../hooks/useDashboardFilter';

const DashboardPage = () => {
  const navigate = useNavigate(); 
  const { summary, trend, stat } = useDashboard();
  const { statusFilter, setStatusFilter, currentAssets, paginationProps } = useDashboardFilter(stat);
  
  // 1. Ambil Role Pengguna (Membaca dari App.jsx / localStorage tiruan)
  // Untuk mencoba, Anda bisa mengubah default value ini secara manual 'admin' atau 'engineer'
  const [userRole, setUserRole] = useState('admin'); 
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateTicket = (asset) => {
    navigate('/create-ticket', { state: { asset: asset } });
  };

  // 2. FILTER & SORTING BERDASARKAN URGENSI (Saran Industri)
  // Mengurutkan asset: CRITICAL -> WARNING -> NORMAL
// Ganti fungsi ini di dalam src/pages/DashboardPage.jsx
  const getSortedAndFilteredAssets = () => {
    let assets = [...currentAssets];

    // 1. Fitur Pencarian Mesin
    if (searchTerm) {
      assets = assets.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.id.toString().includes(searchTerm)
      );
    }

    // 2. Pengurutan Ganda: Berdasarkan Status UTAMA, lalu Berdasarkan RUL TERKECIL
    const statusPriority = { 'CRITICAL': 1, 'WARNING': 2, 'NORMAL': 3 };
    
    return assets.sort((a, b) => {
      const priorityA = statusPriority[a.status] || 4;
      const priorityB = statusPriority[b.status] || 4;

      // Jika statusnya berbeda (misal Critical vs Warning), urutkan berdasarkan status
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // JIKA STATUSNYA SAMA (seperti di gambar Anda), urutkan berdasarkan RUL terkecil di paling atas
      return a.rul_hours - b.rul_hours;
    });
  };

  const displayAssets = getSortedAndFilteredAssets();
  const critcalAlert = stat.find((a) => a.status === 'CRITICAL');

  return (
    <div className="p-6 space-y-6 min-h-screen">
      
      {/* HEADER DYNAMIC BERDASARKAN ROLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-stone-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard Admin {userRole === 'admin' ? '(Admin Mode)' : '(Engineer Mode)'}
          </h1>
          <p className="text-sm text-gray-500">
            {userRole === 'admin' 
              ? 'Pantau kesehatan seluruh aset energi dan kelola registrasi mesin.' 
              : 'Pantau jadwal perbaikan dan kondisi sensor live mesin tugas Anda.'}
          </p>
        </div>
      </div>

      {/* Alert Utama jika ada kondisi kritis */}
      {critcalAlert && (
        <PredictiveAlertBar
          alert={critcalAlert}
          onCreateTicket={() => handleCreateTicket(critcalAlert)}
        />
      )}

      {/* Grid Kartu Ringkasan (Summary Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((data, index) => (
          <SummaryCard
            key={index}
            title={data.title}
            value={data.value}
            icon={
              data.title === 'Total Aset' ? BarChart3 : 
              data.title === 'Normal' ? CheckCircle : 
              data.title === 'Warning' ? AlertCircle : AlertTriangle
            }
            color={
              data.title === 'Total Aset' ? 'bg-blue-500' : 
              data.title === 'Normal' ? 'bg-green-500' : 
              data.title === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
            }
            percentage={(Number(data.rate) || 0).toFixed(2)}
          />
        ))}
      </div>

      {/* Grafik Tren (Trend Card) */}
      <TrendCard data={trend} />

      {/* BAR ACTIONS: FILTER STATUS & PENCARIAN MESIN BARU */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 rounded-xl border border-gray-200 dark:border-stone-800 shadow-sm">
        <FilterBar statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
        
        {/* Fitur Pencarian Mesin Real-time */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Cari mesin berdasarkan nama/ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-stone-700 bg-gray-50 dark:bg-stone-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Layout Tabel Aset (Sudah Ter-sorting & Ter-filter) */}
      <div className="w-full space-y-4">
        <AssetTable 
          assets={displayAssets} 
          pagination={paginationProps} 
        />
      </div>
    </div>
  );
};

export default DashboardPage;