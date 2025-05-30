import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import StoreContextprovidr from './context/StoreContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <StoreContextprovidr>
      <App />
    </StoreContextprovidr>  
    </BrowserRouter>
  </StrictMode>
)

