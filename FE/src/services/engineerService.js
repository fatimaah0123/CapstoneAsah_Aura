// engineerService.js
// Saat ini data engineer masih menggunakan local state.
// File ini disiapkan sebagai layer service agar mudah diganti
// dengan pemanggilan API backend ketika sudah tersedia.

// Contoh struktur yang siap diisi:
// import { getEngineers, createEngineer, deleteEngineer } from './api';

export const fetchAllEngineers = async () => {
  // TODO: Ganti dengan pemanggilan API saat backend siap
  // const response = await getEngineers();
  // return response.data || [];
  return [
    { id: 'ENG-001', name: 'Siti Fatimah', email: 'siti@avatar.com', role: 'Senior Engineer', status: 'Active' },
    { id: 'ENG-002', name: 'Budi Santoso', email: 'budi@avatar.com', role: 'Junior Engineer', status: 'On Duty' },
  ];
};

export const addEngineer = async (engineerData) => {
  // TODO: Ganti dengan pemanggilan API saat backend siap
  // return await createEngineer(engineerData);
  return engineerData;
};

export const removeEngineer = async (id) => {
  // TODO: Ganti dengan pemanggilan API saat backend siap
  // return await deleteEngineer(id);
  return id;
};