import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon, LayoutDashboard, Ticket, MessageSquare, UserCircle, Activity, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; 

const ThemeToggle = ({ isDark, toggle }) => (
  <button
    onClick={toggle}
    className="p-2.5 rounded-full hover:bg-white/20 transition-all duration-300 text-white"
  >
    {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-white" />}
  </button>
);

const Navbar = ({ isDark, toggleDark, onMenuClick }) => {
  const location = useLocation();

  // STATE DINAMIS NAMA PENGGUNA
  const [userName, setUserName] = useState(() => {
    const savedName = localStorage.getItem('user_name') || localStorage.getItem('name') || localStorage.getItem('nama');
    return savedName || 'Siti Fatimah Nur Cahya'; 
  });

  // REVISI: Tambahkan state untuk memantau user_role secara dinamis di Navbar
  const [userRole, setUserRole] = useState(() => {
    return (localStorage.getItem('user_role') || 'engineer').toLowerCase();
  });

  // Ikut memantau jika sewaktu-waktu ada perpindahan akun atau role tanpa reload halaman
  useEffect(() => {
    const handleStorageChange = () => {
      const savedName = localStorage.getItem('user_name') || localStorage.getItem('name') || localStorage.getItem('nama');
      if (savedName) setUserName(savedName);

      const savedRole = localStorage.getItem('user_role');
      if (savedRole) setUserRole(savedRole.toLowerCase());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  // REVISI: Definisikan semua menu, lalu tambahkan properti "isAdminOnly"
  const allNavLinks = [
    { title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} />, isAdminOnly: false },
    { title: 'Tiket', path: '/tickets', icon: <Ticket size={18} />, isAdminOnly: false },
    { title: 'AI Copilot', path: '/chatbot', icon: <MessageSquare size={18} />, isAdminOnly: false },
    
    // Menu Khusus Admin (isAdminOnly: true)
    { title: 'Riwayat', path: '/admin/maintenance', icon: <Clock size={18} />, isAdminOnly: true },
    { title: 'Manajemen Mesin', path: '/admin/machines', icon: <Activity size={18} />, isAdminOnly: true },
    { title: 'Manajemen Engineer', path: '/admin/engineers', icon: <UserCircle size={18} />, isAdminOnly: true },
  ];

  // REVISI LOGIKA FILTER: Menyaring tautan menu berdasarkan role yang sedang aktif
  const displayNavLinks = allNavLinks.filter(link => {
    if (link.isAdminOnly) {
      return userRole === 'admin'; // Hanya lolos saring jika role-nya adalah admin
    }
    return true; // Menu dasar otomatis lolos saring untuk semua role
  });

  return (
    <nav className="sticky top-0 z-30 w-full shadow-lg">
      
      {/* --- TOP BAR: GRADASI BIRU KE HITAM --- */}
      <div className="relative h-20 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-950 to-black dark:from-black dark:via-stone-900 dark:to-black border-b border-white/10 transition-all duration-500">
        
        {/* Latar Belakang Industri */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1470&auto=format&fit=crop')` }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger Mobile */}
            <button 
              onClick={onMenuClick} 
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors lg:hidden text-white border border-white/20"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Branding */}
            <div className="flex items-center gap-3">
              <Activity size={28} className="text-blue-400 mt-1" />
              <div className="flex flex-col text-white">
                <h1 className="text-2xl font-black tracking-tighter leading-none italic">AVATAR</h1>
                <p className="text-[8px] uppercase tracking-[0.3em] font-bold mt-1 text-blue-200/80">Technical Analysis & Reliability</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            <ThemeToggle isDark={isDark} toggle={toggleDark} />
            <div className="flex items-center gap-3 border-l border-white/20 pl-4 lg:pl-6 text-white">
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden bg-white/10 backdrop-blur-md">
                  <UserCircle size={28} className="m-auto mt-1.5 text-white" />
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold leading-none uppercase tracking-wide text-white">
                    {userName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM BAR: NAVIGASI RATA KIRI --- */}
      <div className="bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 hidden lg:block transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-start h-14">
          <div className="flex items-center">
            {/* Menggunakan variabel displayNavLinks yang sudah disaring berdasarkan role */}
            {displayNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-8 py-4 text-sm font-bold flex items-center gap-2.5 transition-all relative ${
                  isActive(link.path) 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-stone-500 dark:text-stone-400 hover:text-blue-600 dark:hover:text-white'
                }`}
              >
                {link.icon}
                {link.title}
                {isActive(link.path) && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-500 rounded-t shadow-[0_-2px_10px_rgba(37,99,235,0.4)]"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;