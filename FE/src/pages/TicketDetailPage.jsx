import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Activity, AlertTriangle, Thermometer, Zap, PenTool } from 'lucide-react';
import { getMaintenanceTicketById } from '../services/api';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        // Cek apakah ini tiket MANUAL atau API
        if (id.toString().startsWith('MANUAL')) {
          // 1. Ambil dari Local Storage
          const localTickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');
          const found = localTickets.find(t => t.ticket_id === id);
          if (found) {
            setTicket(found);
          } else {
            setError('Tiket manual tidak ditemukan.');
          }
        } else {
          // 2. Ambil dari API Backend
          const response = await getMaintenanceTicketById(id);
          // Backend mengembalikan: { status: 'success', data: { ... } }
          if (response && response.data) {
            setTicket(response.data);
          } else {
            setError('Data tiket tidak ditemukan di server.');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Gagal mengambil detail tiket.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Memuat detail tiket...</div>;
  if (error || !ticket) return <div className="p-10 text-center text-red-500">{error || 'Tiket tidak ditemukan'}</div>;

  // Tentukan warna badge status
  const getStatusColor = (s) => {
    const status = s?.toUpperCase() || 'OPEN';
    if (status === 'RESOLVED') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Back */}
        <button 
          onClick={() => navigate('/tickets')} 
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-6 hover:underline"
        >
          <ChevronLeft size={20} /> Kembali ke Daftar
        </button>

        {/* Kartu Utama */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* Header Ticket */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(ticket.ticket_status || ticket.status)}`}>
                  {ticket.ticket_status || ticket.status}
                </span>
                <span className="text-sm text-gray-400">ID: {ticket.ticket_id || ticket.id}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.name || ticket.assetName}</h1>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div className="flex items-center gap-1 justify-end">
                <Calendar size={14} />
                {new Date(ticket.ticket_created_at || ticket.createdAt || Date.now()).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6">
            
            {/* Informasi Umum */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Lokasi / Mesin</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{ticket.name || ticket.assetName || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Prioritas</p>
                <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <AlertTriangle size={16} className={ticket.priority === 'High' ? 'text-red-500' : 'text-yellow-500'} />
                  {ticket.priority || 'Medium'}
                </div>
              </div>
            </div>

            {/* Deskripsi / Analisis AI */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Activity size={20} className="text-blue-500" />
                Analisis & Deskripsi
              </h3>
              <div className="p-4 border border-blue-100 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {ticket.description || (
                  <p>
                    <strong>Rekomendasi Tindakan:</strong> {ticket.action || "Lakukan inspeksi mendalam pada komponen mesin."}
                    <br/><br/>
                    {ticket.confidence && (
                      <span className="text-sm text-gray-500">
                        *Tingkat Kepercayaan AI: {(ticket.confidence * 100).toFixed(1)}%
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Statistik Sensor (Khusus Tiket dari API/ML) */}
            {ticket.heat_dissipation_failure !== undefined && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Statistik Kegagalan (ML)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   <StatCard icon={<Thermometer/>} label="Panas Berlebih" value={ticket.heat_dissipation_failure} />
                   <StatCard icon={<Zap/>} label="Daya" value={ticket.power_failure} />
                   <StatCard icon={<PenTool/>} label="Keausan Alat" value={ticket.tool_wear_failure} />
                   <StatCard icon={<Activity/>} label="Overstrain" value={ticket.overstrain_failure} />
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Kecil untuk Statistik
const StatCard = ({ icon, label, value }) => (
  <div className={`p-3 rounded-lg border text-center ${value ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
    <div className={`mx-auto mb-1 w-8 h-8 flex items-center justify-center rounded-full ${value ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
      {icon}
    </div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`font-bold ${value ? 'text-red-700' : 'text-green-700'}`}>{value ? 'Ya' : 'Tidak'}</p>
  </div>
);

export default TicketDetailPage;