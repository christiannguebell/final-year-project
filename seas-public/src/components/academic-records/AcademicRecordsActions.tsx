import { ArrowLeft, ArrowRight } from 'lucide-react';

interface AcademicRecordsActionsProps {
  onBack: () => void;
  onContinue: () => void;
}

export default function AcademicRecordsActions({ onBack, onContinue }: AcademicRecordsActionsProps) {
  return (
    <div className="flex items-center justify-between pt-8 mt-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft size={18} />
        Previous Step
      </button>

      <button
        type="button"
        onClick={onContinue}
        className="flex items-center gap-3 rounded-lg bg-secondary px-10 py-3.5 text-sm font-extrabold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
      >
        Save &amp; Continue
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
