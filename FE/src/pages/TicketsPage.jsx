import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeTicket, startTicketProgress } from '../services/ticketService';

// Components
import CustomModal from '../components/common/CustomModal';
import TicketTable from '../components/tickets/TicketTable';

// Hooks
import useTickets from '../hooks/useTickets';
import useTicketFilter from '../hooks/useTicketFilter';

const getStatusLabel = (status) => {
  const s = status?.toUpperCase();
  if (s === 'OPEN') return 'TERJADWAL';
  if (s === 'IN_PROGRESS') return 'DIKERJAKAN';
  if (s === 'RESOLVED') return 'SELESAI';
  return s;
};

const TicketsPage = () => {
  const navigate = useNavigate();

  const {
    filterStatus,
    setFilterStatus,
    currentPage,
    getPaginatedTickets,
    goToNextPage,
    goToPrevPage,
    modalConfig,
    setModalConfig,
    openDeleteModal,
  } = useTicketFilter();

  const { tickets, loading, fetchTickets } = useTickets(filterStatus);

  const { currentTickets, totalPages } = getPaginatedTickets(tickets);

  const handleConfirmAction = async () => {
    const { id, payload, type } = modalConfig;
    setModalConfig({ ...modalConfig, isOpen: false });

    try {
      if (type === 'danger') {
        await removeTicket(id);
        fetchTickets();
      } else if (payload === 'IN_PROGRESS') {
        await startTicketProgress(id);
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

      {/* Ticket Table */}
      <TicketTable
        loading={loading}
        currentTickets={currentTickets}
        totalPages={totalPages}
        currentPage={currentPage}
        goToNextPage={() => goToNextPage(totalPages)}
        goToPrevPage={goToPrevPage}
        setModalConfig={setModalConfig}
        openDeleteModal={openDeleteModal}
      />

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