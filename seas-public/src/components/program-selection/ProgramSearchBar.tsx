import { useRef } from 'react';
import { Filter, Search } from 'lucide-react';

export type DegreeFilter = 'all' | "Bachelor's" | "Master's" | 'PhD';

interface ProgramSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  degreeFilter: DegreeFilter;
  onDegreeFilterChange: (value: DegreeFilter) => void;
}

const DEGREE_OPTIONS: { value: DegreeFilter; label: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: "Bachelor's", label: "Bachelor's" },
  { value: "Master's", label: "Master's" },
  { value: 'PhD', label: 'PhD' },
];

export default function ProgramSearchBar({
  searchTerm,
  onSearchChange,
  degreeFilter,
  onDegreeFilterChange,
}: ProgramSearchBarProps) {
  const degreeSelectRef = useRef<HTMLSelectElement>(null);

  return (
    <div className="mb-8 flex flex-col items-center gap-4 rounded-xl border border-outline-variant/5 bg-surface-container-low p-6 shadow-sm md:flex-row">
      <div className="relative w-full flex-1">
        <Search size={20} className="absolute top-1/2 left-4 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search by program name or keyword..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border-none bg-surface-container-lowest py-3 pr-4 pl-12 text-on-surface shadow-sm placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex w-full gap-4 md:w-auto">
        <select
          ref={degreeSelectRef}
          value={degreeFilter}
          onChange={(e) => onDegreeFilterChange(e.target.value as DegreeFilter)}
          className="min-w-[160px] appearance-none rounded-lg border-none bg-surface-container-lowest py-3 pr-10 pl-4 text-xs font-bold tracking-wider text-on-surface uppercase shadow-sm focus:ring-2 focus:ring-primary"
        >
          {DEGREE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => degreeSelectRef.current?.focus()}
          className="rounded-lg bg-surface-container-lowest p-3 text-primary shadow-sm transition-colors hover:bg-surface-container-high"
          aria-label="Filter programs by degree level"
        >
          <Filter size={20} />
        </button>
      </div>
    </div>
  );
}
