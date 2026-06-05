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
  
  // REVISI ROLE DINAMIS: Mengikuti session login murni di browser (sama dengan navbar/sidebar)
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('user_role') || 'engineer';
  }); 
  
  const [searchTerm, setSearchTerm] = useState('');

  // Sinkronisasi otomatis jika ada perubahan status peran di local storage browser
  useEffect(() => {
    const savedRole = localStorage.getItem('user_role');
    if (savedRole) setUserRole(savedRole);
  }, []);

  const handleCreateTicket = (asset) => {
    navigate('/create-ticket', { state: { asset: asset } });
  };

  // REVISI URUTAN DATA: Murni berdasarkan sisa masa pakai (RUL) terkecil ke terbesar
  const getSortedAndFilteredAssets = () => {
    let assets = [...currentAssets];

    // 1. Fitur Pencarian Mesin Real-time
    if (searchTerm) {
      assets = assets.filter(asset => 
        (asset.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.id || '').toString().includes(searchTerm)
      );
    }

    // 2. Logika Sortir Murni Berdasarkan RUL Terkecil (Early Warning System)
    return assets.sort((a, b) => {
      const rulA = parseFloat(a.rul_hours || a.rul || a.remaining_useful_life || 0);
      const rulB = parseFloat(b.rul_hours || b.rul || b.remaining_useful_life || 0);
      return rulA - rulB;
    });
  };

  const displayAssets = getSortedAndFilteredAssets();
  const critcalAlert = stat.find((a) => a.status === 'CRITICAL');

  return (
    <div className="p-6 space-y-6 min-h-screen">
      
      {/* REVISI HEADER: Menyesuaikan judul dan deskripsi teks 100% berdasarkan Role */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-stone-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {userRole === 'admin' ? 'Dashboard Utama Administrator' : 'Pusat Pemantauan Kerja Teknisi'}
          </h1>
          <p className="text-sm text-gray-500">
            {userRole === 'admin' 
              ? 'Pantau metrik kesehatan seluruh aset energi dan kelola data registrasi mesin operasional.' 
              : 'Pantau sisa masa pakai (RUL) sensor live mesin dan tindak lanjuti perintah perbaikan aktif Anda.'}
          </p>
        </div>
      </div>

      {/* Alert Utama berupa bar notifikasi prediktif (Hanya muncul jika ada mesin kritis) */}
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

      {/* BAR ACTIONS: FILTER STATUS & PENCARIAN MESIN */}
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

      {/* Layout Tabel Aset (Murni Berurutan Berdasarkan RUL Terkecil ke Terbesar) */}
      <div className="w-full space-y-4">
        <AssetTable 
          assets={displayAssets} 
          pagination={paginationProps} 
          userRole={userRole} // Melemparkan properti role ke dalam tabel jika dibutuhkan kontrol aksi
        />
      </div>
    </div>
  );
};

export default DashboardPage;