import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket, AlertCircle, Clock, FileCheck,
  CheckCircle2, RefreshCw, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useTickets from '../hooks/useTickets';
import TicketStatusBadge from '../components/ticket/TicketStatusBadge';
import AssignModal from '../components/ticket/AssignModal';

// ─── Status resmi dari API ────────────────────────────────────────────────────
// WaitingAssignment | Assigned | InProgress | WaitingApproval | Done

// ─── Tab config per role ──────────────────────────────────────────────────────
const ADMIN_TABS = [
  { key: 'WaitingAssignment', label: 'Belum Ditugaskan', icon: AlertCircle,  color: 'text-yellow-600 border-yellow-500 bg-yellow-50/40' },
  { key: 'Assigned',          label: 'Ditugaskan',       icon: Clock,        color: 'text-purple-600 border-purple-500 bg-purple-50/40' },
  { key: 'InProgress',        label: 'Sedang Dikerjakan',icon: Clock,        color: 'text-blue-600   border-blue-500   bg-blue-50/40'   },
  { key: 'WaitingApproval',   label: 'Review Laporan',   icon: FileCheck,    color: 'text-orange-600 border-orange-500 bg-orange-50/40' },
  { key: 'Done',              label: 'Selesai',          icon: CheckCircle2, color: 'text-green-600  border-green-500  bg-green-50/40'  },
];

const ENGINEER_TABS = [
  { key: 'Assigned',        label: 'Ditugaskan',         icon: Clock,        color: 'text-purple-600 border-purple-500 bg-purple-50/40' },
  { key: 'InProgress',      label: 'Sedang Dikerjakan',  icon: Clock,        color: 'text-blue-600   border-blue-500   bg-blue-50/40'   },
  { key: 'WaitingApproval', label: 'Menunggu Approval',  icon: AlertCircle,  color: 'text-orange-600 border-orange-500 bg-orange-50/40' },
  { key: 'Done',            label: 'Selesai',            icon: CheckCircle2, color: 'text-green-600  border-green-500  bg-green-50/40'  },
];

// ─── Format tanggal ───────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ─── TicketsPage ──────────────────────────────────────────────────────────────
const TicketsPage = () => {
  const navigate              = useNavigate();
  const { isAdmin }           = useAuth();
  const { tickets, isLoading, error, handleAssign, handleApprove } = useTickets();

  const tabs        = isAdmin ? ADMIN_TABS : ENGINEER_TABS;
  const defaultTab  = isAdmin ? 'WaitingAssignment' : 'Assigned';
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Assign modal state
  const [assignTarget, setAssignTarget]   = useState(null);
  const [isAssigning, setIsAssigning]     = useState(false);
  const [assignError, setAssignError]     = useState('');

  // Filter tiket berdasarkan tab aktif
  const filtered = tickets.filter((t) => t.status === activeTab);

  // Hitung badge count per tab
  const countByStatus = (status) => tickets.filter((t) => t.status === status).length;

  // ── Assign handler ───────────────────────────────────────────────────────
  const onAssignConfirm = async (ticketId, engineerId) => {
    setIsAssigning(true);
    setAssignError('');
    try {
      await handleAssign(ticketId, engineerId);
      setAssignTarget(null);
      setActiveTab('Assigned'); // pindah ke tab Assigned setelah berhasil
    } catch (err) {
      setAssignError(err.response?.data?.message || 'Gagal menugaskan engineer.');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
          <Ticket size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
            Tiket Pemeliharaan
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {isAdmin ? 'Kelola alur kerja perbaikan mesin industri' : 'Daftar tiket yang ditugaskan kepada Anda'}
          </p>
        </div>
      </div>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex items-center justify-center h-48 gap-3 text-stone-400">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm">Memuat data tiket...</span>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* ── Tab navigasi ────────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-1 border-b border-stone-200 dark:border-stone-800">
            {tabs.map(({ key, label, icon: Icon, color }) => {
              const isActive = activeTab === key;
              const count    = countByStatus(key);
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-xl border-b-2 transition-all relative ${
                    isActive
                      ? `${color} border-current`
                      : 'text-stone-500 dark:text-stone-400 border-transparent hover:text-stone-700 dark:hover:text-white'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                  {count > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-current/20' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── List tiket ──────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div className="bg-stone-50 dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center">
              <p className="text-stone-400 text-sm">Tidak ada tiket di kategori ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">

                    {/* Info kiri */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <TicketStatusBadge status={ticket.status} size="sm" />
                        <span className="text-xs text-stone-400 font-mono">#{ticket.id}</span>
                      </div>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                        {ticket.machine_name}
                      </h3>
                      <p className="text-xs text-stone-400 mt-0.5">{ticket.type}</p>
                    </div>

                    {/* Info kanan */}
                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-xs text-stone-400">{formatDate(ticket.created_at)}</p>
                      {ticket.engineer_name ? (
                        <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                          {ticket.engineer_name}
                        </p>
                      ) : (
                        <p className="text-xs text-stone-300 italic">Belum ditugaskan</p>
                      )}
                    </div>

                    <ChevronRight size={16} className="text-stone-300 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
                  </div>

                  {/* Tombol aksi inline — hanya Admin di tab WaitingAssignment */}
                  {isAdmin && ticket.status === 'WaitingAssignment' && (
                    <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); setAssignTarget(ticket); }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Tugaskan Engineer
                      </button>
                    </div>
                  )}

                  {/* Tombol approve inline — Admin di tab WaitingApproval */}
                  {isAdmin && ticket.status === 'WaitingApproval' && (
                    <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleApprove(ticket.id); }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        <CheckCircle2 size={13} /> Setujui
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Assign Modal ─────────────────────────────────────────────────── */}
      {assignTarget && (
        <AssignModal
          ticket={assignTarget}
          onConfirm={onAssignConfirm}
          onClose={() => { setAssignTarget(null); setAssignError(''); }}
          isSubmitting={isAssigning}
        />
      )}
      {assignError && (
        <div className="fixed bottom-4 right-4 z-50 px-4 py-3 bg-red-600 text-white text-sm rounded-xl shadow-lg">
          {assignError}
        </div>
      )}

    </div>
  );
};

export default TicketsPage;