import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDark, toggle }) => (
  <button
    onClick={toggle}
    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    aria-label="Toggle theme"
  >
    {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
  </button>
);

const Navbar = ({ isDark, toggleDark, onMenuClick }) => (
  <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-40">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img 
            src="/img/logo.png" 
            alt="AURA Logo" 
            className="w-10 h-10 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%2306b6d4" width="100" height="100" rx="20"/%3E%3Ctext x="50" y="65" font-size="50" text-anchor="middle" fill="white" font-weight="bold"%3EA%3C/text%3E%3C/svg%3E';
            }}
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">AURA</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Asset Reliability Assistant</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle isDark={isDark} toggle={toggleDark} />
        <button 
          onClick={onMenuClick} 
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;