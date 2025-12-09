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
import CreateTicketPage from './pages/CreateTicketPage'; 

const App = () => {
  const [isDark, toggleDark] = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/create-ticket" element={<CreateTicketPage />} />
          {/* ... route lainnya ... */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;