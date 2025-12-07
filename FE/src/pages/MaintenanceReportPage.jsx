import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Camera, Save, X, Plus, Trash2, Wrench, CheckCircle2, 
  AlertTriangle, ChevronLeft 
} from 'lucide-react';

const MaintenanceReportPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // --- STATE DATA ---
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  
  // State Form Laporan
  const [status, setStatus] = useState('completed'); 
  const [formData, setFormData] = useState({
    actionsTaken: '',
    notes: '',
  });
  const [spareParts, setSpareParts] = useState([{ name: '', quantity: 1 }]);
  const [photos, setPhotos] = useState([]);

  // --- STATE KAMERA ---
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  // 1. Load Data Tiket saat halaman dibuka
  useEffect(() => {
    const tickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');
    const found = tickets.find(t => t.id === id);
    if (found) {
      setTicketData(found);
    } else {
      // Jika reload dan data hilang (karena localstorage), handle graceful degradation
      setTicketData({ assetName: 'Unknown Asset', id: id });
    }
  }, [id]);

  // --- LOGIC KAMERA YANG DIPERBAIKI ---

  // Fungsi: Menyalakan Kamera
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      // Mengutamakan kamera belakang (environment)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Gagal mengakses kamera. Pastikan izin diberikan.");
      setIsCameraOpen(false);
    }
  };

  // Fungsi: Mematikan Kamera (Stop Stream & Update UI)
  const stopCamera = () => {
    if (stream) {
      // Hentikan semua track (video/audio) agar lampu kamera mati
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  // Fungsi: Ambil Foto -> Simpan -> Matikan Kamera Otomatis
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      // Set ukuran canvas sesuai resolusi video asli
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Gambar frame video ke canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas ke Blob/URL Gambar
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          // 1. Simpan ke state photos
          setPhotos(prev => [...prev, { id: Date.now(), url: imageUrl }]);
          
          // 2. MATIKAN KAMERA OTOMATIS SETELAH AMBIL GAMBAR
          stopCamera();
        }
      }, 'image/jpeg', 0.8); // Kualitas JPG 80%
    }
  };

  // Cleanup: Matikan kamera jika user menekan tombol Back browser / pindah halaman
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // --- LOGIC LAINNYA (Spareparts & Submit) ---
  const removePhoto = (pid) => setPhotos(prev => prev.filter(p => p.id !== pid));
  
  const handleSparePartChange = (index, field, value) => {
    const newParts = [...spareParts];
    newParts[index][field] = value;
    setSpareParts(newParts);
  };
  const addSparePart = () => setSpareParts([...spareParts, { name: '', quantity: 1 }]);
  const removeSparePart = (index) => setSpareParts(spareParts.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Update data di LocalStorage
    const tickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');
    const updatedTickets = tickets.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'Completed',
          completedAt: new Date().toISOString(),
          report: {
            finalStatus: status,
            actionsTaken: formData.actionsTaken,
            spareParts: spareParts,
            photos: photos.map(p => p.url) // Hanya URL Blob sementara
          }
        };
      }
      return t;
    });

    localStorage.setItem('aura_tickets', JSON.stringify(updatedTickets));

    setTimeout(() => {
      setLoading(false);
      alert('Laporan berhasil disimpan!');
      navigate('/tickets');
    }, 1000);
  };

  if (!ticketData) return <div className="p-10 text-center text-gray-500">Memuat Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Laporan Maintenance</h1>
          <p className="text-xs text-gray-500">{ticketData.assetName} • #{ticketData.id}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Status Akhir */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600"/> Status Akhir Mesin
            </h3>
            <div className="flex gap-4 flex-col sm:flex-row">
               <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${status === 'completed' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="status" value="completed" checked={status === 'completed'} onChange={() => setStatus('completed')} className="hidden" />
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${status === 'completed' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-400'}`}>
                  {status === 'completed' && <CheckCircle2 size={12} />}
                </div>
                <div className="font-bold text-gray-800 text-sm">Selesai (Fixed)</div>
              </label>
              <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${status === 'pending' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="status" value="pending" checked={status === 'pending'} onChange={() => setStatus('pending')} className="hidden" />
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${status === 'pending' ? 'border-orange-600 bg-orange-600 text-white' : 'border-gray-400'}`}>
                  {status === 'pending' && <CheckCircle2 size={12} />}
                </div>
                <div className="font-bold text-gray-800 text-sm">Butuh Monitoring</div>
              </label>
            </div>
          </div>

          {/* 2. Detail Pengerjaan */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Wrench size={18} className="text-blue-600"/> Laporan Pengerjaan
            </h3>
            <textarea 
              required
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
              placeholder="Jelaskan detail perbaikan yang dilakukan..."
              value={formData.actionsTaken}
              onChange={(e) => setFormData({...formData, actionsTaken: e.target.value})}
            />
          </div>

           {/* 3. Suku Cadang */}
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-blue-600"/> Penggantian Part
            </h3>
            {spareParts.map((part, i) => (
              <div key={i} className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  placeholder="Nama Spare Part" 
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={part.name} 
                  onChange={(e) => handleSparePartChange(i, 'name', e.target.value)} 
                />
                <input 
                  type="number" 
                  min="1"
                  className="w-20 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={part.quantity} 
                  onChange={(e) => handleSparePartChange(i, 'quantity', e.target.value)} 
                />
                {spareParts.length > 1 && (
                  <button type="button" onClick={() => removeSparePart(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSparePart} className="text-sm text-blue-600 font-medium flex items-center gap-1 mt-2 hover:text-blue-700">
              <Plus size={16} /> Tambah Item
            </button>
          </div>

          {/* 4. Bukti Dokumentasi (FITUR KAMERA) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Camera size={18} className="text-blue-600"/> Dokumentasi Bukti
            </h3>
            
            {/* Tampilan Kamera Aktif */}
            {isCameraOpen ? (
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video mb-4 shadow-lg">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                
                {/* Overlay Tombol Kamera */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center items-center gap-8">
                  {/* Tombol Tutup (X) - Matikan Kamera */}
                  <button 
                    type="button" 
                    onClick={stopCamera} 
                    className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                  >
                    <X size={24} />
                  </button>
                  
                  {/* Tombol Shutter - Ambil Foto & Matikan Kamera */}
                  <button 
                    type="button" 
                    onClick={capturePhoto} 
                    className="p-1 rounded-full border-4 border-white/30 active:scale-95 transition-transform"
                  >
                    <div className="w-14 h-14 bg-white rounded-full shadow-lg"></div>
                  </button>
                  
                  {/* Spacer agar shutter di tengah */}
                  <div className="w-12"></div>
                </div>
              </div>
            ) : (
              // Tombol Buka Kamera (Jika kamera mati)
              <button 
                type="button" 
                onClick={startCamera} 
                className="w-full py-8 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl text-blue-600 flex flex-col items-center gap-3 mb-4 hover:bg-blue-50 transition-colors group"
              >
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <span className="text-sm font-medium">Buka Kamera & Ambil Foto</span>
              </button>
            )}

            {/* Gallery Foto */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {photos.map(p => (
                  <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={p.url} alt="Proof" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removePhoto(p.id)} 
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tombol Simpan Laporan */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2 active:scale-95"
          >
            {loading ? 'Menyimpan...' : <><Save size={20} /> Simpan Laporan Selesai</>}
          </button>

        </form>
      </div>
    </div>
  );
};

export default MaintenanceReportPage;