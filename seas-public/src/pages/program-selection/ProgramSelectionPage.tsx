import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import TopNav from '../../components/layout/TopNav';
import Sidebar from '../../components/layout/Sidebar';
import {
  ProgramSelectionContent,
  ProgramSelectionFooter,
} from '../../components/program-selection';
import { apiClient } from '../../api/client';
import type { Program } from '../../types/application';

export default function ProgramSelectionPage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState<string>();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await apiClient.get<Program[]>('/programs');
        setPrograms(response.data?.data || []);
      } catch {
        toast.error('Failed to load programs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleSelectProgram = (programId: string) => {
    setSelectedProgramId(programId);
  };

  const handleContinue = () => {
    if (!selectedProgramId) {
      toast.error('Please select a program to continue');
      return;
    }
    navigate('/application/new', { state: { programId: selectedProgramId, step: 3 } });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopNav activeNav="Programs" />
      <Sidebar />

      <main className="ml-64 flex-1 pt-24 pb-12">
        <ProgramSelectionContent
          programs={programs}
          isLoading={isLoading}
          isSaving={false}
          selectedProgramId={selectedProgramId}
          onSelectProgram={handleSelectProgram}
          onContinue={handleContinue}
          continueLabel="Start Application →"
          showStepper={false}
        />
      </main>

      <div className="ml-64">
        <ProgramSelectionFooter />
      </div>
    </div>
  );
}
