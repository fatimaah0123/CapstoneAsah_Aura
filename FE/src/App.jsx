import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import useDarkMode from './hooks/useDarkMode';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import TicketsPage from './pages/TicketsPage';
import InspectionsPage from './pages/InspectionsPage';
import CreateTicketPage from './pages/CreateTicketPage'; 
import MaintenanceReportPage from './pages/MaintenanceReportPage';
import TicketDetailPage from './pages/TicketDetailPage';


const App = () => {
  const [isDark, toggleDark] = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      
      {/* Navbar (Di Desktop berisi Menu, Di Mobile ada Hamburger) */}
      <Navbar 
        isDark={isDark} 
        toggleDark={toggleDark}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      
      {/* Sidebar Mobile (Overlay/Popup) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inspections" element={<InspectionsPage />} />
          <Route path="/schedule" element={<InspectionsPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/create-ticket" element={<CreateTicketPage />} />
          <Route path="/report/:id" element={<MaintenanceReportPage />} />
          {/* ... route lainnya ... */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;