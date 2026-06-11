import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useDarkMode from './hooks/useDarkMode';

// Guard
import ProtectedRoute from './components/common/ProtectedRoute';

// Layout
import Navbar  from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer  from './components/layout/Footer';

// Pages
import LoginPage          from './pages/LoginPage';
import DashboardPage      from './pages/DashboardPage';
import MachineManagement  from './pages/MachineManagement';
import EngineerManagement from './pages/EngineerManagement';
import TicketsPage        from './pages/TicketsPage';
import TicketDetailPage   from './pages/TicketDetailPage';
import MaintenanceHistory from './pages/MaintenanceHistory';
import ReportPage         from './pages/ReportPage';
import ChatbotPage        from './pages/ChatbotPage';

// ─── Layout untuk semua halaman terproteksi ───────────────────────────────────
// Navbar & Sidebar menerima isDark, toggleDark, dan onMenuClick dari sini
// agar state dark-mode tidak tersebar ke mana-mana.
const AppLayout = ({ isDark, toggleDark, isSidebarOpen, setIsSidebarOpen }) => (
  <div className={`min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
    <Navbar
      isDark={isDark}
      toggleDark={toggleDark}
      onMenuClick={() => setIsSidebarOpen(true)}
    />
    <Sidebar
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
    />
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [isDark, toggleDark]              = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const layoutProps = { isDark, toggleDark, isSidebarOpen, setIsSidebarOpen };

  return (
    <Routes>

      {/* ── Publik ─────────────────────────────────────────────────────── */}
      <Route path="/login" element={<LoginPage />} />

      {/* ── Admin + Engineer ───────────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Engineer']} />}>
        <Route element={<AppLayout {...layoutProps} />}>
          <Route path="/dashboard"   element={<DashboardPage />} />
          <Route path="/tickets"     element={<TicketsPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/report/:id"  element={<ReportPage />} />
          <Route path="/chatbot"     element={<ChatbotPage />} />
        </Route>
      </Route>

      {/* ── Admin saja ─────────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route element={<AppLayout {...layoutProps} />}>
          <Route path="/machines"  element={<MachineManagement />} />
          <Route path="/engineers" element={<EngineerManagement />} />
          <Route path="/history"   element={<MaintenanceHistory />} />
        </Route>
      </Route>

      {/* ── Fallback ───────────────────────────────────────────────────── */}
      <Route path="/"  element={<Navigate to="/dashboard" replace />} />
      <Route path="*"  element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
}

export default App;