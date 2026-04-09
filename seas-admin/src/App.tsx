import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <div className="min-h-screen bg-slate-50">
              <Routes>
                <Route
                  path="/"
                  element={
                    <div className="p-8 max-w-4xl mx-auto">
                      <h1 className="text-4xl font-bold text-primary mb-4">
                        SEAS Admin Console
                      </h1>
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-slate-600 leading-relaxed">
                          Phase 1: Project Setup & Foundation is complete.
                          <br />
                          <span className="text-secondary font-medium">
                            Ready for Phase 2: Core Layer & API Integration.
                          </span>
                        </p>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </div>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
