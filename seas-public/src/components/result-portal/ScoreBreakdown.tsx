import { Printer } from 'lucide-react';
import { printCurrentPage } from '../../config/navigation';
import { useMyResults } from '../../hooks/useResults';

const threshold = 75;

export default function ScoreBreakdown() {
  const { data: result, isLoading, isError } = useMyResults();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8">
        <p className="text-on-surface-variant">Loading score breakdown...</p>
      </div>
    );
  }

  if (isError || !result) {
    return (
      <div className="bg-white rounded-2xl p-8">
        <h2 className="text-xl font-bold text-primary font-headline">Score Breakdown</h2>
        <p className="text-sm text-on-surface-variant mt-2">Results are not yet available.</p>
      </div>
    );
  }

  const scores = (result as { scores?: Array<{ subject: string; score?: number; maxScore?: number }> }).scores ?? [];
  const compositeScore = Number((result as { totalScore?: number }).totalScore ?? result.score ?? 0);

  return (
    <div className="bg-white rounded-2xl shadow-[0px_8px_24px_rgba(25,28,30,0.06)] overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-xl font-bold text-primary font-headline">Score Breakdown</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Detailed performance across core technical competencies.
            </p>
          </div>
          <button
            type="button"
            onClick={printCurrentPage}
            className="flex items-center gap-2 rounded-lg border border-outline-variant/40 px-4 py-2 text-xs font-semibold text-on-surface-variant transition-all duration-200 hover:bg-surface-container-low active:scale-95"
          >
            <Printer className="h-4 w-4" />
            Print Summary
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {scores.length === 0 ? (
            <p className="col-span-full text-sm text-on-surface-variant">No subject scores recorded yet.</p>
          ) : (
            scores.map((subject, index) => {
              const total = subject.maxScore ?? 100;
              const score = subject.score ?? 0;
              return (
                <div
                  key={`${subject.subject}-${index}`}
                  className="border border-outline-variant/25 rounded-xl p-5 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 bg-surface-container-low rounded-lg flex items-center justify-center text-base">
                      ▦
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      {subject.subject.slice(0, 6).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                    {subject.subject}
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl font-extrabold text-primary font-headline">{score}</span>
                    <span className="text-sm text-on-surface-variant font-medium">/{total}</span>
                  </div>
                  <div className="mt-3 w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${total > 0 ? (score / total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6 bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Composite Score Progress
            </span>
            <span className="text-sm font-extrabold text-secondary">{compositeScore.toFixed(1)} TOTAL</span>
          </div>

          <div className="relative">
            <div className="flex h-3 gap-1 rounded-full overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => {
                const segValue = (i + 1) * 5;
                const filled = segValue <= compositeScore;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm transition-all duration-500 ${filled ? 'bg-secondary' : 'bg-surface-container-highest'}`}
                    style={{ opacity: filled ? 1 : 0.4, transitionDelay: `${i * 30}ms` }}
                  />
                );
              })}
            </div>
            <div className="absolute -top-1 flex flex-col items-center" style={{ left: `${threshold}%` }}>
              <div className="w-0.5 h-5 bg-on-surface-variant/60" />
            </div>
          </div>

          <div className="flex justify-between mt-1.5 text-[10px] text-on-surface-variant font-medium">
            <span>0.0</span>
            <span className="relative" style={{ marginLeft: `${threshold - 10}%` }}>
              Admissions Threshold ({threshold}.0)
            </span>
            <span>100.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
