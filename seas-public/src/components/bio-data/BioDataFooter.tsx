interface BioDataFooterProps {
  onCancel: () => void;
  onSaveDraft: () => void;
  isSubmitting: boolean;
}

export default function BioDataFooter({ onCancel, onSaveDraft, isSubmitting }: BioDataFooterProps) {
  return (
    <div className="flex items-center justify-between pt-8 mt-6 border-t border-outline-variant/15">
      <button
        type="button"
        onClick={onCancel}
        className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
      >
        Cancel Application
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg border border-outline-variant/40 bg-white text-on-surface text-sm font-bold hover:bg-surface-container-low transition-all active:scale-95"
        >
          Save Draft
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-container hover:translate-y-[-1px] transition-all active:scale-95 disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
}
