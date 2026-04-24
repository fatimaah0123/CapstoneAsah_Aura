import React from 'react';
import { User, ShieldCheck, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { validatePassword } from '../../hooks/useRegister';

const RegisterForm = ({ formData, setFormData, showPassword, error, loading, handleRegister }) => (
  <>
    {error && (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[11px] font-bold flex items-center gap-2 animate-shake">
        <AlertCircle size={16} /> {error}
      </div>
    )}

    <form onSubmit={handleRegister} className="space-y-4">
      {/* ID Pegawai */}
      <div className="space-y-1">
        <label className="text-sm font-bold text-slate-900 ml-1">ID Pegawai</label>
        <div className="relative">
          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
          <input 
            type="text" required placeholder="Contoh: ENG-001"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            onChange={(e) => setFormData({...formData, userId: e.target.value})}
          />
        </div>
      </div>

      {/* Nama Lengkap */}
      <div className="space-y-1">
        <label className="text-sm font-bold text-slate-900 ml-1">Nama Lengkap</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
          <input 
            type="text" required placeholder="Nama Teknisi"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-bold text-slate-900 ml-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
          <input 
            type={showPassword ? "text" : "password"} 
            required placeholder="••••••••"
            className={`w-full bg-slate-50 border ${formData.password && !validatePassword(formData.password) ? 'border-amber-400' : 'border-slate-200'} rounded-2xl py-3.5 pl-12 pr-12 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-600 transition-all`}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {/* ... tombol eye icon ... */}
        </div>
      </div>
      
      <button 
        type="submit"
        disabled={loading}
        className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all mt-6 uppercase tracking-widest text-sm`}
      >
        {loading ? "Mendaftarkan..." : "Konfirmasi Pendaftaran"}
        {!loading && <ArrowRight size={18} />}
      </button>
    </form>
  </>
);

export default RegisterForm;