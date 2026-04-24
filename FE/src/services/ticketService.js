import {
  getMaintenanceTickets,
  deleteMaintenanceTicket,
  updateMaintenanceTicket,
  getMaintenanceTicketById,
} from './api';

// TicketsPage
export const fetchAllTickets = async (filterStatus) => {
  const response = await getMaintenanceTickets('');
  const apiTickets = response.data || [];
  const filtered = filterStatus
    ? apiTickets.filter((t) => (t.ticket_status || t.status) === filterStatus)
    : apiTickets;
  return filtered;
};

export const removeTicket = async (id) => {
  return await deleteMaintenanceTicket(id);
};

export const startTicketProgress = async (id) => {
  return await updateMaintenanceTicket(id, { status: 'IN_PROGRESS' });
};

// TicketDetailPage
export const fetchTicketDetail = async (id) => {
  if (id.toString().startsWith('MANUAL')) {
    const localTickets = JSON.parse(localStorage.getItem('aura_tickets') || '[]');
    const found = localTickets.find(t => t.ticket_id === id);
    return found || null;
  }
  const response = await getMaintenanceTicketById(id);
  if (response && response.data) return response.data;
  return null;
};

// ReportPage
export const fetchTicketForReport = async (id) => {
  const response = await getMaintenanceTicketById(id);
  if (response && response.data) return response.data;
  return null;
};

export const submitReport = async (id, payload) => {
  return await updateMaintenanceTicket(id, payload);
};