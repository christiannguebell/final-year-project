import { useMemo } from 'react';
import { BarChart3, CheckCircle, Award } from 'lucide-react';
import { useResults } from '@/hooks/useResults';

export default function ResultsStats() {
  const { data: results = [] } = useResults();

  const { meanScore, passRate, topScore } = useMemo(() => {
    const rows = results as Array<{ totalScore?: number; status?: string }>;
    const scored = rows.filter((r) => r.totalScore != null);
    const mean = scored.length ? scored.reduce((s, r) => s + (r.totalScore ?? 0), 0) / scored.length : 0;
    const passed = scored.filter((r) => (r.totalScore ?? 0) >= 75).length;
    const pass = scored.length ? (passed / scored.length) * 100 : 0;
    const top = scored.reduce((max, r) => Math.max(max, r.totalScore ?? 0), 0);
    return { meanScore: mean, passRate: pass, topScore: top };
  }, [results]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Global Mean Score</p>
            <h3 className="text-3xl font-headline font-black text-primary mb-2">{meanScore.toFixed(1)}</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/15 text-secondary border border-secondary/20">
              From {results.length} records
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Overall Pass Rate</p>
            <h3 className="text-3xl font-headline font-black text-primary mb-2">{passRate.toFixed(1)}%</h3>
            <span className="text-[10px] font-semibold text-on-surface-variant/80">Threshold: 75.0</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-primary-container text-white p-6 rounded-xl relative overflow-hidden shadow-lg group">
        <div className="absolute right-[-10%] top-[-10%] opacity-5">
          <Award className="w-24 h-24 text-white" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">Top Score</p>
        <h3 className="text-xl font-headline font-black text-white mb-2">
          Highest: <span className="text-secondary-container font-headline font-black">{topScore.toFixed(1)} pts</span>
        </h3>
        <p className="text-[10px] text-blue-300 font-medium">Live data from published and pending results.</p>
      </div>
    </div>
  );
}
