import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

// Components
import TicketDetailCard from '../components/tickets/TicketDetailCard';

// Hooks
import useTicketDetail from '../hooks/useTicketDetail';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { ticket, loading, error } = useTicketDetail(id);

  if (loading) return <div className="p-10 text-center">Memuat detail tiket...</div>;
  if (error || !ticket) return <div className="p-10 text-center text-red-500">{error || 'Tiket tidak ditemukan'}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Back */}
        <button 
          onClick={() => navigate('/tickets')} 
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-6 hover:underline"
        >
          <ChevronLeft size={20} /> Kembali ke Daftar
        </button>

        {/* Kartu Utama */}
        <TicketDetailCard ticket={ticket} />

      </div>
    </div>
  );
};

export default TicketDetailPage;