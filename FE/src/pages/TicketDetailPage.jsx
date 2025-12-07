import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MapPin, Clock, User, AlertTriangle, 
  CheckCircle2, MessageSquare, Send, Calendar, Wrench 
} from 'lucide-react';
import { dummyTickets } from '../Data/dummy'; // Import Data Dummy

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Simulasi Fetch Data
  useEffect(() => {
    // Mencari tiket berdasarkan ID dari URL
    const foundTicket = dummyTickets.find(t => t.id === id);
    setTicket(foundTicket);
  }, [id]);

  if (!ticket) return <div className="p-10 text-center">Loading Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* 1. Header Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Detail Tiket</h1>
            <p className="text-xs text-gray-500">ID: {ticket.id}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          ticket.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {ticket.priority} Priority
        </span>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* 2. Informasi Utama & Deskripsi */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{ticket.assetName}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1.5">
              <User size={16} /> {ticket.assignee}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} /> {ticket.createdAt}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={16} /> {ticket.location || 'Lokasi tidak tersedia'}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500"/> Deskripsi Masalah
            </h3>
            <p className="text-gray-600 leading-relaxed">{ticket.description}</p>
          </div>
        </div>

        {/* 3. Daftar Tugas & Peta (Adaptasi layout 2 kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Checklist Tugas */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-full">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600"/> Daftar Tugas
            </h3>
            <div className="space-y-3">
              {ticket.tasks && ticket.tasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <input type="checkbox" defaultChecked={task.done} className="mt-1 w-4 h-4 text-blue-600 rounded" readOnly />
                  <span className={`text-sm ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {task.text}
                  </span>
                </div>
              ))}
              {(!ticket.tasks || ticket.tasks.length === 0) && <p className="text-sm text-gray-400">Tidak ada tugas spesifik.</p>}
            </div>
          </div>

          {/* Lokasi / Peta Dummy */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-full flex flex-col">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600"/> Lokasi Aset
            </h3>
            <div className="flex-1 bg-gray-200 rounded-xl relative overflow-hidden group min-h-[200px]">
              {/* Ini simulasi Map agar mirip report-detail-page.js */}
              <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
                 <div className="text-center">
                    <MapPin size={48} className="text-blue-500 mx-auto mb-2 animate-bounce" />
                    <p className="text-sm text-blue-700 font-medium">Peta Digital Area</p>
                    <p className="text-xs text-blue-400">Lat: {ticket.coordinates?.lat}, Lng: {ticket.coordinates?.lng}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bukti Awal (Carousel) */}
        {ticket.evidenceImages && ticket.evidenceImages.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-purple-600"/> Dokumentasi Awal
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {ticket.evidenceImages.map((img, idx) => (
                <img key={idx} src={img} alt="Bukti" className="h-48 w-auto rounded-lg object-cover border border-gray-200" />
              ))}
            </div>
          </div>
        )}

        {/* 5. Komentar (Adaptasi dari report-detail comments) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-gray-600"/> Aktivitas & Komentar
          </h3>
          
          <div className="space-y-6 mb-6">
            {ticket.comments && ticket.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                  {comment.user.charAt(0)}
                </div>
                <div className="bg-gray-50 p-3 rounded-r-xl rounded-bl-xl flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-gray-800">{comment.user}</span>
                    <span className="text-xs text-gray-400">{comment.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{comment.text}</p>
                </div>
              </div>
            ))}
            {(!ticket.comments || ticket.comments.length === 0) && (
              <p className="text-center text-gray-400 text-sm py-4">Belum ada komentar.</p>
            )}
          </div>

          {/* Form Komentar */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tulis tanggapan..." 
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>

      {/* 6. Sticky Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-4xl mx-auto flex justify-end gap-3">
          <button className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 border border-gray-200">
            Tolak Tiket
          </button>
          
          {/* TOMBOL INI MENGARAH KE FORM LAPORAN YANG ANDA BUAT SEBELUMNYA */}
          <button 
            onClick={() => navigate(`/report/${ticket.id}`)}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <Wrench size={18} />
            Mulai Perbaikan / Update Laporan
          </button>
        </div>
      </div>

    </div>
  );
};

export default TicketDetailPage;