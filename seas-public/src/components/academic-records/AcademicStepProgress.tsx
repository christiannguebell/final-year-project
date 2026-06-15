interface AcademicStepProgressProps {
  currentStep?: number;
  totalSteps?: number;
}

export default function AcademicStepProgress({ currentStep = 2, totalSteps = 6 }: AcademicStepProgressProps) {
  return (
    <div className="mb-8 flex gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isComplete = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div
            key={step}
            className={`h-1.5 w-16 rounded-full ${
              isComplete ? 'bg-secondary' : isCurrent ? 'bg-primary' : 'bg-outline-variant/30'
            }`}
          />
        );
      })}
    </div>
  );
}
