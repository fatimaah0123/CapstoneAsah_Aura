// src/seeds/machineSeed.js
import MachineService from './machineService.js';

(async () => {
  try {
    await MachineService.seedMachines();
  } catch (error) {
    console.error('Failed to seed machines:', error);
  }
})();
