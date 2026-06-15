import type { AcademicRecord } from '../../types/application';
import AcademicRecordsHeader from './AcademicRecordsHeader';
import AcademicStepProgress from './AcademicStepProgress';
import SubmissionGuidelines from './SubmissionGuidelines';
import EducationalHistoryTable from './EducationalHistoryTable';
import NewAcademicEntryForm from './NewAcademicEntryForm';
import AcademicRecordsActions from './AcademicRecordsActions';

interface AcademicRecordsContentProps {
  records: AcademicRecord[];
  isAdding: boolean;
  newRecord: Partial<AcademicRecord> & { gpa?: string; scale?: string };
  onNewRecordChange: (value: Partial<AcademicRecord> & { gpa?: string; scale?: string }) => void;
  onAddAnother: () => void;
  onSaveEntry: () => void;
  onCancelEntry: () => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function AcademicRecordsContent({
  records,
  isAdding,
  newRecord,
  onNewRecordChange,
  onAddAnother,
  onSaveEntry,
  onCancelEntry,
  onRemove,
  onBack,
  onContinue,
}: AcademicRecordsContentProps) {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <AcademicRecordsHeader />
      <AcademicStepProgress currentStep={2} totalSteps={6} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SubmissionGuidelines />
        </div>

        <div className="space-y-8 lg:col-span-2">
          <EducationalHistoryTable
            records={records}
            onAddAnother={onAddAnother}
            onRemove={onRemove}
            isAdding={isAdding}
          />

          {isAdding && (
            <NewAcademicEntryForm
              value={newRecord}
              onChange={onNewRecordChange}
              onSave={onSaveEntry}
              onCancel={onCancelEntry}
            />
          )}

          <AcademicRecordsActions onBack={onBack} onContinue={onContinue} />
        </div>
      </div>
    </div>
  );
}
