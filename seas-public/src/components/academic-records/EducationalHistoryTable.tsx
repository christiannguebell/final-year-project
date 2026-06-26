import { PlusCircle, Trash2 } from 'lucide-react';
import type { AcademicRecord } from '../../types/application';

interface EducationalHistoryTableProps {
  records: AcademicRecord[];
  onAddAnother: () => void;
  onRemove: (id: string) => void;
  isAdding: boolean;
}

function formatGradDate(endDate?: string) {
  if (!endDate) return '—';
  try {
    return new Date(endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return endDate;
  }
}

export default function EducationalHistoryTable({
  records,
  onAddAnother,
  onRemove,
  isAdding,
}: EducationalHistoryTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant/10">
        <h2 className="font-headline text-lg font-bold text-on-surface">Educational History</h2>
        {!isAdding && (
          <button
            type="button"
            onClick={onAddAnother}
            className="flex items-center gap-1.5 text-sm font-bold text-secondary hover:opacity-80 transition-opacity"
          >
            <PlusCircle size={16} className="fill-secondary/10" />
            Add Another
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low/60">
              <th className="px-6 py-3 text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
                Institution
              </th>
              <th className="px-4 py-3 text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
                Degree
              </th>
              <th className="px-4 py-3 text-[11px] font-bold tracking-wider text-on-surface-variant uppercase whitespace-nowrap">
                Grad Date
              </th>
              <th className="px-4 py-3 text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
                GPA
              </th>
              <th className="px-4 py-3 text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-on-surface-variant italic opacity-50"
                >
                  No educational records added yet. Click "Add Another" to begin.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-on-surface">{record.institution}</div>
                    {record.fieldOfStudy && (
                      <div className="text-xs text-on-surface-variant mt-0.5">{record.fieldOfStudy}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-on-surface">{record.degree}</td>
                  <td className="px-4 py-4 text-sm text-on-surface-variant whitespace-nowrap">
                    {formatGradDate(record.endDate)}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-secondary">
                    {record.grade || '—'}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {record.id && (
                      <button
                        type="button"
                        onClick={() => onRemove(record.id!)}
                        className="p-1.5 text-on-surface-variant/50 hover:text-error transition-colors rounded"
                        aria-label="Remove record"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
