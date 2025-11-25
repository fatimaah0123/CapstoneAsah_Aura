export const dummyDashboardSummary = {
  totalAssets: 156,
  optimal: 98,
  attention: 42,
  highRisk: 16
};

export const dummyCriticalAlert = {
  assetName: "Turbin Utama #12",
  failure: "Kegagalan Bearing",
  rul: "72 Jam",
  healthScore: 35
};

export const dummyAssets = [
  { id: "TRB-001", name: "Turbin Utama #12", status: "Risiko Tinggi", healthScore: 35, vibration: 8.2, temp: 92, rul: "72h", risk: "Tinggi" },
  { id: "PMP-045", name: "Pompa Hidrolik #45", status: "Risiko Tinggi", healthScore: 42, vibration: 7.8, temp: 88, rul: "96h", risk: "Tinggi" },
  { id: "GEN-023", name: "Generator Diesel #23", status: "Perhatian", healthScore: 58, vibration: 5.2, temp: 75, rul: "168h", risk: "Sedang" },
  { id: "CMP-089", name: "Kompresor Udara #89", status: "Perhatian", healthScore: 65, vibration: 4.8, temp: 70, rul: "240h", risk: "Sedang" },
  { id: "MTR-156", name: "Motor Listrik #156", status: "Optimal", healthScore: 88, vibration: 2.1, temp: 55, rul: "720h", risk: "Rendah" },
  { id: "FAN-034", name: "Fan Cooling #34", status: "Optimal", healthScore: 92, vibration: 1.8, temp: 48, rul: "840h", risk: "Rendah" },
];

export const dummyTickets = [
  { id: "TKT-001", assetId: "TRB-001", assetName: "Turbin Utama #12", priority: "Urgent", status: "Open", createdAt: "2025-11-19 08:30", description: "Getaran tinggi terdeteksi", assignee: "Ahmad Rifai" },
  { id: "TKT-002", assetId: "PMP-045", assetName: "Pompa Hidrolik #45", priority: "High", status: "In Progress", createdAt: "2025-11-18 14:20", description: "Suhu melebihi normal", assignee: "Siti Nurhaliza" },
  { id: "TKT-003", assetId: "GEN-023", assetName: "Generator Diesel #23", priority: "Medium", status: "Open", createdAt: "2025-11-18 10:15", description: "Inspeksi preventif rutin", assignee: "Budi Santoso" },
];

export const dummyTrendData = [
  { date: '15 Nov', optimal: 102, attention: 38, highRisk: 12 },
  { date: '16 Nov', optimal: 100, attention: 40, highRisk: 14 },
  { date: '17 Nov', optimal: 99, attention: 41, highRisk: 15 },
  { date: '18 Nov', optimal: 98, attention: 42, highRisk: 15 },
  { date: '19 Nov', optimal: 98, attention: 42, highRisk: 16 },
];