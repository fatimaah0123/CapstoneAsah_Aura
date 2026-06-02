// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('user_role');

  // Jika belum login, tendang kembali ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login tetapi role-nya tidak diizinkan mengakses halaman ini, tendang ke dashboard umum
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Jika lolos pengecekan, tampilkan halaman yang dituju
  return <Outlet />;
};

export default ProtectedRoute;