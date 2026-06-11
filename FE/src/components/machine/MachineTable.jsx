import React from 'react';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ─── Badge status ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isActive = status === 'Active';
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
      ${isActive
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
      {status}
    </div>
  );
};

// ─── Format tanggal ───────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

// ─── Dialog konfirmasi hapus ──────────────────────────────────────────────────
export const DeleteConfirmDialog = ({ machine, onConfirm, onCancel }) => {
  if (!machine) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 dark:text-white">Hapus Mesin?</h4>
            <p className="text-xs text-stone-500 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
          Anda akan menghapus mesin <span className="font-bold text-stone-900 dark:text-white">"{machine.name}"</span>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all text-sm"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(machine.id)}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all text-sm"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MachineTable ─────────────────────────────────────────────────────────────
// Props:
//   machines      → array dari API
//   onEdit        → fn(machine) buka modal edit
//   onDeleteClick → fn(machine) set deleteTarget untuk konfirmasi
const MachineTable = ({ machines = [], onEdit, onDeleteClick }) => {
  const { isAdmin } = useAuth();

  if (machines.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-16 text-center">
        <p className="text-stone-400 text-sm">Tidak ada data mesin ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
              <th className="px-6 py-4 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                Kode / Nama
              </th>
              <th className="px-6 py-4 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                Tipe
              </th>
              <th className="px-6 py-4 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                Lokasi
              </th>
              <th className="px-6 py-4 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                Instalasi
              </th>
              <th className="px-6 py-4 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-center">
                Status
              </th>
              {/* Kolom aksi hanya tampil untuk Admin */}
              {isAdmin && (
                <th className="px-6 py-4 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-right">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {machines.map((machine) => (
              <tr
                key={machine.id}
                className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group"
              >
                {/* Kode + Nama */}
                <td className="px-6 py-4">
                  <div className="text-xs font-bold text-blue-500 mb-0.5">{machine.code}</div>
                  <div className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    {machine.name}
                  </div>
                </td>

                {/* Tipe */}
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-md text-xs font-bold">
                    {machine.type}
                  </span>
                </td>

                {/* Lokasi */}
                <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-400">
                  {machine.location || '—'}
                </td>

                {/* Tanggal instalasi */}
                <td className="px-6 py-4 text-sm text-stone-500 dark:text-stone-400 whitespace-nowrap">
                  {formatDate(machine.install_date)}
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={machine.status} />
                </td>

                {/* Aksi — hanya Admin */}
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(machine)}
                        className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        title="Edit mesin"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(machine)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Hapus mesin"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MachineTable;