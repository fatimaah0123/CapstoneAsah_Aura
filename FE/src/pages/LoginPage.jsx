import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginUser } from '../services/api';

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ userId: '', password: '' });

  // Fungsi validasi password: Min 8 karakter, 1 Huruf Besar, 1 Angka
  const validatePassword = (pass) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pass);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(formData.password)) {
      setError('Akses ditolak: Password tidak memenuhi standar keamanan.');
      return;
    }

    setLoading(true);
    try {
      // Menggunakan data simulasi atau API asli
      await loginUser({
        email: formData.userId,
        password: formData.password
      });

      if (onLoginSuccess) onLoginSuccess();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'ID atau Password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-blue-950 font-sans">
      
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-900/80 to-blue-950/90 shadow-inner"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Branding AVATAR */}
        <div className="hidden lg:flex flex-col space-y-6 text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 w-fit backdrop-blur-md">
            <Activity className="text-blue-400" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Industrial Reliability System</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-8xl font-black tracking-tighter italic">AVATAR</h1>
            <div className="h-2 w-24 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
            <p className="text-2xl font-light text-blue-100 leading-relaxed pt-4">
              <span className="font-bold">Accenture Virtual Assistant</span> for <br/>
              Technical Analysis and Reliability
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight italic text-center">Login</h2>
            </div>

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
          </div>
        </div>
      </div>

      {/* Dekorasi Branding Bawah */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-yellow-500 to-blue-600 shadow-[0_-4px_20px_rgba(37,99,235,0.4)]"></div>
    </div>
  );
};

export default LoginPage;