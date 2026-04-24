import React from 'react';
import { Camera, Upload, RefreshCw, CheckCircle2, X } from 'lucide-react';

const ReportPhoto = ({
  image,
  isCameraOpen,
  devices,
  selectedDevice,
  setSelectedDevice,
  videoRef,
  fileInputRef,
  startCamera,
  stopCamera,
  takePicture,
  handleFileChange,
  resetImage,
  isViewOnly,
}) => (
  <section className="space-y-5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Dokumentasi Visual (Wajib)</label>

    <div className="w-full relative h-[450px] bg-stone-900 rounded-[3rem] overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xl">
      {isCameraOpen ? (
        <div className="absolute inset-0">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
            {/* Dropdown pilih kamera */}
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="bg-black/60 text-white text-[10px] px-4 py-2 rounded-full border border-white/20 outline-none backdrop-blur-md font-bold"
            >
              {devices.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || 'Kamera'}
                </option>
              ))}
            </select>
            <button type="button" onClick={takePicture} className="p-4 bg-white text-stone-900 rounded-full shadow-lg active:scale-95 transition-all">
              <Camera size={24} />
            </button>
            <button type="button" onClick={stopCamera} className="p-4 bg-red-600 text-white rounded-full">
              <X size={24} />
            </button>
          </div>
        </div>
      ) : image ? (
        <div className="absolute inset-0">
          <img src={image} className="w-full h-full object-cover" alt="preview" />
          {!isViewOnly && (
            <button
              type="button"
              onClick={resetImage}
              className="absolute bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:rotate-180 transition-all duration-500"
            >
              <RefreshCw size={24} />
            </button>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-stone-950">
          <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center mb-8 border border-stone-800">
            <Camera size={32} className="text-gray-600" />
          </div>

          {!isViewOnly ? (
            <div className="flex flex-col md:flex-row gap-5">
              <button
                type="button"
                onClick={startCamera}
                className="py-4 px-10 bg-white text-stone-900 font-bold text-xs rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-wider"
              >
                <Camera size={18} /> Kamera
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="py-4 px-10 bg-stone-800 text-white font-bold text-xs rounded-2xl border border-stone-700 shadow-xl hover:bg-stone-700 transition-all flex items-center gap-3 uppercase tracking-wider"
              >
                <Upload size={18} /> Upload File
              </button>
            </div>
          ) : (
            <div className="text-stone-400 dark:text-stone-600 font-bold italic text-sm">Lampiran foto tidak tersedia</div>
          )}

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      )}
    </div>

    <div className="flex items-center gap-3 px-2">
      <CheckCircle2 className="text-blue-600" size={14} />
      <p className="text-[10px] font-bold text-gray-500 tracking-widest italic leading-relaxed">
        SOP: Dokumentasi wajib jelas untuk validasi sistem AI reliabilitas.
      </p>
    </div>
  </section>
);

export default ReportPhoto;