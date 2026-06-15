interface DocumentStepProgressProps {
  currentStep?: number;
  totalSteps?: number;
}

export default function DocumentStepProgress({ currentStep = 4, totalSteps = 6 }: DocumentStepProgressProps) {
  return (
    <div className="mx-auto mb-12 flex h-1.5 max-w-md gap-2 md:mx-0">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isComplete = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div
            key={step}
            className={`flex-1 rounded-full transition-colors ${
              isComplete ? 'bg-secondary' : isCurrent ? 'bg-primary' : 'bg-outline-variant/30'
            }`}
          />
        );
      })}
    </div>
  );
}
