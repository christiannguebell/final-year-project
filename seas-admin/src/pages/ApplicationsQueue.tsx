import { ClipboardList, Eye, CheckCircle, StickyNote, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useNavigate } from 'react-router-dom';

export default function ApplicationsQueue() {
  const { data, isLoading } = useApplications({ limit: 10 });
  const navigate = useNavigate();

  const applications = data;

  const pagination = data?.pagination;

  const getStatusBadge = (status: string) => {
    const baseClass = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold';
    switch (status) {
      case 'approved': return `${baseClass} bg-secondary-container text-on-secondary-container`;
      case 'submitted': return `${baseClass} bg-blue-100 text-blue-700`;
      case 'under_review': return `${baseClass} bg-yellow-100 text-yellow-700`;
      case 'rejected': return `${baseClass} bg-error-container text-error`;
      case 'draft': return `${baseClass} bg-slate-100 text-slate-600`;
      default: return `${baseClass} bg-slate-100 text-slate-600`;
    }
  };

  const getInitials = (app: any) => {
    const first = app?.candidate?.firstName?.[0] || '?';
    const last = app?.candidate?.lastName?.[0] || '?';
    return (first + last).toUpperCase();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Application Review Queue</h2>
        <p className="text-on-surface-variant mt-2 text-lg">Manage and evaluate pending student applications.</p>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="architect-card p-6 border border-outline-variant/10 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-primary/70">
            <ClipboardList className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
          </div>
          <div className="text-4xl font-headline font-black text-primary">
            {applications.filter(a => a.status === 'under_review').length}
          </div>
          <p className="text-xs text-secondary font-bold flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 11L5 7L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 5H11V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            12% less than last week
          </p>
        </div>
        <div className="architect-card p-6 border border-outline-variant/10 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-primary/70">
            <ClipboardList className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Avg Review</span>
          </div>
          <div className="text-4xl font-headline font-black text-primary">4.2 <span className="text-xl font-normal opacity-40">days</span></div>
          <p className="text-xs text-error font-bold flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L7 3L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 7H11V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            0.5d increase
          </p>
        </div>
        <div className="architect-card p-6 border border-outline-variant/10 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-secondary">
            <CheckCircle className="w-5 h-5 text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-widest">Approvals</span>
          </div>
          <div className="text-4xl font-headline font-black text-secondary">31</div>
          <p className="text-xs text-on-surface-variant font-medium">Goal: 45 approvals per day</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-low p-4 rounded-xl flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, ID or email..."
            className="w-full bg-surface-container-lowest border-none pl-10 pr-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-surface-container-lowest border-none py-2.5 px-4 rounded-lg text-sm focus:ring-0 min-w-[160px] cursor-pointer">
            <option>All Programs</option>
          </select>
          <select className="bg-surface-container-lowest border-none py-2.5 px-4 rounded-lg text-sm focus:ring-0 min-w-[160px] cursor-pointer">
            <option>All Statuses</option>
            <option>Under Review</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-container transition-colors">
            <Filter className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="architect-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-on-surface-variant">Loading applications...</div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b ghost-border">
                  <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Program</th>
                  <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">
                          {getInitials(app)}
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm">
                            {app.candidate?.firstName} {app.candidate?.lastName}
                          </p>
                          <p className="text-xs text-on-surface-variant">{app.candidate?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-on-surface-variant">{app.program?.name || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={getStatusBadge(app.status)}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          app.status === 'approved' ? 'bg-secondary' :
                          app.status === 'under_review' ? 'bg-yellow-500' :
                          app.status === 'submitted' ? 'bg-blue-500' :
                          app.status === 'rejected' ? 'bg-error' : 'bg-slate-400'
                        }`}></span>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs text-on-surface-variant font-medium">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft'}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/applications/${app.id}`)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary-container/20 rounded-lg transition-all">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-all">
                          <StickyNote className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 border-t border-outline-variant/10 flex items-center justify-between">
              <p className="text-xs text-on-surface-variant font-medium">
                Showing {((pagination?.page || 1) - 1) * (pagination?.limit || 10) + 1} to {Math.min(pagination?.page * pagination?.limit, pagination?.total || 0)} of {pagination?.total || 0} applications
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded hover:bg-slate-200 transition-colors disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded bg-primary text-white text-xs font-bold shadow-sm">1</button>
                <button className="w-8 h-8 rounded hover:bg-slate-200 text-xs font-bold text-on-surface-variant transition-colors">2</button>
                {pagination && pagination.totalPages > 2 && <span className="text-outline-variant text-xs">...</span>}
                <button className="p-2 rounded hover:bg-slate-200 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
