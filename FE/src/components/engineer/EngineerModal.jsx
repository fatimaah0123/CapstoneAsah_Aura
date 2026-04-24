import React from 'react';
import { X, Save, Mail, Briefcase, ShieldCheck } from 'lucide-react';

const EngineerModal = ({ isModalOpen, setIsModalOpen, formData, handleChange, handleSubmit }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 animate-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Daftarkan Engineer</h3>
          </div>
          <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:rotate-90 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Employee ID</label>
            <input 
              name="id" required placeholder="Contoh: ENG-102"
              className="w-full px-4 py-3.5 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 font-semibold focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all dark:text-white"
              value={formData.id} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Nama Lengkap</label>
            <input 
              name="name" required placeholder="Nama lengkap teknisi..."
              className="w-full px-4 py-3.5 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 font-semibold focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all dark:text-white"
              value={formData.name} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Email Korporat</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                name="email" type="email" required placeholder="email@avatar.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 font-semibold focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all dark:text-white"
                value={formData.email} onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Level / Jabatan</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                name="role"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 font-bold focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all appearance-none dark:text-white"
                value={formData.role} onChange={handleChange}
              >
                <option value="Junior Engineer">JUNIOR ENGINEER</option>
                <option value="Senior Engineer">SENIOR ENGINEER</option>
                <option value="Lead Engineer">LEAD ENGINEER</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="flex-1 px-6 py-3.5 border border-stone-200 dark:border-stone-800 rounded-xl font-bold text-gray-500 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="flex-1 px-6 py-3.5 bg-stone-900 dark:bg-cyan-600 text-white rounded-xl font-bold hover:bg-black dark:hover:bg-cyan-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save size={18} /> Aktivasi Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EngineerModal;