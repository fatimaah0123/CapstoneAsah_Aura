import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Send, X, Package, Settings, CheckCircle2, XCircle } from 'lucide-react';

// Components
import ReportPhoto from '../components/report/ReportPhoto';

// Hooks
import {useReport} from '../hooks/useReport';
import useCamera from '../hooks/useCamera';

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Deteksi mode: view (riwayat) atau submit (pengisian laporan)
  const isViewOnly = searchParams.get('view') === 'true';

  const {
    ticket,
    technicianName, setTechnicianName,
    damageDesc, setDamageDesc,
    spareParts, setSpareParts,
    evidenceImage, // foto dari riwayat (mode view)
    loading,
    handleSubmit,
  } = useReport(id, isViewOnly, navigate);

  const {
    isCameraOpen,
    devices,
    selectedDevice, setSelectedDevice,
    image, setImage,
    videoRef,
    canvasRef,
    fileInputRef,
    startCamera,
    stopCamera,
    takePicture,
    handleFileChange,
    resetImage,
  } = useCamera();

  // STATE REVISI: Kontrol Modal Dialog Tengah Kustom yang Konsisten & Dinamis
  const [customAlert, setCustomAlert] = useState({ show: false, title: '', message: '', type: 'success' });

// PENCEGAPAN LOGIKA SUBMIT: Membungkus handleSubmit asli agar mengaktifkan dialog kustom tengah
// PENCEGAPAN LOGIKA SUBMIT: Simulasi lokal memaksa status bergeser ke WAITING_APPROVAL
  const handleFormSubmitWithModal = async (e) => {
    e.preventDefault();
    
    if (!damageDesc.trim()) {
      setCustomAlert({
        show: true,
        title: "Input Tidak Valid",
        message: "Silakan isi analisis perbaikan mesin terlebih dahulu.",
        type: "error"
      });
      return;
    }

    if (!image) {
      setCustomAlert({
        show: true,
        title: "Dokumentasi Kosong",
        message: "Silakan ambil foto bukti fisik pengerjaan mesin terlebih dahulu.",
        type: "error"
      });
      return;
    }

    try {
      // === BACKEND INTEGRATION PLACEHOLDER ===
      // Jalankan hit API backend asli bawaan useReport Anda jika server sudah siap
      // await handleSubmit(e, image);

      // ================= LOGIKA SIMULASI JALUR CEPAT FRONT-END =================
      // Ambil seluruh data tiket aktif yang tersimpan di browser saat ini
      const savedTickets = localStorage.getItem('avatar_simulated_tickets');
      let currentTicketsList = savedTickets ? JSON.parse(savedTickets) : [];

      // Jika data local storage kosong, kita salin data awal dari object ticket bawaan hook
      if (currentTicketsList.length === 0 && ticket) {
        currentTicketsList = [ticket];
      }

      // Update status tiket target menjadi WAITING_APPROVAL agar terlempar ke tab review admin
      const targetId = String(id);
      const isExist = currentTicketsList.some(t => String(t.id || t.id_tiket || t.ticket_id) === targetId);

      if (isExist) {
        currentTicketsList = currentTicketsList.map(t => {
          if (String(t.id || t.id_tiket || t.ticket_id) === targetId) {
            return {
              ...t,
              status: 'WAITING_APPROVAL',
              status_tiket: 'WAITING_APPROVAL',
              reportText: damageDesc,
              reportPhoto: image
            };
          }
          return t;
        });
      } else {
        // Jika data belum terdaftar, kita buat objek baru untuk disimulasikan
        currentTicketsList.push({
          id: targetId,
          id_tiket: targetId,
          ticket_id: targetId,
          status: 'WAITING_APPROVAL',
          status_tiket: 'WAITING_APPROVAL',
          reportText: damageDesc,
          reportPhoto: image,
          assetName: ticket.ticket_title || ticket.name,
          engineerId: localStorage.getItem('user_id') || 'ENG-002',
          engineerName: technicianName || 'Bima'
        });
      }

      // Simpan perubahan status simulasi ini ke localStorage agar bisa dibaca oleh TicketsPage
      localStorage.setItem('avatar_simulated_tickets', JSON.stringify(currentTicketsList));

      setCustomAlert({
        show: true,
        title: "Laporan Terkirim",
        message: "Simulasi Sukses! Laporan berhasil diunggah dan status tiket kini berpindah ke tahap Review Admin.",
        type: "success"
      });
    } catch (err) {
      setCustomAlert({
        show: true,
        title: "Pengiriman Gagal",
        message: "Gagal memproses pengiriman data laporan perbaikan.",
        type: "error"
      });
    }
  };

  if (!ticket) return null;

  // Mode view: pakai evidenceImage dari riwayat
  // Mode submit: pakai image dari kamera/upload
  const displayImage = isViewOnly ? evidenceImage : image;

  return (
    // VISUALISASI BARU: Latar belakang gradasi halus & bermain dengan ornamen glow blur agar tidak monoton putih polos
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-blue-50/50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 p-4 md:p-8 flex justify-center items-start transition-colors duration-500 relative overflow-hidden">
      
      {/* Ornamen Grafis Abstrak Menyala di Pojok Belakang Layar */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= REVISI UTAMA: MODAL DIALOG KONFIRMASI TENGAH HALAMAN (KONSISTEN) ================= */}
      {customAlert.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm animate-fadeIn">
          <div className="bg-white/90 dark:bg-stone-900/90 border border-white/20 dark:border-stone-800 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl backdrop-blur-md transform scale-100 transition-all duration-300">
            
            {/* Logika Deteksi Ikon Visual: Hijau untuk sukses, merah untuk kasus gagal */}
            {customAlert.type === 'success' ? (
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl shadow-inner">
                <CheckCircle2 size={26} />
              </div>
            ) : (
              <div className="w-12 h-12 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto text-xl shadow-inner">
                <XCircle size={26} />
              </div>
            )}
            
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">{customAlert.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {customAlert.message}
              </p>
            </div>
            
            <div className="pt-2">
              <button 
                type="button" 
                onClick={() => {
                  setCustomAlert({ show: false, title: '', message: '', type: 'success' });
                  if (customAlert.type === 'success') navigate('/tickets'); // Redirect jika sukses kirim
                }}
                className={`w-full py-2.5 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 duration-200
                  ${customAlert.type === 'success' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20' 
                    : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-500/20'}`}
              >
                {customAlert.type === 'success' ? 'Kembali ke Dashboard' : 'Tutup & Perbaiki'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTAINER UTAMA: Ditambahkan efek Glassmorphism tipis agar menyatu dengan gradasi latar belakang */}
      <div className="w-full max-w-4xl bg-white/95 dark:bg-stone-900/95 rounded-[2.5rem] shadow-2xl border-2 border-black dark:border-stone-700 overflow-hidden backdrop-blur-md relative z-10">
        
        {/* HEADER */}
        <div className="p-6 md:p-8 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white/90 dark:bg-stone-900/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-500/20">
                <Settings size={18} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                  {isViewOnly ? 'Riwayat Perbaikan' : 'Detail Pelaporan'}
                </h2>
                <p className="text-[10px] text-gray-500 dark:text-stone-400 mt-3 flex items-center gap-1 font-bold uppercase tracking-widest leading-none">
                  <span className={`w-1.5 h-1.5 rounded-full ${isViewOnly ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                  {isViewOnly ? 'Mode Tampilan Riwayat' : 'Sistem Validasi Aktif'}
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-1.5 bg-gray-50 dark:bg-stone-800 rounded-full border border-stone-200 dark:border-stone-700">
            ID: {ticket.ticket_id || ticket.id}
          </div>
        </div>

        {/* FORM: Handler diarahkan ke fungsi pembungkus modal kustom baru */}
        <form onSubmit={handleFormSubmitWithModal} className="p-6 md:p-12 space-y-10">

          {/* Aset Terdeteksi */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em]">Aset Terdeteksi</label>
            <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/20 dark:from-stone-800/50 dark:to-stone-800/20 rounded-3xl rounded-tl-none border border-stone-100 dark:border-stone-800 shadow-inner">
              <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight uppercase italic tracking-tighter">
                {ticket.ticket_title || ticket.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-stone-400 mt-2 leading-relaxed font-medium italic">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Suku Cadang */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Suku Cadang</label>
            <div className="relative">
              <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                value={spareParts}
                onChange={(e) => setSpareParts(e.target.value)}
                placeholder="Contoh: Bearing SKF..."
                disabled={isViewOnly}
                className="w-full p-4 pl-12 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 text-sm font-bold text-gray-900 dark:text-white transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Analisis Perbaikan */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Analisis Perbaikan</label>
            <textarea 
              rows="4"
              value={damageDesc}
              onChange={(e) => setDamageDesc(e.target.value)}
              placeholder="Jelaskan detail tindakan teknis yang telah diambil..."
              disabled={isViewOnly}
              required={!isViewOnly}
              className="w-full p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2rem] focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 text-sm font-medium text-gray-800 dark:text-white transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            ></textarea>
          </div>

          {/* Dokumentasi Visual */}
          <ReportPhoto
            image={displayImage}
            isCameraOpen={isCameraOpen}
            devices={devices}
            selectedDevice={selectedDevice}
            setSelectedDevice={setSelectedDevice}
            videoRef={videoRef}
            fileInputRef={fileInputRef}
            startCamera={startCamera}
            stopCamera={stopCamera}
            takePicture={takePicture}
            handleFileChange={handleFileChange}
            resetImage={resetImage}
            isViewOnly={isViewOnly}
          />

          {/* Footer Action - hanya tampil saat mode submit */}
          {!isViewOnly && (
            <div className="pt-10 flex flex-col items-center border-t border-stone-100 dark:border-stone-800">
              <button 
                type="submit"
                disabled={loading || !image}
                className="w-full md:w-auto px-20 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {loading ? 'MEMPROSES DATA...' : <><Send size={20} /> SUBMIT LAPORAN SELESAI</>}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Canvas di luar form untuk capture foto */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ReportPage;