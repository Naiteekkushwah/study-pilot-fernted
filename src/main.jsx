import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Usercontext from './Usercontext.jsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Usercontext>
      <App />
    </Usercontext>
    </BrowserRouter>
  
  </StrictMode>,
)
