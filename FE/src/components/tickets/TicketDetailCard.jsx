import React from 'react';
import { Calendar, Activity, AlertTriangle, Thermometer, Zap, PenTool } from 'lucide-react';
import StatCard from './StatCard';

const getStatusColor = (s) => {
  const status = s?.toUpperCase() || 'OPEN';
  if (status === 'RESOLVED') return 'bg-green-100 text-green-700 border-green-200';
  if (status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-700 border-blue-200';
  return 'bg-yellow-100 text-yellow-700 border-yellow-200';
};

const TicketDetailCard = ({ ticket }) => (
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
);

export default TicketDetailCard;