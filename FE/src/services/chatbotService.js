// Import instance axios (tanpa kurung kurawal karena default export)
import api from './api';

export const chatbotService = {
  // Fungsi untuk mengirim pesan pengguna ke sistem asisten AI / Chatbot
  sendMessage: async (message) => {
    // Menembak endpoint POST /api/chatbot (sesuaikan rute backend Anda)
    const response = await api.post('/api/chatbot', { message });
    return response.data; // Biasanya mengembalikan { status: "success", data: { reply: "..." } }
  }
};