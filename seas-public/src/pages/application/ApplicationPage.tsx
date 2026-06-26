import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BioDataStep } from './components/BioDataStep';
import { AcademicRecordsStep } from './components/AcademicRecordsStep';
import { ProgramSelectionStep } from './components/ProgramSelectionStep';
import { DocumentCenterStep } from './components/DocumentCenterStep';
import { PaymentStep } from './components/PaymentStep';
import { ReviewSubmitStep } from './components/ReviewSubmitStep';
import TopNav from '../../components/layout/TopNav';
import Sidebar from '../../components/layout/Sidebar';
import PortalFooter from '../../components/layout/PortalFooter';
import type { Application } from '../../types/application';
import { apiClient } from '../../api/client';
import { Loader2, ArrowLeft, Edit3 } from 'lucide-react';

const SESSION_KEY = 'seas_application_state';
const DRAFT_KEY = 'seas_application_draft';

type ApplicationMode = 'new' | 'edit' | 'view';

interface Props {
  mode?: ApplicationMode;
}

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

export function ApplicationPage({ mode = 'new' }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const savedSession = loadSession();
  const [step, setStep] = useState(1);
  const [applicationData, setApplicationData] = useState<Partial<Application>>({});
  const [isLoading, setIsLoading] = useState(true);
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';

  useEffect(() => {
    const loadApplication = async () => {
      try {
        if (isEditMode && id) {
          const response = await apiClient.get<Application>(`/applications/${id}`);
          const app = response.data.data as Application;
          if (app.status === 'draft') {
            setApplicationData(app);
          }
        } else if (isViewMode && id) {
          const response = await apiClient.get<Application>(`/applications/${id}`);
          const app = response.data.data as Application;
          setApplicationData(app);
        } else if (savedSession && !id) {
          if (mode === 'new') {
            sessionStorage.removeItem(SESSION_KEY);
            sessionStorage.removeItem(DRAFT_KEY);
          } else {
            setStep(savedSession.step);
            setApplicationData(savedSession.data);
          }
        } else if (!id) {
          const draftStr = sessionStorage.getItem(DRAFT_KEY);
          if (draftStr) {
            const draft = JSON.parse(draftStr);
            setApplicationData(draft);
          }
          const navState = location.state as { step?: number; programId?: string } | null;
          if (navState?.step) setStep(navState.step);
          if (navState?.programId) {
            setApplicationData((prev) => ({ ...prev, programId: navState.programId }));
          }
        }
      } catch (error) {
        console.error('Failed to load application', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadApplication();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mode]);

  // Persist step + data to sessionStorage whenever they change
  useEffect(() => {
    saveSession(step, applicationData);
  }, [step, applicationData]);

  const handleNext = (data: Partial<Application>) => {
    if (isViewMode) return;
    setApplicationData((prev) => {
      const merged = { ...prev, ...data };
      if (!id) saveSession(step + 1, merged);
      return merged;
    });
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (isViewMode) {
      navigate('/applications');
      return;
    }
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

  if (isViewMode && applicationData) {
    return (
      <div className="min-h-screen bg-surface">
        <TopNav />
        <Sidebar />
        <main className="ml-64 pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-6">
            <button
              onClick={() => navigate('/applications')}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-6"
            >
              <ArrowLeft size={18} />
              <span className="font-bold">Back to My Applications</span>
            </button>
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10">
              <h1 className="text-2xl font-headline font-extrabold text-primary mb-2">
                {applicationData.program?.name || 'Application Details'}
              </h1>
              <p className="text-sm text-on-surface-variant mb-6">
                Application ID: {applicationData.id?.slice(0, 8).toUpperCase()}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Status</p>
                  <p className="font-headline font-bold text-primary">{applicationData.status}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Program</p>
                  <p className="font-headline font-bold text-on-surface">{applicationData.program?.name}</p>
                </div>
              </div>
              {isEditMode && (
                <button
                  onClick={() => navigate(`/application/edit/${id}`)}
                  className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold"
                >
                  <Edit3 size={16} />
                  Continue Editing
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopNav activeNav="Admissions" />
      <Sidebar />

      <main className="ml-64 flex-1 pt-24 pb-12">
        <div className="mx-auto h-full max-w-6xl px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && <BioDataStep onNext={handleNext} data={applicationData} />}
              {step === 2 && <ProgramSelectionStep onNext={handleNext} onBack={handleBack} data={applicationData} />}
              {step === 3 && <AcademicRecordsStep onNext={handleNext} onBack={handleBack} data={applicationData} />}
              {step === 4 && <DocumentCenterStep onNext={handleNext} onBack={handleBack} data={applicationData} />}
              {step === 5 && <PaymentStep onNext={handleNext} onBack={handleBack} data={applicationData} />}
              {step === 6 && <ReviewSubmitStep onBack={handleBack} data={applicationData} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <div className="ml-64">
        <PortalFooter />
      </div>
    </div>
  );
}

export default ApplicationPage;
