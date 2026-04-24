import { useState, useEffect } from 'react';

const useDashboardFilter = (stat) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  let filteredAssets = [...stat];
  if (statusFilter !== 'all') {
    const statusMap = { CRITICAL: 'CRITICAL', WARNING: 'WARNING', NORMAL: 'NORMAL' };
    filteredAssets = filteredAssets.filter((a) => a.status === statusMap[statusFilter]);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const paginationProps = {
    currentPage,
    totalPages,
    from: filteredAssets.length === 0 ? 0 : indexOfFirstItem + 1,
    to: Math.min(indexOfLastItem, filteredAssets.length),
    total: filteredAssets.length,
    onNext: goToNextPage,
    onPrev: goToPrevPage,
  };

  return { statusFilter, setStatusFilter, currentAssets, paginationProps };
};

export default useDashboardFilter;