import React from 'react';

const SummaryCard = ({ title, value, icon: Icon, color, percentage }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {percentage}%
      </span>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
      {value}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

export default SummaryCard;
