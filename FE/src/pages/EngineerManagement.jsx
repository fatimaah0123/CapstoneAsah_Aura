import React from 'react';
import { UserCircle, Plus, Search, UserPlus } from 'lucide-react';

// Components
import EngineerTable from '../components/engineer/EngineerTable';
import EngineerModal from '../components/engineer/EngineerModal';

// Hooks
import useEngineer from '../hooks/useEngineer';

const EngineerManagement = () => {
  const {
    engineers,
    totalEngineers,
    isModalOpen, setIsModalOpen,
    searchTerm, setSearchTerm,
    formData,
    handleChange,
    handleSubmit,
  } = useEngineer();

  return (
    <div className="p-6 lg:p-10 bg-gray-50 dark:bg-stone-950 min-h-screen transition-colors duration-500 font-sans">
      
      {/* Header - Konsisten dengan Dashboard & Machine Management */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-cyan-600 to-blue-500 rounded-2xl text-white shadow-lg shadow-cyan-500/20">
            <UserCircle size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Manajemen Engineer
            </h2>
            <p className="text-sm text-gray-500 font-medium">Kelola akses dan personel tim teknis</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-all shadow-md active:scale-95"
        >
          <UserPlus size={20} />
          Tambah Engineer
        </button>
      </div>

      {/* Search & Stats Section */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Cari engineer atau email..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Aktif:</span>
          <span className="text-lg font-bold text-cyan-600">{totalEngineers} Anggota</span>
        </div>
      </div>

      {/* Tabel Engineer */}
      <EngineerTable engineers={engineers} />

      {/* Modal Tambah Engineer */}
      <EngineerModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default EngineerManagement;