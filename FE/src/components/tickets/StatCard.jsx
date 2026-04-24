import React from 'react';

const StatCard = ({ icon, label, value }) => (
  <div className={`p-3 rounded-lg border text-center ${value ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
    <div className={`mx-auto mb-1 w-8 h-8 flex items-center justify-center rounded-full ${value ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
      {icon}
    </div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`font-bold ${value ? 'text-red-700' : 'text-green-700'}`}>{value ? 'Ya' : 'Tidak'}</p>
  </div>
);

export default StatCard;