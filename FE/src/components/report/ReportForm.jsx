import React from 'react';
import { Package } from 'lucide-react';

const ReportForm = ({ damageDesc, setDamageDesc, spareParts, setSpareParts, isViewOnly }) => (
  <section className="bg-white dark:bg-stone-900 p-8 rounded-[2rem] shadow-sm border-2 border-stone-100 dark:border-stone-800 transition-all hover:border-blue-100 dark:hover:border-stone-700">
    <h3 className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
      <Package size={16} /> Detail Temuan & Suku Cadang
    </h3>
    <div className="space-y-4">
      <textarea 
        required 
        placeholder="Deskripsikan detail kerusakan dan tindakan yang diambil..."
        value={damageDesc} 
        onChange={(e) => setDamageDesc(e.target.value)}
        disabled={isViewOnly}
        className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 h-32 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60 resize-none"
      />
      <textarea 
        placeholder="Daftar suku cadang yang diganti (jika ada)..."
        value={spareParts} 
        onChange={(e) => setSpareParts(e.target.value)}
        disabled={isViewOnly}
        className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 h-24 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60 resize-none"
      />
    </div>
  </section>
);

export default ReportForm;