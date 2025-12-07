import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Crosshair,
  Thermometer,
  Wind,
  Clock,
} from 'lucide-react';
import {
  getDashboardSummary,
  getDashboardTrend,
  getDashboardStat,
  chatBot,
} from '../services/api.js';

// Components
import PredictiveAlertBar from '../components/dashboard/PredictiveAlertBar';
import SummaryCard from '../components/dashboard/SummaryCard';
import TrendCard from '../components/dashboard/TrendCard';
import FilterBar from '../components/dashboard/FilterBar';
import ChatInterface from '../components/dashboard/ChatInterface';
import CreateTicketPage from './CreateTicketPage.jsx';

// Internal Component for Table (could be moved to separate file later)
const AssetTable = ({ assets, onCreateTicket }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Nama Aset
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Health Score
            </th> */}
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Sensor Live
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              RUL
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {assets.map((asset) => (
            <tr
              key={asset.id}
              className={`
                ${
                  asset.status === 'CRITICAL'
                    ? 'bg-red-50 dark:bg-red-900/10'
                    : ''
                }
                ${
                  asset.status === 'WARNING'
                    ? 'bg-yellow-50 dark:bg-yellow-900/10'
                    : ''
                }
                hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
              `}
            >
              <td className="px-4 py-4 text-sm font-mono text-gray-900 dark:text-white">
                {asset.id}
              </td>
              <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {asset.name}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    asset.status === 'CRITICAL'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : ''
                  }
                  ${
                    asset.status === 'WARNING'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      : ''
                  }
                  ${
                    asset.status === 'NORMAL'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : ''
                  }
                `}
                >
                  {asset.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Thermometer className="w-3 h-3" />
                    <span>{asset.air_temperature}°C</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Wind className="w-3 h-3" />
                    <span>{asset.process_temperature}°C</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Crosshair className="w-3 h-3" />
                    <span>{asset.rotational_speed} RPM</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>${asset.rul_hours.toFixed(0)} Hours</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <button
                  onClick={() => onCreateTicket(asset)}
                  className="text-cyan-600 dark:text-cyan-400 hover:underline text-sm font-medium"
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
  const [summary, setSummary] = useState([]);
  const [trend, setTrend] = useState([]);
  const [stat, setStat] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [userChat, setUserChat] = useState([]);
  const [botChat, setBotChat] = useState([]);

  // Filter assets
  let filteredAssets = [...stat];
  if (statusFilter !== 'all') {
    const statusMap = {
      CRITICAL: 'CRITICAL',
      WARNING: 'WARNING',
      NORMAL: 'NORMAL',
    };
    filteredAssets = filteredAssets.filter(
      (a) => a.status === statusMap[statusFilter]
    );
  }

  // Reset page saat filter berubah
  useEffect(() => setCurrentPage(1), [statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleCreateTicket = (asset) => {
    setSelectedAsset(asset);
    setShowCreateTicket(true);
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

  const critcalAlert = stat.filter((a) => a.status === 'CRITICAL')[0];

  return (
    <div className="p-6">
      {critcalAlert && (
        <PredictiveAlertBar
          alert={critcalAlert}
          onCreateTicket={() => {
            setSelectedAsset(null);
            setShowCreateTicket(true);
          }}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summary.map((data, index) => (
          <SummaryCard
            key={index}
            title={data.title}
            value={data.value}
            icon={
              data.title === 'Total Aset'
                ? BarChart3
                : data.title === 'Normal'
                ? CheckCircle
                : data.title === 'Warning'
                ? AlertCircle
                : AlertTriangle
            }
            color={
              data.title === 'Total Aset'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : data.title === 'Normal'
                ? 'bg-gradient-to-br from-green-500 to-green-600'
                : data.title === 'Warning'
                ? 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                : 'bg-gradient-to-br from-red-500 to-red-600'
            }
            percentage={data.rate.toFixed(2)}
          />
        ))}
      </div>

      <div className="mb-6">
        <TrendCard data={trend} />
      </div>

      <FilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AssetTable
            assets={paginatedAssets}
            onCreateTicket={handleCreateTicket}
          />

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-4 text-sm">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-white bg-cyan-500 hover:bg-cyan-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &lt; Prev
            </button>

            <span className="px-3 py-2 text-white bg-cyan-500 rounded">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-white bg-cyan-500 hover:bg-cyan-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next &gt;
            </button>
          </div>
        </div>

        <div className="h-[600px]">
          <ChatInterface
            userChat={userChat}
            botChat={botChat}
            setUserChat={setUserChat}
            chatBotAnswer={chatBotAnswer}
          />
        </div>
      </div>

      {showCreateTicket && (
        <CreateTicketPage
          onClose={() => {
            setShowCreateTicket(false);
            setSelectedAsset(null);
          }}
          onSave={(ticketData) => {
            console.log('Ticket Data:', ticketData);
            alert('Tiket berhasil dibuat!');
            setShowCreateTicket(false);
            setSelectedAsset(null);
          }}
          selectedAsset={selectedAsset}
        />
      )}
    </div>
  );
};

export default Dashboard;
