import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DocumentCenterActionsProps {
  onContinue: () => void;
  onBack?: () => void;
  onSaveForLater?: () => void;
  canContinue?: boolean;
}

export default function DocumentCenterActions({
  onContinue,
  onBack,
  onSaveForLater,
  canContinue = true,
}: DocumentCenterActionsProps) {
  return (
    <div className="flex flex-col gap-3 pt-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-1 flex items-center gap-2 text-sm font-bold text-primary transition-all hover:underline"
        >
          <ArrowLeft size={16} />
          Previous Step
        </button>
      )}
      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className={`flex w-full items-center justify-center gap-2 rounded-lg py-4 font-headline text-sm font-extrabold text-white shadow-lg transition-all active:scale-95 ${
          canContinue
            ? 'bg-secondary shadow-secondary/20 hover:-translate-y-0.5'
            : 'cursor-not-allowed bg-outline-variant opacity-50'
        }`}
      >
        Save and Continue
        <ArrowRight size={20} />
      </button>
      {onSaveForLater && (
        <button
          type="button"
          onClick={onSaveForLater}
          className="w-full py-3 text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
        >
          Save for Later
        </button>
      )}
    </div>
  );
}
