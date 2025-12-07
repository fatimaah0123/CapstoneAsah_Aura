import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, CheckCircle, AlertCircle, AlertTriangle,
  Crosshair, Thermometer, Wind, Clock,
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

// Internal Component for Table
const AssetTable = ({ assets, onCreateTicket }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
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
          {assets.map((asset) => (
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
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate(); // Hook untuk navigasi
  const [summary, setSummary] = useState([]);
  const [trend, setTrend] = useState([]);
  const [stat, setStat] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Chatbot State
  const [userChat, setUserChat] = useState([]);
  const [botChat, setBotChat] = useState([]);

  // --- LOGIC NAVIGASI KE CREATE TICKET ---
  const handleCreateTicket = (asset) => {
    // Navigasi ke halaman create-ticket sambil membawa data asset di state
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

  // Filter & Pagination Logic
  let filteredAssets = [...stat];
  if (statusFilter !== 'all') {
    const statusMap = { CRITICAL: 'CRITICAL', WARNING: 'WARNING', NORMAL: 'NORMAL' };
    filteredAssets = filteredAssets.filter((a) => a.status === statusMap[statusFilter]);
  }
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const critcalAlert = stat.find((a) => a.status === 'CRITICAL');

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
          <AssetTable assets={paginatedAssets} onCreateTicket={handleCreateTicket} />
          
          {/* Simple Pagination */}
          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200">
            <button onClick={() => setCurrentPage(c => Math.max(1, c - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 text-sm">Prev</button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50 text-sm">Next</button>
          </div>
        </div>

        <div className="h-[600px]">
          <ChatInterface userChat={userChat} botChat={botChat} setUserChat={setUserChat} chatBotAnswer={chatBotAnswer} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;