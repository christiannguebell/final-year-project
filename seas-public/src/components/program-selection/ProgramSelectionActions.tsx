interface ProgramSelectionActionsProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  backLabel?: string;
  canContinue: boolean;
  isSaving: boolean;
}

export default function ProgramSelectionActions({
  onBack,
  onContinue,
  continueLabel = 'Continue to Documents →',
  backLabel = 'Previous Step',
  canContinue,
  isSaving,
}: ProgramSelectionActionsProps) {
  if (!onBack && !onContinue) return null;

  return (
    <div className="mt-12 flex items-center justify-between gap-8 border-t border-outline-variant/10 pt-10">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg bg-surface-container-high px-8 py-3 font-bold text-primary shadow-sm transition-colors hover:bg-outline-variant/20 active:scale-95"
        >
          {backLabel}
        </button>
      ) : (
        <div />
      )}

      {onContinue && (
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue || isSaving}
          className={`flex items-center gap-2 rounded-lg px-12 py-4 text-xs font-extrabold tracking-widest text-white uppercase shadow-lg transition-all active:scale-95 ${
            canContinue && !isSaving
              ? 'bg-gradient-to-br from-secondary to-primary hover:-translate-y-0.5'
              : 'cursor-not-allowed bg-outline-variant opacity-50'
          }`}
        >
          {continueLabel}
        </button>
      )}
    </div>
  );
}
