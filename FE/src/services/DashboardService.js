import {
  getDashboardSummary,
  getDashboardTrend,
  getDashboardStat,
} from './api';

export const fetchSummary = async () => {
  const response = await getDashboardSummary();
  return response.data;
};

export const fetchTrend = async () => {
  const response = await getDashboardTrend();
  return response.data || [];
};

export const fetchStat = async () => {
  const response = await getDashboardStat();
  return response.data;
};