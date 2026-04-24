import React from 'react';
import { Box, Plus, Search } from 'lucide-react';

// Components
import MachineTable from '../components/machine/MachineTable';
import MachineModal from '../components/machine/MachineModal';

// Hooks
import useMachine from '../hooks/useMachine';

const MachineManagement = () => {
  const {
    machines,
    isModalOpen, setIsModalOpen,
    searchTerm, setSearchTerm,
    formData,
    handleChange,
    addSparePartRow,
    removeSparePartRow,
    handleSparePartChange,
    handleSubmit,
  } = useMachine();

  return (
    <div className="p-6 lg:p-10 bg-gray-50 dark:bg-stone-950 min-h-screen transition-colors duration-500 font-sans">
      
      {/* Header - Disesuaikan dengan Dashboard */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Box size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Manajemen Mesin
            </h2>
            <p className="text-sm text-gray-500 font-medium">Pantau dan kelola aset teknis AVATAR</p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          Registrasi Mesin
        </button>
      </div>

      {/* Search Bar - Modern Clean Style */}
      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text"
          placeholder="Cari aset mesin..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabel Mesin */}
      <MachineTable machines={machines} />

      {/* Modal Tambah Mesin */}
      <MachineModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        addSparePartRow={addSparePartRow}
        removeSparePartRow={removeSparePartRow}
        handleSparePartChange={handleSparePartChange}
      />
    </div>
  );
};

export default MachineManagement;