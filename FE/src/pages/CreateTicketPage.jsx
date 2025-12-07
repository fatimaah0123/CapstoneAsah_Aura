import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, AlertCircle } from 'lucide-react';

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    assetName: '',
    description: '',
    priority: 'Medium', // Default
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Buat Objek Tiket Baru
    const newTicket = {
      id: `TKT-${Date.now()}`, // ID Unik berdasarkan waktu
      assetId: `AST-${Math.floor(Math.random() * 1000)}`, // Dummy Asset ID
      status: 'Open',
      createdAt: new Date().toISOString().slice(0, 10) + ' ' + new Date().toLocaleTimeString(),
      assignee: 'Unassigned', // Default
      ...formData, // Masukkan data dari form (assetName, description, priority, location)
      
      // Field tambahan agar kompatibel dengan halaman Detail
      tasks: [
        { id: 1, text: "Cek kondisi fisik awal", done: false },
        { id: 2, text: "Dokumentasi kerusakan", done: false }
      ],
      evidenceImages: [],
      comments: []
    };

    // 2. SIMPAN KE LOCAL STORAGE
    // Ambil data lama (jika ada)
    const existingTickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');
    // Tambahkan data baru di paling atas (array unshift/spread)
    const updatedTickets = [newTicket, ...existingTickets];
    // Simpan kembali
    localStorage.setItem('aura_tickets', JSON.stringify(updatedTickets));

    // 3. Simulasi Loading & Redirect
    setTimeout(() => {
      setLoading(false);
      alert('Jadwal Inspeksi Berhasil Dibuat!');
      // Arahkan user ke halaman List Tiket untuk melihat hasilnya
      navigate('/tickets');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Buat Jadwal Inspeksi</h1>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          
          {/* Input Nama Aset */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Aset / Mesin</label>
            <input 
              required
              name="assetName"
              type="text" 
              placeholder="Contoh: Turbin Gas #04" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.assetName}
              onChange={handleChange}
            />
          </div>

          {/* Input Lokasi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi</label>
            <input 
              required
              name="location"
              type="text" 
              placeholder="Contoh: Lantai 2 - Zona Produksi A" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Select Prioritas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prioritas</label>
            <select 
              name="priority"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low (Rendah)</option>
              <option value="Medium">Medium (Sedang)</option>
              <option value="High">High (Tinggi)</option>
              <option value="Urgent">Urgent (Darurat)</option>
            </select>
          </div>

          {/* Input Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Masalah / Inspeksi</label>
            <textarea 
              required
              name="description"
              rows="4"
              placeholder="Jelaskan detail masalah atau instruksi inspeksi..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <AlertCircle size={12} /> Data ini akan menjadi acuan teknis perbaikan.
            </p>
          </div>

          {/* Tombol Submit */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              {loading ? 'Menyimpan...' : (
                <>
                  <Save size={20} /> Simpan Jadwal
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateTicketPage;