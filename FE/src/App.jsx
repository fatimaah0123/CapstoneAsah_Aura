import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useDarkMode from './hooks/useDarkMode';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import ChatbotPage from './pages/ChatbotPage';
import ReportPage from './pages/ReportPage'; 
import MachineManagement from './pages/MachineManagement';
import EngineerManagement from './pages/EngineerManagement';

// Catatan: LoginPage dan RegisterPage diimpor tapi tidak digunakan dalam routing sementara
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 

const App = () => {
  const [isDark, toggleDark] = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // MODIFIKASI: Set default ke true agar langsung masuk ke dashboard selama pengembangan
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  const location = useLocation();
  
  // Halaman login/register tetap bisa diakses secara manual jika diperlukan lewat URL
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-stone-950 flex flex-col min-h-screen">
        
        {/* Navbar & Sidebar tampil otomatis karena isLoggedIn sudah true */}
        {!isAuthPage && (
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
            {/* Redirect root ke dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard & Halaman Lainnya sekarang bisa diakses tanpa pengecekan token */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
            <Route path="/report/:id" element={<ReportPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/admin/machines" element={<MachineManagement />} />
            <Route path="/admin/engineers" element={<EngineerManagement />} />
            
            {/* Route Auth tetap ada untuk testing UI jika diperlukan secara manual */}
            <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Catch-all: Lari ke dashboard jika route salah */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
};

export default App;