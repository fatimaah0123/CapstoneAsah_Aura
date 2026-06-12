import React, { useState, useEffect, useCallback } from 'react';
import {
  History, CheckCircle2, Eye, Search,
  Calendar, RefreshCw, Clock, User, Wrench, Image,
} from 'lucide-react';
import { ticketService } from '../services/ticketService';

// ─── Format tanggal ───────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
};

// ─── Modal Detail Laporan ─────────────────────────────────────────────────────
const DetailModal = ({ ticket, onClose }) => {
  if (!ticket) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" />
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Dokumen Hasil Pemeliharaan</h3>
              <p className="text-xs text-stone-400 font-mono mt-0.5">#{ticket.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="px-3 py-1.5 text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors">
            Tutup
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Mesin</p>
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{ticket.machine_name}</p>
              <p className="text-xs text-stone-400 mt-0.5">{ticket.type}</p>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Engineer</p>
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{ticket.engineer_name || '—'}</p>
              <p className="text-xs text-stone-400 mt-0.5">{formatDate(ticket.created_at)}</p>
            </div>
          </div>

          {ticket.description && (
            <div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                <Wrench size={11} /> Deskripsi Masalah
              </p>
              <p className="text-sm text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/50 rounded-xl p-3 leading-relaxed">
                {ticket.description}
              </p>
            </div>
          )}

          {ticket.action_taken && (
            <div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={11} /> Tindakan yang Dilakukan
              </p>
              <p className="text-sm text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/50 rounded-xl p-3 leading-relaxed">
                {ticket.action_taken}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {ticket.duration_hours != null && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/40">
                <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                  <Clock size={10} /> Durasi
                </p>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{ticket.duration_hours} jam</p>
              </div>
            )}
            {ticket.notes && (
              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl col-span-2">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Catatan</p>
                <p className="text-xs text-stone-600 dark:text-stone-400 italic">{ticket.notes}</p>
              </div>
            )}
          </div>

          {ticket.image_url ? (
            <div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                <Image size={11} /> Foto Bukti Pekerjaan
              </p>
              <img src={ticket.image_url} alt="Bukti pekerjaan" className="w-full rounded-xl object-cover max-h-56 border border-stone-200 dark:border-stone-700" />
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-dashed border-stone-200 dark:border-stone-700 text-center">
              <p className="text-xs text-stone-400">Tidak ada foto bukti tersimpan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MaintenanceHistory ───────────────────────────────────────────────────────
const MaintenanceHistory = () => {
  const [tickets, setTickets]               = useState([]);
  const [isLoading, setIsLoading]           = useState(true);
  const [error, setError]                   = useState('');
  const [searchTerm, setSearchTerm]         = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const all = await ticketService.getAllTickets();
      setTickets(all.filter((t) => t.status === 'Done'));
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat riwayat pemeliharaan.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const filtered = tickets.filter((t) =>
    t.machine_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.engineer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl text-white shadow-lg shadow-green-500/20">
            <History size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">Riwayat Pemeliharaan</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">Arsip seluruh tiket yang telah selesai dan disetujui</p>
          </div>
        </div>
        {!isLoading && !error && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40 rounded-xl">
            <CheckCircle2 size={14} className="text-green-500" />
            <span className="text-xs font-bold text-green-600 dark:text-green-400">{tickets.length} Tiket Selesai</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
        <input
          type="text"
          placeholder="Cari mesin, tipe, atau engineer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800
                     bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-sm
                     focus:ring-2 focus:ring-green-500/20 focus:border-green-400 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-48 gap-3 text-stone-400">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm">Memuat riwayat pemeliharaan...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tabel */}
      {!isLoading && !error && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
                  {['Mesin', 'Jenis Kerusakan', 'Engineer', 'Tanggal', 'Status', 'Dokumen'].map((h, i) => (
                    <th key={i} className="px-6 py-4 text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-stone-400 text-sm">
                      {searchTerm ? 'Tidak ada hasil yang cocok.' : 'Belum ada riwayat pemeliharaan.'}
                    </td>
                  </tr>
                ) : filtered.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{ticket.machine_name}</p>
                      <p className="text-xs text-stone-400 font-mono mt-0.5">#{ticket.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-400 max-w-[160px]">
                      <span className="line-clamp-2">{ticket.type || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                          <User size={12} className="text-blue-500" />
                        </div>
                        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{ticket.engineer_name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 whitespace-nowrap">
                        <Calendar size={13} />
                        {formatDate(ticket.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/40 whitespace-nowrap">
                        <CheckCircle2 size={11} /> Approved
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-blue-600 hover:text-white text-stone-600 dark:text-stone-300 rounded-lg font-semibold text-xs transition-all whitespace-nowrap"
                      >
                        <Eye size={13} /> Lihat Dokumen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-6 py-3 bg-stone-50 dark:bg-stone-800/30 border-t border-stone-100 dark:border-stone-800">
              <p className="text-xs text-stone-400">
                Menampilkan <span className="font-bold text-stone-600 dark:text-stone-300">{filtered.length}</span> dari{' '}
                <span className="font-bold text-stone-600 dark:text-stone-300">{tickets.length}</span> riwayat
              </p>
            </div>
          )}
        </div>
      )}

      <DetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </div>
  );
};

export default MaintenanceHistory;