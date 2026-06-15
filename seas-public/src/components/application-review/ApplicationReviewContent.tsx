import ReviewHeader from './ReviewHeader';
import ReviewStepper from './ReviewStepper';
import PersonalInformationCard, { type PersonalInfo } from './PersonalInformationCard';
import SelectedProgramCard, { type SelectedProgramInfo } from './SelectedProgramCard';
import AcademicHistorySection from './AcademicHistorySection';
import UploadedDocumentsGrid, { type ReviewDocument } from './UploadedDocumentsGrid';
import DeclarationSection from './DeclarationSection';
import type { AcademicRecord } from '../../types/application';

interface ApplicationReviewContentProps {
  personalInfo: PersonalInfo;
  program: SelectedProgramInfo;
  academicRecords: AcademicRecord[];
  documents: ReviewDocument[];
  candidateName: string;
  declared: boolean;
  onDeclaredChange: (value: boolean) => void;
  onBack: () => void;
  onSubmit: () => void;
  onEditPersonal?: () => void;
  onEditAcademic?: () => void;
  isSubmitting?: boolean;
}

export default function ApplicationReviewContent({
  personalInfo,
  program,
  academicRecords,
  documents,
  candidateName,
  declared,
  onDeclaredChange,
  onBack,
  onSubmit,
  onEditPersonal,
  onEditAcademic,
  isSubmitting,
}: ApplicationReviewContentProps) {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <ReviewHeader />
      <ReviewStepper currentStep={5} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <PersonalInformationCard info={personalInfo} onEdit={onEditPersonal} />
        <SelectedProgramCard program={program} />
        <AcademicHistorySection records={academicRecords} onEdit={onEditAcademic} />
        <UploadedDocumentsGrid documents={documents} />
      </div>

      <DeclarationSection
        candidateName={candidateName}
        declared={declared}
        onDeclaredChange={onDeclaredChange}
        onBack={onBack}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
