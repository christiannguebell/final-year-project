import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryProvider, AuthProvider, ToastProvider } from './providers'
import './index.css'
import './i18n'
import App from './App.tsx'

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-surface">
    <div className="text-center">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm font-medium text-on-surface-variant">Loading...</p>
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </Suspense>
  </StrictMode>,
)