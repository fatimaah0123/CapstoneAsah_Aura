import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, CheckCircle, AlertCircle, AlertTriangle,
  Crosshair, Thermometer, Clock, ChevronLeft, ChevronRight,
  Activity
} from 'lucide-react';
import {
  getDashboardSummary, getDashboardTrend, getDashboardStat,
} from '../services/api.js'; // Membuang import chatBot

// Components
import PredictiveAlertBar from '../components/dashboard/PredictiveAlertBar';
import SummaryCard from '../components/dashboard/SummaryCard';
import TrendCard from '../components/dashboard/TrendCard';
import FilterBar from '../components/dashboard/FilterBar';
// ChatInterface tidak lagi diimport di sini

const AssetTable = ({ assets, pagination }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
    <div className="overflow-x-auto min-h-[300px]">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Nama Aset</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Sensor Live</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">RUL</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {assets.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-8 text-center text-gray-500 text-sm">Tidak ada data aset ditemukan.</td>
            </tr>
          ) : (
            assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-4 text-sm font-mono text-gray-900 dark:text-white">{asset.id}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{asset.name}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                    ${asset.status === 'CRITICAL' ? 'bg-red-100 text-red-700' : 
                      asset.status === 'WARNING' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2"><Thermometer className="w-3 h-3" /> {asset.air_temperature}°C</div>
                    <div className="flex items-center gap-2"><Crosshair className="w-3 h-3" /> {asset.rotational_speed} RPM</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{asset.rul_hours.toFixed(0)} Hours</span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    {pagination.total > 0 && (
      <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <span className="font-bold text-gray-900 dark:text-white">{pagination.from}</span> - <span className="font-bold text-gray-900 dark:text-white">{pagination.to}</span> dari <span className="font-bold text-gray-900 dark:text-white">{pagination.total}</span> data
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={pagination.onPrev}
            disabled={pagination.currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} /> Sebelumnya
          </button>
          <button 
            onClick={pagination.onNext}
            disabled={pagination.currentPage === pagination.totalPages}
            className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Selanjutnya <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate(); 
  const [summary, setSummary] = useState([]);
  const [trend, setTrend] = useState([]);
  const [stat, setStat] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  // State chatBotAnswer, userChat, dan botChat telah dihapus

  const handleCreateTicket = (asset) => {
    navigate('/create-ticket', { state: { asset: asset } });
  };

  // Fungsi chatBotAnswer telah dihapus

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await getDashboardSummary();
        setSummary(summaryData.data);
        
        const trendData = await getDashboardTrend();
        // Debug: Cek di console browser apakah trendData.data adalah Array
        console.log("Trend Data API:", trendData.data); 
        setTrend(trendData.data || []); // Pastikan fallback ke array kosong
        
        const statData = await getDashboardStat();
        setStat(statData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  let filteredAssets = [...stat];
  if (statusFilter !== 'all') {
    const statusMap = { CRITICAL: 'CRITICAL', WARNING: 'WARNING', NORMAL: 'NORMAL' };
    filteredAssets = filteredAssets.filter((a) => a.status === statusMap[statusFilter]);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const critcalAlert = stat.find((a) => a.status === 'CRITICAL');

  const paginationProps = {
    currentPage,
    totalPages,
    from: filteredAssets.length === 0 ? 0 : indexOfFirstItem + 1,
    to: Math.min(indexOfLastItem, filteredAssets.length),
    total: filteredAssets.length,
    onNext: goToNextPage,
    onPrev: goToPrevPage,
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
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

      {/* Bar Filter Status */}
      <FilterBar statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      {/* Layout Tabel Aset - SEKARANG FULL WIDTH */}
      <div className="w-full space-y-4">
        <AssetTable 
          assets={currentAssets} 
          pagination={paginationProps} 
        />
      </div>
      {/* Container h-[600px] untuk ChatInterface telah dihapus */}
    </div>
  );
};

export default Dashboard;