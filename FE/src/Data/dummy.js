export const dummyTickets = [
  { 
    id: "TKT-001", 
    assetId: "TRB-001", 
    assetName: "Turbin Utama #12", 
    priority: "Urgent", 
    status: "Open", 
    createdAt: "2025-11-19 08:30", 
    description: "Terdeteksi getaran abnormal pada bearing utama (Level > 8.2mm/s). Suhu meningkat drastis dalam 2 jam terakhir.", 
    assignee: "Ahmad Rifai",
    location: "Area Power Plant - Zona B",
    coordinates: { lat: -6.175392, lng: 106.827153 },
    tasks: [
      { id: 1, text: "Cek level oli lubrikasi", done: false },
      { id: 2, text: "Inspeksi visual mounting bolt", done: false },
      { id: 3, text: "Analisis spektrum getaran", done: false }
    ],
    evidenceImages: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1535955575913-c97693b4a2d1?auto=format&fit=crop&q=80&w=300"
    ],
    comments: [
      { id: 1, user: "System AI", text: "Alert otomatis: Prediksi kegagalan dalam 72 jam.", time: "08:00" },
      { id: 2, user: "Admin", text: "Segera kirim tim, prioritas urgent.", time: "08:15" }
    ]
  },
  { 
    id: "TKT-002", 
    assetId: "PMP-045", 
    assetName: "Pompa Hidrolik #45", 
    priority: "High", 
    status: "In Progress", 
    createdAt: "2025-11-18 14:20", 
    description: "Suhu motor penggerak melebihi ambang batas normal (92°C). Indikasi overload atau cooling system failure.", 
    assignee: "Siti Nurhaliza",
    location: "Ruang Pompa Utama",
    coordinates: { lat: -6.175392, lng: 106.827153 },
    tasks: [
      { id: 1, text: "Cek sirkulasi pendingin", done: true },
      { id: 2, text: "Ukur arus beban motor", done: false }
    ],
    evidenceImages: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=300"
    ],
    comments: []
  },
  // ... tambahkan data dummy lainnya jika perlu
];