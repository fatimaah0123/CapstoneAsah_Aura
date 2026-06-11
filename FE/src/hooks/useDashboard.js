import { useState, useEffect } from 'react';
import { dashboardService } from '../services/DashboardService';

const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading]         = useState(true);
  const [error, setError]                 = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dashboardData, isLoading, error };
};

export default useDashboard;