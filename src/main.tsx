import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Style.css'
import App from './App.tsx'
import { GatewayProvider } from './context/GatewayContext';  // ← add this


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GatewayProvider> 
    <App />
    </GatewayProvider > 
  </StrictMode>,
)
