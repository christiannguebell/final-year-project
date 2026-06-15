import { ArrowRight } from 'lucide-react';

interface ViewAllProgramsButtonProps {
  onClick?: () => void;
}

export default function ViewAllProgramsButton({ onClick }: ViewAllProgramsButtonProps) {
  return (
    <div className="mt-10 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 rounded-lg bg-surface-container-high px-8 py-3 text-sm font-bold text-primary transition-colors hover:bg-outline-variant/20"
      >
        View All Programs
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
