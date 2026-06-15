import FinalExamBlockCard from '@/components/exam-sessions/FinalExamBlockCard';
import QuickAllocationCard from '@/components/exam-sessions/QuickAllocationCard';
import ScheduledSessionsTable from '@/components/exam-sessions/ScheduledSessionsTable';
import { useExamSessions } from '@/hooks/useExams';

export default function ExamSessions() {
  const { data } = useExamSessions();
  const activeCount = (data?.items ?? []).filter((s) => {
    const status = (s as { status?: string }).status;
    return status === 'scheduled' || status === 'in_progress';
  }).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      
      {/* Top Header Panel */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="space-y-1">
          <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            SEAS Engineering <span className="text-[9px]">•</span> Logistics Command
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
              Exam Sessions
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-secondary-container text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              {activeCount} Active Session{activeCount === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Orchestrate academic excellence through precise scheduling and resource allocation management.
          </p>
        </div>
      </div>

      {/* Top Metrics Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Final Exam Block (col-span 8) */}
        <div className="lg:col-span-8">
          <FinalExamBlockCard />
        </div>

        {/* Quick Allocation diagnostics (col-span 4) */}
        <div className="lg:col-span-4">
          <QuickAllocationCard />
        </div>
      </div>

      {/* Main Sessions Table list */}
      <ScheduledSessionsTable />

    </div>
  );
}
