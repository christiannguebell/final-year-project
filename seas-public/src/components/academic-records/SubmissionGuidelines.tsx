export default function SubmissionGuidelines() {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/10 shadow-sm p-6 space-y-4 h-full">
      <h3 className="font-headline text-base font-bold text-on-surface">Submission Guidelines</h3>
      <p className="text-sm leading-relaxed text-on-surface-variant">
        Please provide details of all post-secondary education institutions attended. You will need to upload
        official transcripts for each entry in the next step.
      </p>
      <div className="flex items-start gap-2.5 pt-1">
        <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
          <span className="block w-1.5 h-1.5 rounded-full bg-white" />
        </span>
        <p className="text-xs leading-relaxed text-on-surface-variant">
          Include institutions even if a degree was not conferred.
        </p>
      </div>
    </div>
  );
}
