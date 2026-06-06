import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../now-ui-kit-master/assets/css/bootstrap.min.css'
import '../now-ui-kit-master/assets/css/now-ui-kit.css'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
