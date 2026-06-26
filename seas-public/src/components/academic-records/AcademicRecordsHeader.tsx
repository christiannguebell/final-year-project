interface AcademicRecordsHeaderProps {
  currentStep?: number;
  totalSteps?: number;
}

export default function AcademicRecordsHeader({ currentStep = 2, totalSteps = 5 }: AcademicRecordsHeaderProps) {
  return (
    <div className="mb-2">
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-1">
            Step {currentStep} of {totalSteps}
          </span>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary">
            Academic Records
          </h1>
        </div>

        {/* Step progress dots in top right */}
        <div className="flex items-center gap-2 mt-2">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const step = index + 1;
            const isComplete = step < currentStep;
            const isCurrent = step === currentStep;
            return (
              <div
                key={step}
                className={`rounded-full transition-all duration-300 ${
                  isComplete
                    ? 'h-2 w-8 bg-secondary'
                    : isCurrent
                    ? 'h-2 w-8 bg-primary'
                    : 'h-2 w-8 bg-outline-variant/30'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
