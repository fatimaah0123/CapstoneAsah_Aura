import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Zap,
  Eye,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ClipboardCheck
} from 'lucide-react';

const getStatusLabel = (status) => {
  const s = status?.toUpperCase();
  if (s === 'OPEN') return 'TERJADWAL';
  if (s === 'IN_PROGRESS') return 'DIKERJAKAN';
  if (s === 'RESOLVED') return 'SELESAI';
  return s;
};

const getStatusStyle = (status) => {
  const s = status?.toUpperCase();
  if (s === 'OPEN') return 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200';
  if (s === 'IN_PROGRESS') return 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200';
  return 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200';
};

const TicketTable = ({ loading, currentTickets, totalPages, currentPage, goToNextPage, goToPrevPage, setModalConfig, openDeleteModal }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr className="bg-stone-50/50 dark:bg-stone-800/30 border-b border-stone-200 dark:border-stone-800">
              <th className="w-1/3 px-8 py-6 text-[12px] font-bold uppercase tracking-widest text-stone-400">Informasi Tiket</th>
              <th className="w-1/3 px-8 py-6 text-[12px] font-bold uppercase tracking-widest text-stone-400 text-center">Status</th>
              <th className="w-1/3 px-8 py-6 text-[12px] font-bold uppercase tracking-widest text-stone-400 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {loading ? (
              <tr>
                <td colSpan="3" className="px-8 py-24 text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                </td>
              </tr>
            ) : currentTickets.length > 0 ? (
              currentTickets.map((ticket) => {
                const ticketId = ticket.ticket_id || ticket.id;
                const status = (ticket.ticket_status || ticket.status)?.toUpperCase();

                return (
                  <tr key={ticketId} className="group hover:bg-gray-50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="px-8 py-7">
                      <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">#{ticketId}</div>
                      <div className="text-base font-semibold text-gray-600 dark:text-stone-300">{ticket.ticket_title || ticket.name}</div>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                        <Calendar size={14} />
                        {new Date(ticket.ticket_created_at || Date.now()).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-8 py-7 text-center">
                      <span className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest border inline-block min-w-[140px] ${getStatusStyle(status)}`}>
                        {getStatusLabel(status)}
                      </span>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => navigate(`/tickets/${ticketId}`)}
                          className="p-3.5 bg-gray-100 dark:bg-stone-800 text-gray-500 dark:text-stone-300 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Detail Mesin"
                        >
                          <Eye size={22} />
                        </button>
                        
                        {/* AKSI UNTUK STATUS TERJADWAL */}
                        {status === 'OPEN' && (
                          <button
                            onClick={() => setModalConfig({ isOpen: true, id: ticketId, payload: 'IN_PROGRESS', type: 'info', title: 'Mulai Perbaikan?', message: 'Ubah status tiket menjadi DIKERJAKAN?' })}
                            className="p-3.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                            title="Dikerjakan"
                          >
                            <Zap size={22} />
                          </button>
                        )}
                        
                        {/* AKSI UNTUK STATUS DIKERJAKAN */}
                        {status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => setModalConfig({ isOpen: true, id: ticketId, payload: 'RESOLVED', type: 'info', title: 'Selesaikan Perbaikan?', message: 'Lanjutkan untuk mengisi laporan penyelesaian tiket?' })}
                            className="p-3.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            title="Isi Laporan"
                          >
                            <CheckCircle size={22} />
                          </button>
                        )}

                        {/* REVISI: AKSI UNTUK STATUS SELESAI - Melihat Laporan Perbaikan */}
                        {(status === 'RESOLVED' || status === 'CLOSED') && (
                          <button
                            onClick={() => navigate(`/report/${ticketId}?view=true`)}
                            className="p-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="Lihat Riwayat Laporan"
                          >
                            <ClipboardCheck size={22} />
                          </button>
                        )}

                        <button
                          onClick={() => openDeleteModal(ticketId)}
                          className="p-3.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Hapus Tiket"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="px-8 py-24 text-center text-gray-500 font-medium text-base">Data tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-5 bg-gray-50 dark:bg-stone-800/30 flex items-center justify-between border-t border-stone-200 dark:border-stone-800">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Halaman <span className="text-blue-600">{currentPage}</span> / {totalPages || 1}
        </div>
        <div className="flex gap-3">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-gray-600 dark:text-white disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-gray-600 dark:text-white disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketTable;