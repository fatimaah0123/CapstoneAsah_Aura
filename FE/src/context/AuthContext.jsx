import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authServices';

// ─── Buat Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // { id, name, email, role }
  const [isLoading, setIsLoading] = useState(true); // true saat cek sesi pertama kali

  // Saat app pertama dibuka: coba pulihkan sesi dari localStorage.
  // Kalau accessToken & user masih ada → langsung pakai.
  // Kalau tidak ada → coba refresh via cookie (kasus buka tab baru / reload).
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser  = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoading(false);
        return;
      }

      // Tidak ada data lokal → coba minta token baru via refreshToken (cookie HttpOnly)
      try {
        const freshUser = await authService.refreshToken();
        setUser(freshUser);
      } catch {
        // Cookie juga tidak ada / expired → user harus login manual
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const loggedUser = await authService.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  // ── Helper role ────────────────────────────────────────────────────────────
  // Perhatikan: BE mengembalikan role dengan huruf kapital awal → 'Admin' / 'Engineer'
  const isAdmin    = user?.role === 'Admin';
  const isEngineer = user?.role === 'Engineer';

  return (
    <AuthContext.Provider value={{ user, isAdmin, isEngineer, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Custom Hook ──────────────────────────────────────────────────────────────
// Gunakan hook ini di komponen mana saja yang butuh data auth:
// const { user, isAdmin, login, logout } = useAuth();
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus digunakan di dalam <AuthProvider>. Pastikan AuthProvider membungkus App di main.jsx.');
  }
  return ctx;
};