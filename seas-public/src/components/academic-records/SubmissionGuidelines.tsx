import { Info } from 'lucide-react';

export default function SubmissionGuidelines() {
  return (
    <div className="space-y-4 rounded-xl border border-outline-variant/5 bg-surface-container-low p-6 shadow-sm">
      <h3 className="font-headline text-lg font-bold text-primary">Submission Guidelines</h3>
      <p className="text-sm leading-relaxed text-on-surface-variant">
        Please provide details of all post-secondary education institutions attended. You will need to upload
        official transcripts for each entry in the next step.
      </p>
      <div className="flex items-start gap-3 rounded-lg border border-secondary/10 bg-white/50 p-3">
        <Info size={16} className="mt-0.5 text-secondary" />
        <p className="text-xs text-on-surface-variant">Include institutions even if a degree was not conferred.</p>
      </div>
    </div>
  );
}
