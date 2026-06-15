import { CheckCircle } from 'lucide-react';
import { useExamCenters } from '@/hooks/useExams';

export default function ExamCenterStats() {
  const { data } = useExamCenters();
  const centers = data?.items ?? [];
  const totalCapacity = centers.reduce((sum, center) => sum + (center.capacity || 0), 0);
  const activeVenues = centers.filter((center) => (center as { isActive?: boolean }).isActive !== false).length;
  const availabilityPct = totalCapacity > 0 ? Math.round((activeVenues / Math.max(centers.length, 1)) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-primary text-white p-6 rounded-xl relative overflow-hidden group shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-2">Total Capacity</p>
        <h3 className="text-4xl font-headline font-black text-white mb-2">{totalCapacity.toLocaleString()}</h3>
        <span className="text-xs font-bold text-secondary-container flex items-center gap-1">
          Across {centers.length} registered centers
        </span>
      </div>

      <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm relative overflow-hidden group">
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Active Venues</p>
        <h3 className="text-4xl font-headline font-black text-primary mb-2">{activeVenues}</h3>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
          <div className="bg-secondary h-full rounded-full" style={{ width: `${availabilityPct}%` }} />
        </div>
        <span className="text-xs font-semibold text-secondary flex items-center gap-1 mt-2">
          <CheckCircle className="w-3.5 h-3.5" /> {availabilityPct}% operational status
        </span>
      </div>

      <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm relative overflow-hidden flex justify-between items-center group">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Registered Centers</p>
          <h3 className="text-4xl font-headline font-black text-secondary mb-2">{centers.length}</h3>
          <p className="text-[10px] text-on-surface-variant/70 leading-tight max-w-[140px]">
            Available for candidate allocation
          </p>
        </div>
      </div>
    </div>
  );
}
