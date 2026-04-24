import { useState, useEffect } from 'react';
import { fetchSummary, fetchTrend, fetchStat } from '../services/DashboardService';

const useDashboard = () => {
  const [summary, setSummary] = useState([]);
  const [trend, setTrend] = useState([]);
  const [stat, setStat] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await fetchSummary();
        setSummary(summaryData);

        const trendData = await fetchTrend();
        // Debug: Cek di console browser apakah trendData adalah Array
        console.log("Trend Data API:", trendData);
        setTrend(trendData);

        const statData = await fetchStat();
        setStat(statData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return { summary, trend, stat };
};

export default useDashboard;