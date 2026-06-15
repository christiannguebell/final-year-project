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
import { ProfilePage } from './pages/profile';
import { PaymentsPage } from './pages/payments';
import { ExamHubPage } from './pages/exam-hub';
import { ResultPortalPage } from './pages/result-portal';
import { NotificationCenterPage } from './pages/notification-center';
import { ProgramSelectionPage } from './pages/program-selection';
import ApplicationPaymentPage from './pages/payments/ApplicationPaymentPage';
import ApplicationSuccessPage from './pages/application/ApplicationSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
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
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
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
            <Route 
              path="/exams" 
              element={
                <ProtectedRoute>
                  <ExamHubPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results" 
              element={
                <ProtectedRoute>
                  <ResultPortalPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/programs" 
              element={
                <ProtectedRoute>
                  <ProgramSelectionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <NotificationCenterPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/application/success" 
              element={
                <ProtectedRoute>
                  <ApplicationSuccessPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;