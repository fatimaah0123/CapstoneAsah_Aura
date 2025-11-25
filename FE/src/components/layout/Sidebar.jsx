import React from 'react';
import { Home, Wrench, Calendar, FileText, Settings, X, Phone, Mail } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard Utama' },
    { id: 'tickets', icon: Wrench, label: 'Tiket Maintenance' },
    { id: 'schedule', icon: Calendar, label: 'Jadwal Inspeksi' },
    { id: 'reports', icon: FileText, label: 'Laporan Prediktif' },
    { id: 'settings', icon: Settings, label: 'Pengaturan Sistem' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed top-0 right-0 h-screen w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 
        transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left
                  ${currentPage === item.id 
                    ? 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Kontak Darurat */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
              <p className="text-xs font-semibold text-cyan-900 dark:text-cyan-300 mb-2">Kontak Darurat</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <Phone className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <Mail className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  <span>support@aura.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;