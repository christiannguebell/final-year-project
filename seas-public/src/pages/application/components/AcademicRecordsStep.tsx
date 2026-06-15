import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '../../../api/client';
import type { Application, AcademicRecord } from '../../../types/application';
import { AcademicRecordsContent } from '../../../components/academic-records';

const emptyRecord = {
  institution: '',
  degree: '',
  startDate: '',
  endDate: '',
  grade: '',
  fieldOfStudy: '',
  gpa: '',
  scale: '4.0',
};

export const AcademicRecordsStep = ({
  onNext,
  onBack,
  data,
}: {
  onNext: (data: Partial<Application>) => void;
  onBack: () => void;
  data: Partial<Application>;
}) => {
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newRecord, setNewRecord] = useState(emptyRecord);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!data.id) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await apiClient.get<AcademicRecord[]>(`/academic-records/application/${data.id}`);
        setRecords(response.data?.data || []);
      } catch {
        console.error('Failed to fetch academic records');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, [data.id]);

  const handleSaveEntry = async () => {
    if (!newRecord.institution || !newRecord.degree) {
      toast.error('Institution and Degree are required');
      return;
    }

    if (!data.id) {
      toast.error('Application not initialized. Please go back to Step 1.');
      return;
    }

    const grade = newRecord.gpa
      ? `${newRecord.gpa}${newRecord.scale ? `/${newRecord.scale}` : ''}`
      : newRecord.grade;

    try {
      const response = await apiClient.post<AcademicRecord>('/academic-records', {
        institution: newRecord.institution,
        degree: newRecord.degree,
        fieldOfStudy: newRecord.fieldOfStudy,
        startDate: newRecord.startDate,
        endDate: newRecord.endDate,
        grade,
        applicationId: data.id,
      });
      if (response.data?.data) {
        setRecords([...records, response.data.data]);
      }
      toast.success('Academic record saved');
    } catch {
      toast.error('Failed to save academic record');
      return;
    }

    setIsAdding(false);
    setNewRecord(emptyRecord);
  };

  const removeRecord = async (id: string) => {
    try {
      await apiClient.delete(`/academic-records/${id}`);
      setRecords(records.filter((r) => r.id !== id));
      toast.success('Record removed');
    } catch {
      toast.error('Failed to delete record');
    }
  };

  const handleContinue = () => {
    if (records.length === 0) {
      toast.error('Please add at least one academic record');
      return;
    }
    onNext({ academicRecords: records });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
        <p className="font-bold text-on-surface-variant">Loading academic records...</p>
      </div>
    );
  }

  return (
    <AcademicRecordsContent
      records={records}
      isAdding={isAdding}
      newRecord={newRecord}
      onNewRecordChange={(value) => setNewRecord({ ...emptyRecord, ...value })}
      onAddAnother={() => setIsAdding(true)}
      onSaveEntry={handleSaveEntry}
      onCancelEntry={() => {
        setIsAdding(false);
        setNewRecord(emptyRecord);
      }}
      onRemove={removeRecord}
      onBack={onBack}
      onContinue={handleContinue}
    />
  );
};
