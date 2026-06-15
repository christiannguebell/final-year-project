import { FileDown } from 'lucide-react';
import { useDownloadAdmissionSlip } from '../../hooks/useDownloads';

export default function ExamHubHeader() {
  const downloadSlip = useDownloadAdmissionSlip();

  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">Exam Hub</h1>
        <p className="mt-2 max-w-xl text-on-surface-variant">
          Manage your upcoming examination details, download mandatory documentation, and review center
          protocols.
        </p>
      </div>
      <button
        type="button"
        onClick={() => downloadSlip.mutate()}
        disabled={downloadSlip.isPending}
        className="flex shrink-0 items-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-secondary/90 active:scale-95 disabled:opacity-60"
      >
        <FileDown className="h-5 w-5" />
        {downloadSlip.isPending ? 'Generating PDF...' : 'Download Admission Slip (PDF)'}
      </button>
    </div>
  );
}
