import { useState, useEffect } from 'react';
import { fetchAllTickets } from '../services/ticketService';

const useTickets = (filterStatus) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const filtered = await fetchAllTickets(filterStatus);
      setTickets(filtered);
    } catch (error) {
      console.error('Gagal load tiket:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  return { tickets, loading, fetchTickets };
};

export default useTickets;