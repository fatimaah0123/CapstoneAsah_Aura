import { useState, useEffect, useCallback } from 'react';
import { ticketService } from '../services/ticketService';

export const useTicketDetail = (ticketId) => {
  const [ticket, setTicket]             = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError]               = useState('');

  // ── Fetch detail tiket ─────────────────────────────────────────────────────
  const fetchDetail = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await ticketService.getTicketById(ticketId);
      setTicket(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat detail tiket.');
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketId) fetchDetail();
  }, [fetchDetail, ticketId]);

  // ── Assign engineer — Admin ────────────────────────────────────────────────
  const handleAssign = async (engineerId) => {
    setActionLoading(true);
    setError('');
    try {
      const updated = await ticketService.assignEngineer(ticketId, engineerId);
      setTicket(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menugaskan engineer.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Mulai kerja — Engineer ─────────────────────────────────────────────────
  const handleStart = async () => {
    setActionLoading(true);
    setError('');
    try {
      const updated = await ticketService.startWork(ticketId);
      setTicket(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memulai pekerjaan.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Approve — Admin ────────────────────────────────────────────────────────
  const handleApprove = async () => {
    setActionLoading(true);
    setError('');
    try {
      const updated = await ticketService.approveTicket(ticketId);
      setTicket(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyetujui tiket.');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    ticket,
    isLoading,
    actionLoading,
    error,
    handleAssign,
    handleStart,
    handleApprove,
    refreshDetail: fetchDetail,
  };
};