import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, FileText, CheckCircle2 } from 'lucide-react';

import TicketCard from '../components/tickets/TicketCard';
import useTickets from '../hooks/useTickets'; 

const DUMMY_ENGINEERS = [
  { id: 'ENG-001', name: 'Luthfi' },
  { id: 'ENG-002', name: 'Bima' },
  { id: 'ENG-003', name: 'Teddy' },
  { id: 'ENG-004', name: 'Wijaya' }
];

const CURRENT_USER_ROLE = localStorage.getItem('user_role') || 'engineer'; 
const CURRENT_USER_ID = localStorage.getItem('user_id') || 'ENG-002'; 

const TicketsPage = () => {
  const navigate = useNavigate();

  const { 
    tickets: backendTickets, 
    loading, 
    error, 
    assignEngineer, 
    deleteTicket, 
    approveTicket,
    availableEngineers 
  } = useTickets();

  const [localTickets, setLocalTickets] = useState([]);
  
  const [activeTab, setActiveTab] = useState(
    CURRENT_USER_ROLE === 'admin' ? 'WAITING_ASSIGNMENT' : 'IN_PROGRESS'
  );
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [chosenEngineer, setChosenEngineer] = useState('');
  const [customAlert, setCustomAlert] = useState({ show: false, message: '' });

  useEffect(() => {
    if (backendTickets && Array.isArray(backendTickets)) {
      const simulatedData = localStorage.getItem('avatar_simulated_tickets');
      if (simulatedData) {
        const parsedSimulated = JSON.parse(simulatedData);
        const mergedTickets = backendTickets.map(bt => {
          const targetId = bt.id || bt.id_tiket;
          const matchSimulated = parsedSimulated.find(st => String(st.id || st.id_tiket) === String(targetId));
          return matchSimulated ? { ...bt, ...matchSimulated } : bt;
        });
        setLocalTickets(mergedTickets);
      } else {
        setLocalTickets(backendTickets);
      }
    }
  }, [backendTickets]);

  useEffect(() => {
    if (backendTickets && Array.isArray(backendTickets)) {
      const simulatedData = localStorage.getItem('avatar_simulated_tickets');
      if (simulatedData) {
        const parsedSimulated = JSON.parse(simulatedData);
        const mergedTickets = backendTickets.map(bt => {
          const targetId = bt.id || bt.id_tiket;
          const matchSimulated = parsedSimulated.find(st => String(st.id || st.id_tiket) === String(targetId));
          return matchSimulated ? { ...bt, ...matchSimulated } : bt;
        });
        setLocalTickets(mergedTickets);
      }
    }
  }, [activeTab]);

  const getNormalizedStatus = (statusString) => {
    const status = String(statusString || '').toUpperCase().trim();
    if (status === 'WAITING_ASSIGNMENT' || status === 'WAITING' || status === 'BELUM_DITUGASKAN' || status === 'BARU') {
      return 'WAITING_ASSIGNMENT';
    }
    if (status === 'IN_PROGRESS' || status === 'PROGRESS' || status === 'SEDANG_DIKERJAKAN' || status === 'KERJA') {
      return 'IN_PROGRESS';
    }
    if (status === 'WAITING_APPROVAL' || status === 'APPROVAL' || status === 'MENUNGGU_PERSETUJUAN' || status === 'REVIEW' || status.includes('APPROV')) {
      return 'WAITING_APPROVAL';
    }
    if (status === 'RESOLVED' || status === 'SELESAI') {
      return 'RESOLVED';
    }
    return status;
  };

  const getFilteredAndSortedTickets = () => {
    if (!localTickets || !Array.isArray(localTickets)) return [];
    
    const sorted = [...localTickets].sort((a, b) => {
      const statusA = String(a.status || a.status_tiket || '').toUpperCase();
      const statusB = String(b.status || b.status_tiket || '').toUpperCase();
      const getWeight = (status) => {
        if (status.includes('CRIT') || status.includes('DANGER') || status.includes('FAIL')) return 3;
        if (status.includes('WARN') || status.includes('ANOMALI') || status.includes('PROGRESS')) return 2;
        return 1;
      };
      return getWeight(statusB) - getWeight(statusA);
    });

    if (CURRENT_USER_ROLE === 'admin') {
      return sorted.filter(t => {
        const normalized = getNormalizedStatus(t.status || t.status_tiket);
        const hasEngineer = t.engineerId || t.id_engineer || t.engineer_id || t.engineerName || t.engineer_name;

        if (activeTab === 'WAITING_ASSIGNMENT') return normalized === 'WAITING_ASSIGNMENT' || !hasEngineer;
        if (activeTab === 'IN_PROGRESS') return normalized === 'IN_PROGRESS' && hasEngineer;
        if (activeTab === 'WAITING_APPROVAL') return normalized === 'WAITING_APPROVAL';
        return false;
      });
    }
    
    return sorted.filter(t => {
      const normalized = getNormalizedStatus(t.status || t.status_tiket);
      const currentEngId = String(t.engineerId || t.id_engineer || t.engineer_id || t.id_teknisi || '');
      const isMyTicket = currentEngId === String(CURRENT_USER_ID) || currentEngId === '2' || t.engineerName === 'Teddy';
      
      if (!isMyTicket) return false;
      if (activeTab === 'IN_PROGRESS') return normalized === 'IN_PROGRESS';
      if (activeTab === 'WAITING_APPROVAL') return normalized === 'WAITING_APPROVAL';
      if (activeTab === 'RESOLVED') return normalized === 'RESOLVED';
      return false;
    });
  };

  const getTabCount = (tabType) => {
    if (!localTickets || !Array.isArray(localTickets)) return 0;
    return localTickets.filter(t => {
      const normalized = getNormalizedStatus(t.status || t.status_tiket);
      const hasEngineer = t.engineerId || t.id_engineer || t.engineer_id || t.engineerName || t.engineer_name;

      if (CURRENT_USER_ROLE === 'admin') {
        if (tabType === 'WAITING_ASSIGNMENT') return normalized === 'WAITING_ASSIGNMENT' || !hasEngineer;
        if (tabType === 'IN_PROGRESS') return normalized === 'IN_PROGRESS' && hasEngineer;
        if (tabType === 'WAITING_APPROVAL') return normalized === 'WAITING_APPROVAL';
      } else {
        const currentEngId = String(t.engineerId || t.id_engineer || t.engineer_id || t.id_teknisi || '');
        const isMyTicket = currentEngId === String(CURRENT_USER_ID) || currentEngId === '2' || t.engineerName === 'Teddy';
        
        if (!isMyTicket) return false;
        if (tabType === 'IN_PROGRESS') return normalized === 'IN_PROGRESS';
        if (tabType === 'WAITING_APPROVAL') return normalized === 'WAITING_APPROVAL';
        if (tabType === 'RESOLVED') return normalized === 'RESOLVED';
      }
      return false;
    }).length;
  };

  const displayedTickets = getFilteredAndSortedTickets();
  const handleCardClick = (ticketId) => navigate(`/tickets/${ticketId}`);

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus dokumen tiket ini?")) {
      try {
        if (deleteTicket) await deleteTicket(ticketId);
        setLocalTickets(localTickets.filter(t => (t.id || t.id_tiket) !== ticketId));
      } catch (err) { console.error(err); }
    }
  };

  const handleAssignEngineerSubmit = async () => {
    if (!chosenEngineer || !selectedTicket) return;
    const ticketId = selectedTicket.id || selectedTicket.id_tiket;
    const engineerObj = engineerListOptions.find(e => e.id === chosenEngineer);
    const targetEngineerName = engineerObj ? (engineerObj.name || engineerObj.nama) : 'Teknisi Terpilih';

    const updatedTickets = localTickets.map(t => {
      const currentId = t.id || t.id_tiket;
      if (currentId === ticketId) {
        return {
          ...t,
          status: 'IN_PROGRESS',
          status_tiket: 'IN_PROGRESS',
          engineerId: chosenEngineer,
          id_engineer: chosenEngineer,
          engineer_id: chosenEngineer,
          engineerName: targetEngineerName,
          engineer_name: targetEngineerName
        };
      }
      return t;
    });

    const savedSimulated = localStorage.getItem('avatar_simulated_tickets');
    let currentSimulatedList = savedSimulated ? JSON.parse(savedSimulated) : [];
    const targetMatch = updatedTickets.find(t => (t.id || t.id_tiket) === ticketId);
    if (targetMatch) {
      currentSimulatedList = currentSimulatedList.filter(s => String(s.id || s.id_tiket) !== String(ticketId));
      currentSimulatedList.push(targetMatch);
    }
    localStorage.setItem('avatar_simulated_tickets', JSON.stringify(currentSimulatedList));

    setLocalTickets(updatedTickets);
    setShowAssignModal(false);
    setSelectedTicket(null);
    setChosenEngineer('');
    setActiveTab('IN_PROGRESS'); 
    
    setCustomAlert({
      show: true,
      message: `Tiket berhasil dibuat dan teknisi ${targetEngineerName} telah resmi ditugaskan.`
    });
  };

  const handleRedirectToReportPage = (ticketId) => {
    navigate(`/report/${ticketId}`);
  };

  const handleApproveTicketSubmit = async (ticketId) => {
    const updatedTickets = localTickets.map(t => {
      if ((t.id || t.id_tiket) === ticketId) {
        return { ...t, status: 'RESOLVED', status_tiket: 'RESOLVED' };
      }
      return t;
    });

    localStorage.setItem('avatar_simulated_tickets', JSON.stringify(updatedTickets));
    setLocalTickets(updatedTickets);
    setShowApprovalModal(false);
    setSelectedTicket(null);

    setCustomAlert({
      show: true,
      message: "Laporan perbaikan disetujui! Status tiket resmi ditutup dan dipindahkan ke Riwayat Selesai Teknisi."
    });
  };

  const engineerListOptions = availableEngineers || DUMMY_ENGINEERS;

  if (loading && localTickets.length === 0) return <div className="p-6 text-center text-sm text-gray-500 animate-pulse font-medium">Menghubungkan ke API server AVATAR...</div>;
  if (error && localTickets.length === 0) return <div className="p-6 text-center text-sm text-red-500 font-semibold">Gagal memuat data tiket.</div>;

  return (
    <div className="p-6 space-y-6 min-h-screen">
      
      {/* MODAL DIALOG KONFIRMASI TENGAH HALAMAN */}
      {customAlert.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl shadow-inner">
              <CheckCircle2 size={26} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">Berhasil</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{customAlert.message}</p>
            </div>
            <div className="pt-2">
              <button type="button" onClick={() => setCustomAlert({ show: false, message: '' })} className="w-full py-2 bg-gray-900 text-white text-xs font-bold rounded-xl shadow-md transition hover:bg-stone-800">Selesai</button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-gray-200 dark:border-stone-800 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pusat Kerja Pemeliharaan</h1>
        <p className="text-sm text-gray-500">Kelola alur kerja persetujuan perbaikan perangkat industri secara terpusat.</p>
      </div>

      {CURRENT_USER_ROLE === 'engineer' && (
        <div className="bg-blue-50 dark:bg-stone-900/40 border border-blue-100 dark:border-stone-800 p-4 rounded-xl text-xs text-blue-700 dark:text-blue-400 font-semibold mb-2">
          Daftar Surat Perintah Kerja Perbaikan Anda (ID Teknisi: {CURRENT_USER_ID})
        </div>
      )}

      {/* REVISI UKURAN TEKS TAB: Mengubah class px-4 py-2.5 text-xs menjadi text-base dan font-black */}
      {CURRENT_USER_ROLE === 'admin' ? (
        <div className="flex border-b border-gray-200 dark:border-stone-800 gap-4">
          <button type="button" onClick={() => setActiveTab('WAITING_ASSIGNMENT')} className={`px-5 py-3 text-base font-black rounded-t-xl flex items-center gap-2 border-b-2 transition-all ${activeTab === 'WAITING_ASSIGNMENT' ? 'border-purple-600 text-purple-600 bg-purple-50/40' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
            <AlertCircle size={16} /> Belum Ditugaskan ({getTabCount('WAITING_ASSIGNMENT')})
          </button>
          <button type="button" onClick={() => setActiveTab('IN_PROGRESS')} className={`px-5 py-3 text-base font-black rounded-t-xl flex items-center gap-2 border-b-2 transition-all ${activeTab === 'IN_PROGRESS' ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
            <Clock size={16} /> Sedang Dikerjakan ({getTabCount('IN_PROGRESS')})
          </button>
          <button type="button" onClick={() => setActiveTab('WAITING_APPROVAL')} className={`px-5 py-3 text-base font-black rounded-t-xl flex items-center gap-2 border-b-2 transition-all ${activeTab === 'WAITING_APPROVAL' ? 'border-orange-600 text-orange-600 bg-orange-50/40' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
            <FileText size={16} /> Review Laporan ({getTabCount('WAITING_APPROVAL')})
          </button>
        </div>
      ) : (
        <div className="flex border-b border-gray-200 dark:border-stone-800 gap-4">
          <button type="button" onClick={() => setActiveTab('IN_PROGRESS')} className={`px-5 py-3 text-base font-black rounded-t-xl flex items-center gap-2 border-b-2 transition-all ${activeTab === 'IN_PROGRESS' ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
            <Clock size={16} /> Sedang Dikerjakan ({getTabCount('IN_PROGRESS')})
          </button>
          <button type="button" onClick={() => setActiveTab('WAITING_APPROVAL')} className={`px-5 py-3 text-base font-black rounded-t-xl flex items-center gap-2 border-b-2 transition-all ${activeTab === 'WAITING_APPROVAL' ? 'border-amber-600 text-amber-600 bg-amber-50/40' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
            <AlertCircle size={16} /> Menunggu Approved ({getTabCount('WAITING_APPROVAL')})
          </button>
          <button type="button" onClick={() => setActiveTab('RESOLVED')} className={`px-5 py-3 text-base font-black rounded-t-xl flex items-center gap-2 border-b-2 transition-all ${activeTab === 'RESOLVED' ? 'border-emerald-600 text-emerald-600 bg-emerald-50/40' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
            <CheckCircle2 size={16} /> Selesai / Riwayat ({getTabCount('RESOLVED')})
          </button>
        </div>
      )}

      {/* GRID KARTU OPERASIONAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedTickets.length === 0 ? (
          <div className="col-span-full bg-gray-50 dark:bg-stone-950 border border-dashed border-gray-300 dark:border-stone-800 p-8 rounded-xl text-center text-sm text-gray-500">
            Tidak ada dokumen tiket aktif di kategori ini.
          </div>
        ) : (
          displayedTickets.map((ticket, index) => (
            <TicketCard 
              key={`${ticket.id || ticket.id_tiket}-${index}`}
              ticket={ticket}
              userRole={CURRENT_USER_ROLE}
              onCardClick={handleCardClick}
              onDelete={handleDeleteTicket}
              onAssign={(t) => { setSelectedTicket(t); setShowAssignModal(true); }}
              onReview={(t) => { setSelectedTicket(t); setShowApprovalModal(true); }}
              onEngineerReport={handleRedirectToReportPage}
            />
          ))
        )}
      </div>

      {/* MODAL DIALOG ADMIN */}
      {showAssignModal && selectedTicket && CURRENT_USER_ROLE === 'admin' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 border border-gray-200 p-6 rounded-xl max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tugaskan Personel</h3>
            <select value={chosenEngineer} onChange={(e) => setChosenEngineer(e.target.value)} className="w-full p-2.5 rounded-lg border bg-gray-50 text-sm text-gray-900 outline-none border-gray-300 focus:border-blue-500">
              <option value="">-- Pilih Teknisi Lapangan --</option>
              {engineerListOptions.map(e => <option key={e.id} value={e.id}>{e.name || e.nama_engineer || e.nama}</option>)}
            </select>
            <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
              <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">Batal</button>
              <button type="button" onClick={handleAssignEngineerSubmit} disabled={!chosenEngineer} className="px-4 py-2 bg-purple-600 text-white rounded-lg transition hover:bg-purple-700">Kirim Perintah</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL APPROVAL ADMIN */}
      {showApprovalModal && selectedTicket && CURRENT_USER_ROLE === 'admin' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 border border-gray-200 p-6 rounded-xl max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold">Review Hasil Kerja</h3>
            <div className="space-y-3 text-sm">
              <p><strong>Nama Mesin:</strong> {selectedTicket.assetName || selectedTicket.machine_name || selectedTicket.machine?.name}</p>
              <p><strong>Teknisi:</strong> {selectedTicket.engineerName || selectedTicket.engineer_name}</p>
              <p className="bg-gray-50 p-3 rounded-lg italic">"{selectedTicket.reportText || selectedTicket.report_text}"</p>
              { (selectedTicket.reportPhoto || selectedTicket.report_photo) && (
                <img src={selectedTicket.reportPhoto || selectedTicket.report_photo} alt="Bukti" className="w-full h-40 object-cover rounded-lg" />
              )}
            </div>
            <div className="flex justify-end gap-2 text-xs font-bold border-t pt-4">
              <button type="button" onClick={() => setShowApprovalModal(false)} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">Tutup</button>
              <button type="button" onClick={() => handleApproveTicketSubmit(selectedTicket.id || selectedTicket.id_tiket)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Valid & Approve Selesai</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TicketsPage;