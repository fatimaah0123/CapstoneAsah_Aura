import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Save, AlertCircle, Cpu } from 'lucide-react';

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Ambil data asset yang dikirim dari Dashboard
  const assetFromDashboard = location.state?.asset;

  // State Form
  const [formData, setFormData] = useState({
    assetName: '',
    assetId: '',
    description: '',
    priority: 'Medium',
    location: '',
  });

  // Efek untuk mengisi form otomatis jika ada data dari dashboard
  useEffect(() => {
    if (assetFromDashboard) {
      setFormData(prev => ({
        ...prev,
        assetName: assetFromDashboard.name,
        assetId: assetFromDashboard.id,
        location: `Zona Produksi - Unit ${assetFromDashboard.id}`,
        description: `Terdeteksi anomali pada sensor: Suhu ${assetFromDashboard.air_temperature}°C, RPM ${assetFromDashboard.rotational_speed}. Mohon inspeksi segera.`
      }));
    }
  }, [assetFromDashboard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Buat Objek Tiket Baru
    const newTicket = {
      id: `TKT-${Date.now()}`,
      status: 'Open', 
      createdAt: new Date().toISOString(),
      report: null, 
      ...formData,
    };

    // 2. SIMPAN KE LOCAL STORAGE
    const existingTickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');
    const updatedTickets = [newTicket, ...existingTickets];
    localStorage.setItem('aura_tickets', JSON.stringify(updatedTickets));

    // 3. Redirect ke halaman Tickets
    setTimeout(() => {
      setLoading(false);
      navigate('/tickets');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 p-6 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Buat Jadwal Inspeksi</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          
          {/* Info Aset Terpilih */}
          {assetFromDashboard && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Cpu size={24} />
              </div>
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Aset Terpilih</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{assetFromDashboard.name} <span className="text-gray-500 dark:text-gray-400 text-sm">#{assetFromDashboard.id}</span></p>
              </div>
            </div>
          )}

          {/* Input Nama Aset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Aset / Mesin</label>
              <input 
                required
                name="assetName"
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                value={formData.assetName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Lokasi</label>
              <input 
                required
                name="location"
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Select Prioritas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Prioritas</label>
            <select 
              name="priority"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
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
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsi Masalah</label>
            <textarea 
              required
              name="description"
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
              <AlertCircle size={12} /> Deskripsi otomatis terisi dari data sensor jika tersedia.
            </p>
          </div>

          {/* Tombol Submit */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              {loading ? 'Menyimpan...' : ( <><Save size={20} /> Simpan Jadwal</> )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateTicketPage;