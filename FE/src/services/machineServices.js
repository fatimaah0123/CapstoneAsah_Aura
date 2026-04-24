// machineService.js
// Saat ini data mesin masih menggunakan local state di useMachine.js.
// File ini disiapkan sebagai layer service agar mudah diganti
// dengan pemanggilan API backend ketika sudah tersedia.

// Contoh struktur yang siap diisi:
// import { getMachines, createMachine, deleteMachine } from './api';

export const fetchAllMachines = async () => {
  // TODO: Ganti dengan pemanggilan API saat backend siap
  // const response = await getMachines();
  // return response.data || [];
  return [
    { id: 'MC-001', name: 'CNC Milling Machine A1', type: 'Production', status: 'Active' },
    { id: 'MC-002', name: 'Lathe Machine B2', type: 'Production', status: 'Maintenance' },
  ];
};

export const addMachine = async (machineData) => {
  // TODO: Ganti dengan pemanggilan API saat backend siap
  // return await createMachine(machineData);
  return machineData;
};

export const removeMachine = async (id) => {
  // TODO: Ganti dengan pemanggilan API saat backend siap
  // return await deleteMachine(id);
  return id;
};