import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Camera, Send, X, User, Package, 
  CheckCircle2, RefreshCw, Upload, Settings, FlipHorizontal,
  Ticket // Tambahkan ikon Ticket untuk konsistensi header
} from 'lucide-react';
import { getMaintenanceTicketById, updateMaintenanceTicket } from '../services/api';

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  
  const isViewOnly = searchParams.get('view') === 'true';

  const [ticket, setTicket] = useState(null);
  const [technicianName, setTechnicianName] = useState('');
  const [damageDesc, setDamageDesc] = useState('');
  const [spareParts, setSpareParts] = useState('');
  const [loading, setLoading] = useState(false);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); 
  const [image, setImage] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    fetchTicketDetail();
    listCameras();
    return () => stopCamera();
  }, [id]);

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    }
  }, [facingMode]);

  const fetchTicketDetail = async () => {
    try {
      const response = await getMaintenanceTicketById(id);
      if (response && response.data) {
        setTicket(response.data);
        if (isViewOnly) {
          setTechnicianName(response.data.technician_name || '');
          setDamageDesc(response.data.report_description || '');
          setSpareParts(response.data.spare_parts || '');
          setImage(response.data.evidence_image || null);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil rincian tiket:", error);
    }
  };

  const listCameras = async () => {
    try {
      const devs = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devs.filter(d => d.kind === 'videoinput');
      setDevices(videoDevs);
    } catch (err) {
      console.error("Akses kamera ditolak", err);
    }
  };

  const startCamera = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Gagal membuka kamera: " + err.message);
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      setImage(canvas.toDataURL('image/png'));
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
        status: 'RESOLVED'
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
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950 p-6 lg:p-10 transition-colors duration-500">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER: Disesuaikan dengan Screenshot Manajemen Tiket */}
        <div className="mb-10 flex items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-8">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
            <Ticket size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              {isViewOnly ? "Histori Perbaikan" : "Laporan Pekerjaan"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-stone-400 mt-2 font-medium">
              {isViewOnly ? "Detail riwayat perbaikan teknis unit" : "Lengkapi laporan penyelesaian tiket perbaikan"} #{id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KOLOM KIRI: FORM DATA DENGAN BORDER TEGAS */}
          <div className="space-y-6">

            <section className="bg-white dark:bg-stone-900 p-8 rounded-[2rem] shadow-sm border-2 border-stone-100 dark:border-stone-800 transition-all hover:border-blue-100 dark:hover:border-stone-700">
              <h3 className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Package size={16} /> Detail Temuan & Suku Cadang
              </h3>
              <div className="space-y-4">
                <textarea 
                  required 
                  placeholder="Deskripsikan detail kerusakan dan tindakan yang diambil..."
                  value={damageDesc} 
                  onChange={(e) => setDamageDesc(e.target.value)}
                  disabled={isViewOnly}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 h-32 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60 resize-none"
                />
                <textarea 
                  placeholder="Daftar suku cadang yang diganti (jika ada)..."
                  value={spareParts} 
                  onChange={(e) => setSpareParts(e.target.value)}
                  disabled={isViewOnly}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 h-24 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60 resize-none"
                />
              </div>
            </section>
          </div>

          {/* KOLOM KANAN: DOKUMENTASI FOTO DENGAN BORDER TEGAS */}
          <section className="bg-white dark:bg-stone-900 p-8 rounded-[2rem] shadow-sm border-2 border-stone-100 dark:border-stone-800 h-full flex flex-col transition-all hover:border-blue-100 dark:hover:border-stone-700">
            <h3 className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Camera size={16} /> Bukti Perbaikan (Foto)
            </h3>
            
            <div className="flex-1 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-3xl overflow-hidden relative group min-h-[300px] mb-6 bg-stone-50 dark:bg-stone-800/50">
              {image ? (
                <div className="h-full w-full relative">
                  <img src={image} alt="Bukti Visual" className="h-full w-full object-cover" />
                  {!isViewOnly && (
                    <button type="button" onClick={() => setImage(null)} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                      <RefreshCw size={18} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-10 text-center gap-4">
                  {!isViewOnly ? (
                    <>
                      <div className="p-5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full animate-pulse">
                        <Camera size={40} />
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        <button type="button" onClick={startCamera} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-blue-600/20">
                          <Camera size={16} /> Kamera
                        </button>
                        <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 px-6 py-2.5 bg-stone-800 dark:bg-stone-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all shadow-md">
                          <Upload size={16} /> Upload
                        </button>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </>
                  ) : (
                    <div className="text-stone-400 dark:text-stone-600 font-bold italic text-sm">Lampiran foto tidak tersedia</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 px-2">
              <CheckCircle2 className="text-blue-600" size={16} />
              <p className="text-[11px] font-semibold text-gray-500 dark:text-stone-400 tracking-normal italic leading-relaxed">
                Dokumentasi wajib jelas untuk validasi sistem AI AVATAR.
              </p>
            </div>
          </section>
        </div>

        {/* FOOTER ACTION */}
        {!isViewOnly && (
          <div className="pt-10 flex flex-col items-center border-t border-stone-200 dark:border-stone-800">
             <button 
                type="submit" 
                disabled={loading || !image}
                className="w-full md:w-auto px-16 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
             >
                {loading ? 'Mengirim Laporan...' : <><Send size={20} /> Submit Laporan Perbaikan</>}
             </button>
          </div>
        )}
      </form>

      {/* MODAL KAMERA */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="relative w-full max-w-2xl bg-stone-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-cover" />
            <div className="absolute bottom-8 left-0 w-full flex justify-center gap-6">
              <button type="button" onClick={toggleCamera} className="p-5 bg-stone-800 text-white rounded-full shadow-xl active:scale-90 transition-all">
                <FlipHorizontal size={28} />
              </button>
              <button type="button" onClick={takePhoto} className="p-5 bg-white text-black rounded-full shadow-xl active:scale-90 transition-all shadow-white/10">
                <Camera size={32} />
              </button>
              <button type="button" onClick={stopCamera} className="p-5 bg-red-600 text-white rounded-full shadow-xl active:scale-90 transition-all">
                <X size={28} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branding Bawah */}
      <div className="fixed bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600 shadow-lg"></div>
    </div>
  );
};

export default ReportPage;