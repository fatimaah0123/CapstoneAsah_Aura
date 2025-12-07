import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Filter, Plus, Search, 
  ArrowUpRight, ListFilter, CalendarDays,
  Clock, MapPin, User, Bot, AlertTriangle, CheckCircle2
} from 'lucide-react';

// IMPORT HALAMAN CREATE TICKET SEBAGAI KOMPONEN
import CreateTicketPage from './CreateTicketPage'; 

// --- Komponen Sub: Kartu Jadwal Kecil ---
const InspectionCard = ({ data }) => {
  // Helper untuk menentukan warna badge berdasarkan tipe (Support Dark Mode)
  const getBadgeStyle = (type, priority) => {
    // Critical / Red
    if (priority === 'critical') 
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
    
    // Warning / Amber
    if (type === 'Predictive') 
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
    
    // Routine / Green
    if (type === 'Preventive') 
      return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
    
    // Default / Blue
    return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
  };

  return (
    <div className="flex flex-col p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all mb-3 relative group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {/* Badge Kategori dengan Warna Baru */}
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getBadgeStyle(data.type, data.priority)}`}>
            {data.type}
          </span>

          {/* Indikator Prioritas Tinggi */}
          {data.priority === 'high' && (
            <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 px-2 py-0.5 rounded-full">
              <AlertTriangle size={10} /> Prioritas
            </span>
          )}
        </div>
      </div>

      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 line-clamp-1" title={data.title}>
        {data.title}
      </h4>
      
      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400 dark:text-gray-500" />
          <span className="text-xs">{data.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <User size={14} className="text-gray-400 dark:text-gray-500" />
          <span className="text-xs truncate">{data.technician}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <MapPin size={14} className="text-gray-400 dark:text-gray-500" />
          <span className="text-xs truncate">{data.location}</span>
        </div>
      </div>

      {data.status === 'completed' ? (
        <div className="absolute bottom-4 right-4 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-1 rounded-full">
          <CheckCircle2 size={18} />
        </div>
      ) : (
        <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-700 flex justify-end">
          <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors flex items-center gap-1">
            Detail <ArrowUpRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

// --- Halaman Utama ---
const InspectionPage = () => {
  // --- LOGIKA KALENDER ---
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  const [viewMode, setViewMode] = useState('calendar'); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi: Pindah Bulan
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Helper: Detail hari dalam bulan
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let firstDayOfWeek = new Date(year, month, 1).getDay();
    const startingSlot = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    return { daysInMonth, startingSlot };
  };

  const { daysInMonth, startingSlot } = getDaysInMonth(currentDate);
  const formattedMonthYear = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // Handler Simpan
  const handleSaveInspection = (formData) => {
    console.log("Data Inspeksi Baru:", formData);
    setIsModalOpen(false); 
  };

  // Data Mockup
  const inspections = [
    {
      id: 1,
      title: 'Cek Getaran Turbin #04',
      time: '09:00 - 10:30',
      location: 'Area Produksi A',
      technician: 'Budi Santoso',
      status: 'completed',
      priority: 'high',
      type: 'Predictive' 
    },
    {
      id: 2,
      title: 'Inspeksi Visual Conveyor Belt',
      time: '11:00 - 12:00',
      location: 'Warehouse Logistik',
      technician: 'Siti Aminah',
      status: 'pending',
      priority: 'medium',
      type: 'Preventive' 
    },
    {
      id: 3,
      title: 'Kalibrasi Sensor Suhu',
      time: '13:30 - 14:30',
      location: 'Ruang Boiler',
      technician: 'Dimas Anggara',
      status: 'pending',
      priority: 'low',
      type: 'Preventive' 
    },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* --- INTEGRASI MODAL CREATE TICKET --- */}
      {isModalOpen && (
        <CreateTicketPage 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveInspection}
        />
      )}

      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Jadwal Inspeksi</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Kelola agenda maintenance dan validasi prediksi AI.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus size={18} /> 
            <span className="hidden sm:inline">Jadwal Baru</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* KOLOM UTAMA (KIRI) - Kalender & Widget AI */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* AURA AI Widget */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-cyan-400 opacity-20 blur-3xl"></div>
            
            <div className="relative flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                <Bot size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">AURA Copilot Insights</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/20 font-medium tracking-wide uppercase text-white border border-white/10">AI Analysis</span>
                </div>
                <p className="text-blue-50 text-sm leading-relaxed mb-4 max-w-2xl">
                  Terdeteksi anomali frekuensi tinggi pada <strong>Turbin #04</strong>. 
                  Berdasarkan tren historis, risiko kegagalan meningkat 85% dalam 24 jam. 
                  Disarankan memajukan jadwal inspeksi ke <strong>hari ini pukul 14:00</strong>.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm">
                    <CheckCircle2 size={16} />
                    Setujui Perubahan
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 border border-white/20 transition-colors">
                    Abaikan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Kalender View */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[600px]">
            {/* Header Kalender */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 capitalize">{formattedMonthYear}</h2>
                <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-1 border border-gray-100 dark:border-gray-600">
                  <button 
                    onClick={prevMonth}
                    className="p-1.5 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-md transition-all text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-md transition-all text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="hidden sm:flex gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-200"></span>
                  Terjadwal (Hijau)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-200"></span>
                  Warning (Kuning)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-200"></span>
                  Critical (Merah)
                </div>
              </div>
            </div>

            {/* Grid Kalender */}
            <div className="flex-1 p-4 bg-white dark:bg-gray-800 overflow-y-auto">
              <div className="grid grid-cols-7 text-center mb-2">
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                  <div key={day} className="text-xs font-semibold text-gray-400 dark:text-gray-500 py-2 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2 lg:gap-3 h-full">
                {/* Slot Kosong */}
                {[...Array(startingSlot)].map((_, i) => (
                  <div key={`empty-${i}`} className="bg-gray-50/30 dark:bg-gray-700/30 rounded-xl"></div>
                ))}
                
                {/* Render Hari */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const isSelected = day === selectedDay;
                  
                  const hasPredictive = (day % 7 === 0);
                  const hasPreventive = (day % 5 === 0);
                  const isOverdue = (day === 12);

                  return (
                    <div 
                      key={day} 
                      onClick={() => setSelectedDay(day)}
                      className={`
                        relative min-h-[80px] sm:min-h-[100px] border rounded-xl p-2 cursor-pointer transition-all duration-200 group
                        flex flex-col justify-between
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-900/40 ring-2 ring-blue-100 dark:ring-blue-800 ring-offset-1 dark:ring-offset-gray-900 z-10' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md bg-white dark:bg-gray-800'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`
                          text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
                          ${isSelected 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none' 
                            : 'text-gray-700 dark:text-gray-200'
                          }
                        `}>
                          {day}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mt-1">
                        {hasPredictive && (
                          <div className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-200 font-medium truncate border border-amber-200/50 dark:border-amber-700">
                            WARNING
                          </div>
                        )}
                        {hasPreventive && !isOverdue && (
                          <div className="text-[10px] px-1.5 py-0.5 rounded-md bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium truncate border border-green-200/50 dark:border-green-700">
                            Rutin
                          </div>
                        )}
                        {hasPreventive && isOverdue && (
                          <div className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-medium truncate border border-red-200/50 dark:border-red-700">
                            ! CRITICAL
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN - Detail & Sidebar Info */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[765px]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">Agenda Harian</h3>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">
                    {selectedDay} {formattedMonthYear}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl shadow-inner border border-blue-100 dark:border-blue-800">
                  {selectedDay}
                </div>
              </div>

              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari teknisi, aset, atau ID..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
                Total 3 Inspeksi
              </p>
              
              {inspections.map((item) => (
                <InspectionCard key={item.id} data={item} />
              ))}
            </div>

            <div className="p-5 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Load Teknisi (Hari Ini)</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm">BS</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Budi Santoso</span>
                      <span className="text-red-500 dark:text-red-400 font-semibold">90%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[90%] rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm">SA</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Siti Aminah</span>
                      <span className="text-green-600 dark:text-green-400 font-semibold">45%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[45%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InspectionPage;