import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Tambahkan interseptor untuk menyertakan Token di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= AUTHENTICATION =================

export const loginUser = async (credentials) => {
  try {
    const res = await api.post('/api/auth/login', credentials);
    // Simpan token dan data user jika login berhasil
    if (res.data.token) {
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userData', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    console.error('Error login:', err);
    throw err.response?.data || { message: 'Login gagal, periksa koneksi Anda' };
  }
};
export const registerUser = async (userData) => {
  try {
    const res = await api.post('/api/auth/register', userData);
    return res.data;
  } catch (err) {
    console.error('Error register:', err);
    throw err.response?.data || { message: 'Registrasi gagal' };
  }
};

export const logoutUser = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  window.location.href = '/login';
};

// ... (pertahankan fungsi getDashboardSummary, getMaintenanceTickets, dll yang sudah ada)

// ================= DASHBOARD =================

export const getDashboardSummary = async () => {
  try {
    const res = await api.get('/api/dashboard/summary');
    return res.data;
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    throw err;
  }
};

export const getDashboardTrend = async () => {
  try {
    const res = await api.get('/api/dashboard/trend');
    return res.data;
  } catch (err) {
    console.error('Error fetching dashboard trend:', err);
    throw err;
  }
};

export const getDashboardStat = async () => {
  try {
    const res = await api.get('/api/dashboard/stats');
    return res.data;
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    throw err;
  }
};

// ================= CHATBOT =================

export const chatBot = async (question) => {
  try {
    const res = await api.post('/api/chatbot', { question });
    return res.data;
  } catch (err) {
    console.error('Error chatbot:', err);
    throw err;
  }
};

// ================= MAINTENANCE TICKETS =================

export const getMaintenanceTickets = async (status = '') => {
  try {
    const res = await api.get('/api/maintenance-tickets', {
      params: status ? { status } : {},
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching maintenance tickets:', err);
    return { data: [] };
  }
};

export const getMaintenanceTicketById = async (id) => {
  try {
    const res = await api.get(`/api/maintenance-tickets/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching ticket detail:', err);
    throw err;
  }
};

export const updateMaintenanceTicket = async (id, data) => {
  try {
    const res = await api.put(`/api/maintenance-tickets/${id}`, data);
    return res.data;
  } catch (err) {
    console.error('Error updating ticket:', err);
    throw err;
  }
};

export const deleteMaintenanceTicket = async (id) => {
  try {
    const res = await api.delete(`/api/maintenance-tickets/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error deleting ticket:', err);
    throw err;
  }
};

export const postCreateTicket = async (data) => {
  try {
    const res = await api.post('/api/maintenance-tickets', data);
    return res.data;
  } catch (err) {
    console.error('Error creating ticket:', err);
    throw err;
  }
};