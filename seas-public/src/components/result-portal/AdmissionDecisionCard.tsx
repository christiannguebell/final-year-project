import { CheckCircle, Download, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMyApplications } from '../../hooks/useApplications';
import { useDownloadAdmissionLetter } from '../../hooks/useDownloads';
import { useMyResults } from '../../hooks/useResults';
import type { Application } from '../../types/entities';

export default function AdmissionDecisionCard() {
  const navigate = useNavigate();
  const { data: applicationsResponse } = useMyApplications();
  const { data: result } = useMyResults();
  const payload = applicationsResponse?.data;
  const applications: Application[] = Array.isArray(payload)
    ? payload
    : (payload as { items?: Application[] } | null | undefined)?.items ?? [];
  const approvedApplication = applications.find((app) => app.status === 'approved');
  const downloadLetter = useDownloadAdmissionLetter(approvedApplication?.id);

  const ranking = {
    position: (result as { rank?: number } | undefined)?.rank ?? 0,
    total: 2500,
    percentile: result ? 'Published Result' : 'Pending Publication',
    percentileVsPeers: result ? Math.min(99.9, Number((result as { totalScore?: number }).totalScore ?? result.score ?? 0)) : 0,
  };

  const isAdmitted = result?.status === 'published' || !!approvedApplication;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div
        className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl p-8 lg:col-span-2"
        style={{ background: 'linear-gradient(135deg, #00193c 0%, #002d62 100%)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, #ffffff 1px, transparent 1px), radial-gradient(circle at 20% 80%, #046d40 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/20 px-3 py-1 text-[10px] font-bold tracking-widest text-secondary uppercase">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-secondary" />
            Official Decision
          </div>

          <h2 className="mb-4 font-headline text-3xl leading-tight font-extrabold text-white">
            {isAdmitted ? (
              <>
                CONGRATULATIONS:
                <br />
                ADMITTED
              </>
            ) : (
              'RESULTS PENDING'
            )}
          </h2>

          <p className="max-w-md text-sm leading-relaxed text-white/75">
            {isAdmitted
              ? 'We are pleased to inform you that based on your performance in the SEAS Engineering Entrance Examination, you have been granted admission to the Faculty of Engineering.'
              : 'Your results are being processed. You will receive a notification when your admission decision is published.'}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              toast.success('Offer accepted. Check your email for next steps.');
              navigate('/payments');
            }}
            className="flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-secondary/90 active:scale-95"
          >
            <CheckCircle className="h-4 w-4" />
            Accept Offer
          </button>
          <button
            type="button"
            onClick={() => downloadLetter.mutate()}
            disabled={downloadLetter.isPending || !approvedApplication}
            className="flex items-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-white/10 active:scale-95 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {downloadLetter.isPending ? 'Generating...' : 'Download Admission Letter'}
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-[0px_8px_24px_rgba(25,28,30,0.06)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-headline text-base font-bold text-primary">Global Ranking</h3>
          <TrendingUp className="h-5 w-5 text-secondary" />
        </div>

        <div className="text-center">
          <p className="font-headline text-5xl font-black tracking-tighter text-primary">
            {ranking.position > 0 ? `#${ranking.position}` : '—'}
          </p>
          <p className="mt-1 text-xs font-bold tracking-wider text-on-surface-variant uppercase">
            of {ranking.total.toLocaleString()} candidates
          </p>
        </div>

        <div className="mt-6 rounded-xl bg-secondary/10 p-4 text-center">
          <p className="text-sm font-bold text-secondary">{ranking.percentile}</p>
          <p className="mt-1 text-xs text-on-surface-variant">
            You scored higher than {ranking.percentileVsPeers}% of peers
          </p>
        </div>
      </div>
    </div>
  );
}
