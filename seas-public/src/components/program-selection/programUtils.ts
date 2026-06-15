import type { Program } from '../../types/application';

export function formatDegreeLabel(degreeLevel?: string): string {
  if (!degreeLevel) return 'PROFESSIONAL DEGREE';

  const level = degreeLevel.toLowerCase();
  if (level.includes('bachelor')) return 'BACHELOR OF SCIENCE';
  if (level.includes('master')) return 'MASTER OF SCIENCE';
  if (level.includes('phd') || level.includes('doctor')) return 'DOCTOR OF PHILOSOPHY';

  return degreeLevel.toUpperCase();
}

export function getDegreeBadgeClasses(degreeLevel?: string): string {
  const level = (degreeLevel ?? '').toLowerCase();

  if (level.includes('master')) return 'bg-sky-100 text-sky-800';
  if (level.includes('bachelor')) return 'bg-emerald-100 text-emerald-800';
  if (level.includes('phd') || level.includes('doctor')) return 'bg-violet-100 text-violet-800';

  return 'bg-primary-container/10 text-primary';
}

export function formatDuration(durationYears?: number): string {
  if (!durationYears) return 'Duration TBD';
  const months = durationYears * 12;
  return `${months} Months Full-time`;
}

export function isPopularProgram(program: Program): boolean {
  const name = program.name.toLowerCase();
  return name.includes('computer') || program.code === 'COMP-01';
}

export function matchesDegreeFilter(program: Program, filter: string): boolean {
  if (filter === 'all') return true;

  const level = (program.degreeLevel ?? '').toLowerCase();
  if (filter === "Bachelor's") return level.includes('bachelor');
  if (filter === "Master's") return level.includes('master');
  if (filter === 'PhD') return level.includes('phd') || level.includes('doctor');

  return true;
}
