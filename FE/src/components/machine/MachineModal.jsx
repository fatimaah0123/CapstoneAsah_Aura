import React from 'react';
import { X, Cpu, Save, PlusCircle, MinusCircle } from 'lucide-react';

const MachineModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleChange,
  handleSubmit,
  addSparePartRow,
  removeSparePartRow,
  handleSparePartChange,
}) => {
  if (!isModalOpen) return null;

  return (
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
                <PlusCircle size={14} /> 
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
              <Save size={18} /> 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MachineModal;