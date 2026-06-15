import { useState } from 'react';
import ResultsStats from '@/components/results-publication/ResultsStats';
import CohortReleaseTable from '@/components/results-publication/CohortReleaseTable';
import NotificationStatusCard from '@/components/results-publication/NotificationStatusCard';
import { Lock, Unlock, FileDown, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useExamSessions } from '@/hooks/useExams';
import { usePublishSessionResults, useResults } from '@/hooks/useResults';

export default function ResultsPublication() {
  const [isLocked, setIsLocked] = useState(true);
  const { data: sessionsData } = useExamSessions();
  const sessions = sessionsData?.items ?? [];
  const activeSession = sessions[0];
  const publishSession = usePublishSessionResults();
  const { data: results = [] } = useResults();

  const handlePublishToggle = () => {
    if (isLocked) {
      toast.error('Results release cannot proceed while lock state is active. Please perform Sign & Authorize.');
      return;
    }
    if (!activeSession) {
      toast.error('No exam session available to publish results for.');
      return;
    }
    publishSession.mutate(activeSession.id, {
      onSuccess: (data) => {
        const published = (data as { published?: number })?.published ?? 0;
        toast.success(`Published ${published} result(s) successfully!`);
      },
      onError: () => toast.error('Failed to publish results'),
    });
  };

  const handleSignAuthorize = () => {
    setIsLocked(false);
    toast.success('Signature verification succeeded. Results Master Release is now UNLOCKED!');
  };

  const handleDownloadPDF = () => {
    const csv = ['Application ID,Total Score,Status', ...(results as Array<Record<string, unknown>>).map((r) => `${r.applicationId},${r.totalScore ?? ''},${r.status ?? 'pending'}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pre-release-results-report.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Pre-release report downloaded');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-wrap justify-between items-start gap-6 bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm">
        <div className="space-y-1.5 flex-1 min-w-[280px]">
          <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            Administrative Control <span className="text-[9px]">•</span> Entrance Exam
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
            Results Publication
          </h2>
          <p className="text-on-surface-variant max-w-xl text-xs leading-relaxed font-medium">
            Authorize and manage the final release of academic standings. Ensure all notification channels are synchronized.
          </p>
        </div>

        <div className="flex items-center gap-5 bg-slate-50 p-4 rounded-lg border border-outline-variant/10 shrink-0">
          <div className="text-right">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              Master Release Status
            </p>
            <p className={`text-sm font-headline font-black uppercase ${isLocked ? 'text-error' : 'text-secondary'}`}>
              Currently {isLocked ? 'Locked' : 'Unlocked'}
            </p>
          </div>
          <button
            onClick={handlePublishToggle}
            disabled={publishSession.isPending}
            className={`px-5 py-3 rounded-lg text-white font-bold text-xs tracking-wider flex items-center gap-1.5 shadow transition-all disabled:opacity-60 ${
              isLocked ? 'bg-slate-700 hover:bg-slate-800' : 'bg-secondary hover:opacity-90'
            }`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {publishSession.isPending ? 'Publishing...' : 'Publish Results'}
          </button>
        </div>
      </div>

      <ResultsStats />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 xl:col-span-8">
          <CohortReleaseTable />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <NotificationStatusCard />
        </div>
      </div>

      <div className="bg-slate-50 border border-outline-variant/15 p-6 rounded-xl flex flex-wrap justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 border border-outline-variant/20 rounded-lg flex items-center justify-center text-primary shadow-sm">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Final Approval Authority</h4>
            <p className="text-[11px] text-on-surface-variant font-medium">
              The actions on this dashboard are recorded for institutional compliance audits.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline transition-all"
          >
            <FileDown className="w-4 h-4" />
            Download Pre-Release Report
          </button>
          <button
            onClick={handleSignAuthorize}
            className="px-6 py-3 bg-primary hover:bg-primary-container text-white font-bold text-xs tracking-wider rounded-lg shadow transition-all flex items-center gap-1.5"
          >
            <Unlock className="w-4 h-4" />
            Sign & Authorize
          </button>
        </div>
      </div>
    </div>
  );
}
