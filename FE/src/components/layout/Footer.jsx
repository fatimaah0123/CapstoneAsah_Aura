import React from 'react';
import { UserCircle, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto transition-all duration-300
      bg-gradient-to-r from-cyan-500 to-blue-600 
      dark:bg-none dark:bg-gray-900 border-t border-transparent dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* BAGIAN KIRI: BRANDING & COPYRIGHT */}
          <div className="space-y-2 text-white dark:text-gray-300">
            <h3 className="text-2xl font-bold tracking-tight">AURA</h3>
            <p className="text-sm opacity-90 dark:opacity-70 leading-relaxed">
              Asset Reliability Assistant<br />
              © 2025 Accenture. All rights reserved.
            </p>
          </div>

          {/* BAGIAN KANAN: KONTAK (Tanpa Card, Text Only) */}
          <div className="flex flex-col md:items-end space-y-4 text-white dark:text-gray-300">
            
            {/* Profil Manajer */}
            <div className="flex items-center gap-3">
              {/* Info Teks (Rata Kanan di Desktop) */}
              <div className="text-left md:text-right">
                <p className="text-sm font-bold">Ir. Aidan Muharram Saputra</p>
                <p className="text-xs opacity-80">Manajer Teknis </p>
              </div>
              
              {/* Avatar Icon */}
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
                <UserCircle size={24} className="text-white" />
              </div>
            </div>

            {/* Info Kontak (Baris Bawah) */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-6 text-sm font-medium opacity-90">
              <div className="flex items-center gap-2 hover:opacity-100 transition-opacity cursor-default">
                <Phone size={16} /> 
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2 hover:opacity-100 transition-opacity cursor-pointer">
                <Mail size={16} /> 
                <span>support-ai@aura.com</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;