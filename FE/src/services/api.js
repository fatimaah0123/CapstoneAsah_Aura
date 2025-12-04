import axios from 'axios';
const BASE_URL = 'http://localhost:3000/';

export const getDashboardSummary = async function () {
  try {
    const response = await axios.get(`${BASE_URL}api/dashboard/summary`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

export const getDashboardTrend = async function () {
  try {
    const response = await axios.get(`${BASE_URL}api/dashboard/trend`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching dashboard trend:', error);
    throw error;
  }
};

export const getDashboardStat = async function () {
  try {
    const response = await axios.get(`${BASE_URL}api/dashboard/stats`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    const data = response.data;
    return data;
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
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const postCreateTicket = async function (data) {
  try {
    axios.post(`${BASE_URL}api/maintenance-tickets`, data, {});
  } catch (error) {
    console.error('Error posting create ticket:', error);
    throw error;
  }
};
