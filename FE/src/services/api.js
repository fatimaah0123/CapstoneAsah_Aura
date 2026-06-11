import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// ─── Axios instance utama ────────────────────────────────────────────────────
// withCredentials: true wajib ada agar cookie HttpOnly (refreshToken dari BE)
// ikut terkirim secara otomatis di setiap request, termasuk saat refresh token.
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Sisipkan accessToken dari localStorage ke header Authorization setiap request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────────────
// Jika BE mengembalikan 401, otomatis coba refresh token via PUT /api/auth.
// Jika refresh juga gagal → paksa logout ke /login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Pakai axios langsung (bukan instance `api`) agar tidak masuk loop interceptor
        const res = await axios.put(
          `${BASE_URL}/api/auth`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.data.accessToken;

        // Perbarui token di storage dan di header default instance
        localStorage.setItem('accessToken', newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest); // Ulangi request asal yang sempat gagal
      } catch (refreshError) {
        // refreshToken juga sudah kadaluarsa → bersihkan semua dan paksa login ulang
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;