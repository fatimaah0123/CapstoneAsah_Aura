import api from './api';
export const userService = {

  // ── GET /api/users?search= ────────────────────────────────────────────────
  getAll: async (search = '') => {
    const params = search ? { search } : {};
    const res = await api.get('/api/users', { params });
    return res.data.data.users;
  },

  // ── POST /api/users ───────────────────────────────────────────────────────
  // Required: employee_id, name, email, password, role ('Admin' | 'Engineer')
  create: async (payload) => {
    const res = await api.post('/api/users', payload);
    return res.data.data.user;
  },

  // ── PUT /api/users/{id} ───────────────────────────────────────────────────
  // Fields yang bisa diubah: name, password, role
  // email & employee_id tidak bisa diubah
  update: async (id, payload) => {
    const res = await api.put(`/api/users/${id}`, payload);
    return res.data.data.user;
  },

  // ── DELETE /api/users/{id} ────────────────────────────────────────────────
  remove: async (id) => {
    await api.delete(`/api/users/${id}`);
  },
};