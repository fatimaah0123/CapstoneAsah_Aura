import React from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  CalendarDays, 
  FileText, 
  X, 
  Phone, 
  Mail, 
  UserCircle 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoAura from '../../assets/img/Logo2.png';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { title: 'Tiket Maintenance', icon: <Ticket size={20} />, path: '/tickets' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Container Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="h-25 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-700">
            <img 
              src={logoAura}
              alt="AURA Logo" 
              className="h-12 w-auto object-contain" 
            />
          
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- MENU ITEMS --- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive(item.path)
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              {item.icon}
              {item.title}
            </button>
          ))}
        </div>

      </aside>
    </>
  );
};

export default Sidebar;