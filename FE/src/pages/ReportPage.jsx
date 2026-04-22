import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Camera, Send, X, User, Package, 
  CheckCircle2, RefreshCw, Upload, Settings,
  AlertCircle
} from 'lucide-react';
import { getMaintenanceTicketById, updateMaintenanceTicket } from '../services/api';

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  
  // Mode Check: Jika URL mengandung ?view=true, maka form tidak bisa diedit
  const isViewOnly = searchParams.get('view') === 'true';
  
  const [ticket, setTicket] = useState(null);
  const [technicianName, setTechnicianName] = useState('');
  const [damageDesc, setDamageDesc] = useState('');
  const [spareParts, setSpareParts] = useState('');
  const [loading, setLoading] = useState(false);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [image, setImage] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    fetchTicketDetail();
    if (!isViewOnly) {
      listCameras();
    }
    return () => stopCamera();
  }, [id]);

  const fetchTicketDetail = async () => {
    try {
      const response = await getMaintenanceTicketById(id);
      if (response && response.data) {
        setTicket(response.data);
        // Jika mode lihat riwayat, isi state dengan data dari database
        if (isViewOnly) {
          setTechnicianName(response.data.technician_name || '');
          setDamageDesc(response.data.report_description || '');
          setSpareParts(response.data.spare_parts || '');
          setImage(response.data.evidence_image || null);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil detail tiket:", error);
    }
  };

  const listCameras = async () => {
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devs.filter(d => d.kind === 'videoinput');
      setDevices(videoDevs);
      if (videoDevs.length > 0) setSelectedDevice(videoDevs[0].deviceId);
    } catch (err) {
      console.error("Gagal akses kamera:", err);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDevice ? { exact: selectedDevice } : undefined }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error start camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewOnly) return;

    setLoading(true);
    try {
      const payload = {
        technician_name: technicianName,
        report_description: damageDesc,
        spare_parts: spareParts,
        evidence_image: image,
        ticket_status: 'RESOLVED'
      };
      await updateMaintenanceTicket(id, payload);
      alert("Laporan berhasil dikirim!");
      navigate('/tickets');
    } catch (err) {
      alert("Gagal mengirim laporan.");
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return <div className="p-20 text-center font-bold">Memuat Data Tiket...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950 p-4 md:p-8 flex justify-center items-start transition-colors duration-500">
      <div className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-2xl border-2 border-black dark:border-stone-700 overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 md:p-8 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-stone-900">
           <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-none uppercase italic tracking-tighter">
                {isViewOnly ? "Riwayat Laporan Perbaikan" : "Laporan Teknis Mesin"}
              </h2>
              <p className="text-[10px] font-bold text-blue-600 mt-2 tracking-[0.2em] uppercase">Tiket ID: #{id}</p>
            </div>
          </div>
          <div className="hidden md:block">
            <Settings className="text-gray-300 animate-spin-slow" size={24} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-10">
          
          {/* SECTION 1: INFORMASI DASAR */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 dark:text-stone-500 uppercase tracking-[0.2em] ml-1">Nama Teknisi</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                <input 
                  disabled={isViewOnly}
                  type="text" required placeholder="Input nama lengkap"
                  value={technicianName} onChange={(e) => setTechnicianName(e.target.value)}
                  className={`w-full bg-gray-50 dark:bg-stone-800 border-2 border-stone-100 dark:border-stone-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all ${isViewOnly && 'opacity-70 cursor-not-allowed'}`}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 dark:text-stone-500 uppercase tracking-[0.2em] ml-1">Suku Cadang Digunakan</label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                <input 
                  disabled={isViewOnly}
                  type="text" placeholder="Contoh: Bearing SKF, Belt V-42"
                  value={spareParts} onChange={(e) => setSpareParts(e.target.value)}
                  className={`w-full bg-gray-50 dark:bg-stone-800 border-2 border-stone-100 dark:border-stone-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all ${isViewOnly && 'opacity-70 cursor-not-allowed'}`}
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: ANALISIS KERUSAKAN */}
          <section className="space-y-3">
            <label className="text-[11px] font-bold text-gray-400 dark:text-stone-500 uppercase tracking-[0.2em] ml-1">Analisis & Tindakan Perbaikan</label>
            <textarea 
              disabled={isViewOnly}
              required rows="5"
              placeholder="Deskripsikan penyebab kerusakan dan langkah perbaikan yang telah dilakukan..."
              value={damageDesc} onChange={(e) => setDamageDesc(e.target.value)}
              className={`w-full bg-gray-50 dark:bg-stone-800 border-2 border-stone-100 dark:border-stone-700 rounded-[2rem] p-6 text-gray-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-600 transition-all leading-relaxed ${isViewOnly && 'opacity-70 cursor-not-allowed'}`}
            ></textarea>
          </section>

          {/* SECTION 3: BUKTI PERBAIKAN (KAMERA / UPLOAD) */}
          <section className="space-y-6">
            <label className="text-[11px] font-bold text-gray-400 dark:text-stone-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              Bukti Visual Selesai Perbaikan {isViewOnly && <span className="text-blue-500">(Dokumentasi Terlampir)</span>}
            </label>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Preview Box */}
              <div className="relative group aspect-video bg-gray-100 dark:bg-stone-800 rounded-[2rem] border-2 border-dashed border-stone-200 dark:border-stone-700 overflow-hidden flex items-center justify-center">
                {image ? (
                  <img src={image} alt="Evidence" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-8">
                    <Camera className="mx-auto text-gray-300 mb-2" size={48} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Belum ada foto</p>
                  </div>
                )}
                {image && !isViewOnly && (
                  <button 
                    type="button" onClick={() => setImage(null)}
                    className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
              </div>

              {/* Controls (Hanya muncul jika bukan mode Lihat) */}
              {!isViewOnly && (
                <div className="space-y-4">
                  {isCameraOpen ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl overflow-hidden border-2 border-blue-600 bg-black aspect-video">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={takePhoto} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase">Ambil Gambar</button>
                        <button type="button" onClick={stopCamera} className="px-4 py-3 bg-gray-200 rounded-xl"><X size={18}/></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <button type="button" onClick={startCamera} className="w-full py-4 bg-stone-900 dark:bg-white dark:text-stone-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95">
                        <Camera size={18} /> Aktifkan Kamera
                      </button>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-gray-900 dark:text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-transform active:scale-95">
                        <Upload size={18} /> Upload Galeri
                      </button>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 px-2">
              <CheckCircle2 className="text-blue-600" size={14} />
              <p className="text-[10px] font-bold text-gray-500 tracking-widest italic leading-relaxed uppercase">
                SOP: Dokumentasi wajib jelas untuk validasi sistem reliabilitas AVATAR.
              </p>
            </div>
          </section>

          {/* FOOTER ACTION */}
          {!isViewOnly && (
            <div className="pt-10 flex flex-col items-center border-t border-stone-100 dark:border-stone-800">
               <button 
                  type="submit" disabled={loading || !image}
                  className="w-full md:w-auto px-20 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
               >
                  {loading ? 'MEMPROSES DATA...' : <><Send size={20} /> SUBMIT LAPORAN SELESAI</>}
               </button>
            </div>
          )}
        </form>

        {/* Hidden canvas for taking photos */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default ReportPage;