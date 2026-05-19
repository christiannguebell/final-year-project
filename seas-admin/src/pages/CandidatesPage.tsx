import { Download, UserPlus, Filter, Eye, Edit, Slash, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCandidates } from '@/hooks/useCandidates';
import { useNavigate } from 'react-router-dom';
import type { Candidate } from '@/types/entities';

export default function CandidatesPage() {
  const { data, isLoading } = useCandidates({ limit: 10 });
  const navigate = useNavigate();

  const candidates = data?.items || [];
  const pagination = data?.pagination;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Candidate Management</h2>
          <p className="text-on-surface-variant mt-1">Review and manage candidate applications for academic programs.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest text-primary border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-all text-sm font-semibold shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-all text-sm font-bold shadow-sm">
            <UserPlus className="w-4 h-4" />
            Invite Candidate
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-1 bg-surface-container-low rounded-xl">
        <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm flex flex-col gap-2">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Academic Program</label>
          <select className="border-none bg-transparent font-medium text-sm text-primary focus:ring-0 p-0 outline-none">
            <option>All Programs</option>
          </select>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm flex flex-col gap-2">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</label>
          <div className="flex gap-2 mt-1">
            <button className="px-2 py-1 bg-secondary-container text-on-secondary-container rounded text-[10px] font-bold">Verified</button>
            <button className="px-2 py-1 bg-surface-container-high text-on-surface-variant rounded text-[10px] font-bold">Pending</button>
            <button className="px-2 py-1 bg-surface-container-high text-on-surface-variant rounded text-[10px] font-bold">Blocked</button>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm flex flex-col gap-2">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Registration Date</label>
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <svg className="w-4 h-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>All time</span>
          </div>
        </div>

        <div className="bg-primary p-4 rounded-lg shadow-sm flex items-center justify-center gap-3 cursor-pointer hover:bg-primary-container transition-all">
          <Filter className="w-4 h-4 text-white" />
          <span className="text-white font-headline font-bold text-sm">Apply Filters</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="architect-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-on-surface-variant">Loading candidates...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b ghost-border">
                    <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Candidate Name</th>
                    <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">ID Number</th>
                    <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Program</th>
                    <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Reg. Date</th>
                    <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                 <tbody className="divide-y divide-outline-variant/10">
                    {candidates.map((c: Candidate) => (
                     <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">
                            {getInitials(c.firstName + ' ' + c.lastName)}
                          </div>
                          <div>
                            <p className="font-bold text-primary text-sm">{c.firstName} {c.lastName}</p>
                            <p className="text-xs text-on-surface-variant">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-on-surface-variant/70 border border-outline-variant/10">
                          {c.candidateNumber}
                        </code>
                      </td>
                      <td className="px-6 py-5">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <p className="text-sm font-medium text-on-surface-variant">{(c as any).program?.name || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-secondary-container text-on-secondary-container">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs text-on-surface-variant font-medium">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => navigate(`/candidates/${c.id}`)}
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-slate-100 rounded-lg transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-all">
                            <Slash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 border-t border-outline-variant/10 flex items-center justify-between">
              <p className="text-xs text-on-surface-variant font-medium">
                Showing {((pagination?.page || 1) - 1) * (pagination?.limit || 10) + 1} to {Math.min((pagination?.page || 1) * (pagination?.limit || 10), pagination?.total || 0)} of {pagination?.total || 0} candidates
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded hover:bg-slate-200 transition-colors disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded bg-primary text-white text-xs font-bold shadow-sm">1</button>
                {pagination && pagination.totalPages > 1 && (
                  <>
                    {Array.from({ length: Math.min(3, pagination.totalPages - 1) }, (_, i) => (
                      <button key={i + 2} className="w-8 h-8 rounded hover:bg-slate-200 text-xs font-bold text-on-surface-variant transition-colors">
                        {i + 2}
                      </button>
                    ))}
                    {pagination.totalPages > 4 && <span className="text-outline-variant text-xs">...</span>}
                  </>
                )}
                <button className="p-2 rounded hover:bg-slate-200 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl relative overflow-hidden group architect-card border-none bg-primary text-white">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-blue-200">Total Candidates</p>
            <h3 className="text-4xl font-headline font-black text-white">{data?.pagination?.total || 0}</h3>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-secondary-fixed">
              <UserPlus className="w-4 h-4" />
              <span>Active candidates</span>
            </div>
          </div>
          <UserPlus className="absolute -right-4 -bottom-4 w-32 h-32 transition-transform group-hover:scale-110 text-white/5" />
        </div>
        <StatSummaryCard 
          label="Pending Approval" 
           value={data?.items?.filter(c => !c.verified).length || 0}
          subValue="Awaiting review" 
          icon={Clock} 
          theme="low"
        />
        <StatSummaryCard 
          label="New Registrations" 
          value="42" 
          subValue="In the last 24 hours" 
          icon={UserPlus} 
          theme="low"
        />
      </div>
    </div>
  );
}

interface StatSummaryCardProps {
  label: string;
  value: string | number;
  subValue: string;
  icon: LucideIcon;
  theme?: 'low' | 'primary';
}

function StatSummaryCard({ label, value, subValue, icon: Icon, theme = 'low' }: StatSummaryCardProps) {
  return (
    <div className={cn(
      'p-6 rounded-xl relative overflow-hidden group architect-card border-none',
      theme === 'primary' ? 'bg-primary text-white' : 'bg-surface-container-low'
    )}>
      <div className="relative z-10">
        <p className={cn(
          'text-[10px] font-bold uppercase tracking-widest mb-1',
          theme === 'primary' ? 'text-blue-200' : 'text-on-surface-variant'
        )}>{label}</p>
        <h3 className={cn(
          'text-4xl font-headline font-black',
          theme === 'primary' ? 'text-white' : 'text-primary'
        )}>{value}</h3>
        <div className={cn(
          'mt-4 flex items-center gap-2 text-xs font-bold',
          theme === 'primary' ? 'text-secondary-fixed' : 'text-primary/60'
        )}>
          <Icon className="w-4 h-4" />
          <span>{subValue}</span>
        </div>
      </div>
      <Icon className={cn(
        'absolute -right-4 -bottom-4 w-32 h-32 transition-transform group-hover:scale-110',
        theme === 'primary' ? 'text-white/5' : 'text-primary/5'
      )} />
    </div>
  );
}
