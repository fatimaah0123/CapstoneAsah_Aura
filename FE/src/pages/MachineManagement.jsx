import React from 'react';
import { Box, Plus, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Components
import MachineTable, { DeleteConfirmDialog } from '../components/machine/MachineTable';
import MachineModal from '../components/machine/MachineModal';

// Hook
import useMachine from '../hooks/useMachine';

const MachineManagement = () => {
  const { isAdmin } = useAuth();

  const {
    machines,
    isLoading,
    error,
    searchTerm, setSearchTerm,

    isModalOpen,
    editTarget,
    formData,
    formError,
    isSubmitting,
    openAddModal,
    openEditModal,
    closeModal,
    handleChange,
    handleSubmit,

    deleteTarget, setDeleteTarget,
    handleDelete,
  } = useMachine();

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Box size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
              Manajemen Mesin
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
              Pantau dan kelola aset teknis AVATAR
            </p>
          </div>
        </div>

        {/* Tombol tambah hanya muncul untuk Admin */}
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <Plus size={18} />
            Tambah Mesin
          </button>
        )}
      </div>

      {/* ── Search ──────────────────────────────────────────────────────── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
        <input
          type="text"
          placeholder="Cari nama atau kode mesin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800
                     bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-sm
                     focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all shadow-sm"
        />
      </div>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex items-center justify-center h-48 gap-3 text-stone-400">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm">Memuat data mesin...</span>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── Tabel ────────────────────────────────────────────────────────── */}
      {!isLoading && !error && (
        <MachineTable
          machines={machines}
          onEdit={openEditModal}
          onDeleteClick={setDeleteTarget}
        />
      )}

      {/* ── Modal Tambah / Edit ───────────────────────────────────────────── */}
      <MachineModal
        isModalOpen={isModalOpen}
        editTarget={editTarget}
        formData={formData}
        formError={formError}
        isSubmitting={isSubmitting}
        closeModal={closeModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      {/* ── Dialog Konfirmasi Hapus ───────────────────────────────────────── */}
      <DeleteConfirmDialog
        machine={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};

export default MachineManagement;