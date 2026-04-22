import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { AdminLoginPage, AdminVerifyOtpPage, AdminSetupPasswordPage } from '@/pages/auth';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/verify" element={<AdminVerifyOtpPage />} />
            <Route path="/admin/setup-password" element={<AdminSetupPasswordPage />} />
            <Route path="/" element={<AdminLoginPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;