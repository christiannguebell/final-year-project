import { useState, useEffect } from 'react';
import { apiClient } from '../../../api/client';
import { toast } from 'sonner';
import type { Application, Program } from '../../../types/application';
import { ProgramSelectionContent } from '../../../components/program-selection';

export const ProgramSelectionStep = ({
  onNext,
  onBack,
  data,
}: {
  onNext: (data: Partial<Application>) => void;
  onBack: () => void;
  data: Partial<Application>;
}) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(data.programId);
  const [pendingApplicationId, setPendingApplicationId] = useState<string | undefined>(data.id);

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

  const handleSelectProgram = async (programId: string) => {
    if (programId === selectedProgramId) return;
    setIsSaving(true);
    try {
      let applicationId = pendingApplicationId ?? data.id;

      if (!applicationId) {
        const response = await apiClient.post<Application>('/applications', { programId });
        if (response.data?.data?.id) {
          applicationId = response.data.data.id;
          setPendingApplicationId(applicationId);
        }
      } else {
        await apiClient.put(`/applications/${applicationId}`, { programId });
      }

      if (data.academicRecords && applicationId) {
        for (const record of data.academicRecords) {
          if (!record.id || record.id.includes('.')) {
            await apiClient.post('/academic-records', { ...record, applicationId, id: undefined });
          }
        }
      }

      setSelectedProgramId(programId);
    } catch {
      toast.error('Failed to save selection');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinue = () => {
    if (!selectedProgramId) {
      toast.error('Please select a program to continue');
      return;
    }
    onNext({ id: pendingApplicationId ?? data.id, programId: selectedProgramId });
  };

  return (
    <ProgramSelectionContent
      programs={programs}
      isLoading={isLoading}
      isSaving={isSaving}
      selectedProgramId={selectedProgramId}
      onSelectProgram={handleSelectProgram}
      onBack={onBack}
      onContinue={handleContinue}
    />
  );
};
