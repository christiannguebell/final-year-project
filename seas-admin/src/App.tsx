import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import DashboardLayout from '@/layouts/DashboardLayout';
import { LoginPage, OTPVerificationPage, SetupPasswordPage, ForgotPasswordPage, ResetPasswordPage } from '@/pages/auth';
import DashboardPage from '@/pages/DashboardPage';
import CandidatesPage from '@/pages/CandidatesPage';
import ProgramsPage from '@/pages/ProgramsPage';
import ApplicationsQueue from '@/pages/ApplicationsQueue';
import VerificationDetail from '@/pages/VerificationDetail';

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
              <Route index element={<DashboardPage />} />
              <Route path="candidates" element={<CandidatesPage />} />
              <Route path="candidates/:id" element={<VerificationDetail />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="applications" element={<ApplicationsQueue />} />
              <Route path="applications/:id" element={<VerificationDetail />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;