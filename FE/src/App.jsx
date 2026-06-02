import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useDarkMode from './hooks/useDarkMode';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import ChatbotPage from './pages/ChatbotPage';
import ReportPage from './pages/ReportPage'; 
import MachineManagement from './pages/MachineManagement';
import MaintenanceHistory from './pages/MaintenanceHistory';
import EngineerManagement from './pages/EngineerManagement';
import LoginPage from './pages/LoginPage'; // Pastikan import ini sesuai dengan lokasi file Anda
import RegisterPage from './pages/RegisterPage'; // Jika ada halaman registrasi

// 1. Komponen Pelindung Rute (Protected & Role-Based)
const ProtectedRoute = ({ allowedRoles }) => {
  // const token = localStorage.getItem('auth_token');
  // const userRole = localStorage.getItem('user_role'); 

  // --- KODE MOCKING SEMENTARA AGAR BISA LANGSUNG MASUK DASHBOARD ---
  const token = "mock-token-bara-12345"; 
  const userRole = "admin";

  if (!token) {
    // Jika tidak ada token, paksa user ke halaman login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Jika role tidak sesuai, kembalikan ke dashboard utama
    return <Navigate to="/dashboard" replace />;
  }

  // Jika lolos verifikasi, render komponen anak
  return <Outlet />;
};

// 2. Komponen Khusus Layout Dashboard internal
const DashboardLayout = ({ isDark, toggleDark, isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className="bg-gray-50 dark:bg-stone-950 flex flex-col min-h-screen">
      {/* Navbar & Sidebar hanya merender di dalam layout internal dashboard */}
      <Navbar 
        isDark={isDark} 
        toggleDark={toggleDark} 
        onMenuClick={() => setIsSidebarOpen(true)} 
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Konten Utama Halaman Internal */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6">
        <Outlet /> {/* Di sinilah isi halaman dashboard/tiket/mesin akan muncul */}
      </main>

      <Footer />
    </div>
  );
};

const App = () => {
  const [isDark, toggleDark] = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark' : ''}`}>
      <Routes>
        {/* ================= HALAMAN PUBLIK (TANPA NAVBAR/SIDEBAR) ================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ================= HALAMAN TERPROTEKSI (ROLE: ADMIN & ENGINEER) ================= */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'engineer']} />}>
          {/* Membungkus halaman dengan struktur Layout Dashboard */}
          <Route element={
            <DashboardLayout 
              isDark={isDark} 
              toggleDark={toggleDark} 
              isSidebarOpen={isSidebarOpen} 
              setIsSidebarOpen={setIsSidebarOpen} 
            />
          }>
            {/* Redirect root awal (/) ke dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Tiket & Pelaporan */}
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
            <Route path="/report/:id" element={<ReportPage />} />

            {/* Fitur Lainnya */}
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Route>
        </Route>

        {/* ================= HALAMAN KHUSUS ADMIN SAJA ================= */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={
            <DashboardLayout 
              isDark={isDark} 
              toggleDark={toggleDark} 
              isSidebarOpen={isSidebarOpen} 
              setIsSidebarOpen={setIsSidebarOpen} 
            />
          }>
            <Route path="/admin/machines" element={<MachineManagement />} />
            <Route path="/admin/engineers" element={<EngineerManagement />} />
            <Route path="/admin/maintenance" element={<MaintenanceHistory />} />
          </Route>
        </Route>

        {/* Catch-all: Jika rute tidak dikenali dan user belum login, ProtectedRoute otomatis menendang ke /login */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default App;