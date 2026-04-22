import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Zap,
  Eye,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Settings,
  ClipboardCheck // Menambahkan ikon baru untuk riwayat perbaikan
} from 'lucide-react';
import {
  getMaintenanceTickets,
  deleteMaintenanceTicket,
  updateMaintenanceTicket,
} from '../services/api';

// Komponen Modal untuk konfirmasi visual yang interaktif
import CustomModal from '../components/common/CustomModal';

const TicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState('OPEN');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    id: null, 
    payload: null,
    title: '', 
    message: '', 
    type: 'info' 
  });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await getMaintenanceTickets('');
      const apiTickets = response.data || [];

      const filtered = filterStatus
        ? apiTickets.filter((t) => (t.ticket_status || t.status) === filterStatus)
        : apiTickets;

      setTickets(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Gagal load tiket:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  // REVISI: Menambahkan fungsi openDeleteModal yang sebelumnya hilang di kode asli Anda
  const openDeleteModal = (id) => {
    setModalConfig({
      isOpen: true,
      id: id,
      type: 'danger',
      title: 'Hapus Tiket Permanen?',
      message: 'Tindakan ini akan menghapus tiket dan riwayat perbaikan terkait dari database.',
    });
  };

  const handleConfirmAction = async () => {
    const { id, payload, type } = modalConfig;
    setModalConfig({ ...modalConfig, isOpen: false });

    try {
      if (type === 'danger') {
        await deleteMaintenanceTicket(id);
        fetchTickets();
      } else if (payload === 'IN_PROGRESS') {
        await updateMaintenanceTicket(id, { status: 'IN_PROGRESS' });
        setFilterStatus('IN_PROGRESS');
        fetchTickets();
      } else if (payload === 'RESOLVED') {
        // Langsung arahkan ke halaman input laporan
        navigate(`/report/${id}`);
      }
    } catch (error) {
      console.error("Gagal melakukan aksi:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

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

  return (
    <div className="p-6 lg:p-10 bg-gray-50 dark:bg-stone-950 min-h-screen transition-colors duration-500">
      
      {/* Header Section */}
      <div className="mb-10 flex items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
            Manajemen Tiket
          </h2>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-stone-900 p-2 rounded-2xl w-fit border border-stone-200 dark:border-stone-800 shadow-sm">
        {['OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-wider ${
              filterStatus === status
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-500 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {getStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* Table Content */}
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

      <CustomModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default TicketsPage;