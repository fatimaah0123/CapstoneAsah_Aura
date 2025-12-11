import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, Clock, CheckCircle, 
  PlayCircle, CheckSquare, ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  getMaintenanceTickets, 
  deleteMaintenanceTicket, 
  updateMaintenanceTicket 
} from '../services/api';

const TicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State
  const [filterStatus, setFilterStatus] = useState('OPEN');
  const [currentPage, setCurrentPage] = useState(1);        
  const [itemsPerPage] = useState(5); 

  // Fetch Data Database
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await getMaintenanceTickets(''); 
      const apiTickets = response.data || []; 
      
      const filtered = filterStatus 
        ? apiTickets.filter(t => (t.ticket_status || t.status) === filterStatus) 
        : apiTickets;

      setTickets(filtered);
      setCurrentPage(1); 
    } catch (error) {
      console.error("Gagal load tiket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  // Logic Pagination Sederhana
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Logic Update Status (Tanpa Pending)
  const handleStatusChange = async (e, id, newStatus) => {
    e.stopPropagation(); 
    if (!window.confirm(`Ubah status tiket ini menjadi ${newStatus}?`)) return;

    setLoading(true);
    try {
      await updateMaintenanceTicket(id, { status: newStatus });
      fetchTickets(); 
    } catch (err) {
      alert("Gagal update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(window.confirm("Hapus tiket ini permanen dari database?")) {
      try {
        await deleteMaintenanceTicket(id);
        fetchTickets();
      } catch (err) { alert("Gagal hapus"); }
    }
  };

  const getStatusColor = (status) => {
    const s = status ? status.toUpperCase() : '';
    if (s === 'OPEN') return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    if (s === 'IN_PROGRESS') return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    if (s === 'RESOLVED') return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Tiket</h1>
            <p className="text-gray-500 text-sm">Data maintenance realtime dari Database.</p>
          </div>
          <button 
            onClick={() => navigate('/create-ticket')}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} /> Buat Tiket Baru
          </button>
        </div>

        {/* Filter Tabs (Tanpa Pending) */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-1">
          {['OPEN', 'IN_PROGRESS', 'RESOLVED', ''].map(status => (
            <button
              key={status || 'ALL'}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${
                filterStatus === status 
                ? 'text-blue-600 border-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-t-lg' 
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status === '' ? 'SEMUA TIKET' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* List Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* List Content */}
          <div className="p-4 space-y-3 min-h-[300px]">
            {loading ? (
              <div className="flex justify-center items-center h-40 text-gray-500">Memuat data database...</div>
            ) : currentTickets.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500">Tidak ada tiket ditemukan untuk status ini.</p>
              </div>
            ) : (
              currentTickets.map((ticket, index) => {
                const status = ticket.ticket_status || ticket.status;
                const ticketId = ticket.ticket_id || ticket.id;

                return (
                  <div 
                    key={`${ticketId}-${index}`} 
                    onClick={() => navigate(`/tickets/${ticketId}`)}
                    className="group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col md:flex-row gap-4 justify-between items-center"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                       <div className={`p-3 rounded-full shrink-0 ${getStatusColor(status)}`}>
                          {status === 'RESOLVED' ? <CheckCircle size={20} /> : <Clock size={20} />}
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400 font-mono">ID: {ticketId}</span>
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-blue-600 transition">
                            {ticket.name || 'Unknown Machine'}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                             <span className="flex items-center gap-1">
                               <Calendar size={12}/> 
                               {new Date(ticket.ticket_created_at || ticket.created_at || Date.now()).toLocaleDateString()}
                             </span>
                             {ticket.priority && <span className="font-medium text-orange-500">Prioritas: {ticket.priority}</span>}
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0 border-gray-100">
                      
                      {/* Actions: OPEN -> IN_PROGRESS -> RESOLVED */}
                      {status === 'OPEN' && (
                        <button 
                          onClick={(e) => handleStatusChange(e, ticketId, 'IN_PROGRESS')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1 transition shadow-sm"
                        >
                          <PlayCircle size={14} /> Kerjakan
                        </button>
                      )}

                      {status === 'IN_PROGRESS' && (
                        <button 
                          onClick={(e) => handleStatusChange(e, ticketId, 'RESOLVED')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 flex items-center gap-1 transition shadow-sm"
                        >
                          <CheckSquare size={14} /> Selesai
                        </button>
                      )}

                      <button 
                        onClick={(e) => handleDelete(e, ticketId)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-xs font-medium border border-transparent hover:border-red-100 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Sederhana (Footer) */}
          {tickets.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
               
               <div className="text-sm text-gray-600 dark:text-gray-400">
                  Menampilkan <span className="font-bold text-gray-900 dark:text-white">{indexOfFirstItem + 1}</span> - <span className="font-bold text-gray-900 dark:text-white">{Math.min(indexOfLastItem, tickets.length)}</span> dari <span className="font-bold text-gray-900 dark:text-white">{tickets.length}</span> data
               </div>

               <div className="flex items-center gap-2">
                  <button 
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={16} />
                    Sebelumnya
                  </button>

                  <button 
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Selanjutnya
                    <ChevronRight size={16} />
                  </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TicketsPage;