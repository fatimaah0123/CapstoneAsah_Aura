import React from 'react';

const FilterBar = ({ statusFilter, setStatusFilter, sortBy, setSortBy }) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-6">
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status Kesehatan</label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
      >
        <option value="all">Semua Status</option>
        <option value="high">Risiko Tinggi</option>
        <option value="attention">Perhatian</option>
        <option value="optimal">Optimal</option>
      </select>
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Urutkan Berdasarkan</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
      >
        <option value="score-asc">Skor Kesehatan: Rendah → Tinggi</option>
        <option value="score-desc">Skor Kesehatan: Tinggi → Rendah</option>
        <option value="name">Nama Aset</option>
      </select>
    </div>
  </div>
);

export default FilterBar;