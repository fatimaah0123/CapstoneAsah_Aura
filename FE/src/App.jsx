import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useDarkMode from './hooks/useDarkMode';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import ChatbotPage from './pages/ChatbotPage';
import ReportPage from './pages/ReportPage'; 
import MachineManagement from './pages/MachineManagement';
import EngineerManagement from './pages/EngineerManagement';

const App = () => {
  const [isDark, toggleDark] = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Mengecek status login dari token di localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken'));
  
  const location = useLocation();
  
  // Tentukan apakah saat ini berada di halaman autentikasi (Login/Register)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Fungsi untuk update status login saat sukses
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-stone-950 flex flex-col min-h-screen">
        
        {/* Render Navbar & Sidebar HANYA jika sudah login dan bukan di halaman auth */}
        {isLoggedIn && !isAuthPage && (
          <>
            <Navbar 
              isDark={isDark} 
              toggleDark={toggleDark} 
              onMenuClick={() => setIsSidebarOpen(true)} 
            />
            <Sidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
            />
          </>
        )}
        
        {/* Konten Utama */}
        <main className={`flex-1 w-full ${!isAuthPage ? 'max-w-7xl mx-auto p-4 md:p-6' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={!isLoggedIn ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/dashboard" />} 
            />

            {/* Protected Routes (Hanya untuk User Login) */}
            <Route path="/" element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />} />
            
            {/* Tiket & Pelaporan */}
            <Route path="/tickets" element={isLoggedIn ? <TicketsPage /> : <Navigate to="/login" />} />
            <Route path="/tickets/:id" element={isLoggedIn ? <TicketDetailPage /> : <Navigate to="/login" />} />
            <Route path="/report/:id" element={isLoggedIn ? <ReportPage /> : <Navigate to="/login" />} />

            {/* Fitur Lainnya */}
            <Route path="/chatbot" element={isLoggedIn ? <ChatbotPage /> : <Navigate to="/login" />} />
            
            {/* Manajemen Admin (Hanya muncul jika login) */}
            <Route path="/admin/machines" element={isLoggedIn ? <MachineManagement /> : <Navigate to="/login" />} />
            <Route path="/admin/engineers" element={isLoggedIn ? <EngineerManagement /> : <Navigate to="/login" />} />
            
            {/* Catch-all: Jika route tidak ditemukan */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>

        {/* Footer hanya muncul jika sudah login dan bukan di halaman auth */}
        {isLoggedIn && !isAuthPage && <Footer />}
      </div>
    </div>
  );
};

export default App;