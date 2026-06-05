import React from 'react';
import { Clock, UserCheck, Trash2, UserPlus, Eye, FileSpreadsheet, CheckCircle } from 'lucide-react';

const TicketCard = ({ 
  ticket, 
  userRole, 
  onCardClick, 
  onDelete, 
  onAssign, 
  onReview,
  onEngineerReport 
}) => {
  const targetId = ticket.id || ticket.id_tiket || ticket.id_ticket;

  // REVISI TOTAL: Menangkap variasi nama aset dari API Backend agar tidak muncul teks generik "Mesin #ID"
  const machineName = 
    ticket.assetName || 
    ticket.asset_name || 
    ticket.machineName || 
    ticket.machine_name || 
    ticket.namaMesin || 
    ticket.nama_mesin || 
    ticket.machine?.name || 
    ticket.machine?.nama_mesin || 
    ticket.asset?.name || 
    ticket.name || 
    ticket.nama || 
    `Mesin #${targetId}`;

  const engineerName = ticket.engineerName || ticket.engineer_name || ticket.nama_engineer || ticket.nama_teknisi || 'Belum Ditugaskan';
  const backendStatus = String(ticket.status || ticket.status_tiket || 'NORMAL').toUpperCase().trim();

  const getColorScheme = (status) => {
    if (status.includes('CRIT') || status.includes('DANGER') || status.includes('FAIL')) {
      return {
        badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50',
        dot: 'bg-red-500',
        borderHover: 'hover:border-red-500/40'
      };
    }
    if (status.includes('WARN') || status.includes('ANOMALI') || status.includes('PROGRESS') || status.includes('KERJA')) {
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
        dot: 'bg-amber-500',
        borderHover: 'hover:border-amber-500/40'
      };
    }
    return {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50',
      dot: 'bg-emerald-500',
      borderHover: 'hover:border-emerald-500/40'
    };
  };

  const colors = getColorScheme(backendStatus);
  const hasEngineer = ticket.engineerId || ticket.id_engineer || ticket.engineer_id || ticket.engineerName || ticket.engineer_name;

  return (
    <div 
      onClick={() => onCardClick(targetId)}
      className={`bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-200 group ${colors.borderHover} hover:shadow-md`}
    >
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase border ${colors.badge}`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${colors.dot}`} />
            {backendStatus.replace('_', ' ')}
          </span>
          <span className="text-gray-400 font-medium">ID: {targetId}</span>
        </div>

        <div className="pt-1">
          {/* Menampilkan nama spesifik aset mesin (misal: Turbin 147) secara dinamis */}
          <h3 className="font-extrabold text-gray-900 dark:text-white text-xl tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors capitalize">
            {machineName}
          </h3>
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-stone-800 text-xs text-gray-500 flex items-center gap-2">
          <UserCheck size={14} />
          <span>Teknisi: <strong className="text-gray-700 dark:text-gray-300">{engineerName}</strong></span>
        </div>
      </div>

      <div 
        className="bg-gray-50 dark:bg-stone-950 p-4 border-t border-gray-100 dark:border-stone-800 flex justify-end gap-2"
        onClick={(e) => e.stopPropagation()} 
      >
        {userRole === 'admin' ? (
          <>
            {(backendStatus.includes('WAITING') || backendStatus.includes('BARU') || backendStatus.includes('ASSIGNMENT') || !hasEngineer) && (
              <>
                <button type="button" onClick={() => onDelete(targetId)} className="flex items-center gap-1 px-3 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 text-xs font-bold rounded-lg transition shadow-sm active:scale-95"><Trash2 size={13} /> Hapus</button>
                <button type="button" onClick={() => onAssign(ticket)} className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition shadow-sm active:scale-95"><UserPlus size={13} /> Tugaskan</button>
              </>
            )}

            {(backendStatus.includes('PROGRESS') || backendStatus.includes('KERJA')) && hasEngineer && (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold italic flex items-center gap-1 py-1.5"><Clock size={13} /> Sedang Diperbaiki...</span>
            )}

            {(backendStatus.includes('APPROVAL') || backendStatus.includes('REVIEW')) && (
              <button type="button" onClick={() => onReview(ticket)} className="flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition shadow-sm active:scale-95"><Eye size={13} /> Review & Approve Laporan</button>
            )}
          </>
        ) : (
          <>
            {(backendStatus.includes('PROGRESS') || backendStatus.includes('KERJA')) && (
              <button 
                type="button" 
                onClick={() => onEngineerReport(targetId)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
              >
                <FileSpreadsheet size={13} /> Kirim Laporan Kerja
              </button>
            )}

            {(backendStatus.includes('APPROVAL') || backendStatus.includes('REVIEW')) && (
              <span className="text-xs text-orange-600 dark:text-orange-400 font-bold italic flex items-center gap-1.5 py-1.5 animate-pulse">
                <Clock size={13} /> Menunggu Approved Admin...
              </span>
            )}

            {(backendStatus.includes('RESOLVED') || backendStatus.includes('SELESAI')) && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 py-1.5">
                <CheckCircle size={13} /> Perbaikan Selesai
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TicketCard;