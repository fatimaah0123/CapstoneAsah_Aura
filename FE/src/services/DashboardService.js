import api from './api';

// GET /api/dashboard
// Response BE: { status: "success", data: { summary, machine_status, engineer_status,
//   ticket_status, failure_types, critical_machines, problematic_machines,
//   monthly_maintenance, latest_tickets } }
export const dashboardService = {
  getDashboardData: async () => {
    const response = await api.get('/api/dashboard');
    return response.data.data; // langsung kembalikan objek data-nya
  },
};