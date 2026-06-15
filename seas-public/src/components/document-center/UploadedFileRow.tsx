import { Eye, FileText, Trash2 } from 'lucide-react';

interface UploadedFileRowProps {
  fileName: string;
  meta?: string;
  url?: string;
  onDelete?: () => void;
}

export default function UploadedFileRow({ fileName, meta, url, onDelete }: UploadedFileRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-secondary/10 bg-surface-container-low p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded bg-white shadow-sm">
          <FileText size={24} className="text-secondary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{fileName}</p>
          <p className="text-[10px] tracking-wider text-on-surface-variant uppercase">{meta ?? 'Ready for review'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <Eye size={20} />
          </a>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-error-container/50 hover:text-error"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
