import { useMemo, useState } from 'react';
import { Search, MoreHorizontal, MapPin, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useExamCenters, useDeleteExamCenter } from '@/hooks/useExams';
import type { ExamCenter } from '@/types/entities';

export default function ExamCenterTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useExamCenters();
  const deleteCenter = useDeleteExamCenter();
  const centers = data?.items ?? [];

  const filtered = useMemo(
    () =>
      centers.filter(
        (center) =>
          center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (center.location || '').toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [centers, searchTerm]
  );

  const getStatusBadge = (center: ExamCenter & { isActive?: boolean }) => {
    const base = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold';
    if (center.isActive === false) return `${base} bg-slate-100 text-on-surface-variant/70`;
    return `${base} bg-secondary-container text-secondary`;
  };

  const handleDelete = (center: ExamCenter) => {
    if (!window.confirm(`Delete exam center "${center.name}"?`)) return;
    deleteCenter.mutate(center.id, {
      onSuccess: () => toast.success(`${center.name} removed`),
      onError: () => toast.error('Failed to delete center'),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-outline-variant/15 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-outline-variant/10 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
        <h3 className="text-md font-headline font-bold text-primary">Registered Exam Centers</h3>
        <div className="relative w-full max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search venues..."
            className="w-full bg-white border border-outline-variant/30 pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="p-6 text-sm text-on-surface-variant">Loading exam centers...</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-outline-variant/10 text-on-surface-variant/70">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider">Venue Details</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider">Total Capacity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider">Current Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.map((center) => {
                const extended = center as ExamCenter & { address?: string; city?: string; isActive?: boolean };
                return (
                  <tr key={center.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center border border-outline-variant/10">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm">{center.name}</p>
                          <p className="text-xs text-on-surface-variant/70">{extended.city || 'Campus Network'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <p className="text-sm text-primary">{extended.address || center.location}</p>
                    </td>
                    <td className="px-6 py-4.5">
                      <p className="text-sm font-bold text-primary">{center.capacity ?? 0}</p>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={getStatusBadge(extended)}>
                        {extended.isActive === false ? 'Inactive' : 'Fully Operational'}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <button
                        onClick={() => handleDelete(center)}
                        className="p-1.5 text-on-surface-variant hover:text-error hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-outline-variant/10 flex items-center justify-between">
        <p className="text-xs text-on-surface-variant/80 font-medium">
          Showing {filtered.length} of {centers.length} venues
        </p>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover:bg-slate-200 text-on-surface-variant/70 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-slate-200 text-on-surface-variant/70 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
