import { useState, useEffect, useCallback } from 'react';
import { ticketService } from '../services/ticketService';

// Status resmi dari API BE:
// WaitingAssignment | Assigned | InProgress | WaitingApproval | Done

const useTickets = () => {
  const [tickets, setTickets]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState('');

  // ── Fetch semua tiket ──────────────────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await ticketService.getAllTickets();
      setTickets(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data tiket.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // ── Update satu tiket di state (setelah aksi berhasil) ─────────────────────
  const updateTicketInState = (updatedTicket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
  };

  // ── Assign engineer (Admin) ────────────────────────────────────────────────
  const handleAssign = async (ticketId, engineerId) => {
    const updated = await ticketService.assignEngineer(ticketId, engineerId);
    updateTicketInState(updated);
  };

  // ── Approve tiket (Admin) ──────────────────────────────────────────────────
  const handleApprove = async (ticketId) => {
    const updated = await ticketService.approveTicket(ticketId);
    updateTicketInState(updated);
  };

  // ── Mulai kerja (Engineer) ─────────────────────────────────────────────────
  const handleStart = async (ticketId) => {
    const updated = await ticketService.startWork(ticketId);
    updateTicketInState(updated);
  };

  return {
    tickets,
    isLoading,
    error,
    fetchTickets,
    handleAssign,
    handleApprove,
    handleStart,
  };
};

export default useTickets;