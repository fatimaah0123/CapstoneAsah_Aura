import React, { useState } from 'react';
import { 
  Box, Plus, Trash2, Search, X, Save, 
  Layers, Cpu, Activity, PlusCircle, MinusCircle 
} from 'lucide-react';

const MachineManagement = () => {
  const [machines, setMachines] = useState([
    { id: 'MC-001', name: 'CNC Milling Machine A1', type: 'Production', status: 'Active' },
    { id: 'MC-002', name: 'Lathe Machine B2', type: 'Production', status: 'Maintenance' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Form Baru dengan Suku Cadang Dinamis
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'Production',
    spareParts: [{ partName: '', quantity: 1 }] // Array untuk baris suku cadang
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi menambah baris suku cadang
  const addSparePartRow = () => {
    setFormData({
      ...formData,
      spareParts: [...formData.spareParts, { partName: '', quantity: 1 }]
    });
  };

  // Fungsi menghapus baris suku cadang
  const removeSparePartRow = (index) => {
    const updatedParts = formData.spareParts.filter((_, i) => i !== index);
    setFormData({ ...formData, spareParts: updatedParts });
  };

  // Fungsi update item suku cadang spesifik
  const handleSparePartChange = (index, field, value) => {
    const updatedParts = [...formData.spareParts];
    updatedParts[index][field] = value;
    setFormData({ ...formData, spareParts: updatedParts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMachine = {
      ...formData,
      id: formData.id || `MC-0${machines.length + 1}`,
      status: 'Active'
    };
    setMachines([...machines, newMachine]);
    setIsModalOpen(false);
    setFormData({ id: '', name: '', type: 'Production', spareParts: [{ partName: '', quantity: 1 }] });
  };

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

      {/* Tabel Mesin - Clean Style (Tanpa Border Hitam) */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
                <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">Identitas Mesin</th>
                <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-center">Kategori</th>
                <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-right">Tindakan</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {machines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map((machine) => (
                <tr key={machine.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-0.5">{machine.id}</div>
                    <div className="text-base font-semibold text-gray-800 dark:text-stone-200">{machine.name}</div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-400 rounded-md text-xs font-bold">
                      {machine.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-xs uppercase">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      {machine.status}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL FORM REVISI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
            
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-white dark:bg-stone-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                  <Cpu size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Tambah Mesin Baru</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">ID Mesin</label>
                  <input 
                    name="id" required placeholder="Contoh: MC-V01"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
                    value={formData.id} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tipe Unit</label>
                  <select 
                    name="type"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white appearance-none"
                    value={formData.type} onChange={handleChange}
                  >
                    <option value="Production">PRODUCTION</option>
                    <option value="Utility">UTILITY</option>
                    <option value="Packaging">PACKAGING</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nama Nama Unit</label>
                  <input 
                    name="name" required placeholder="Masukkan nama resmi mesin..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
                    value={formData.name} onChange={handleChange}
                  />
                </div>
              </div>

              {/* SECTION SUKU CADANG DINAMIS */}
              <div className="space-y-4 border-t border-stone-100 dark:border-stone-800 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daftar Suku Cadang (Inventory)</label>
                  <button 
                    type="button" 
                    onClick={addSparePartRow}
                    className="text-xs flex items-center gap-1.5 text-blue-600 font-bold hover:underline"
                  >
                    <PlusCircle size={14} /> Tambah Baris
                  </button>
                </div>

                {formData.spareParts.map((part, index) => (
                  <div key={index} className="flex gap-3 animate-in slide-in-from-left-2">
                    <div className="flex-1">
                      <input 
                        placeholder="Nama suku cadang..."
                        className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-800 dark:bg-stone-800 text-sm font-medium focus:border-blue-500 outline-none transition-all dark:text-white"
                        value={part.partName}
                        onChange={(e) => handleSparePartChange(index, 'partName', e.target.value)}
                      />
                    </div>
                    <div className="w-24">
                      <input 
                        type="number"
                        placeholder="Qty"
                        className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-800 dark:bg-stone-800 text-sm font-bold text-center focus:border-blue-500 outline-none transition-all dark:text-white"
                        value={part.quantity}
                        onChange={(e) => handleSparePartChange(index, 'quantity', parseInt(e.target.value))}
                      />
                    </div>
                    {formData.spareParts.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeSparePartRow(index)}
                        className="p-2.5 text-stone-300 hover:text-red-500 transition-colors"
                      >
                        <MinusCircle size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 px-6 py-3 border border-stone-200 dark:border-stone-800 rounded-xl font-bold text-gray-500 hover:bg-stone-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineManagement;