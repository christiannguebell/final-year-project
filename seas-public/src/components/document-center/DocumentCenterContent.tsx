import DocumentCenterHeader from './DocumentCenterHeader';
import DocumentStepProgress from './DocumentStepProgress';
import DocumentUploadCard, { type DocumentFile } from './DocumentUploadCard';
import VerificationProtocolCard from './VerificationProtocolCard';
import HelpfulResourcesCard from './HelpfulResourcesCard';
import DocumentCenterActions from './DocumentCenterActions';
import { DOCUMENT_TYPES, type DocumentTypeId } from './documentTypes';

interface UploadingState {
  type: DocumentTypeId;
  name: string;
  progress: number;
}

interface DocumentCenterContentProps {
  documentsByType: Record<string, DocumentFile | undefined>;
  uploadingType?: DocumentTypeId | null;
  uploadingState?: UploadingState | null;
  onUpload: (type: DocumentTypeId, file: File) => void;
  onDelete: (id: string) => void;
  onCancelUpload?: () => void;
  onContinue: () => void;
  onBack?: () => void;
  onSaveForLater?: () => void;
  canContinue?: boolean;
}

export default function DocumentCenterContent({
  documentsByType,
  uploadingType,
  uploadingState,
  onUpload,
  onDelete,
  onCancelUpload,
  onContinue,
  onBack,
  onSaveForLater,
  canContinue,
}: DocumentCenterContentProps) {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <DocumentCenterHeader />
      <DocumentStepProgress currentStep={4} totalSteps={6} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {DOCUMENT_TYPES.map((docType) => {
            const uploaded = documentsByType[docType.id];
            const isCurrentlyUploading = uploadingType === docType.id;
            const showUploadingCard =
              isCurrentlyUploading && uploadingState && uploadingState.type === docType.id;

            let status: 'completed' | 'pending' | 'uploading' = 'pending';
            if (uploaded) status = 'completed';
            else if (showUploadingCard) status = 'uploading';

            return (
              <DocumentUploadCard
                key={docType.id}
                label={docType.label}
                description={docType.description}
                status={status}
                uploadedFile={uploaded}
                uploadingFile={
                  showUploadingCard
                    ? { name: uploadingState.name, progress: uploadingState.progress }
                    : undefined
                }
                isUploading={isCurrentlyUploading && !showUploadingCard}
                allowMultiple={'allowMultiple' in docType ? docType.allowMultiple : false}
                onUpload={(file) => onUpload(docType.id, file)}
                onDelete={onDelete}
                onCancelUpload={onCancelUpload}
              />
            );
          })}
        </div>

        <div className="space-y-6">
          <VerificationProtocolCard />
          <HelpfulResourcesCard />
          <DocumentCenterActions
            onContinue={onContinue}
            onBack={onBack}
            onSaveForLater={onSaveForLater}
            canContinue={canContinue}
          />
        </div>
      </div>
    </div>
  );
}
