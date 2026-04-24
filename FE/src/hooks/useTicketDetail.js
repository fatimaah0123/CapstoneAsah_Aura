import { useState, useEffect } from 'react';
import { fetchTicketDetail } from '../services/ticketService';

const useTicketDetail = (id) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const data = await fetchTicketDetail(id);
        if (data) {
          setTicket(data);
        } else {
          setError('Tiket tidak ditemukan.');
        }
      } catch (err) {
        console.error(err);
        setError('Gagal mengambil detail tiket.');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  return { ticket, loading, error };
};

export default useTicketDetail;