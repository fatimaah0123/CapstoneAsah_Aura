import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, Clock, FileText, CheckCircle2, 
  UserCheck, Trash2, UserPlus, Eye, ThumbsUp, XCircle 
} from 'lucide-react';

const CURRENT_USER_ROLE = 'admin'; // 'admin' atau 'engineer'
const CURRENT_USER_ID = 'ENG-001'; 

const TicketsPage = () => {
  const navigate = useNavigate();

  // State Utama Tiket Kerja Aktif
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-101',
      assetName: 'Motor 16',
      description: 'Suhu bearing melebihi ambang batas aman (300°C)',
      status: 'WAITING_ASSIGNMENT', 
      engineerId: null,
      engineerName: null,
      reportText: '',
      reportPhoto: null
    },
    {
      id: 'TKT-102',
      assetName: 'Generator 31',
      description: 'Rotational speed tidak stabil, penurunan tegangan listrik',
      status: 'IN_PROGRESS', 
      engineerId: 'ENG-001',
      engineerName: 'Bara',
      reportText: '',
      reportPhoto: null
    },
    {
      id: 'TKT-103',
      assetName: 'Compressor 33',
      description: 'Kebocoran katup tekanan udara utama',
      status: 'WAITING_APPROVAL', 
      engineerId: 'ENG-002',
      engineerName: 'Rian',
      reportText: 'Sudah dilakukan penggantian seal katup utama dan uji tekanan ulang. Hasil normal.',
      reportPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'
    }
  ]);

  const availableEngineers = [
    { id: 'ENG-001', name: 'Bara' },
    { id: 'ENG-002', name: 'Rian' },
    { id: 'ENG-003', name: 'Siti' }
  ];

  // State untuk Tab Admin (3 Bagian)
  const [activeTab, setActiveTab] = useState('WAITING_ASSIGNMENT');
  
  // State Modals
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [chosenEngineer, setChosenEngineer] = useState('');

  // 1. FILTER DATA TIKET BERDASARKAN ROLE & TAB
  const getFilteredTickets = () => {
    if (CURRENT_USER_ROLE === 'admin') {
      return tickets.filter(t => t.status === activeTab);
    }
    return tickets.filter(t => t.engineerId === CURRENT_USER_ID && t.status !== 'RESOLVED');
  };

  const displayedTickets = getFilteredTickets();

  // 2. AKSI ADMIN: Hapus Tiket buatan Sistem
  const handleDeleteTicket = (ticketId) => {
    if(window.confirm("Apakah Anda yakin ingin menghapus tiket buatan sistem ini?")) {
      setTickets(tickets.filter(t => t.id !== ticketId));
    }
  };

  // 3. AKSI ADMIN: Lanjut (Input Teknisi yang Ditugaskan)
  const handleAssignEngineer = () => {
    const engineer = availableEngineers.find(e => e.id === chosenEngineer);
    if (!engineer) return;

    setTickets(tickets.map(t => 
      t.id === selectedTicket.id 
        ? { ...t, status: 'IN_PROGRESS', engineerId: engineer.id, engineerName: engineer.name }
        : t
    ));
    setShowAssignModal(false);
    setSelectedTicket(null);
    setChosenEngineer('');
    setActiveTab('IN_PROGRESS'); 
  };

  // 4. AKSI ADMIN: Approve Laporan & Selesaikan
  const handleApproveTicket = (ticketId) => {
    setTickets(tickets.filter(t => t.id !== ticketId)); 
    setShowApprovalModal(false);
    setSelectedTicket(null);
    alert("Tiket berhasil disetujui dan telah resmi diarsipkan ke Riwayat Pemeliharaan.");
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      
      {/* HEADER */}
      <div className="border-b border-gray-200 dark:border-stone-800 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pusat Kerja Pemeliharaan
        </h1>
        <p className="text-sm text-gray-500">
          {CURRENT_USER_ROLE === 'admin' 
            ? 'Kelola alur kerja persetujuan perbaikan perangkat industri secara terpusat.' 
            : 'Daftar tugas lapangan aktif yang ditugaskan kepada Anda.'}
        </p>
      </div>

      {/* RENDER 3 BAGIAN TAB KHUSUS UNTUK ROLE ADMIN */}
      {CURRENT_USER_ROLE === 'admin' && (
        <div className="flex border-b border-gray-200 dark:border-stone-800 gap-2">
          <button 
            type="button"
            onClick={() => setActiveTab('WAITING_ASSIGNMENT')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg flex items-center gap-1.5 border-b-2 transition-all
              ${activeTab === 'WAITING_ASSIGNMENT' 
                ? 'border-purple-600 text-purple-600 bg-purple-50/40 dark:bg-purple-950/10' 
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <AlertCircle size={14} />
            Belum Ditugaskan ({tickets.filter(t => t.status === 'WAITING_ASSIGNMENT').length})
          </button>
          
          <button 
            type="button"
            onClick={() => setActiveTab('IN_PROGRESS')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg flex items-center gap-1.5 border-b-2 transition-all
              ${activeTab === 'IN_PROGRESS' 
                ? 'border-blue-600 text-blue-600 bg-blue-50/40 dark:bg-blue-950/10' 
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Clock size={14} />
            Sedang Dikerjakan ({tickets.filter(t => t.status === 'IN_PROGRESS').length})
          </button>
          
          <button 
            type="button"
            onClick={() => setActiveTab('WAITING_APPROVAL')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg flex items-center gap-1.5 border-b-2 transition-all
              ${activeTab === 'WAITING_APPROVAL' 
                ? 'border-orange-600 text-orange-600 bg-orange-50/40 dark:bg-orange-950/10' 
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <FileText size={14} />
            Review Laporan ({tickets.filter(t => t.status === 'WAITING_APPROVAL').length})
          </button>
        </div>
      )}

      {/* DAFTAR TIKET GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedTickets.length === 0 ? (
          <div className="col-span-full bg-gray-50 dark:bg-stone-950 border border-dashed border-gray-300 dark:border-stone-800 p-8 rounded-xl text-center text-sm text-gray-500">
            Tidak ada tiket di kategori ini.
          </div>
        ) : (
          displayedTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
              
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-400">#{ticket.id}</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                    ${ticket.status === 'WAITING_ASSIGNMENT' ? 'bg-purple-100 text-purple-700' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">{ticket.assetName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{ticket.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-stone-800 text-xs text-gray-500 flex items-center gap-2">
                  <UserCheck size={14} />
                  <span>Teknisi: <strong className="text-gray-700 dark:text-gray-300">{ticket.engineerName || 'Belum Ditunjuk'}</strong></span>
                </div>
              </div>

              {/* PANEL AKSI DAN KONTROL TOMBOL */}
              <div className="bg-gray-50 dark:bg-stone-950 p-4 border-t border-gray-100 dark:border-stone-800 flex justify-end gap-2">
                {CURRENT_USER_ROLE === 'admin' ? (
                  <>
                    {ticket.status === 'WAITING_ASSIGNMENT' && (
                      <>
                        <button 
                          type="button"
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="flex items-center gap-1 px-3 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 text-xs font-bold rounded-lg transition shadow-sm"
                        >
                          <Trash2 size={13} /> Hapus
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setSelectedTicket(ticket); setShowAssignModal(true); }}
                          className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
                        >
                          <UserPlus size={13} /> Lanjut (Tugaskan)
                        </button>
                      </>
                    )}

                    {ticket.status === 'IN_PROGRESS' && (
                      <span className="text-xs text-blue-600 font-semibold italic flex items-center gap-1">
                        <Clock size={13} /> Sedang Diperbaiki Teknisi...
                      </span>
                    )}

                    {ticket.status === 'WAITING_APPROVAL' && (
                      <button 
                        type="button"
                        onClick={() => { setSelectedTicket(ticket); setShowApprovalModal(true); }}
                        className="flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
                      >
                        <Eye size={13} /> Review & Approve
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {ticket.status === 'IN_PROGRESS' && (
                      <button 
                        type="button"
                        onClick={() => navigate(`/report/${ticket.id}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                      >
                        Kirim Laporan Kerja
                      </button>
                    )}
                  </>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* ================= MODAL DIALOG: INPUT TEKNISI (BAGIAN 1) ================= */}
      {showAssignModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 p-6 rounded-xl max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tugaskan Personel</h3>
            <p className="text-xs text-gray-500">Tunjuk engineer ahli untuk memproses penanganan kerusakan pada <strong>{selectedTicket.assetName}</strong>.</p>
            
            <select 
              value={chosenEngineer} 
              onChange={(e) => setChosenEngineer(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-stone-800 dark:border-stone-700 text-sm text-gray-900 dark:text-white outline-none"
            >
              <option value="">-- Pilih Teknisi Lapangan --</option>
              {availableEngineers.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
            </select>

            <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
              <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 rounded-lg">Batal</button>
              <button type="button" onClick={handleAssignEngineer} disabled={!chosenEngineer} className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50">Kirim Perintah</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DIALOG: REVIEW & APPROVE LAPORAN (BAGIAN 3) ================= */}
      {showApprovalModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 p-6 rounded-xl max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-stone-800 pb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">Review Hasil Kerja</h3>
              <span className="text-xs font-mono font-bold text-gray-400">#{selectedTicket.id}</span>
            </div>

            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <span className="text-xs text-gray-400 block">Nama Mesin:</span>
                <span className="font-bold">{selectedTicket.assetName}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Teknisi Pelaksana:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedTicket.engineerName}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Deskripsi Hasil Lapangan:</span>
                <p className="bg-gray-50 dark:bg-stone-950 p-3 rounded-lg italic text-xs text-gray-500 mt-1">
                  "{selectedTicket.reportText}"
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-1">Lampiran Bukti Visual Fisik:</span>
                <img src={selectedTicket.reportPhoto} alt="Bukti" className="w-full h-40 object-cover rounded-lg border border-gray-200" />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-bold pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setShowApprovalModal(false)} className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-stone-800 text-gray-700 dark:text-gray-300 rounded-lg">
                <XCircle size={14} /> Tutup
              </button>
              <button type="button" onClick={() => handleApproveTicket(selectedTicket.id)} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md">
                <ThumbsUp size={14} /> Valid & Approve Selesai
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TicketsPage;