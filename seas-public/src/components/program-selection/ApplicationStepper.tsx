import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const STEPS = [
  { id: 1, label: 'Identity' },
  { id: 2, label: 'Academic' },
  { id: 3, label: 'Program' },
  { id: 4, label: 'Review' },
] as const;

interface ApplicationStepperProps {
  currentStep?: number;
}

export default function ApplicationStepper({ currentStep = 3 }: ApplicationStepperProps) {
  const progressWidth =
    currentStep <= 1 ? '0%' : currentStep >= 4 ? '100%' : `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`;

  return (
    <div className="mb-12">
      <div className="relative mx-auto flex h-10 max-w-2xl items-center justify-between">
        <div className="absolute top-1/2 left-0 -z-10 h-1 w-full -translate-y-1/2 rounded-full bg-outline-variant/30" />
        <div
          className="absolute top-1/2 left-0 -z-10 h-1 -translate-y-1/2 rounded-full bg-secondary transition-all duration-500"
          style={{ width: progressWidth }}
        />

        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  'mb-2 flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-md transition-all',
                  isCompleted && 'bg-secondary text-white',
                  isCurrent && 'scale-110 bg-primary text-white',
                  !isCompleted && !isCurrent && 'border-2 border-outline-variant/20 bg-surface-container-high text-on-surface opacity-40'
                )}
              >
                {isCompleted ? <Check size={16} /> : step.id}
              </div>
              <span
                className={cn(
                  'text-xs font-bold uppercase tracking-wider',
                  isCurrent || isCompleted ? 'text-primary' : 'text-primary opacity-40'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
