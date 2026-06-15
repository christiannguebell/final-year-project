import { ArrowLeft, ArrowRight } from 'lucide-react';

interface AcademicRecordsActionsProps {
  onBack: () => void;
  onContinue: () => void;
}

export default function AcademicRecordsActions({ onBack, onContinue }: AcademicRecordsActionsProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant/10 pt-8 md:flex-row">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 font-bold text-primary transition-all hover:underline"
      >
        <ArrowLeft size={18} />
        Previous Step
      </button>
      <button
        type="button"
        onClick={onContinue}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-secondary to-[#0e7144] px-12 py-4 font-extrabold text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
      >
        Save &amp; Continue
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
