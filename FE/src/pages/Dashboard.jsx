import React, { useState } from 'react';
import { BarChart3, CheckCircle, AlertCircle, AlertTriangle, Activity, Thermometer, Clock } from 'lucide-react';

// Components
import PredictiveAlertBar from '../components/dashboard/PredictiveAlertBar';
import SummaryCard from '../components/dashboard/SummaryCard';
import TrendCard from '../components/dashboard/TrendCard';
import FilterBar from '../components/dashboard/FilterBar';
import ChatInterface from '../components/dashboard/ChatInterface';
import CreateTicketPage from './CreateTicketPage';

// Data
import { dummyAssets, dummyCriticalAlert, dummyDashboardSummary, dummyTrendData } from '../Data/dummy';

// Internal Component for Table (could be moved to separate file later)
const AssetTable = ({ assets, onCreateTicket }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Nama Aset</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Health Score</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Sensor Live</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">RUL</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {assets.map((asset) => (
            <tr 
              key={asset.id}
              className={`
                ${asset.status === 'Risiko Tinggi' ? 'bg-red-50 dark:bg-red-900/10' : ''}
                ${asset.status === 'Perhatian' ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}
                hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
              `}
            >
              <td className="px-4 py-4 text-sm font-mono text-gray-900 dark:text-white">{asset.id}</td>
              <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{asset.name}</td>
              <td className="px-4 py-4">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                  ${asset.status === 'Risiko Tinggi' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : ''}
                  ${asset.status === 'Perhatian' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : ''}
                  ${asset.status === 'Optimal' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''}
                `}>
                  {asset.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{asset.healthScore}%</span>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        asset.healthScore < 50 ? 'bg-red-500' : 
                        asset.healthScore < 70 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${asset.healthScore}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Activity className="w-3 h-3" />
                    <span>{asset.vibration} mm/s</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Thermometer className="w-3 h-3" />
                    <span>{asset.temp}°C</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{asset.rul}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <button 
                  onClick={() => onCreateTicket(asset)}
                  className="text-cyan-600 dark:text-cyan-400 hover:underline text-sm font-medium"
                >
                  Buat Tiket
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score-asc');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  let filteredAssets = [...dummyAssets];

  if (statusFilter !== 'all') {
    const statusMap = {
      'high': 'Risiko Tinggi',
      'attention': 'Perhatian',
      'optimal': 'Optimal'
    };
    filteredAssets = filteredAssets.filter(a => a.status === statusMap[statusFilter]);
  }

  if (sortBy === 'score-asc') {
    filteredAssets.sort((a, b) => a.healthScore - b.healthScore);
  } else if (sortBy === 'score-desc') {
    filteredAssets.sort((a, b) => b.healthScore - a.healthScore);
  } else if (sortBy === 'name') {
    filteredAssets.sort((a, b) => a.name.localeCompare(b.name));
  }

  const handleCreateTicket = (asset) => {
    setSelectedAsset(asset);
    setShowCreateTicket(true);
  };

  const handleSaveTicket = (ticketData) => {
    console.log('Ticket Data:', ticketData);
    console.log('Selected Asset:', selectedAsset);
    alert('Tiket berhasil dibuat!');
    setShowCreateTicket(false);
    setSelectedAsset(null);
  };

  return (
    <div className="p-6">
      {/* Critical Alert */}
      {dummyCriticalAlert && (
        <PredictiveAlertBar 
          alert={dummyCriticalAlert}
          onCreateTicket={() => {
            setSelectedAsset(null);
            setShowCreateTicket(true);
          }}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Aset"
          value={dummyDashboardSummary.totalAssets}
          icon={BarChart3}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          percentage={100}
        />
        <SummaryCard
          title="Optimal"
          value={dummyDashboardSummary.optimal}
          icon={CheckCircle}
          color="bg-gradient-to-br from-green-500 to-green-600"
          percentage={Math.round((dummyDashboardSummary.optimal / dummyDashboardSummary.totalAssets) * 100)}
        />
        <SummaryCard
          title="Perhatian"
          value={dummyDashboardSummary.attention}
          icon={AlertCircle}
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          percentage={Math.round((dummyDashboardSummary.attention / dummyDashboardSummary.totalAssets) * 100)}
        />
        <SummaryCard
          title="Risiko Tinggi"
          value={dummyDashboardSummary.highRisk}
          icon={AlertTriangle}
          color="bg-gradient-to-br from-red-500 to-red-600"
          percentage={Math.round((dummyDashboardSummary.highRisk / dummyDashboardSummary.totalAssets) * 100)}
        />
      </div>

      {/* Trend Chart */}
      <div className="mb-6">
        <TrendCard data={dummyTrendData} />
      </div>

      {/* Filter Bar */}
      <FilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Main Content: Asset Table + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AssetTable 
            assets={filteredAssets} 
            onCreateTicket={handleCreateTicket}
          />
        </div>
        <div className="h-[600px]">
          <ChatInterface />
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateTicket && (
        <CreateTicketPage 
          onClose={() => {
            setShowCreateTicket(false);
            setSelectedAsset(null);
          }}
          onSave={handleSaveTicket}
          selectedAsset={selectedAsset}
        />
      )}
    </div>
  );
};

export default Dashboard;