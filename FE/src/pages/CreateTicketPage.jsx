import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Save, AlertCircle, Cpu } from 'lucide-react';

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const assetFromDashboard = location.state?.asset;

  const [formData, setFormData] = useState({
    assetName: '',
    assetId: '',
    description: '',
    priority: 'Medium',
    location: '',
  });

  useEffect(() => {
    if (assetFromDashboard) {
      setFormData(prev => ({
        ...prev,
        assetName: assetFromDashboard.name,
        assetId: assetFromDashboard.id,
        location: `Zona Produksi - Unit ${assetFromDashboard.id}`,
        description: `Terdeteksi anomali pada sensor. Mohon inspeksi segera.`
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

    // --- LOGIKA SIMULASI (KARENA BE TIDAK ADA POST) ---
    // Kita samakan struktur object dengan apa yang dikeluarkan API BE
    // Lihat: MaintenanceTicketsService.js
    const simulatedTicket = {
      ticket_id: `MANUAL-${Date.now()}`, // Format ID beda agar bisa dibedakan
      name: formData.assetName,           // Sesuai query: m.name
      ticket_status: 'OPEN',              // Sesuai query: mt.status AS ticket_status
      priority: formData.priority,        // Sesuai query: mr.priority
      ticket_created_at: new Date().toISOString(), // Sesuai query: mt.created_at
      
      // Data tambahan yang mungkin tidak disimpan BE tapi perlu di FE sementara
      description: formData.description,
      location: formData.location
    };

    // Simpan ke Local Storage
    const existingTickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');
    const updatedTickets = [simulatedTicket, ...existingTickets];
    localStorage.setItem('aura_tickets', JSON.stringify(updatedTickets));

    // Simulasi loading network
    setTimeout(() => {
      setLoading(false);
      navigate('/tickets');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 p-6 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Buat Jadwal Inspeksi</h1>
        </div>

        {/* Notifikasi bahwa ini mode manual */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex gap-3 text-yellow-800 text-sm">
           <AlertCircle size={20} className="shrink-0" />
           <p>
             <strong>Catatan Sistem:</strong> cuma Buat simulasi yakk,belum kesambung ke back-end pas bikinnya..hehe.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nama Aset / Mesin</label>
              <input required name="assetName" type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-400" value={formData.assetName} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Lokasi</label>
              <input required name="location" type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white placeholder-gray-400" value={formData.location} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Prioritas</label>
            <select name="priority" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low (Rendah)</option>
              <option value="Medium">Medium (Sedang)</option>
              <option value="High">High (Tinggi)</option>
              <option value="Urgent">Urgent (Darurat)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsi Masalah</label>
            <textarea required name="description" rows="4" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400" value={formData.description} onChange={handleChange}></textarea>
          </div>

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