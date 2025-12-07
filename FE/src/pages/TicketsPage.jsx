import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, Activity, CheckCircle, Clock, MapPin, 
  Play, CheckSquare, FileText, Filter, Eye, X, 
  AlertTriangle, Calendar, User, CheckCircle2
} from 'lucide-react';

const TicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [viewMode, setViewMode] = useState('active'); // 'active' | 'completed'
  
  // State untuk Filter
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // --- STATE BARU: MODAL DETAIL ---
  const [selectedTicket, setSelectedTicket] = useState(null); 

  // --- LOGIC LOAD DATA ---
  useEffect(() => {
    const savedTickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');
    setTickets(savedTickets);
  }, []);

  // --- STATISTIK ---
  const stats = {
    total: tickets.length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    completed: tickets.filter(t => t.status === 'Completed').length
  };

  // --- UPDATE STATUS ---
  const updateStatus = (ticketId, newStatus) => {
    const updatedTickets = tickets.map(t => 
      t.id === ticketId ? { ...t, status: newStatus } : t
    );
    setTickets(updatedTickets);
    localStorage.setItem('aura_tickets', JSON.stringify(updatedTickets));
  };

  const handleFinish = (ticketId) => {
    navigate(`/report/${ticketId}`); 
  };

  // --- LOGIC FILTERING ---
  let processedTickets = viewMode === 'active' 
    ? tickets.filter(t => t.status !== 'Completed') 
    : tickets.filter(t => t.status === 'Completed');

  processedTickets = processedTickets.filter(ticket => {
    const matchPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchPriority && matchStatus;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative transition-colors duration-200">
      {/* Header & Statistik */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Tiket Maintenance</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Daftar tiket perbaikan aset yang sedang berjalan maupun selesai.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Card Total */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center">
          <div><p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Tiket</p><p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p></div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400"><Wrench size={24} /></div>
        </div>
        {/* Card In Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-cyan-200 dark:border-cyan-900/50 shadow-sm flex justify-between items-center">
          <div><p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sedang Dikerjakan</p><p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{stats.inProgress}</p></div>
          <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400"><Activity size={24} /></div>
        </div>
        {/* Card Selesai */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-green-200 dark:border-green-900/50 shadow-sm flex justify-between items-center">
          <div><p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Selesai</p><p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p></div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400"><CheckCircle size={24} /></div>
        </div>
      </div>

      {/* Filter & Tabs */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1 flex gap-4 w-full">
           <div className="w-full">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 ml-1">Filter Prioritas</label>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Semua Prioritas</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 ml-1">Filter Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Semua Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 inline-flex shadow-sm shrink-0">
          <button onClick={() => setViewMode('active')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'active' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Tugas Aktif</button>
          <button onClick={() => setViewMode('completed')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'completed' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>Laporan Selesai</button>
        </div>
      </div>

      {/* Grid Tiket */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {processedTickets.map(ticket => (
          <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
             <div className={`px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start 
                ${ticket.status === 'Completed' ? 'bg-green-50/50 dark:bg-green-900/20' : 'bg-blue-50/50 dark:bg-blue-900/20'}`}>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white line-clamp-1">{ticket.assetName}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide 
                  ${ticket.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'}`}>
                  {ticket.status}
                </span>
              </div>

              <div className="p-5 flex-1">
                <div className="flex items-start gap-2 mb-4">
                  <MapPin size={16} className="text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{ticket.location || 'Lokasi tidak tersedia'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 italic">"{ticket.description}"</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border 
                  ${ticket.priority === 'Urgent' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
                  {ticket.priority} Priority
                </span>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30">
                {ticket.status === 'Open' && (
                  <button onClick={() => updateStatus(ticket.id, 'In Progress')} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2">
                    <Play size={16} /> Mulai Pengerjaan
                  </button>
                )}
                {ticket.status === 'In Progress' && (
                  <button onClick={() => updateStatus(ticket.id, 'Resolved')} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2">
                    <CheckSquare size={16} /> Tandai Selesai
                  </button>
                )}
                {ticket.status === 'Resolved' && (
                  <button onClick={() => handleFinish(ticket.id)} className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-100 dark:shadow-none">
                    <FileText size={16} /> Buat Laporan & Finish
                  </button>
                )}
                {ticket.status === 'Completed' && (
                  <button 
                    onClick={() => setSelectedTicket(ticket)} 
                    className="w-full py-2 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye size={16} /> Lihat Detail Laporan
                  </button>
                )}
              </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DETAIL POP-UP --- */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Header Modal */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detail Laporan</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">ID: {selectedTicket.id}</p>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 space-y-6">
              
              {/* Info Utama */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white text-lg">{selectedTicket.assetName}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin size={14} /> {selectedTicket.location}
                  </div>
                </div>
                <div className="text-right">
                   <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800">
                      STATUS: COMPLETED
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-2 justify-end">
                    <Calendar size={14} /> {selectedTicket.completedAt ? new Date(selectedTicket.completedAt).toLocaleDateString() : '-'}
                  </div>
                </div>
              </div>

              {/* Grid Masalah vs Solusi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1">
                    <AlertTriangle size={14} className="text-red-500"/> Masalah Awal
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30 min-h-[80px]">
                    {selectedTicket.description}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1">
                    <Wrench size={14} className="text-blue-500"/> Tindakan Perbaikan
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 min-h-[80px]">
                    {selectedTicket.report?.actionsTaken || "Tidak ada catatan."}
                  </p>
                </div>
              </div>

              {/* Tabel Spare Parts */}
              {selectedTicket.report?.spareParts && selectedTicket.report.spareParts.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1 mb-2">
                    <CheckCircle2 size={14} /> Spare Part Diganti
                  </h4>
                  <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                        <tr>
                          <th className="px-4 py-2">Nama Barang</th>
                          <th className="px-4 py-2 text-right">Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {selectedTicket.report.spareParts.map((part, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{part.name}</td>
                            <td className="px-4 py-2 text-gray-800 dark:text-gray-200 text-right font-medium">{part.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Galeri Foto */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1 mb-2">
                  <FileText size={14} /> Bukti Dokumentasi
                </h4>
                {selectedTicket.report?.photos && selectedTicket.report.photos.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {selectedTicket.report.photos.map((url, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                        <img src={url} alt="Bukti" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Tidak ada foto dilampirkan.</p>
                )}
              </div>

            </div>
            
            {/* Footer Modal */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end">
              <button 
                onClick={() => setSelectedTicket(null)}
                className="px-6 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Tutup Detail
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default TicketsPage;