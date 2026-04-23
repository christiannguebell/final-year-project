import { Suspense, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import DashboardLayout from '@/layouts/DashboardLayout';
import { LoginPage, OTPVerificationPage, SetupPasswordPage, ForgotPasswordPage, ResetPasswordPage } from '@/pages/auth';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('seas_admin_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/verify" element={<OTPVerificationPage />} />
            <Route path="/admin/setup-password" element={<SetupPasswordPage />} />
            <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/admin/reset-password" element={<ResetPasswordPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route
                  index
                  element={
                    <div className="max-w-5xl mx-auto">
                      <div className="mb-12 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Overview</span>
                          <h1 className="text-4xl font-extrabold text-primary font-headline tracking-tight">Admin Console</h1>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                          <div className="bg-surface-container-lowest rounded-xl overflow-hidden p-8 shadow-[0px_8px_24px_rgba(25,28,30,0.06)] border border-outline-variant/15">
                            <h3 className="text-xl font-bold text-primary mb-4 font-headline">System operations</h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                              Phase 1: Project Setup & Foundation is complete, utilizing the "Architectural Blueprint" design system.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;