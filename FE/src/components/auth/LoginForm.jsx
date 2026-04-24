import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { validatePassword } from '../../hooks/useLogin';

const LoginForm = ({ formData, setFormData, showPassword, setShowPassword, error, loading, handleLogin }) => {
  const navigate = useNavigate();

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-[11px] font-bold flex items-center gap-3">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Input ID */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest ml-1">ID Pegawai</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
            <input 
              type="text" required placeholder="Masukkan ID Anda"
              className="w-full bg-slate-950/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
            />
          </div>
        </div>

        {/* Input Password dengan Keterangan Dinamis */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              required placeholder="••••••••"
              className={`w-full bg-slate-950/40 border ${formData.password && !validatePassword(formData.password) ? 'border-amber-500/50' : 'border-white/10'} rounded-2xl py-4 pl-12 pr-12 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold`}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button 
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" disabled={loading}
          className={`w-full ${loading ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'} text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all mt-6 uppercase tracking-widest text-sm`}
        >
          {loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
          {!loading && <ArrowRight size={18} />}
        </button>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-blue-200/60 text-xs font-bold uppercase tracking-wider">
            Belum memiliki akses?{' '}
            <button 
              type="button" onClick={() => navigate('/register')}
              className="text-blue-400 hover:text-cyan-300 underline transition-colors"
            >
              Daftar di sini
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default LoginForm;