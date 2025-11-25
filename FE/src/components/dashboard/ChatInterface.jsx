import React, { useState } from 'react';
import { Activity } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Halo! Saya AURA Copilot. Bagaimana saya bisa membantu Anda menganalisis data aset hari ini?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, 
      { role: 'user', text: input },
      { role: 'assistant', text: 'Fitur chat AI sedang dalam pengembangan. Saya akan segera bisa membantu Anda menganalisis data aset secara real-time!' }
    ]);
    setInput('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-500" />
          AURA Copilot
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">AI Assistant untuk analisis prediktif</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
              max-w-[80%] p-3 rounded-lg text-sm
              ${msg.role === 'user' 
                ? 'bg-cyan-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }
            `}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tanyakan sesuatu..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;