import StepProgressBar from './StepProgressBar';

interface BioDataHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

export default function BioDataHeader({ currentStep, totalSteps, stepLabel }: BioDataHeaderProps) {
  return (
    <section className="mb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight font-headline mb-1">
            Application Portal
          </h1>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Please provide your foundational information to begin your engineering journey.
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-8">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest block">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-lg font-bold text-primary">{stepLabel}</span>
        </div>
      </div>
      <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />
    </section>
  );
}
