import React, { useState } from 'react';
import { X, AlertCircle, Calendar, Clock, User, Users, Wrench, FileText, Camera, Save } from 'lucide-react';

const CreateTicketPage = ({ onClose, onSave, selectedAsset }) => {
  const [formData, setFormData] = useState({
    assetId: selectedAsset?.id || '',
    assetName: selectedAsset?.name || '',
    problemType: '',
    priority: 'medium',
    description: '',
    picName: '',
    picContact: '',
    teamMembers: '',
    scheduledDate: '',
    scheduledTime: '',
    estimatedDuration: '',
    maintenanceType: 'corrective',
    spareParts: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi form
    if (!formData.assetId || !formData.assetName || !formData.problemType) {
      alert('Mohon lengkapi field yang wajib diisi');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Buat Tiket Maintenance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lengkapi informasi untuk membuat tiket baru</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informasi Aset */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-cyan-600" />
              Informasi Aset
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID Aset <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleChange}
                  placeholder="Contoh: TRB-001"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Aset <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleChange}
                  placeholder="Contoh: Turbin Utama #12"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Detail Masalah */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600" />
              Detail Masalah
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jenis Masalah <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="problemType"
                    value={formData.problemType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih Jenis Masalah</option>
                    <option value="mechanical">Kerusakan Mekanik</option>
                    <option value="electrical">Kerusakan Elektrik</option>
                    <option value="vibration">Getaran Tinggi</option>
                    <option value="temperature">Suhu Berlebih</option>
                    <option value="oil">Kebocoran Oli</option>
                    <option value="noise">Suara Abnormal</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prioritas <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  >
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                    <option value="critical">Kritis</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deskripsi Masalah <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Jelaskan detail masalah yang terjadi..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Penanggung Jawab & Tim */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-600" />
              Penanggung Jawab & Tim
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama PIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="picName"
                    value={formData.picName}
                    onChange={handleChange}
                    placeholder="Nama penanggung jawab"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kontak PIC
                  </label>
                  <input
                    type="text"
                    name="picContact"
                    value={formData.picContact}
                    onChange={handleChange}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Anggota Tim
                </label>
                <input
                  type="text"
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleChange}
                  placeholder="Pisahkan dengan koma (Contoh: Ahmad, Budi, Candra)"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Jadwal Perbaikan */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              Jadwal Perbaikan
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Waktu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Durasi Estimasi
                  </label>
                  <select
                    name="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Pilih Durasi</option>
                    <option value="1h">1 Jam</option>
                    <option value="2h">2 Jam</option>
                    <option value="4h">4 Jam</option>
                    <option value="8h">8 Jam (1 Hari)</option>
                    <option value="16h">2 Hari</option>
                    <option value="24h">3 Hari</option>
                    <option value="more">Lebih dari 3 Hari</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jenis Maintenance
                </label>
                <select
                  name="maintenanceType"
                  value={formData.maintenanceType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="corrective">Corrective (Perbaikan)</option>
                  <option value="preventive">Preventive (Pencegahan)</option>
                  <option value="predictive">Predictive (Prediktif)</option>
                  <option value="inspection">Inspection (Inspeksi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informasi Tambahan */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-600" />
              Informasi Tambahan
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Spare Parts yang Dibutuhkan
                </label>
                <textarea
                  name="spareParts"
                  value={formData.spareParts}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Daftar spare parts yang diperlukan..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catatan Tambahan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Informasi atau catatan penting lainnya..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Upload Foto/Dokumen
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Klik untuk upload atau drag & drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, PDF hingga 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5" />
              Simpan Tiket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketPage;