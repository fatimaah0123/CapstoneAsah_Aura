import React, { useState, useEffect } from 'react';
import { X, UserCheck, Loader2 } from 'lucide-react';
import { ticketService } from '../../services/ticketService';

const AssignModal = ({ ticket, onConfirm, onClose, isSubmitting }) => {
  const [engineers, setEngineers]         = useState([]);
  const [selectedId, setSelectedId]       = useState('');
  const [loadingEngineers, setLoadingEngineers] = useState(true);

  // Fetch list engineer dari BE saat modal dibuka
  useEffect(() => {
    const load = async () => {
      try {
        const data = await ticketService.getEngineers();
        setEngineers(data);
      } catch {
        setEngineers([]);
      } finally {
        setLoadingEngineers(false);
      }
    };
    load();
  }, []);

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-sm">

        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <UserCheck size={16} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Tugaskan Engineer</h3>
              <p className="text-xs text-stone-400 mt-0.5 truncate max-w-[180px]">{ticket.machine_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">
              Pilih Engineer
            </label>
            {loadingEngineers ? (
              <div className="flex items-center gap-2 text-stone-400 text-sm py-2">
                <Loader2 size={14} className="animate-spin" /> Memuat daftar engineer...
              </div>
            ) : engineers.length === 0 ? (
              <p className="text-sm text-stone-400">Tidak ada engineer tersedia.</p>
            ) : (
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-white text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all"
              >
                <option value="">-- Pilih Engineer --</option>
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} ({eng.employee_id})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-stone-100 dark:border-stone-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all text-sm"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(ticket.id, selectedId)}
            disabled={!selectedId || isSubmitting}
            className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 size={14} className="animate-spin" /> Menugaskan...</>
            ) : (
              <><UserCheck size={14} /> Tugaskan</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AssignModal;