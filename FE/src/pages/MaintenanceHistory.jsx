import React, { useState } from 'react';
import { FileText, CheckCircle2, Eye, Search, Calendar } from 'lucide-react';

const MaintenanceHistory = () => {
  // Hanya memuat arsip tiket yang SUDAH SELESAI (RESOLVED) & APPROVED oleh Admin
  const [historyLogs] = useState([
    {
      id: 'LOG-001',
      assetName: 'Compressor 33',
      issue: 'Kebocoran katup tekanan udara utama',
      engineerName: 'Rian',
      completionDate: '01 Juni 2026',
      status: 'RESOLVED',
      notes: 'Sudah dilakukan penggantian seal katup utama dan uji tekanan ulang. Hasil normal dan disetujui oleh Admin.',
      photo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500'
    },
    {
      id: 'LOG-002',
      assetName: 'Fan 24',
      issue: 'Kelebihan beban arus listrik pada motor penggerak',
      engineerName: 'Bara',
      completionDate: '28 Mei 2026',
      status: 'RESOLVED',
      notes: 'Pembersihan rotor dan kalibrasi ulang modul sistem kelistrikan luar. Laporan valid.',
      photo: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  // Filter Logika Pencarian khusus untuk riwayat mesin selesai
  const filteredLogs = historyLogs.filter(log => {
    return log.assetName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           log.issue.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* HEADER */}
      <div className="border-b border-gray-200 dark:border-stone-800 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Riwayat Pemeliharaan & Aset</h1>
        <p className="text-sm text-gray-500">Daftar arsip seluruh perbaikan mesin yang telah dinyatakan selesai dan disetujui oleh Admin.</p>
      </div>

      {/* SEARCH BAR CONTROL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 rounded-xl border border-gray-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg border border-green-100 dark:border-green-900/50">
          <CheckCircle2 size={14} />
          <span>Mode: Hanya Menampilkan Arsip Approved</span>
        </div>

        {/* Kolom Pencarian Mesin */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Cari nama aset atau kendala..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-stone-700 bg-gray-50 dark:bg-stone-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* TABEL RIWAYAT UTAMA */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-gray-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-50 dark:bg-stone-950 border-b border-gray-200 dark:border-stone-800 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Nama Aset</th>
                <th className="px-6 py-4">Kategori Kendala</th>
                <th className="px-6 py-4">Teknisi (Engineer)</th>
                <th className="px-6 py-4">Tanggal Selesai</th>
                <th className="px-6 py-4">Status Akhir</th>
                <th className="px-6 py-4 text-center">Dokumentasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-stone-800 text-sm">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                    Tidak ada riwayat dokumen perbaikan yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/60 dark:hover:bg-stone-800/40 transition-colors">
                    {/* NAMA ASET */}
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{log.assetName}</td>
                    
                    {/* KENDALANYA */}
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">{log.issue}</td>
                    
                    {/* ENGINEER */}
                    <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-semibold">{log.engineerName}</td>
                    
                    {/* TANGGAL SELESAI */}
                    <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                      <Calendar size={14} className="text-gray-400" />
                      {log.completionDate}
                    </td>
                    
                    {/* BADGE STATUS */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-900/40">
                        <CheckCircle2 size={12} />
                        APPROVED
                      </span>
                    </td>

                    {/* TOMBOL LIHAT DOKUMEN / DETAIL BUKTI */}
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-blue-600 dark:bg-stone-800 text-gray-700 dark:text-gray-300 hover:text-white rounded-lg font-semibold text-xs transition-all shadow-sm"
                      >
                        <Eye size={12} />
                        <span>Lihat Dokumen</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL BUKTI AUDIT & MAINTENANCE LOGS ================= */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 p-6 rounded-xl max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-stone-800 pb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <FileText className="text-blue-500" size={18} />
                Dokumen Hasil Pemeliharaan
              </h3>
              <span className="text-xs font-mono font-bold text-gray-400">{selectedLog.id}</span>
            </div>

            <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-400 block">Nama Alat Utama:</span>
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{selectedLog.assetName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Teknisi Pelaksana:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedLog.engineerName}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block">Riwayat Laporan Akhir:</span>
                <p className="bg-gray-50 dark:bg-stone-950 p-3 rounded-lg border border-gray-100 dark:border-stone-800 italic text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  "{selectedLog.notes}"
                </p>
              </div>

              <div>
                <span className="text-gray-400 block mb-1">Lampiran Foto Bukti Resmi (Approved):</span>
                <img src={selectedLog.photo} alt="Bukti Perbaikan" className="w-full h-44 object-cover rounded-lg border border-gray-200 dark:border-stone-800" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedLog(null)} 
                className="px-4 py-2 bg-gray-900 dark:bg-stone-800 text-white text-xs font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-stone-700 transition"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MaintenanceHistory;