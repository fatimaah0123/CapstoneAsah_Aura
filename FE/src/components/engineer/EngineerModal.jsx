import React, { useState } from 'react';
import { X, Save, Mail, ShieldCheck, Loader2, Eye, EyeOff, Hash, User } from 'lucide-react';

const EngineerModal = ({
  isModalOpen,
  editTarget,       // null = tambah, object = edit
  formData,
  formError,
  isSubmitting,
  closeModal,
  handleChange,
  handleSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isModalOpen) return null;

  const isEdit = !!editTarget;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">

        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              {isEdit && (
                <p className="text-xs text-stone-400 mt-0.5">
                  {editTarget.employee_id} · {editTarget.email}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Error dari API */}
          {formError && (
            <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {formError}
            </div>
          )}

          {/* ── Field hanya untuk mode TAMBAH ── */}
          {!isEdit && (
            <>
              {/* Employee ID */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Employee ID
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    name="employee_id"
                    required
                    placeholder="EMP-001"
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="nama@avatar.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {/* Nama — tampil di kedua mode */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                name="name"
                required
                placeholder="Nama lengkap pengguna..."
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password — required saat tambah, opsional saat edit */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Password {isEdit && <span className="normal-case text-stone-400 font-normal">(kosongkan jika tidak ingin mengubah)</span>}
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required={!isEdit}
                placeholder={isEdit ? 'Password baru (opsional)' : 'Buat password...'}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 pr-12 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role — Admin atau Engineer sesuai API */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 dark:bg-stone-800 dark:text-white font-bold text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 outline-none transition-all appearance-none"
            >
              <option value="Engineer">Engineer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Tombol aksi */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-6 py-3 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-gray-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? (
                <><Loader2 size={16} className="animate-spin" /><span>Menyimpan...</span></>
              ) : (
                <><Save size={16} /><span>{isEdit ? 'Simpan Perubahan' : 'Tambah Pengguna'}</span></>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EngineerModal;