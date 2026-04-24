import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, CheckCircle, AlertCircle, AlertTriangle,
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

  const handleCreateTicket = (asset) => {
    navigate('/create-ticket', { state: { asset: asset } });
  };

  const critcalAlert = stat.find((a) => a.status === 'CRITICAL');

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

export default DashboardPage;