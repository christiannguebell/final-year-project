import { ArrowLeft, ArrowRight, Info, Loader2 } from 'lucide-react';

interface DeclarationSectionProps {
  candidateName: string;
  declared: boolean;
  onDeclaredChange: (value: boolean) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function DeclarationSection({
  candidateName,
  declared,
  onDeclaredChange,
  onBack,
  onSubmit,
  isSubmitting,
}: DeclarationSectionProps) {
  return (
    <div className="mt-12 rounded-xl border-t-8 border-secondary bg-white p-8 shadow-xl">
      <h3 className="mb-4 font-headline text-xl font-bold text-primary italic">Declaration &amp; Submission</h3>

      <div className="mb-8 flex items-start gap-4 rounded-lg border-l-4 border-primary bg-surface-container-low p-5">
        <input
          type="checkbox"
          id="declaration"
          checked={declared}
          onChange={(e) => onDeclaredChange(e.target.checked)}
          className="mt-1 h-5 w-5 cursor-pointer rounded border-outline-variant text-secondary focus:ring-secondary"
        />
        <label htmlFor="declaration" className="cursor-pointer text-sm leading-relaxed font-medium text-on-surface-variant select-none">
          I, {candidateName}, hereby declare that the information provided is accurate and all documents
          uploaded are genuine copies of the originals. I understand that any misrepresentation will result in
          immediate disqualification and possible legal action under institutional bylaws.
        </label>
      </div>

      <div className="mb-8 flex items-start gap-3 rounded-lg bg-secondary/10 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-secondary" />
        <p className="text-sm text-on-surface-variant">
          <span className="font-bold text-primary">Next:</span> You will receive an application ID via email and
          your status will update to &quot;Pending Review&quot;.
        </p>
      </div>

      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 font-bold text-primary transition-all hover:underline"
        >
          <ArrowLeft size={18} />
          Save Draft
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !declared}
          className={`flex items-center justify-center gap-3 rounded-lg px-12 py-4 text-xs font-extrabold tracking-widest text-white uppercase shadow-lg transition-all active:scale-95 ${
            declared && !isSubmitting
              ? 'bg-gradient-to-br from-secondary to-primary hover:-translate-y-0.5'
              : 'cursor-not-allowed bg-outline-variant opacity-50'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Submit Application
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
