import api from './api';

export const ticketService = {

  // ── GET /api/ticket-maintenance ───────────────────────────────────────────
  getAllTickets: async () => {
    const res = await api.get('/api/ticket-maintenance');
    return res.data.data.tickets;
  },

  // ── GET /api/ticket-maintenance/{id} ──────────────────────────────────────
  getTicketById: async (id) => {
    const res = await api.get(`/api/ticket-maintenance/${id}`);
    return res.data.data.ticket;
  },

  // ── PATCH /api/ticket-maintenance/{id}/assign ─────────────────────────────
  assignEngineer: async (id, assigned_engineer_id) => {
    const res = await api.patch(`/api/ticket-maintenance/${id}/assign`, {
      assigned_engineer_id: parseInt(assigned_engineer_id),
    });
    return res.data.data.ticket;
  },

  // ── PATCH /api/ticket-maintenance/{id}/start ──────────────────────────────
  startWork: async (id) => {
    const res = await api.patch(`/api/ticket-maintenance/${id}/start`);
    return res.data.data.ticket;
  },

  // ── PATCH /api/ticket-maintenance/{id}/submit ─────────────────────────────
  submitReport: async (id, formData) => {
    const res = await api.patch(`/api/ticket-maintenance/${id}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.ticket;
  },

  // ── PATCH /api/ticket-maintenance/{id}/approve ────────────────────────────
  approveTicket: async (id) => {
    const res = await api.patch(`/api/ticket-maintenance/${id}/approve`);
    return res.data.data.ticket;
  },

  // ── GET /api/users?search= ────────────────────────────────────────────────
  getEngineers: async () => {
    const res = await api.get('/api/users');
    const users = res.data.data.users || [];
    return users.filter((u) => u.role === 'Engineer');
  },
};