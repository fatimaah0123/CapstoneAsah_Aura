import { useState, useEffect } from 'react';
import { fetchTicketForReport, submitReport } from '../services/ticketService';

const useReport = (id, navigate) => {
  const [ticket, setTicket] = useState(null);
  const [technicianName, setTechnicianName] = useState('');
  const [damageDesc, setDamageDesc] = useState('');
  const [spareParts, setSpareParts] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTicketDetail = async () => {
    try {
      const data = await fetchTicketForReport(id);
      if (data) {
        setTicket(data);
        setTechnicianName(data.technician_name || '');
      }
    } catch (error) {
      console.error("Gagal mengambil rincian tiket:", error);
    }
  };

  useEffect(() => {
    fetchTicketDetail();
  }, [id]);

  const handleSubmit = async (e, image) => {
    e.preventDefault();
    if (!image) return alert("Wajib melampirkan foto bukti!");
    setLoading(true);
    try {
      await submitReport(id, {
        status: 'RESOLVED',
        technician_name: technicianName,
        report_description: damageDesc,
        spare_parts: spareParts,
        evidence_image: image
      });
      alert("Laporan Berhasil Dikirim!");
      navigate('/tickets');
    } catch (error) {
      alert("Gagal mengirim laporan.");
    } finally {
      setLoading(false);
    }
  };

  return {
    ticket,
    technicianName, setTechnicianName,
    damageDesc, setDamageDesc,
    spareParts, setSpareParts,
    loading,
    handleSubmit,
  };
};

export default useReport;