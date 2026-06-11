import React from 'react';
import {
  Calendar, AlertTriangle, Cpu, Activity, Clock,
  UserCheck, Play, CheckCircle, Send, ShieldCheck,
  Loader2,
} from 'lucide-react';
import TicketStatusBadge from './TicketStatusBadge';
import { useAuth } from '../../context/AuthContext';

// ─── Helper ───────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
};

const InfoRow = ({ label, value, className = '' }) => (
  <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
    <p className="text-xs text-stone-400 font-medium mb-1">{label}</p>
    <p className={`text-sm font-semibold text-stone-800 dark:text-stone-200 ${className}`}>{value || '—'}</p>
  </div>
);

const PriorityBadge = ({ priority }) => {
  const config = {
    High:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Low:    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${config[priority] || config.Medium}`}>
      {priority || 'Medium'}
    </span>
  );
};

// ─── TicketDetailCard ─────────────────────────────────────────────────────────
// Props:
//   ticket         → TicketDetailData dari API
//   actionLoading  → boolean
//   onAssignClick  → fn() buka AssignModal (Admin, status WaitingAssignment)
//   onStart        → fn() mulai kerja (Engineer, status Assigned)
//   onSubmitClick  → fn() buka SubmitReportModal (Engineer, status InProgress)
//   onApprove      → fn() approve (Admin, status WaitingApproval)

const TicketDetailCard = ({
  ticket,
  actionLoading,
  onAssignClick,
  onStart,
  onSubmitClick,
  onApprove,
}) => {
  const { isAdmin, user } = useAuth();
  const status = ticket.status;

  // Engineer hanya boleh aksi pada tiket yang ditugaskan ke dirinya
  const isMyTicket = !isAdmin && ticket.assigned_engineer_id === user?.id;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="p-6 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <TicketStatusBadge status={status} />
              <PriorityBadge priority={ticket.priority} />
              <span className="text-xs text-stone-400 font-mono">#{ticket.id}</span>
            </div>
            <h1 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
              {ticket.machine_name}
            </h1>
            <p className="text-sm text-stone-500 mt-1">{ticket.type}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Calendar size={13} />
            {formatDate(ticket.created_at)}
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="p-6 space-y-5">

        {/* Grid info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <InfoRow label="RUL (Jam)"  value={ticket.rul_hours != null ? `${ticket.rul_hours} jam` : '—'} />
          <InfoRow label="RUL (Hari)" value={ticket.rul_days  != null ? `${ticket.rul_days} hari` : '—'} />
          <InfoRow label="Kondisi"    value={ticket.maintenance_status} />
          <InfoRow label="Confidence" value={ticket.confidence != null ? `${(ticket.confidence * 100).toFixed(1)}%` : '—'} />
          <InfoRow
            label="Engineer"
            value={ticket.engineer_name || 'Belum ditugaskan'}
            className={!ticket.engineer_name ? 'text-stone-400 italic' : ''}
          />
          <InfoRow label="Dibuat" value={formatDate(ticket.created_at)} />
        </div>

        {/* Rekomendasi AI */}
        {ticket.action && (
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-blue-500" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Rekomendasi AI</span>
            </div>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{ticket.action}</p>
          </div>
        )}

        {/* Laporan (jika sudah WaitingApproval / Done) */}
        {(status === 'WaitingApproval' || status === 'Done') && ticket.description && (
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-3">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Laporan Engineer</p>
            <div className="space-y-2 text-sm text-stone-700 dark:text-stone-300">
              <p><span className="font-semibold">Deskripsi:</span> {ticket.description}</p>
              <p><span className="font-semibold">Tindakan:</span> {ticket.action_taken}</p>
              {ticket.notes && <p><span className="font-semibold">Catatan:</span> {ticket.notes}</p>}
              {ticket.duration_hours && (
                <p><span className="font-semibold">Durasi:</span> {ticket.duration_hours} jam</p>
              )}
            </div>
            {ticket.image_url && (
              <img
                src={ticket.image_url}
                alt="Bukti pekerjaan"
                className="w-full rounded-xl object-cover max-h-64 border border-stone-200 dark:border-stone-700 mt-2"
              />
            )}
          </div>
        )}

      </div>

      {/* ── Tombol Aksi ────────────────────────────────────────────────── */}
      {/* Tombol muncul berdasarkan kombinasi status + role */}
      <div className="px-6 pb-6">

        {/* Admin: Assign (WaitingAssignment) */}
        {isAdmin && status === 'WaitingAssignment' && (
          <button
            onClick={onAssignClick}
            disabled={actionLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-60"
          >
            {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
            Tugaskan Engineer
          </button>
        )}

        {/* Engineer: Mulai (Assigned + tiket milikku) */}
        {!isAdmin && isMyTicket && status === 'Assigned' && (
          <button
            onClick={onStart}
            disabled={actionLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-60"
          >
            {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            Mulai Pengerjaan
          </button>
        )}

        {/* Engineer: Submit laporan (InProgress + tiket milikku) */}
        {!isAdmin && isMyTicket && status === 'InProgress' && (
          <button
            onClick={onSubmitClick}
            className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-all"
          >
            <Send size={16} />
            Submit Laporan Perbaikan
          </button>
        )}

        {/* Admin: Approve (WaitingApproval) */}
        {isAdmin && status === 'WaitingApproval' && (
          <button
            onClick={onApprove}
            disabled={actionLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-60"
          >
            {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            Setujui & Selesaikan Tiket
          </button>
        )}

        {/* Done */}
        {status === 'Done' && (
          <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold text-sm border border-green-100 dark:border-green-800/40">
            <ShieldCheck size={16} />
            Tiket Selesai & Disetujui
          </div>
        )}

      </div>
    </div>
  );
};

export default TicketDetailCard;