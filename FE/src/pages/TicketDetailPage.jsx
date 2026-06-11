import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw } from 'lucide-react';

import TicketDetailCard from '../components/ticket/TicketDetailCard';
import AssignModal      from '../components/ticket/AssignModal';
import SubmitReportModal from '../components/ticket/SubmitReportModal';
import { useTicketDetail } from '../hooks/useTicketDetail';

const TicketDetailPage = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const {
    ticket,
    isLoading,
    actionLoading,
    error,
    handleAssign,
    handleStart,
    handleApprove,
    refreshDetail,
  } = useTicketDetail(id);

  const [showAssignModal, setShowAssignModal]   = useState(false);
  const [showSubmitModal, setShowSubmitModal]   = useState(false);
  const [isAssigning, setIsAssigning]           = useState(false);

  // ── Assign handler ─────────────────────────────────────────────────────────
  const onAssignConfirm = async (ticketId, engineerId) => {
    setIsAssigning(true);
    try {
      await handleAssign(engineerId);
      setShowAssignModal(false);
    } finally {
      setIsAssigning(false);
    }
  };

  // ── Submit report handler ──────────────────────────────────────────────────
  const onSubmitSuccess = (updatedTicket) => {
    setShowSubmitModal(false);
    refreshDetail(); // refresh agar status terbaru tampil
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-stone-400">
        <RefreshCw size={18} className="animate-spin" />
        <span className="text-sm">Memuat detail tiket...</span>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !ticket) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 text-sm font-medium">{error || 'Tiket tidak ditemukan.'}</p>
        <button onClick={() => navigate('/tickets')} className="mt-4 text-sm text-blue-500 hover:underline">
          Kembali ke daftar tiket
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">

      {/* Back button */}
      <button
        onClick={() => navigate('/tickets')}
        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 dark:hover:text-white transition-colors"
      >
        <ChevronLeft size={18} />
        Kembali ke Daftar Tiket
      </button>

      {/* Kartu utama */}
      <TicketDetailCard
        ticket={ticket}
        actionLoading={actionLoading}
        onAssignClick={() => setShowAssignModal(true)}
        onStart={handleStart}
        onSubmitClick={() => setShowSubmitModal(true)}
        onApprove={handleApprove}
      />

      {/* Modal Assign Engineer */}
      {showAssignModal && (
        <AssignModal
          ticket={ticket}
          onConfirm={onAssignConfirm}
          onClose={() => setShowAssignModal(false)}
          isSubmitting={isAssigning}
        />
      )}

      {/* Modal Submit Laporan */}
      {showSubmitModal && (
        <SubmitReportModal
          ticket={ticket}
          onSuccess={onSubmitSuccess}
          onClose={() => setShowSubmitModal(false)}
        />
      )}

    </div>
  );
};

export default TicketDetailPage;