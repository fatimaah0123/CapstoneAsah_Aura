import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authServices';

// Fungsi validasi password: Min 8 karakter, 1 Huruf Besar, 1 Angka
export const validatePassword = (pass) => {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(pass);
};

const useLogin = (onLoginSuccess) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ userId: '', password: '' });

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
      await login(formData);

      if (onLoginSuccess) onLoginSuccess();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'ID atau Password salah.');
    } finally {
      setLoading(false);
    }
  };

  return {
    showPassword, setShowPassword,
    loading,
    error,
    formData, setFormData,
    handleLogin,
  };
};

export default useLogin;