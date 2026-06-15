import { Award, Check, Pencil, School } from 'lucide-react';
import type { AcademicRecord } from '../../types/application';

interface AcademicHistorySectionProps {
  records: AcademicRecord[];
  onEdit?: () => void;
}

export default function AcademicHistorySection({ records, onEdit }: AcademicHistorySectionProps) {
  return (
    <section className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest p-8 shadow-ambient md:col-span-12">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-headline text-lg font-extrabold text-primary">
          <School size={18} className="text-secondary" />
          Academic History
        </h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-sm font-bold text-primary-container hover:underline"
          >
            <Pencil size={14} />
            Edit Records
          </button>
        )}
      </div>
      <div className="space-y-4">
        {records.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic">No academic records on file.</p>
        ) : (
          records.map((record, index) => (
            <div
              key={record.id ?? index}
              className="group flex flex-col justify-between rounded-lg border border-outline-variant/5 bg-surface-container-low p-5 md:flex-row md:items-center"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{record.degree}</p>
                  <p className="text-xs font-medium text-on-surface-variant">{record.institution}</p>
                  <p className="mt-1 text-[10px] tracking-wider text-on-surface-variant/70 uppercase">
                    {record.fieldOfStudy}
                    {record.endDate ? ` • Class of ${new Date(record.endDate).getFullYear()}` : ''}
                    {record.grade ? ` • GPA: ${record.grade}` : ''}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 self-start rounded-full border border-secondary/10 bg-white/50 px-3 py-1 md:mt-0">
                <Check size={12} className="text-secondary" />
                <span className="text-[10px] font-black text-primary uppercase">Verified Transcript</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
