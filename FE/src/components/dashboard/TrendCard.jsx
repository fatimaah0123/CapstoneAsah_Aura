import React from 'react';
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ─── Palet warna ──────────────────────────────────────────────────────────────
const PIE_COLORS   = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
const STATUS_COLOR = {
  Active:      '#10b981',
  Maintenance: '#f59e0b',
  Onduty:      '#3b82f6',
  Done:        '#10b981',
  InProgress:  '#3b82f6',
  Assigned:    '#8b5cf6',
  WaitingAssignment: '#f59e0b',
  WaitingApproval:   '#f97316',
};
const FAILURE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16'];

// ─── Helper: format label bulan dari ISO date string ─────────────────────────
const formatMonth = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
};

// ─── Sub-komponen kartu chart ─────────────────────────────────────────────────
const ChartCard = ({ title, children }) => (
  <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 shadow-sm">
    <h4 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-4">{title}</h4>
    {children}
  </div>
);

// ─── TrendCard utama ──────────────────────────────────────────────────────────
// Props yang diterima (semua langsung dari dashboardData):
//   machineStatus      → array [{ status, total }]
//   engineerStatus     → array [{ status, total }]
//   ticketStatus       → array [{ status, total }]
//   monthlyMaintenance → array [{ month, total }]  (month = ISO date)
//   failureTypes       → array [{ type, total }]   (jenis kerusakan)

const TrendCard = ({
  machineStatus      = [],
  engineerStatus     = [],
  ticketStatus       = [],
  monthlyMaintenance = [],
  failureTypes       = [],
}) => {

  // Normalkan angka (BE mengembalikan total sebagai string)
  const normalize = (arr) =>
    arr.map((item) => ({ ...item, total: Number(item.total) }));

  const machineData  = normalize(machineStatus);
  const engineerData = normalize(engineerStatus);
  const ticketData   = normalize(ticketStatus);
  const monthlyData  = normalize(monthlyMaintenance).map((item) => ({
    ...item,
    bulan: formatMonth(item.month),
  }));
  // Urutkan failure types dari yang paling sering, ambil maksimal 6 agar chart tidak terlalu panjang
  const failureData  = normalize(failureTypes)
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {/* 1. Status Mesin — Pie Chart */}
      <ChartCard title="Status Mesin">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={machineData}
              dataKey="total"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
            >
              {machineData.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLOR[entry.status] || PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => [val, 'Jumlah']} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 2. Status Engineer — Pie Chart */}
      <ChartCard title="Status Engineer">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={engineerData}
              dataKey="total"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
            >
              {engineerData.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLOR[entry.status] || PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => [val, 'Jumlah']} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 3. Status Tiket — Bar Chart */}
      <ChartCard title="Distribusi Status Tiket">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ticketData} margin={{ top: 4, right: 8, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="status"
              tick={{ fontSize: 10 }}
              angle={-20}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(val) => [val, 'Tiket']} />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {ticketData.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLOR[entry.status] || '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 4. Tren Bulanan — Line Chart */}
      <ChartCard title="Tren Pemeliharaan Bulanan">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyData} margin={{ top: 4, right: 8, left: -10, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(val) => [val, 'Tiket']} />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              name="Jumlah Tiket"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 5. Jenis Kerusakan — Horizontal Bar Chart (full width) */}
      <div className="md:col-span-2">
        <ChartCard title="Jenis Kerusakan Paling Sering Terjadi">
          {failureData.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm text-stone-400">
              Belum ada data jenis kerusakan.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(180, failureData.length * 42)}>
              <BarChart
                data={failureData}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="type"
                  tick={{ fontSize: 11 }}
                  width={160}
                />
                <Tooltip formatter={(val) => [val, 'Kejadian']} />
                <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={22}>
                  {failureData.map((entry, i) => (
                    <Cell key={i} fill={FAILURE_COLORS[i % FAILURE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

    </div>
  );
};

export default TrendCard;