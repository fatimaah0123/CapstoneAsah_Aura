// src/seeds/machineSeed.js
import seedService from './seedService.js';
import MaintenanceTicketSeedService from './seedMaintenanceTickets.js';

(async () => {
  try {
    await seedService.seed();
    await MaintenanceTicketSeedService.seed();
  } catch (error) {
    console.error('Failed to seed machines:', error);
  }
})();
