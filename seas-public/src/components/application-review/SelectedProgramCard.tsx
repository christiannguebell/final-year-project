import { Calendar, MapPin, School } from 'lucide-react';

export interface SelectedProgramInfo {
  code: string;
  name: string;
  enrollmentTerm: string;
  campus: string;
}

interface SelectedProgramCardProps {
  program: SelectedProgramInfo;
}

export default function SelectedProgramCard({ program }: SelectedProgramCardProps) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-primary p-8 text-white shadow-lg md:col-span-5">
      <div className="absolute -top-12 -right-12 opacity-10">
        <School size={160} />
      </div>
      <div className="relative z-10">
        <h3 className="mb-6 flex items-center gap-2 font-headline text-lg font-bold">Selected Program</h3>
        <div className="mb-6 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-md">
          <p className="mb-2 text-[10px] font-bold tracking-widest text-secondary-container uppercase">
            Program Code: {program.code}
          </p>
          <p className="font-headline text-xl leading-tight font-extrabold">{program.name}</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar size={18} className="shrink-0 text-secondary-container" />
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">Enrolment Term</p>
              <p className="text-sm font-bold">{program.enrollmentTerm}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="shrink-0 text-secondary-container" />
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">Campus</p>
              <p className="text-sm font-bold">{program.campus}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
