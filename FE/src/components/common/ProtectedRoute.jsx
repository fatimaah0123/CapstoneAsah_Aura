import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ProtectedRoute digunakan di App.jsx untuk membungkus rute yang butuh autentikasi.
//
// Penggunaan:
//   Hanya cek login saja:
//     <Route element={<ProtectedRoute />}>
//
//   Cek login + role tertentu:
//     <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
//
// Alur:
//   1. Saat isLoading (cek sesi) → tampilkan spinner, jangan redirect dulu
//   2. Tidak login → redirect ke /login
//   3. Login tapi role tidak sesuai → redirect ke /dashboard
//   4. Lolos semua → render halaman (<Outlet />)

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  // Tahap 1: Masih mengecek sesi (restore dari localStorage / refresh token)
  // Penting: tanpa ini, user yang sudah login akan di-redirect ke /login
  // karena state user belum terisi saat pertama kali render.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-stone-950">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Memeriksa sesi...</span>
        </div>
      </div>
    );
  }

  // Tahap 2: Belum login sama sekali
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Tahap 3: Sudah login tapi role tidak termasuk yang diizinkan
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Tahap 4: Semua lolos → render halaman yang diminta
  return <Outlet />;
};

export default ProtectedRoute;