import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Untuk animasi halus
import { AlertCircle, X, Trash2, CheckCircle2, Info } from 'lucide-react';

const CustomModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
  const themes = {
    danger: {
      icon: <Trash2 size={40} />,
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-900/20',
      btn: 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
    },
    success: {
      icon: <CheckCircle2 size={40} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
    },
    info: {
      icon: <Info size={40} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
    }
  };

  const currentTheme = themes[type] || themes.info;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay dengan Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-stone-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden"
          >
            <div className="p-8 text-center">
              {/* Animated Icon */}
              <motion.div 
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${currentTheme.bg} ${currentTheme.color}`}
              >
                {currentTheme.icon}
              </motion.div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 italic tracking-tight uppercase">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-stone-400 leading-relaxed px-2">
                {message}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 p-8 pt-0">
              <button
                onClick={onConfirm}
                className={`w-full py-4 rounded-2xl text-sm font-black text-white transition-all shadow-lg uppercase tracking-widest ${currentTheme.btn}`}
              >
                Ya, Lanjutkan
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl text-sm font-bold text-gray-400 dark:text-stone-500 hover:text-gray-600 dark:hover:text-stone-300 transition-all uppercase tracking-widest"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;