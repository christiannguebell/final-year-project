import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BioDataStep } from './components/BioDataStep';
import { AcademicRecordsStep } from './components/AcademicRecordsStep';
import { ProgramSelectionStep } from './components/ProgramSelectionStep';
import { DocumentCenterStep } from './components/DocumentCenterStep';
import { PaymentStep } from './components/PaymentStep';
import { ReviewSubmitStep } from './components/ReviewSubmitStep';
import Sidebar from '../../components/layout/Sidebar';
import TopNav from '../../components/layout/TopNav';
import type { Application } from '../../types/application';
import { apiClient } from '../../api/client';
import { Loader2 } from 'lucide-react';

const SESSION_KEY = 'seas_application_state';

function loadSession(): { step: number; data: Partial<Application> } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(step: number, data: Partial<Application>) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ step, data }));
  } catch {
    // ignore storage errors
  }
}

export function ApplicationPage() {
  const savedSession = loadSession();
  const [step, setStep] = useState(savedSession?.step ?? 1);
  const [applicationData, setApplicationData] = useState<Partial<Application>>(savedSession?.data ?? {});
  const [isLoading, setIsLoading] = useState(!savedSession); // skip loading if session already restored

  useEffect(() => {
    // Only fetch from backend if we don't have a restored session
    if (savedSession) {
      return;
    }
    const fetchDraft = async () => {
      try {
        const response = await apiClient.get<Application[]>('/applications/mine');
        const applications = response.data.data as Application[];
        const draft = applications.find((app: Application) => app.status === 'draft');
        if (draft) {
          setApplicationData(draft);
        }
      } catch (error) {
        console.error('Failed to fetch draft application', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDraft();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist step + data to sessionStorage whenever they change
  useEffect(() => {
    saveSession(step, applicationData);
  }, [step, applicationData]);

  const handleNext = (data: Partial<Application>) => {
    setApplicationData((prev) => {
      const merged = { ...prev, ...data };
      saveSession(step + 1, merged);
      return merged;
    });
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant font-bold">Loading your application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <Sidebar />

      <main className="ml-64 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6 h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && <BioDataStep onNext={handleNext} data={applicationData} />}
              {step === 2 && <AcademicRecordsStep onNext={handleNext} onBack={handleBack} data={applicationData} />}
              {step === 3 && <ProgramSelectionStep onNext={handleNext} onBack={handleBack} data={applicationData} />}
              {step === 4 && <DocumentCenterStep onNext={handleNext} onBack={handleBack} data={applicationData} />}
              {step === 5 && <PaymentStep onNext={handleNext} onBack={handleBack} data={applicationData} />}
              {step === 6 && <ReviewSubmitStep onBack={handleBack} data={applicationData} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default ApplicationPage;
