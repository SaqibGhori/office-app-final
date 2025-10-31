import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Style.css'
import App from './App.tsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <h1 className='text-center pt-4 font-bold text-2xl'>Maintenance in progress...</h1>
    {/* <App />
    <ToastContainer
      position="top-right"
      theme="colored"
      autoClose={3000}
      newestOnTop
      pauseOnHover={false}
      closeOnClick
    /> */}
    
  </StrictMode>,
)
