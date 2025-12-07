import React from 'react';
import { Menu, Sun, Moon, LayoutDashboard, Ticket, CalendarDays, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; 
import logoAura from '../../assets/img/Logo2.png';

const ThemeToggle = ({ isDark, toggle }) => (
  <button
    onClick={toggle}
    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
    {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
  </button>
);

const Navbar = ({ isDark, toggleDark, onMenuClick }) => {
  const location = useLocation();

  // Helper untuk cek link aktif
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  // Menu yang sama dengan Sidebar
  const navLinks = [
    { title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { title: 'Jadwal', path: '/inspections', icon: <CalendarDays size={18} /> },
    { title: 'Tiket', path: '/tickets', icon: <Ticket size={18} /> },
    { title: 'Laporan', path: '/reports', icon: <FileText size={18} /> },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick} 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden text-gray-600 dark:text-gray-300"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logoAura} alt="Logo" className="w-20 h-auto object-contain" />
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              AURA
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1 ml-8 border-l border-gray-200 dark:border-gray-700 pl-6 h-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors
                  ${isActive(link.path) 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                  }
                `}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
          </div>
        </div>
        
        {/* BAGIAN KANAN */}
        <div className="flex items-center gap-2">
          <ThemeToggle isDark={isDark} toggle={toggleDark} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;