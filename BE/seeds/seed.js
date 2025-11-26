// src/seeds/machineSeed.js
import seedService from './seedService.js';

(async () => {
  try {
    await seedService.seed();
  } catch (error) {
    console.error('Failed to seed machines:', error);
  }
})();
