import React, { useState } from 'react';
import { 
  UserCircle, Plus, Trash2, Search, X, Save, 
  Mail, Briefcase, ShieldCheck, UserPlus, 
  ChevronRight, MoreVertical 
} from 'lucide-react';

const EngineerManagement = () => {
  // 1. State untuk Data Engineer
  const [engineers, setEngineers] = useState([
    { id: 'ENG-001', name: 'Siti Fatimah', email: 'siti@avatar.com', role: 'Senior Engineer', status: 'Active' },
    { id: 'ENG-002', name: 'Budi Santoso', email: 'budi@avatar.com', role: 'Junior Engineer', status: 'On Duty' },
  ]);

  // 2. State untuk Kontrol Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: 'Junior Engineer'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEngineer = {
      ...formData,
      id: formData.id || `ENG-0${engineers.length + 1}`,
      status: 'Active'
    };
    setEngineers([...engineers, newEngineer]);
    setIsModalOpen(false);
    setFormData({ id: '', name: '', email: '', role: 'Junior Engineer' });
  };

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
           <span className="text-lg font-bold text-cyan-600">{engineers.length} Anggota</span>
        </div>
      </div>

      {/* Tabel Engineer - Modern Clean Style */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-400">Informasi Personel</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Jabatan</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Status</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {engineers.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())).map((eng) => (
                <tr key={eng.id} className="hover:bg-cyan-50/30 dark:hover:bg-cyan-900/10 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-gradient-to-tr from-cyan-100 to-blue-50 dark:from-cyan-900/40 dark:to-blue-900/20 rounded-full flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-200 dark:border-cyan-800 shadow-sm">
                        {eng.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-0.5">{eng.id}</div>
                        <div className="text-base font-semibold text-gray-800 dark:text-stone-200 leading-tight">{eng.name}</div>
                        <div className="text-xs text-stone-400 font-medium">{eng.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      eng.role.includes('Senior') 
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50' 
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50'
                    }`}>
                      {eng.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-tight text-gray-500">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                      {eng.status}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                        <ChevronRight size={18} />
                      </button>
                    </div>
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
      )}
    </div>
  );
};

export default EngineerManagement;