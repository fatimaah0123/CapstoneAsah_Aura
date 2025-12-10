import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, CheckCircle, AlertCircle, AlertTriangle,
  Crosshair, Thermometer, Clock, ChevronLeft, ChevronRight // Tambahkan Icon Pagination
} from 'lucide-react';
import {
  getDashboardSummary, getDashboardTrend, getDashboardStat, chatBot,
} from '../services/api.js';

// Components
import PredictiveAlertBar from '../components/dashboard/PredictiveAlertBar';
import SummaryCard from '../components/dashboard/SummaryCard';
import TrendCard from '../components/dashboard/TrendCard';
import FilterBar from '../components/dashboard/FilterBar';
import ChatInterface from '../components/dashboard/ChatInterface';

// Internal Component for Table with Pagination Footer
const AssetTable = ({ assets, onCreateTicket, pagination }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    {/* Table Content */}
    <div className="overflow-x-auto min-h-[300px]">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Nama Aset</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Sensor Live</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">RUL</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {assets.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-gray-500 text-sm">Tidak ada data aset ditemukan.</td>
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
                <td className="px-4 py-4">
                  <button
                    onClick={() => onCreateTicket(asset)}
                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
                  >
                    Buat Jadwal
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Integrated Pagination Footer (Sama seperti TicketsPage) */}
    {pagination.total > 0 && (
      <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Info Data */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <span className="font-bold text-gray-900 dark:text-white">{pagination.from}</span> - <span className="font-bold text-gray-900 dark:text-white">{pagination.to}</span> dari <span className="font-bold text-gray-900 dark:text-white">{pagination.total}</span> data
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={pagination.onPrev}
            disabled={pagination.currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} />
            Sebelumnya
          </button>

          {/* Page Numbers */}
          <div className="hidden md:flex gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => pagination.onPageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition ${
                    pagination.currentPage === page 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
            ))}
          </div>

          <button 
            onClick={pagination.onNext}
            disabled={pagination.currentPage === pagination.totalPages}
            className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Selanjutnya
            <ChevronRight size={16} />
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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Tetap 5 data per halaman
  
  // Chatbot State
  const [userChat, setUserChat] = useState([]);
  const [botChat, setBotChat] = useState([]);

  const handleCreateTicket = (asset) => {
    navigate('/create-ticket', { state: { asset: asset } });
  };

  const chatBotAnswer = async (question) => {
    try {
      const data = await chatBot(question);
      setBotChat((prev) => [...prev, data.answer]);
    } catch (error) {
      console.error('Error fetching chatbot answer:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await getDashboardSummary();
        setSummary(summaryData.data);
        const trendData = await getDashboardTrend();
        setTrend(trendData.data);
        const statData = await getDashboardStat();
        setStat(statData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  let filteredAssets = [...stat];
  if (statusFilter !== 'all') {
    const statusMap = { CRITICAL: 'CRITICAL', WARNING: 'WARNING', NORMAL: 'NORMAL' };
    filteredAssets = filteredAssets.filter((a) => a.status === statusMap[statusFilter]);
  }

  // Pagination Logic (Calculations)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handlePageChange = (page) => setCurrentPage(page);

  // Reset page to 1 if filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const critcalAlert = stat.find((a) => a.status === 'CRITICAL');

  // Pagination Props Object
  const paginationProps = {
    currentPage,
    totalPages,
    from: filteredAssets.length === 0 ? 0 : indexOfFirstItem + 1,
    to: Math.min(indexOfLastItem, filteredAssets.length),
    total: filteredAssets.length,
    onNext: goToNextPage,
    onPrev: goToPrevPage,
    onPageChange: handlePageChange
  };

  return (
    <div className="p-6 space-y-6">
      {critcalAlert && (
        <PredictiveAlertBar
          alert={critcalAlert}
          onCreateTicket={() => handleCreateTicket(critcalAlert)}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((data, index) => (
          <SummaryCard
            key={index}
            title={data.title}
            value={data.value}
            icon={data.title === 'Total Aset' ? BarChart3 : data.title === 'Normal' ? CheckCircle : data.title === 'Warning' ? AlertCircle : AlertTriangle}
            color={data.title === 'Total Aset' ? 'bg-blue-500' : data.title === 'Normal' ? 'bg-green-500' : data.title === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'}
            percentage={data.rate.toFixed(2)}
          />
        ))}
      </div>

      <TrendCard data={trend} />

      <FilterBar statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Table with Integrated Pagination */}
          <AssetTable 
            assets={currentAssets} 
            onCreateTicket={handleCreateTicket} 
            pagination={paginationProps} 
          />
        </div>

        <div className="h-[600px]">
          <ChatInterface userChat={userChat} botChat={botChat} setUserChat={setUserChat} chatBotAnswer={chatBotAnswer} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;