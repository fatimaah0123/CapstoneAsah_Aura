import React, { useState, useEffect } from 'react';
import { Wrench, Activity, CheckCircle } from 'lucide-react';
import TicketCard from '../components/tickets/TiketCard';
import { dummyTickets } from '../Data/dummy'; 

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // --- LOGIC LOAD DATA ---
  useEffect(() => {
    // 1. Ambil data dari Local Storage (Data hasil dari Inspeksi/Create Ticket)
    const savedTickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');
    
    // 2. Gabungkan dengan data Dummy bawaan
    // Data baru (savedTickets) ditaruh di depan agar muncul paling atas
    const combinedData = [...savedTickets, ...dummyTickets];
    
    // 3. Simpan ke State
    setTickets(combinedData);
  }, []);

  // --- LOGIC FILTER ---
  const filteredTickets = tickets.filter(ticket => {
    const matchPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchPriority && matchStatus;
  });

  // --- LOGIC STATISTIK ---
  const stats = {
    total: tickets.length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved' || t.status === 'Completed').length
  };

  return (
    <div className="p-6">
      {/* Header Halaman */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tiket Maintenance</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Daftar tiket perbaikan aset yang sedang berjalan maupun selesai.
        </p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Tiket */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Tiket</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Wrench size={24} />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-cyan-200 dark:border-cyan-800 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sedang Dikerjakan</p>
            <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{stats.inProgress}</p>
          </div>
          <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Activity size={24} />
          </div>
        </div>

        {/* Selesai */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-green-200 dark:border-green-800 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Selesai</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Filter Prioritas</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all outline-none"
          >
            <option value="all">Semua Prioritas</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Filter Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Grid Tiket */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Wrench className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tidak ada tiket ditemukan</h3>
            <p className="text-gray-500 dark:text-gray-400">Coba ubah filter atau buat jadwal inspeksi baru.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;