import React from 'react';
import { Camera, X, FlipHorizontal } from 'lucide-react';

const CameraModal = ({ videoRef, canvasRef, takePhoto, stopCamera, toggleCamera }) => (
  <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
    <div className="relative w-full max-w-2xl bg-stone-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
      <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-8 left-0 w-full flex justify-center gap-6">
        <button type="button" onClick={toggleCamera} className="p-5 bg-stone-800 text-white rounded-full shadow-xl active:scale-90 transition-all">
          <FlipHorizontal size={28} />
        </button>
        <button type="button" onClick={takePhoto} className="p-5 bg-white text-black rounded-full shadow-xl active:scale-90 transition-all shadow-white/10">
          <Camera size={32} />
        </button>
        <button type="button" onClick={stopCamera} className="p-5 bg-red-600 text-white rounded-full shadow-xl active:scale-90 transition-all">
          <X size={28} />
        </button>
      </div>
    </div>
  </div>
);

export default CameraModal;