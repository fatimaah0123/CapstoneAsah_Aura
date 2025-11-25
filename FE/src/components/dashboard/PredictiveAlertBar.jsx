import React from 'react';
import { AlertTriangle, Plus } from 'lucide-react';

const PredictiveAlertBar = ({ alert, onCreateTicket }) => (
  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg mb-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-lg mb-1">⚠️ PERINGATAN KRITIS</h3>
          <p className="text-sm opacity-95">
            <span className="font-semibold">{alert.assetName}</span> - {alert.failure}
          </p>
          <p className="text-sm opacity-90 mt-1">
            Estimasi RUL: <span className="font-bold">{alert.rul}</span> | Health Score: <span className="font-bold">{alert.healthScore}%</span>
          </p>
        </div>
      </div>
      <button
        onClick={onCreateTicket}
        className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2 whitespace-nowrap shadow-md"
      >
        <Plus className="w-5 h-5" />
        Buat Tiket SEGERA
      </button>
    </div>
  </div>
);

export default PredictiveAlertBar;