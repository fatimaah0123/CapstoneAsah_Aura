import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Send, X, Package, Settings } from 'lucide-react';

// Components
import ReportPhoto from '../components/report/ReportPhoto';

// Hooks
import useReport from '../hooks/useReport';
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

  if (!ticket) return null;

  // Mode view: pakai evidenceImage dari riwayat
  // Mode submit: pakai image dari kamera/upload
  const displayImage = isViewOnly ? evidenceImage : image;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950 p-4 md:p-8 flex justify-center items-start transition-colors duration-500">
      
      <div className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-2xl border-2 border-black dark:border-stone-700 overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 md:p-8 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-stone-900 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-black transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
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

        {/* FORM */}
        <form onSubmit={(e) => handleSubmit(e, image)} className="p-6 md:p-12 space-y-10">

          {/* Aset Terdeteksi */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em]">Aset Terdeteksi</label>
            <div className="p-6 bg-gray-50 dark:bg-stone-800/50 rounded-3xl rounded-tl-none border border-stone-100 dark:border-stone-800 shadow-sm">
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
                className="w-full p-4 pl-12 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl focus:outline-none focus:border-blue-500 text-sm font-bold text-gray-900 dark:text-white transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
              className="w-full p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2rem] focus:outline-none focus:border-blue-500 text-sm font-medium text-gray-800 dark:text-white transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
                className="w-full md:w-auto px-20 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
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