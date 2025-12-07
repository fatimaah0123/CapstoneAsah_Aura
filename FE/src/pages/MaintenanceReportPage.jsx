import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Camera, Save, X, Plus, Trash2, Wrench, CheckCircle2, 
  AlertTriangle, Upload, Image as ImageIcon, ChevronLeft 
} from 'lucide-react';

const MaintenanceReportPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil ID tiket dari URL
  
  // --- State Management ---
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('completed'); // 'completed' | 'pending'
  const [photos, setPhotos] = useState([]);
  
  // State Form
  const [formData, setFormData] = useState({
    actionsTaken: '',
    notes: '',
  });

  // State Spare Parts
  const [spareParts, setSpareParts] = useState([{ name: '', quantity: 1 }]);

  // State Kamera
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  // --- Logic Kamera (Diadaptasi dari new-page.js ke React) ---
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer kamera belakang HP
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Gagal akses kamera:", err);
      alert("Tidak dapat mengakses kamera. Pastikan izin diberikan.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      // Set ukuran canvas sesuai video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Gambar video ke canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert ke Blob/URL
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setPhotos(prev => [...prev, { id: Date.now(), url: imageUrl, file: blob }]);
        stopCamera(); // Tutup kamera setelah ambil foto
      }, 'image/jpeg', 0.8);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  // --- Logic Spare Parts ---
  const handleSparePartChange = (index, field, value) => {
    const newParts = [...spareParts];
    newParts[index][field] = value;
    setSpareParts(newParts);
  };

  const addSparePart = () => {
    setSpareParts([...spareParts, { name: '', quantity: 1 }]);
  };

  const removeSparePart = (index) => {
    const newParts = spareParts.filter((_, i) => i !== index);
    setSpareParts(newParts);
  };

  // --- Submit Handler ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi Request API
    const payload = {
      ticketId: id,
      status,
      ...formData,
      spareParts,
      evidencePhotos: photos.map(p => p.file)
    };

    console.log("Data Laporan Dikirim:", payload);

    setTimeout(() => {
      setLoading(false);
      alert('Laporan Maintenance Berhasil Disimpan!');
      navigate('/inspections'); // Kembali ke halaman list
    }, 1500);
  };

  // Cleanup saat component unmount (matikan kamera)
  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Laporan Maintenance</h1>
            <p className="text-xs text-gray-500">Tiket ID: #{id || 'NEW'} • Mesin: Turbin Gas #04</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Status Akhir */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600"/> Status Akhir Mesin
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${status === 'completed' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="status" value="completed" checked={status === 'completed'} onChange={(e) => setStatus(e.target.value)} className="hidden" />
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${status === 'completed' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-400'}`}>
                  {status === 'completed' && <CheckCircle2 size={14} />}
                </div>
                <div>
                  <div className="font-bold text-gray-800">Selesai (Fixed)</div>
                  <div className="text-xs text-gray-500">Mesin beroperasi normal kembali</div>
                </div>
              </label>

              <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${status === 'pending' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="status" value="pending" checked={status === 'pending'} onChange={(e) => setStatus(e.target.value)} className="hidden" />
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${status === 'pending' ? 'border-orange-600 bg-orange-600 text-white' : 'border-gray-400'}`}>
                  {status === 'pending' && <CheckCircle2 size={14} />}
                </div>
                <div>
                  <div className="font-bold text-gray-800">Dalam Pantauan</div>
                  <div className="text-xs text-gray-500">Butuh inspeksi lanjutan / parts belum ada</div>
                </div>
              </label>
            </div>
          </div>

          {/* 2. Detail Perbaikan */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Wrench size={18} className="text-blue-600"/> Detail Pengerjaan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tindakan Perbaikan</label>
                <textarea 
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
                  placeholder="Jelaskan langkah-langkah perbaikan yang telah dilakukan..."
                  value={formData.actionsTaken}
                  onChange={(e) => setFormData({...formData, actionsTaken: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          {/* 3. Suku Cadang (Spare Parts) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <AlertTriangle size={18} className="text-blue-600"/> Penggantian Suku Cadang
              </h3>
            </div>
            
            <div className="space-y-3">
              {spareParts.map((part, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Nama Spare Part (e.g., Bearing SKF-6205)" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={part.name}
                      onChange={(e) => handleSparePartChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="w-20">
                    <input 
                      type="number" 
                      min="1"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-center"
                      value={part.quantity}
                      onChange={(e) => handleSparePartChange(index, 'quantity', e.target.value)}
                    />
                  </div>
                  {spareParts.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeSparePart(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              
              <button 
                type="button"
                onClick={addSparePart}
                className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 mt-2"
              >
                <Plus size={16} /> Tambah Item
              </button>
            </div>
          </div>

          {/* 4. Bukti Dokumentasi (Camera Section) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Camera size={18} className="text-blue-600"/> Dokumentasi Bukti
            </h3>

            {/* Area Kamera Aktif */}
            {isCameraOpen ? (
              <div className="relative bg-black rounded-xl overflow-hidden mb-4 aspect-video">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
                  <button 
                    type="button" 
                    onClick={stopCamera} 
                    className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30"
                  >
                    <X size={24} />
                  </button>
                  <button 
                    type="button" 
                    onClick={capturePhoto} 
                    className="bg-white p-4 rounded-full shadow-lg active:scale-95 transition-transform"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white"></div>
                  </button>
                </div>
              </div>
            ) : (
              // Tombol Buka Kamera / Upload
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button 
                  type="button" 
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-blue-700"
                >
                  <Camera size={24} />
                  <span className="text-sm font-medium">Buka Kamera</span>
                </button>
                <label className="cursor-pointer flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-gray-600">
                  <Upload size={24} />
                  <span className="text-sm font-medium">Upload Galeri</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            )}

            {/* List Foto yang diambil */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={photo.url} alt="Evidence" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end gap-3">
             <button 
              type="button" 
              onClick={() => navigate('/inspections')}
              className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>Menyimpan...</>
              ) : (
                <>
                  <Save size={18} /> Simpan Laporan
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MaintenanceReportPage;