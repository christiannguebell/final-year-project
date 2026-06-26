import type { AcademicRecord } from '../../types/application';
import AcademicRecordsHeader from './AcademicRecordsHeader';
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
    <div className="mx-auto max-w-5xl">
      {/* Page header with step indicator and inline progress bars */}
      <AcademicRecordsHeader currentStep={3} totalSteps={6} />

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Submission guidelines sidebar */}
        <div className="lg:col-span-1">
          <SubmissionGuidelines />
        </div>

        {/* Right: Educational history table + new entry form + actions */}
        <div className="space-y-6 lg:col-span-2">
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
