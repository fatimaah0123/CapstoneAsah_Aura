import React, { useState } from 'react';
import { Calendar, FileText, Settings } from 'lucide-react';

// Hooks
import useDarkMode from './hooks/useDarkMode';

// Data
import { dummyDashboardSummary } from './Data/dummy';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import TicketsPage from './pages/TicketsPage';

// Placeholder Pages (bisa dipindah ke file terpisah jika mau)
const SchedulePage = () => (
  <div className="p-6 text-center">
    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Jadwal Inspeksi</h2>
    <p className="text-gray-600 dark:text-gray-400">Halaman ini sedang dalam pengembangan</p>
  </div>
);

const ReportsPage = () => (
  <div className="p-6 text-center">
    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Laporan Prediktif</h2>
    <p className="text-gray-600 dark:text-gray-400">Halaman ini sedang dalam pengembangan</p>
  </div>
);

const SettingsPage = () => (
  <div className="p-6 text-center">
    <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pengaturan Sistem</h2>
    <p className="text-gray-600 dark:text-gray-400">Halaman ini sedang dalam pengembangan</p>
  </div>
);

const App = () => {
  const [isDark, toggleDark] = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      <Navbar 
        isDark={isDark} 
        toggleDark={toggleDark}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      <main className="flex-1 flex flex-col">
        <div className="flex-1">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'tickets' && <TicketsPage />}
          {currentPage === 'schedule' && <SchedulePage />}
          {currentPage === 'reports' && <ReportsPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
        
        <Footer />
      </main>
    </div>
  );
};

export default App;