import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// ─── Axios instance utama ────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // agar cookie refreshToken otomatis ikut dikirim
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: sisipkan accessToken di setiap request ─────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: auto-refresh token saat 401 ───────────────────────
let isRefreshing = false;
let failedQueue = []; // antri request yang gagal saat sedang refresh

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika 401 dan bukan dari endpoint refresh/login itu sendiri
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/auth')
    ) {
      if (isRefreshing) {
        // Kalau sedang refresh, antri dulu
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Minta accessToken baru pakai refreshToken (ada di cookie HttpOnly)
        const res = await axios.put(`${BASE_URL}/api/auth`, {}, { withCredentials: true });
        const newToken = res.data.data.accessToken;

        localStorage.setItem('accessToken', newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh gagal → paksa logout, hapus data lokal
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ─── Chatbot helper ───────────────────────────────────────────────────────────
// Endpoint chatbot — sesuaikan path dengan BE jika berbeda
export const chatBot = async (message) => {
  const res = await api.post('/api/chatbot', { message });
  return res.data.data; // { answer: "..." }
};