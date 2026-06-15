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
    return new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
    <div className="overflow-hidden rounded-xl border border-outline-variant/5 bg-surface-container-lowest shadow-ambient">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline text-xl font-bold text-primary">Educational History</h2>
          {!isAdding && (
            <button
              type="button"
              onClick={onAddAnother}
              className="flex items-center gap-2 text-sm font-bold text-secondary transition-opacity hover:opacity-80"
            >
              <PlusCircle size={18} />
              Add Another
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                <th className="rounded-l-lg px-4 py-3">Institution</th>
                <th className="px-4 py-3">Degree</th>
                <th className="px-4 py-3">Grad Date</th>
                <th className="px-4 py-3">GPA</th>
                <th className="rounded-r-lg px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-on-surface-variant italic opacity-50">
                    No educational records added yet.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="transition-colors hover:bg-surface-container-low">
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold text-primary">{record.institution}</div>
                      {record.fieldOfStudy && (
                        <div className="text-[10px] tracking-wider text-on-surface-variant uppercase">
                          {record.fieldOfStudy}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">{record.degree}</td>
                    <td className="px-4 py-4 text-sm text-on-surface-variant">{formatGradDate(record.endDate)}</td>
                    <td className="px-4 py-4 text-sm font-bold text-secondary">{record.grade || '—'}</td>
                    <td className="px-4 py-4 text-right">
                      {record.id && (
                        <button
                          type="button"
                          onClick={() => onRemove(record.id!)}
                          className="p-2 text-on-surface-variant transition-colors hover:text-error"
                        >
                          <Trash2 size={16} />
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
    </div>
  );
}
