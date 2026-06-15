import { CloudUpload, Loader2 } from 'lucide-react';

interface DocumentUploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  disabled?: boolean;
}

export default function DocumentUploadZone({ onFileSelect, isUploading, disabled }: DocumentUploadZoneProps) {
  return (
    <div className="group relative cursor-pointer rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface-bright p-8 text-center transition-all hover:border-primary/40 hover:bg-primary/5">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="absolute inset-0 cursor-pointer opacity-0"
        disabled={disabled || isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = '';
        }}
      />
      {isUploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="mb-2 h-10 w-10 animate-spin text-primary" />
          <p className="text-xs font-bold text-primary uppercase">Uploading document...</p>
        </div>
      ) : (
        <>
          <CloudUpload
            size={40}
            className="mx-auto mb-3 text-outline-variant transition-colors group-hover:text-primary"
          />
          <p className="mb-1 text-sm font-semibold text-primary">Drag and drop your file here</p>
          <p className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
            or browse files from your computer
          </p>
        </>
      )}
    </div>
  );
}
