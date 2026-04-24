import React from 'react';
import { Trash2 } from 'lucide-react';

const MachineTable = ({ machines }) => (
  <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
            <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">Identitas Mesin</th>
            <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-center">Kategori</th>
            <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-center">Status</th>
            <th className="px-8 py-5 text-xs  text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
          {machines.map((machine) => (
            <tr key={machine.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
              <td className="px-8 py-5">
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-0.5">{machine.id}</div>
                <div className="text-base font-semibold text-gray-800 dark:text-stone-200">{machine.name}</div>
              </td>
              <td className="px-8 py-5 text-center">
                <span className="px-3 py-1 bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-400 rounded-md text-xs font-bold">
                  {machine.type}
                </span>
              </td>
              <td className="px-8 py-5 text-center">
                <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-xs uppercase">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {machine.status}
                </div>
              </td>
              <td className="px-8 py-5 text-right">
                <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default MachineTable;