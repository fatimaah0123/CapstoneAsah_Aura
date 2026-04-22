import React from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  X,
  Activity,
  MessageSquare 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

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
    { title: 'AI Copilot', icon: <MessageSquare size={20} />, path: '/chatbot' }, 
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Container Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white dark:bg-stone-900 shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* --- HEADER SIDEBAR: Senada dengan Navbar --- */}
        <div className="p-6 bg-gradient-to-br from-blue-900 via-blue-950 to-black flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-blue-400" />
            <div className="flex flex-col">
              <span className="text-xl font-black italic tracking-tighter text-white">
                AVATAR
              </span>
              <span className="text-[7px] uppercase tracking-[0.2em] font-bold text-blue-200/80">
                Technical Analysis
              </span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- MENU ITEMS --- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-stone-50/50 dark:bg-transparent">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all
                ${isActive(item.path)
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-gray-600 dark:text-stone-400 hover:bg-blue-50 dark:hover:bg-stone-800 hover:text-blue-600 dark:hover:text-blue-400'
                }
              `}
            >
              <span className={`${isActive(item.path) ? 'text-white' : 'text-gray-400 dark:text-stone-500'}`}>
                {item.icon}
              </span>
              {item.title}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;