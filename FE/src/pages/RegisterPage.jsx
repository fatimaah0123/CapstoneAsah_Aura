import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ShieldCheck, ArrowRight, ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { registerUser } from '../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ 
    userId: '', 
    username: '', 
    email: '', 
    password: '' 
  });

  // Fungsi validasi password: Min 8 karakter, 1 Huruf Besar, 1 Angka
  const validatePassword = (pass) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pass);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi sebelum kirim ke API
    if (!validatePassword(formData.password)) {
      setError('Password belum memenuhi syarat keamanan (8 Karakter, Huruf Besar, Angka).');
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData);
      alert("Registrasi Berhasil! Silakan masuk menggunakan kredensial Anda.");
      navigate('/login'); 
    } catch (err) {
      setError(err.message || "Gagal melakukan registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-blue-950 font-sans">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-900/80 to-blue-950/90"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-t-8 border-blue-600">
          
          <div className="mb-8 text-center">
            <button 
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-[0.2em] mb-6 transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              Kembali ke Login
            </button>
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase italic">Registrasi</h2>
            <p className="text-slate-500 text-sm font-medium">Buat akun teknisi baru</p>
          </div>

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

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest italic">
              Industrial Reliability System
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;