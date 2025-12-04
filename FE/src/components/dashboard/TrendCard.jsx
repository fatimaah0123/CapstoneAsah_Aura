import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const TrendCard = ({ data }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Trend Kesehatan Aset (5 Hari Terakhir)
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
        <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.9)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
          }}
        />
        <Line
          type="monotone"
          dataKey="machineNormal"
          stroke="#10B981"
          strokeWidth={2}
          name="Normal"
        />
        <Line
          type="monotone"
          dataKey="machineWarning"
          stroke="#F59E0B"
          strokeWidth={2}
          name="Warning"
        />
        <Line
          type="monotone"
          dataKey="machineCritical"
          stroke="#EF4444"
          strokeWidth={2}
          name="Critical"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TrendCard;
