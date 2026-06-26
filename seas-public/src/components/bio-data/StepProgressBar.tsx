interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgressBar({ currentStep, totalSteps }: StepProgressBarProps) {
  return (
    <div className="flex items-center w-full gap-2 mt-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isComplete = step <= currentStep;
        return (
          <div
            key={step}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              isComplete ? 'bg-secondary' : 'bg-outline-variant/30'
            }`}
          />
        );
      })}
    </div>
  );
}
