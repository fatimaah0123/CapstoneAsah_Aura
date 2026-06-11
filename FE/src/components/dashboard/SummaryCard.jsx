import React from 'react';
import { Cpu, Ticket } from 'lucide-react';

// Props:
//   title  → string label kartu
//   value  → angka yang ditampilkan besar
//   type   → 'machines' | 'tickets' (menentukan ikon & warna)

const CONFIG = {
  machines: {
    icon: Cpu,
    gradient: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-800/40',
    iconColor: 'text-blue-500',
    label: 'Terdaftar',
  },
  tickets: {
    icon: Ticket,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-100 dark:border-amber-800/40',
    iconColor: 'text-amber-500',
    label: 'Sedang Aktif',
  },
};

const SummaryCard = ({ title, value, type = 'machines' }) => {
  const cfg = CONFIG[type] || CONFIG.machines;
  const Icon = cfg.icon;

  return (
    <div className={`rounded-2xl border p-6 flex items-center gap-5 bg-white dark:bg-stone-900 shadow-sm ${cfg.border} hover:shadow-md transition-shadow`}>
      {/* Ikon */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${cfg.gradient} shadow-lg shrink-0`}>
        <Icon size={26} className="text-white" />
      </div>

      {/* Teks */}
      <div>
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{title}</p>
        <p className="text-4xl font-black text-stone-900 dark:text-white leading-tight mt-0.5">
          {value ?? '—'}
        </p>
        <p className={`text-xs font-semibold mt-1 ${cfg.iconColor}`}>{cfg.label}</p>
      </div>
    </div>
  );
};

export default SummaryCard;