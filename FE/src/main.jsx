import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <--- 1. TAMBAHKAN IMPORT INI
import './style/index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. BUNGKUS APP DENGAN BROWSERROUTER */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)