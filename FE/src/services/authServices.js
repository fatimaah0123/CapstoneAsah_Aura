import api from './api';

// authService hanya bertugas memanggil endpoint /api/auth.
// Penyimpanan token & data user dilakukan HANYA di sini, tidak di tempat lain.
export const authService = {

  // ── POST /api/auth ─────────────────────────────────────────────────────────
  // Response BE: { status: "success", data: { accessToken, user: { id, name, email, role } } }
  login: async (email, password) => {
    const response = await api.post('/api/auth', { email, password });
    const { accessToken, user } = response.data.data;

    // Simpan token & info user ke localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user)); // simpan sebagai 1 objek

    return user; // kembalikan data user agar AuthContext bisa set state
  },

  // ── PUT /api/auth ──────────────────────────────────────────────────────────
  // Dipanggil oleh interceptor api.js secara otomatis, bukan manual dari komponen.
  // Tapi disediakan juga di sini untuk keperluan restore sesi saat app pertama buka.
  refreshToken: async () => {
    const response = await api.put('/api/auth');
    const { accessToken, user } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  },

  // ── DELETE /api/auth ───────────────────────────────────────────────────────
  logout: async () => {
    try {
      await api.delete('/api/auth'); // beritahu BE untuk invalidate refreshToken
    } catch (error) {
      // Tetap lanjut logout lokal meskipun request ke BE gagal
      console.error('Logout API error:', error);
    } finally {
      localStorage.clear();
    }
  },
};