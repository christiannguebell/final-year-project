import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Loading from './components/common/Loading';
import { LandingPage } from './components/landing';
import { LoginPage, RegisterPage, OTPVerificationPage, ResetPasswordPage, ForgotPasswordPage } from './pages/auth';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
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
                  <div className="p-8 text-center">
                    <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
                    <p className="mt-4 text-on-surface-variant">Authenticated and authorized candidate!</p>
                  </div>
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