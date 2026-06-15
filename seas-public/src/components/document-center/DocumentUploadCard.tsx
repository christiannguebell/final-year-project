import { BadgeCheck, FileText, Loader2, Plus } from 'lucide-react';
import UploadedFileRow from './UploadedFileRow';
import DocumentUploadZone from './DocumentUploadZone';

export interface DocumentFile {
  id: string;
  name: string;
  url?: string;
  meta?: string;
}

export interface UploadingFile {
  name: string;
  progress: number;
}

interface DocumentUploadCardProps {
  label: string;
  description: string;
  status: 'completed' | 'pending' | 'uploading';
  uploadedFile?: DocumentFile;
  uploadingFile?: UploadingFile;
  isUploading?: boolean;
  allowMultiple?: boolean;
  onUpload: (file: File) => void;
  onDelete?: (id: string) => void;
  onCancelUpload?: () => void;
  onAddAnother?: () => void;
}

export default function DocumentUploadCard({
  label,
  description,
  status,
  uploadedFile,
  uploadingFile,
  isUploading,
  allowMultiple,
  onUpload,
  onDelete,
  onCancelUpload,
  onAddAnother,
}: DocumentUploadCardProps) {
  return (
    <section className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 font-headline text-lg font-bold text-primary">
            {status === 'completed' ? <BadgeCheck className="text-secondary" /> : <FileText className="text-primary" />}
            {label}
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
        </div>
        {status === 'completed' && (
          <span className="flex items-center gap-1.5 rounded-full bg-secondary-container/30 px-3 py-1 text-[10px] font-black tracking-widest text-secondary uppercase">
            Completed
          </span>
        )}
        {status === 'pending' && (
          <span className="rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-black tracking-widest text-on-surface-variant uppercase">
            Pending
          </span>
        )}
      </div>

      {status === 'completed' && uploadedFile && (
        <UploadedFileRow
          fileName={uploadedFile.name}
          meta={uploadedFile.meta}
          url={uploadedFile.url}
          onDelete={onDelete ? () => onDelete(uploadedFile.id) : undefined}
        />
      )}

      {status === 'pending' && <DocumentUploadZone onFileSelect={onUpload} isUploading={isUploading} />}

      {status === 'uploading' && uploadingFile && (
        <div className="space-y-4">
          <div className="rounded-lg border border-outline-variant/10 bg-surface-container-low p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-white shadow-sm">
                  <FileText size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{uploadingFile.name}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase">
                    Uploading... {Math.max(0, Math.round((100 - uploadingFile.progress) / 25))}s remaining
                  </p>
                </div>
              </div>
              {onCancelUpload && (
                <button
                  type="button"
                  onClick={onCancelUpload}
                  className="text-[10px] font-bold tracking-wider text-error uppercase"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-outline-variant/20">
              <div
                className="h-full rounded-full bg-secondary transition-all duration-300"
                style={{ width: `${uploadingFile.progress}%` }}
              />
            </div>
            <p className="mt-2 text-right text-[10px] font-bold text-primary">{uploadingFile.progress}%</p>
          </div>

          {allowMultiple && onAddAnother && (
            <button
              type="button"
              onClick={onAddAnother}
              className="flex min-h-[120px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface-bright text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plus size={24} className="mb-2" />
              <span className="text-xs font-bold tracking-wider uppercase">Add Another</span>
            </button>
          )}
        </div>
      )}

      {isUploading && status !== 'uploading' && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </section>
  );
}
