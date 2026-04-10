import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryProvider, AuthProvider, ToastProvider } from './providers'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
)