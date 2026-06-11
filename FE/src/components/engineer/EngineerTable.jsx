import React from 'react';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';

// ─── Badge Role ───────────────────────────────────────────────────────────────
// role dari API: 'Admin' | 'Engineer'
const RoleBadge = ({ role }) => {
  const isAdmin = role === 'Admin';
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
      isAdmin
        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50'
        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50'
    }`}>
      {role}
    </span>
  );
};

// ─── Badge Status ─────────────────────────────────────────────────────────────
// status dari API: 'Active' | 'Onduty'
const StatusBadge = ({ status }) => {
  const isActive = status === 'Active';
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
      isActive
        ? 'text-green-600 dark:text-green-400'
        : 'text-cyan-600 dark:text-cyan-400'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${
        isActive ? 'bg-green-500 animate-pulse' : 'bg-cyan-500 animate-pulse'
      }`} />
      {status === 'Onduty' ? 'On Duty' : status}
    </div>
  );
};

// ─── Format tanggal ───────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

// ─── Dialog konfirmasi hapus ──────────────────────────────────────────────────
export const DeleteConfirmDialog = ({ user, onConfirm, onCancel }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 dark:text-white">Hapus Pengguna?</h4>
            <p className="text-xs text-stone-500 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
          Anda akan menghapus akun{' '}
          <span className="font-bold text-stone-900 dark:text-white">"{user.name}"</span>
          {' '}({user.employee_id}).
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all text-sm"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all text-sm"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── EngineerTable ────────────────────────────────────────────────────────────
// Props:
//   users         → array dari API
//   onEdit        → fn(user) buka modal edit
//   onDeleteClick → fn(user) set deleteTarget
const EngineerTable = ({ users = [], onEdit, onDeleteClick }) => {
  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-16 text-center">
        <p className="text-stone-400 text-sm">Tidak ada data pengguna ditemukan.</p>
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
                Informasi Personel
              </th>
              <th className="px-6 py-4 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                Role
              </th>
              <th className="px-6 py-4 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                Terdaftar
              </th>
              <th className="px-6 py-4 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-cyan-50/30 dark:hover:bg-cyan-900/10 transition-colors group"
              >
                {/* Informasi Personel */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar inisial */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-100 to-blue-50 dark:from-cyan-900/40 dark:to-blue-900/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-sm border border-cyan-200 dark:border-cyan-800 shrink-0">
                      {user.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-cyan-500 mb-0.5">{user.employee_id}</div>
                      <div className="text-sm font-semibold text-stone-800 dark:text-stone-200 leading-tight">
                        {user.name}
                      </div>
                      <div className="text-xs text-stone-400">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={user.status} />
                </td>

                {/* Tanggal terdaftar */}
                <td className="px-6 py-4 text-xs text-stone-500 dark:text-stone-400 whitespace-nowrap">
                  {formatDate(user.created_at)}
                </td>

                {/* Aksi */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      title="Edit pengguna"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(user)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Hapus pengguna"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EngineerTable;