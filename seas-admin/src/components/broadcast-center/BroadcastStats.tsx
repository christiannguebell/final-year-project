import { Send, Eye, Clock } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useAnalytics';

export default function BroadcastStats() {
  const { data: stats } = useDashboardStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container opacity-30" />
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Total Candidates</p>
            <h3 className="text-3xl font-headline font-black text-primary mb-2">{(stats?.totalCandidates ?? 0).toLocaleString()}</h3>
            <span className="text-xs font-bold text-secondary flex items-center gap-1">Reachable via broadcast</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <Send className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-secondary-container opacity-30" />
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Active Applications</p>
            <h3 className="text-3xl font-headline font-black text-primary mb-2">{(stats?.totalApplications ?? 0).toLocaleString()}</h3>
            <span className="text-xs font-bold text-secondary flex items-center gap-1">Eligible for notifications</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-error to-error-container opacity-30" />
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Pending Reviews</p>
            <h3 className="text-3xl font-headline font-black text-primary mb-2">{(stats?.pendingApplications ?? 0).toLocaleString()}</h3>
            <span className="text-xs font-medium text-on-surface-variant/80">May need status broadcasts</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
