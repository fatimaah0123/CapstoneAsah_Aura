import React, { useState, useRef } from 'react';
import { X, Send, Camera, Upload, Loader2, ImageIcon, Trash2 } from 'lucide-react';
import { ticketService } from '../../services/ticketService';

const SubmitReportModal = ({ ticket, onSuccess, onClose }) => {
  const [form, setForm] = useState({
    description:    '',
    action_taken:   '',
    notes:          '',
    duration_hours: '',
  });
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]             = useState('');
  const fileInputRef                  = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) { setError('Foto bukti pekerjaan wajib diisi.'); return; }

    setIsSubmitting(true);
    setError('');

    try {
      // Gunakan FormData karena ada upload file (multipart/form-data)
      const fd = new FormData();
      fd.append('description',    form.description);
      fd.append('action_taken',   form.action_taken);
      fd.append('duration_hours', form.duration_hours);
      fd.append('image',          imageFile);
      if (form.notes) fd.append('notes', form.notes);

      const updated = await ticketService.submitReport(ticket.id, fd);
      onSuccess(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim laporan. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Send size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">Submit Laporan Perbaikan</h3>
              <p className="text-xs text-stone-400 truncate max-w-[220px]">{ticket.machine_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Deskripsi masalah */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Deskripsi Masalah <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Jelaskan masalah yang ditemukan..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all resize-none"
            />
          </div>

          {/* Tindakan yang dilakukan */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Tindakan yang Dilakukan <span className="text-red-500">*</span>
            </label>
            <textarea
              name="action_taken"
              required
              rows={3}
              value={form.action_taken}
              onChange={handleChange}
              placeholder="Jelaskan tindakan perbaikan yang telah dilakukan..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all resize-none"
            />
          </div>

          {/* Lama pengerjaan */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Durasi Pengerjaan (jam) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="duration_hours"
              required
              min="0.1"
              step="0.1"
              value={form.duration_hours}
              onChange={handleChange}
              placeholder="Contoh: 2.5"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
            />
          </div>

          {/* Catatan tambahan */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Catatan Tambahan <span className="text-stone-300">(opsional)</span>
            </label>
            <input
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Rekomendasi, temuan lain, dll..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all"
            />
          </div>

          {/* Upload foto */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              Foto Bukti Pekerjaan <span className="text-red-500">*</span>
            </label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={resetImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
              >
                <ImageIcon size={28} className="mx-auto text-stone-300 mb-2" />
                <p className="text-sm font-medium text-stone-400">Klik untuk upload foto</p>
                <p className="text-xs text-stone-300 mt-1">JPG, PNG, WEBP (maks 10MB)</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

        </form>

        {/* Footer */}
        <div className="p-5 border-t border-stone-100 dark:border-stone-800 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all text-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            form=""
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 size={14} className="animate-spin" /> Mengirim...</>
            ) : (
              <><Send size={14} /> Kirim Laporan</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SubmitReportModal;