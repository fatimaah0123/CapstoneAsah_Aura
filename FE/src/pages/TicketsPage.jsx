import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, Clock, CheckCircle, 
  PlayCircle, CheckSquare, Eye, AlertCircle 
} from 'lucide-react';
import { 
  getMaintenanceTickets, 
  deleteMaintenanceTicket, 
  updateMaintenanceTicket // Pastikan fungsi ini ada di api.js
} from '../services/api';

const TicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('OPEN'); // Default ke OPEN agar perpindahan kartu terlihat jelas

  // --- 1. FETCH DATA (API + MANUAL) ---
  const fetchTickets = async () => {
    setLoading(true);
    try {
      // A. Ambil Data API (Mesin/ML)
      const response = await getMaintenanceTickets(''); // Ambil semua dulu, baru filter di client untuk transisi mulus
      const apiTickets = response.data || []; 

      // B. Ambil Data Manual (LocalStorage)
      const localTickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');

      // C. Gabungkan
      const allTickets = [...localTickets, ...apiTickets];
      
      // D. Filter Sesuai Tab yang Aktif
      const filtered = filterStatus 
        ? allTickets.filter(t => t.ticket_status === filterStatus) 
        : allTickets;

      setTickets(filtered);
    } catch (error) {
      console.error("Gagal load tiket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]); // Refresh saat tab ganti

  // --- 2. HANDLE UPDATE STATUS (PINDAH KARTU) ---
  const handleStatusChange = async (id, newStatus, isLocal) => {
    // Konfirmasi tindakan
    const actionName = newStatus === 'IN_PROGRESS' ? 'mulai pengerjaan' : 'menyelesaikan';
    if (!window.confirm(`Apakah Anda yakin ingin ${actionName} tiket ini?`)) return;

    setLoading(true);

    try {
      if (isLocal) {
        // A. Update Local Storage
        const localTickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');
        const updatedTickets = localTickets.map(t => 
          t.ticket_id === id ? { ...t, ticket_status: newStatus } : t
        );
        localStorage.setItem('aura_tickets', JSON.stringify(updatedTickets));
      } else {
        // B. Update API Backend
        // BE mengharapkan body { status: '...' }
        await updateMaintenanceTicket(id, { status: newStatus });
      }

      // Refresh halaman agar kartu "pindah" (hilang dari tab saat ini)
      fetchTickets();

    } catch (error) {
      console.error("Gagal update status:", error);
      alert("Gagal memperbarui status tiket.");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. HANDLE DELETE ---
  const handleDelete = async (id, isLocal) => {
    if(window.confirm("Yakin hapus tiket ini?")) {
      try {
        if (isLocal) {
          const localTickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');
          const updated = localTickets.filter(t => t.ticket_id !== id);
          localStorage.setItem('aura_tickets', JSON.stringify(updated));
        } else {
          await deleteMaintenanceTicket(id);
        }
        fetchTickets();
      } catch (err) {
        alert("Gagal menghapus tiket.");
      }
    }
  };

  // Helper UI Warna
  const getStatusColor = (status) => {
    const s = status ? status.toUpperCase() : '';
    if (s === 'OPEN') return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    if (s === 'IN_PROGRESS') return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    if (s === 'RESOLVED') return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pb-24">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daftar Tiket</h1>
            <p className="text-gray-500 text-sm">Monitor perbaikan mesin dan status pengerjaan.</p>
          </div>
          <button 
            onClick={() => navigate('/create-ticket')}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <Plus size={20} /> Buat Tiket Manual
          </button>
        </div>

        {/* Tab Filter Status */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['OPEN', 'IN_PROGRESS', 'RESOLVED'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                filterStatus === status 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
          <button
              onClick={() => setFilterStatus('')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                filterStatus === '' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
              }`}
            >
              SEMUA
          </button>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="flex justify-center mb-4 text-gray-300">
               <CheckCircle size={48} />
            </div>
            <p className="text-gray-500 font-medium">Tidak ada tiket dengan status ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket, index) => {
              const isLocal = ticket.ticket_id && ticket.ticket_id.toString().startsWith('MANUAL');
              
              return (
                <div key={`${ticket.ticket_id}-${index}`} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 group">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    
                    {/* Bagian Kiri: Info Tiket */}
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl shrink-0 ${getStatusColor(ticket.ticket_status)}`}>
                          {ticket.ticket_status === 'RESOLVED' ? <CheckCircle size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          {isLocal ? (
                              <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md font-bold border border-purple-200">MANUAL</span>
                          ) : (
                              <span className="text-[10px] px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-md font-bold border border-cyan-200">IOT SENSOR</span>
                          )}
                          <span className="text-xs text-gray-400 font-mono">#{ticket.ticket_id}</span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">
                          {ticket.name || 'Unknown Machine'} 
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} /> 
                            {ticket.ticket_created_at ? new Date(ticket.ticket_created_at).toLocaleDateString('id-ID') : '-'}
                          </span>
                          {ticket.priority && (
                             <span className={`flex items-center gap-1.5 font-medium ${
                               ticket.priority === 'High' || ticket.priority === 'Urgent' ? 'text-red-500' : 'text-gray-500'
                             }`}>
                               <AlertCircle size={14} /> {ticket.priority}
                             </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bagian Kanan: Actions Button */}
                    <div className="flex flex-row md:flex-col items-center justify-center gap-2 w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                      
                      {/* 1. Tombol BUKA (Detail) */}
                      {/* Anda bisa arahkan ke halaman detail jika ada, atau tampilkan modal. 
                          Disini saya buat dummy alert/log dulu */}
                      <button 
                        onClick={() => alert(`Membuka detail tiket: ${ticket.name}\nDeskripsi: ${ticket.description || 'Tidak ada deskripsi'}`)}
                        className="flex-1 md:flex-none w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        <Eye size={16} /> Buka
                      </button>

                      {/* 2. Tombol Action Berdasarkan Status */}
                      
                      {/* Jika OPEN -> Tombol IN PROGRESS */}
                      {ticket.ticket_status === 'OPEN' && (
                        <button 
                          onClick={() => handleStatusChange(ticket.ticket_id, 'IN_PROGRESS', isLocal)}
                          className="flex-1 md:flex-none w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-blue-200"
                        >
                          <PlayCircle size={16} /> Kerjakan
                        </button>
                      )}

                      {/* Jika IN PROGRESS -> Tombol RESOLVE */}
                      {ticket.ticket_status === 'IN_PROGRESS' && (
                        <button 
                          onClick={() => handleStatusChange(ticket.ticket_id, 'RESOLVED', isLocal)}
                          className="flex-1 md:flex-none w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-green-200"
                        >
                          <CheckSquare size={16} /> Selesai
                        </button>
                      )}

                      {/* Tombol Hapus (Opsional, kecil di bawah) */}
                      <button 
                        onClick={() => handleDelete(ticket.ticket_id, isLocal)}
                        className="text-xs text-red-400 hover:text-red-600 underline mt-1"
                      >
                        Hapus
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;