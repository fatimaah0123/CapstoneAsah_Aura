import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';

export const getDashboardSummary = async function () {
  try {
    const response = await axios.get(`${BASE_URL}api/dashboard/summary`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

export const getDashboardTrend = async function () {
  try {
    const response = await axios.get(`${BASE_URL}api/dashboard/trend`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard trend:', error);
    throw error;
  }
};

export const getDashboardStat = async function () {
  try {
    const response = await axios.get(`${BASE_URL}api/dashboard/stats`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const chatBot = async function (question) {
  try {
    const response = await axios.post(
      `${BASE_URL}api/chatbot`,
      { question },
      { headers: { 'ngrok-skip-browser-warning': 'true' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching chatbot:', error);
    throw error;
  }
};

export const getMaintenanceTickets = async function (status = '') {
  try {
    const url = status
      ? `${BASE_URL}api/maintenance-tickets?status=${status}`
      : `${BASE_URL}api/maintenance-tickets`;

    const response = await axios.get(url, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance tickets:', error);
    return { data: [] };
  }
};

export const getMaintenanceTicketById = async function (id) {
  try {
    const response = await axios.get(
      `${BASE_URL}api/maintenance-tickets/${id}`,
      {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket detail:', error);
    throw error;
  }
};

export const updateMaintenanceTicket = async function (id, data) {
  try {
    const response = await axios.put(
      `${BASE_URL}api/maintenance-tickets/${id}`,
      data,
      {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

export const deleteMaintenanceTicket = async function (id) {
  try {
    const response = await axios.delete(
      `${BASE_URL}api/maintenance-tickets/${id}`,
      {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};

export const postCreateTicket = async function (data) {
  try {
    const response = await axios.post(
      `${BASE_URL}api/maintenance-tickets`,
      data,
      {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error posting create ticket:', error);
    throw error;
  }
};
