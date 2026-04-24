import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authServices';

// Fungsi validasi password: Min 8 karakter, 1 Huruf Besar, 1 Angka
export const validatePassword = (pass) => {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(pass);
};

const useRegister = () => {
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
      await register(formData);
      alert("Registrasi Berhasil! Silakan masuk menggunakan kredensial Anda.");
      navigate('/login'); 
    } catch (err) {
      setError(err.message || "Gagal melakukan registrasi");
    } finally {
      setLoading(false);
    }
  };

  return {
    showPassword, setShowPassword,
    loading,
    error,
    formData, setFormData,
    handleRegister,
  };
};

export default useRegister;