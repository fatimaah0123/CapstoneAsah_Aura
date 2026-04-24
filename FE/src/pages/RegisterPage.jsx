import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Components
import RegisterForm from '../components/auth/RegisterForm';

// Hooks
import useRegister from '../hooks/useRegister';

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    showPassword, setShowPassword,
    loading,
    error,
    formData, setFormData,
    handleRegister,
  } = useRegister();

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

          <RegisterForm
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            error={error}
            loading={loading}
            handleRegister={handleRegister}
          />

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