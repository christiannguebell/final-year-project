import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/common/ErrorBoundary';
import Loading from './components/common/Loading';
import { LandingPage } from './components/landing';
import { LoginPage, RegisterPage, OTPVerificationPage, ResetPasswordPage, ForgotPasswordPage } from './pages/auth';
import { DashboardPage } from './pages/dashboard';
import { ApplicationPage } from './pages/application';
import { MyApplicationsPage } from './pages/applications';
import { PaymentsPage } from './pages/payments';
import ApplicationPaymentPage from './pages/payments/ApplicationPaymentPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" richColors closeButton />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<OTPVerificationPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute>
                  <MyApplicationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/application/new" 
              element={
                <ProtectedRoute>
                  <ApplicationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/application/edit/:id" 
              element={
                <ProtectedRoute>
                  <ApplicationPage mode="edit" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications/:id" 
              element={
                <ProtectedRoute>
                  <ApplicationPage mode="view" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payments" 
              element={
                <ProtectedRoute>
                  <PaymentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications/:id/payment" 
              element={
                <ProtectedRoute>
                  <ApplicationPaymentPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;