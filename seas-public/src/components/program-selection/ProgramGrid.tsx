import { Loader2 } from 'lucide-react';
import type { Program } from '../../types/application';
import ProgramCard from './ProgramCard';

interface ProgramGridProps {
  programs: Program[];
  selectedProgramId?: string;
  isLoading: boolean;
  isSaving: boolean;
  onSelectProgram: (programId: string) => void;
}

export default function ProgramGrid({
  programs,
  selectedProgramId,
  isLoading,
  isSaving,
  onSelectProgram,
}: ProgramGridProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="font-bold text-on-surface-variant">Discovering Academic Paths...</p>
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest py-16 text-center">
        <p className="font-headline text-lg font-bold text-primary">No programs found</p>
        <p className="mt-2 text-sm text-on-surface-variant">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          isSelected={program.id === selectedProgramId}
          isSaving={isSaving}
          onSelect={onSelectProgram}
        />
      ))}
    </div>
  );
}
