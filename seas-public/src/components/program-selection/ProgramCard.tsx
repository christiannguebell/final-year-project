import { Check, ClipboardCheck, Clock, Loader2, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Program } from '../../types/application';
import {
  formatDegreeLabel,
  formatDuration,
  getDegreeBadgeClasses,
  isPopularProgram,
} from './programUtils';

interface ProgramCardProps {
  program: Program;
  isSelected: boolean;
  isSaving: boolean;
  onSelect: (programId: string) => void;
}

export default function ProgramCard({ program, isSelected, isSaving, onSelect }: ProgramCardProps) {
  const popular = isPopularProgram(program);
  const isBusy = isSaving && !isSelected;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest p-8 shadow-ambient transition-all hover:shadow-lg',
        'ring-2 ring-transparent hover:ring-primary/10',
        isSelected && 'ring-primary'
      )}
    >
      {popular && (
        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold tracking-widest text-white uppercase shadow-sm">
          <Star size={10} fill="currentColor" />
          Popular
        </div>
      )}

      <div className="mb-6">
        <div
          className={cn(
            'mb-4 inline-flex rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase transition-colors',
            getDegreeBadgeClasses(program.degreeLevel),
            'group-hover:bg-primary group-hover:text-white'
          )}
        >
          {formatDegreeLabel(program.degreeLevel)}
        </div>

        <h3 className="mb-2 line-clamp-1 font-headline text-xl font-extrabold text-primary">{program.name}</h3>
        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-on-surface-variant">{program.description}</p>
      </div>

      <div className="mb-8 flex-1 space-y-4">
        <div className="flex items-start gap-3">
          <ClipboardCheck size={16} className="mt-1 text-secondary" />
          <div>
            <p className="text-[10px] font-bold tracking-wider text-primary uppercase">Requirements</p>
            <p className="line-clamp-2 text-xs text-on-surface-variant">
              {program.entryRequirements || 'See program handbook for entry requirements.'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock size={16} className="mt-1 text-secondary" />
          <div>
            <p className="text-[10px] font-bold tracking-wider text-primary uppercase">Duration</p>
            <p className="text-xs text-on-surface-variant">{formatDuration(program.durationYears)}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelect(program.id)}
        disabled={isSaving}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg py-4 text-xs font-extrabold tracking-[0.15em] uppercase transition-all active:scale-95',
          isSelected
            ? 'cursor-default bg-secondary text-white shadow-secondary/20'
            : 'bg-primary text-white shadow-primary/20 hover:bg-on-primary-fixed hover:shadow-xl'
        )}
      >
        {isBusy ? (
          <Loader2 className="animate-spin" size={16} />
        ) : isSelected ? (
          <>
            <Check size={16} />
            Selected
          </>
        ) : (
          'Select Program'
        )}
      </button>
    </article>
  );
}
