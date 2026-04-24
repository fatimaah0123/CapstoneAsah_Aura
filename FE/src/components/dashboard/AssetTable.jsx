import React from 'react';
import { Thermometer, Crosshair, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const AssetTable = ({ assets, pagination }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
    <div className="overflow-x-auto min-h-[300px]">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Nama Aset</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Sensor Live</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">RUL</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {assets.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-8 text-center text-gray-500 text-sm">Tidak ada data aset ditemukan.</td>
            </tr>
          ) : (
            assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-4 text-sm font-mono text-gray-900 dark:text-white">{asset.id}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">{asset.name}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                    ${asset.status === 'CRITICAL' ? 'bg-red-100 text-red-700' : 
                      asset.status === 'WARNING' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2"><Thermometer className="w-3 h-3" /> {asset.air_temperature}°C</div>
                    <div className="flex items-center gap-2"><Crosshair className="w-3 h-3" /> {asset.rotational_speed} RPM</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{asset.rul_hours.toFixed(0)} Hours</span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    {pagination.total > 0 && (
      <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <span className="font-bold text-gray-900 dark:text-white">{pagination.from}</span> - <span className="font-bold text-gray-900 dark:text-white">{pagination.to}</span> dari <span className="font-bold text-gray-900 dark:text-white">{pagination.total}</span> data
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={pagination.onPrev}
            disabled={pagination.currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} /> Sebelumnya
          </button>
          <button 
            onClick={pagination.onNext}
            disabled={pagination.currentPage === pagination.totalPages}
            className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Selanjutnya <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )}
  </div>
);

export default AssetTable;