import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const STEPS = [
  { id: 1, label: 'Bio Data' },
  { id: 2, label: 'Academic History' },
  { id: 3, label: 'Program Selection' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Submit' },
] as const;

interface ReviewStepperProps {
  currentStep?: number;
}

export default function ReviewStepper({ currentStep = 5 }: ReviewStepperProps) {
  return (
    <div className="mb-12 overflow-x-auto">
      <div className="mx-auto flex min-w-[640px] max-w-3xl items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'mb-2 flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-md',
                    isCompleted && 'bg-secondary text-white',
                    isCurrent && 'scale-110 bg-primary text-white',
                    !isCompleted && !isCurrent && 'border-2 border-outline-variant/20 bg-surface-container-high text-on-surface'
                  )}
                >
                  {isCompleted ? <Check size={16} /> : step.id}
                </div>
                <span
                  className={cn(
                    'max-w-[88px] text-center text-[10px] font-bold tracking-wider uppercase',
                    isCurrent || isCompleted ? 'text-primary' : 'text-on-surface-variant'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-2 mb-6 h-0.5 flex-1',
                    step.id < currentStep ? 'bg-secondary' : 'bg-outline-variant/30'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
