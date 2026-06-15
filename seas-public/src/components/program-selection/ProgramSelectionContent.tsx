import { useMemo, useState } from 'react';
import type { Program } from '../../types/application';
import ApplicationStepper from './ApplicationStepper';
import ProgramSelectionHeader from './ProgramSelectionHeader';
import ProgramSearchBar, { type DegreeFilter } from './ProgramSearchBar';
import ProgramGrid from './ProgramGrid';
import ProgramSelectionActions from './ProgramSelectionActions';
import ViewAllProgramsButton from './ViewAllProgramsButton';
import { matchesDegreeFilter } from './programUtils';

interface ProgramSelectionContentProps {
  programs: Program[];
  isLoading: boolean;
  isSaving: boolean;
  selectedProgramId?: string;
  onSelectProgram: (programId: string) => void;
  onBack?: () => void;
  onContinue?: () => void;
  showStepper?: boolean;
  showActions?: boolean;
  showViewAll?: boolean;
  continueLabel?: string;
}

export default function ProgramSelectionContent({
  programs,
  isLoading,
  isSaving,
  selectedProgramId,
  onSelectProgram,
  onBack,
  onContinue,
  showStepper = true,
  showActions = true,
  showViewAll = true,
  continueLabel,
}: ProgramSelectionContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [degreeFilter, setDegreeFilter] = useState<DegreeFilter>('all');
  const [showAll, setShowAll] = useState(false);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (program.description ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (program.code ?? '').toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch && matchesDegreeFilter(program, degreeFilter);
    });
  }, [programs, searchTerm, degreeFilter]);

  const visiblePrograms = showAll ? filteredPrograms : filteredPrograms.slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4">
      {showStepper && <ApplicationStepper currentStep={3} />}

      <ProgramSelectionHeader />

      <ProgramSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        degreeFilter={degreeFilter}
        onDegreeFilterChange={setDegreeFilter}
      />

      <ProgramGrid
        programs={visiblePrograms}
        selectedProgramId={selectedProgramId}
        isLoading={isLoading}
        isSaving={isSaving}
        onSelectProgram={onSelectProgram}
      />

      {showViewAll && !showAll && filteredPrograms.length > 6 && (
        <ViewAllProgramsButton onClick={() => setShowAll(true)} />
      )}

      {showActions && (
        <ProgramSelectionActions
          onBack={onBack}
          onContinue={onContinue}
          continueLabel={continueLabel}
          canContinue={!!selectedProgramId}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
