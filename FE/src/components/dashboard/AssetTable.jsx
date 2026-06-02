import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Thermometer, Crosshair, Clock, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const AssetTable = ({ assets, pagination }) => {
  const navigate = useNavigate();

  // Fungsi untuk menangani klik pada baris mesin
  const handleRowClick = (assetId) => {
    // Mengarahkan pengguna langsung ke halaman detail tiket/kondisi mesin berdasarkan ID-nya
    navigate(`/tickets/${assetId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Nama Aset</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Sensor Live</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">RUL (Sisa Waktu)</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {assets.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 text-sm">Tidak ada data aset ditemukan.</td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr 
                  key={asset.id} 
                  onClick={() => handleRowClick(asset.id)}
                  className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                >
                  
                  {/* Nama Mesin */}
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {asset.name}
                  </td>
                  
                  {/* Status Urgensi */}
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                      ${asset.status === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                        asset.status === 'WARNING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {asset.status}
                    </span>
                  </td>
                  
                  {/* Parameter Sensor Live dengan Deteksi Ambang Batas */}
                  <td className="px-4 py-4">
                    <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                      <div className={`flex items-center gap-2 ${asset.air_temperature > 45 ? 'text-red-500 font-medium' : ''}`}>
                        <Thermometer className="w-3 h-3" /> {asset.air_temperature}°C
                      </div>
                      <div className="flex items-center gap-2">
                        <Crosshair className="w-3 h-3" /> {asset.rotational_speed} RPM
                      </div>
                    </div>
                  </td>
                  
                  {/* Remaining Useful Life (RUL) */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className={asset.rul_hours < 100 ? 'text-amber-600 font-semibold' : ''}>
                        {asset.rul_hours.toFixed(0)} Hours
                      </span>
                    </div>
                  </td>

                  {/* Tombol Aksi Pintas */}
                  <td className="px-4 py-4 text-center">
                    <button className="p-1.5 rounded-lg text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-gray-700 transition-all">
                      <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination.total > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan <span className="font-bold text-gray-900 dark:text-white">{pagination.from}</span> - <span className="font-bold text-gray-900 dark:text-white">{pagination.to}</span> dari <span className="font-bold text-gray-900 dark:text-white">{pagination.total}</span> data
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); pagination.onPrev(); }}
              disabled={pagination.currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} /> Sebelumnya
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); pagination.onNext(); }}
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
};

export default AssetTable;