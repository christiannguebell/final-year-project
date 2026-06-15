import { useMemo } from 'react';
import { useResults } from '@/hooks/useResults';

export default function ScoreEntryStats() {
  const { data: results = [] } = useResults();

  const stats = useMemo(() => {
    const rows = results as Array<{ totalScore?: number; scores?: Array<{ score?: number }> }>;
    const total = rows.length;
    const validated = rows.filter((r) => r.totalScore != null && r.totalScore > 0).length;
    const errors = rows.filter((r) => {
      const scores = r.scores ?? [];
      return scores.some((s) => s.score != null && (s.score < 0 || s.score > 100));
    }).length;
    const avgScore =
      validated > 0
        ? rows.reduce((sum, r) => sum + (r.totalScore ?? 0), 0) / validated
        : 0;

    return [
      { label: 'TOTAL ENTRIES', value: total.toLocaleString(), color: 'bg-slate-900', progress: 100 },
      { label: 'VALIDATED', value: validated.toLocaleString(), color: 'bg-emerald-600', progress: total ? (validated / total) * 100 : 0 },
      { label: 'ERRORS', value: errors.toLocaleString(), color: 'bg-rose-500', progress: total ? (errors / total) * 100 : 0 },
      { label: 'AVG SCORE', value: `${avgScore.toFixed(1)}%`, color: 'bg-indigo-600', progress: avgScore },
    ];
  }, [results]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl border border-outline-variant/15 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-headline font-extrabold text-primary tracking-tight">{stat.value}</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
            <div className={`${stat.color} h-1 rounded-full`} style={{ width: `${Math.min(stat.progress, 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
