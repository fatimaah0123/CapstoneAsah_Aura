import React from 'react';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import ini

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate(); // 2. Init Hook

  // ... (Kode warna priorityColors & statusColors TETAP SAMA, jangan dihapus) ...
  const priorityColors = {
    'Urgent': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    'High': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700',
    'Medium': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    'Low': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
  };

  const statusColors = {
    'Open': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    'In Progress': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    'Resolved': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    'Closed': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400',
  };

  return (
    <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl border-2 ${priorityColors[ticket.priority]} hover:shadow-lg transition-shadow`}>
      {/* ... (Bagian Header & Description TETAP SAMA) ... */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white text-lg">{ticket.id}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ticket.assetName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ticket.status]}`}>
          {ticket.status}
        </span>
      </div>
      
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{ticket.description}</p>
      
      {/* ... (Bagian Footer Info assignee TETAP SAMA) ... */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{ticket.createdAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-[10px]">
            {ticket.assignee.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{ticket.assignee}</span>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        {/* 3. UBAH TOMBOL LIHAT DETAIL */}
        <button 
          onClick={() => navigate(`/tickets/${ticket.id}`)}
          className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium"
        >
          Lihat Detail
        </button>
        
        {/* 4. TOMBOL UPDATE LANGSUNG KE LAPORAN */}
        <button 
          onClick={() => navigate(`/report/${ticket.id}`)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default TicketCard;