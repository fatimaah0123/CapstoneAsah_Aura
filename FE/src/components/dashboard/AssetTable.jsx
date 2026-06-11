import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, ArrowRight, CheckCircle, Loader, UserCheck } from 'lucide-react';

// ─── Badge status tiket ───────────────────────────────────────────────────────
const STATUS_STYLE = {
  WaitingAssignment: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Assigned:          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  InProgress:        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  WaitingApproval:   'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Done:              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[status] || 'bg-stone-100 text-stone-600'}`}>
    {status}
  </span>
);

// ─── Format tanggal ───────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

// ─── AssetTable ───────────────────────────────────────────────────────────────
// Props:
//   title → string judul tabel
//   data  → array dari API
//   type  → 'critical' | 'latest'
//
// type='critical' → data = critical_machines: [{ id, name, rul_days }]
// type='latest'   → data = latest_tickets:    [{ id, status, machine_name, type, engineer_name, created_at }]

const AssetTable = ({ title, data = [], type = 'critical' }) => {
  const navigate = useNavigate();

  const isEmpty = !data || data.length === 0;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
        {type === 'critical'
          ? <AlertTriangle size={16} className="text-red-500" />
          : <Clock size={16} className="text-blue-500" />
        }
        <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">{title}</h3>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full">

          {/* Header kolom */}
          <thead className="bg-stone-50 dark:bg-stone-800/50 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
            <tr>
              {type === 'critical' ? (
                <>
                  <th className="px-5 py-3 text-left">Nama Mesin</th>
                  <th className="px-5 py-3 text-left">RUL (Hari)</th>
                  <th className="px-5 py-3 text-center">Detail</th>
                </>
              ) : (
                <>
                  <th className="px-5 py-3 text-left">Mesin</th>
                  <th className="px-5 py-3 text-left">Jenis</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Engineer</th>
                  <th className="px-5 py-3 text-left">Tanggal</th>
                  <th className="px-5 py-3 text-center">Detail</th>
                </>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {isEmpty ? (
              <tr>
                <td
                  colSpan={type === 'critical' ? 3 : 6}
                  className="px-5 py-8 text-center text-sm text-stone-400"
                >
                  Tidak ada data.
                </td>
              </tr>
            ) : type === 'critical' ? (
              // ── Baris untuk critical_machines ──
              data.map((machine) => {
                const isUrgent = machine.rul_days <= 3;
                return (
                  <tr
                    key={machine.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/tickets?machine=${machine.id}`)}
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-stone-800 dark:text-stone-200 group-hover:text-blue-600 transition-colors">
                      {machine.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-bold ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                        {Number(machine.rul_days).toFixed(1)} hari
                      </span>
                      {isUrgent && (
                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                          Kritis!
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button className="p-1.5 rounded-lg text-stone-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-stone-700 transition-all">
                        <ArrowRight size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              // ── Baris untuk latest_tickets ──
              data.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <td className="px-5 py-3.5 text-sm font-medium text-stone-800 dark:text-stone-200 group-hover:text-blue-600 transition-colors">
                    {ticket.machine_name}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-stone-500 dark:text-stone-400 max-w-[120px] truncate">
                    {ticket.type}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-stone-500 dark:text-stone-400">
                    {ticket.engineer_name || <span className="italic">Belum ditugaskan</span>}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-stone-500 dark:text-stone-400 whitespace-nowrap">
                    {formatDate(ticket.created_at)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button className="p-1.5 rounded-lg text-stone-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-stone-700 transition-all">
                      <ArrowRight size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTable;