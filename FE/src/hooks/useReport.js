import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Perbaikan import: ambil objek ticketService yang baru
import { ticketService } from '../services/ticketService';

export const useReport = (ticketId) => {
  const [ticket, setTicket] = useState(null);
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [notes, setNotes] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [imageFile, setImageFile] = useState(null); // Menyimpan file gambar binary
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 2. Ambil detail tiket untuk ditampilkan sebagai informasi di halaman report
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setIsFetching(true);
        // Mengganti fungsi lama dengan ticketService.getTicketById
        const response = await ticketService.getTicketById(ticketId);
        if (response.status === 'success') {
          setTicket(response.data.ticket);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data detail tiket.');
      } finally {
        setIsFetching(false);
      }
    };

    if (ticketId) fetchTicketData();
  }, [ticketId]);

  // 3. Logika Submit Laporan Perbaikan (PATCH /api/ticket-maintenance/{id}/submit)
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Foto bukti pekerjaan wajib diunggah.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Sesuai swagger.json, request harus berbentuk multipart/form-data karena ada file gambar
      const formData = new FormData();
      formData.append('description', description);
      formData.append('action_taken', actionTaken);
      formData.append('notes', notes);
      formData.append('duration_hours', parseFloat(durationHours));
      formData.append('image', imageFile); // Key 'image' sesuai skema binary swagger BE

      const response = await ticketService.submitTicketReport(ticketId, formData);
      
      if (response.status === 'success') {
        // Jika sukses, arahkan kembali ke detail tiket atau halaman list tiket
        navigate(`/tickets/${ticketId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirimkan laporan perbaikan.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ticket,
    description,
    setDescription,
    actionTaken,
    setActionTaken,
    notes,
    setNotes,
    durationHours,
    setDurationHours,
    setImageFile,
    isLoading,
    isFetching,
    error,
    handleSubmitReport,
  };
};