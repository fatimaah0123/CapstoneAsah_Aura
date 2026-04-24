import { useState } from 'react';

const useTicketFilter = () => {
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

  const getPaginatedTickets = (tickets) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(tickets.length / itemsPerPage);
    return { currentTickets, totalPages };
  };

  const goToNextPage = (totalPages) => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  const openDeleteModal = (id) => {
    setModalConfig({
      isOpen: true,
      id: id,
      type: 'danger',
      title: 'Hapus Tiket Permanen?',
      message: 'Tindakan ini akan menghapus tiket dan riwayat perbaikan terkait dari database.',
    });
  };

  return {
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    getPaginatedTickets,
    goToNextPage,
    goToPrevPage,
    modalConfig,
    setModalConfig,
    openDeleteModal,
  };
};

export default useTicketFilter;