import api from './api';
export const machineService = {

  // ── GET /api/machines?search= ─────────────────────────────────────────────
  getAll: async (search = '') => {
    const params = search ? { search } : {};
    const res = await api.get('/api/machines', { params });
    return res.data.data.machines; // kembalikan array langsung
  },

  // ── POST /api/machines ────────────────────────────────────────────────────
  // Required fields: name, code, type, location, install_date
  create: async (payload) => {
    const res = await api.post('/api/machines', payload);
    return res.data.data.machine;
  },

  // ── PUT /api/machines/{id} ────────────────────────────────────────────────
  update: async (id, payload) => {
    const res = await api.put(`/api/machines/${id}`, payload);
    return res.data.data.machine;
  },

  // ── DELETE /api/machines/{id} ─────────────────────────────────────────────
  remove: async (id) => {
    await api.delete(`/api/machines/${id}`);
  },
};