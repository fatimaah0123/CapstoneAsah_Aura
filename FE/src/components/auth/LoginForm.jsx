// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// src/components/auth/LoginForm.jsx
import { login as loginService } from '../../services/authServices';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Panggil service login ke backend
      const response = await loginService({ email, password });
      const { token, user } = response;

      // 2. Simpan token dan role ke localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_role', user.role); // Menyimpan 'admin' atau 'engineer'
      localStorage.setItem('user_name', user.name);

      // 3. Arahkan pengguna langsung ke halaman Dashboard utama
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required 
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isLoading ? 'Sedang Memuat...' : 'Masuk'}
      </button>
    </form>
  );
};

export default LoginForm;