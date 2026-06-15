import { FileText } from 'lucide-react';

export interface ReviewDocument {
  id?: string;
  label: string;
  fileName: string;
  uploadedAt?: string;
  fileSize?: string;
}

interface UploadedDocumentsGridProps {
  documents: ReviewDocument[];
}

function formatDocLabel(type?: string) {
  if (!type) return 'Document';
  return type.replace(/_/g, ' ').toUpperCase();
}

export default function UploadedDocumentsGrid({ documents }: UploadedDocumentsGridProps) {
  return (
    <section className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest p-8 shadow-ambient md:col-span-12">
      <h3 className="mb-6 font-headline text-lg font-extrabold text-primary">
        Uploaded Documents ({documents.length})
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {documents.map((doc, index) => (
          <div
            key={doc.id ?? index}
            className="flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 transition-colors"
          >
            <div className="mb-3 flex items-center gap-2">
              <FileText size={18} className="shrink-0 text-primary" />
              <p className="truncate text-xs font-bold text-primary uppercase">{formatDocLabel(doc.label)}</p>
            </div>
            <p className="truncate text-sm font-semibold text-on-surface">{doc.fileName}</p>
            <p className="mt-2 text-[10px] font-medium text-on-surface-variant/60">
              {doc.uploadedAt ?? 'Uploaded recently'}
              {doc.fileSize ? ` • ${doc.fileSize}` : ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
