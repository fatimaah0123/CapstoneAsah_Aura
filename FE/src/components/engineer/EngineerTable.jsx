import React from 'react';
import { Trash2, ChevronRight } from 'lucide-react';

const EngineerTable = ({ engineers }) => (
  <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
            <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">Informasi Personel</th>
            <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-center">Jabatan</th>
            <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-center">Status</th>
            <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
          {engineers.map((eng) => (
            <tr key={eng.id} className="hover:bg-cyan-50/30 dark:hover:bg-cyan-900/10 transition-colors group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-gradient-to-tr from-cyan-100 to-blue-50 dark:from-cyan-900/40 dark:to-blue-900/20 rounded-full flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-200 dark:border-cyan-800 shadow-sm">
                    {eng.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-0.5">{eng.id}</div>
                    <div className="text-base font-semibold text-gray-800 dark:text-stone-200 leading-tight">{eng.name}</div>
                    <div className="text-xs text-stone-400 font-medium">{eng.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-center">
                <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                  eng.role.includes('Senior') 
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50' 
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50'
                }`}>
                  {eng.role}
                </span>
              </td>
              <td className="px-8 py-5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-tight text-gray-500">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                  {eng.status}
                </div>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end items-center gap-1">
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default EngineerTable;