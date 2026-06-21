import React from 'react';
import { LayoutDashboard, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useDashboard from '../hooks/useDashboard';
import SummaryCard from '../components/dashboard/SummaryCard';
import TrendCard   from '../components/dashboard/TrendCard';
import AssetTable  from '../components/dashboard/AssetTable';

const DashboardPage = () => {
  const { user }                            = useAuth();
  const { dashboardData, isLoading, error } = useDashboard();

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <LayoutDashboard size={22} className="text-blue-500" />
        <div>
          <h1 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
            Dashboard Monitoring
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Selamat datang, <span className="font-semibold">{user?.name}</span>
            {' — '}
            <span className="font-semibold text-blue-500">{user?.role}</span>
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-64 gap-3 text-stone-400">
          <RefreshCw size={20} className="animate-spin" />
          <span className="text-sm font-medium">Memuat data analitik...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Konten */}
      {!isLoading && !error && dashboardData && (
        <>
          {/* 1. Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SummaryCard
              title="Total Mesin Industri"
              value={dashboardData.summary?.total_machines ?? 0}
              type="machines"
            />
            <SummaryCard
              title="Tiket Pemeliharaan Aktif"
              value={dashboardData.summary?.active_tickets ?? 0}
              type="tickets"
            />
          </div>

          {/* 2. Charts: status mesin, engineer, tiket, tren bulanan, jenis kerusakan */}
          <TrendCard
            machineStatus={dashboardData.machine_status          ?? []}
            engineerStatus={dashboardData.engineer_status        ?? []}
            ticketStatus={dashboardData.ticket_status            ?? []}
            monthlyMaintenance={dashboardData.monthly_maintenance ?? []}
            failureTypes={dashboardData.failure_types             ?? []}
          />

          {/* 3. Tabel bawah: mesin kritis, mesin paling sering rusak, tiket terbaru */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <AssetTable
              title="5 Mesin Paling Kritis (RUL Terendah)"
              data={dashboardData.critical_machines ?? []}
              type="critical"
            />
            <AssetTable
              title="5 Mesin Paling Sering Rusak"
              data={dashboardData.problematic_machines ?? []}
              type="problematic"
            />
            <div className="xl:col-span-2">
              <AssetTable
                title="10 Tiket Pemeliharaan Terbaru"
                data={dashboardData.latest_tickets ?? []}
                type="latest"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;