import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from '@/api/modules/analytics';
import { useResults, useResultsBySession } from '@/hooks/useResults';

interface CohortRow {
  id: string;
  name: string;
  subtitle: string;
  candidates: number;
  status: 'Ready' | 'Pending' | 'Missing Scores';
}

interface CohortReleaseTableProps {
  sessionId?: string;
}

export default function CohortReleaseTable({ sessionId }: CohortReleaseTableProps) {
  const queryClient = useQueryClient();
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['analytics', 'programs'],
    queryFn: () => analyticsApi.getProgramDistribution(),
  });
  const { data: allResults = [] } = useResults();
  const { data: sessionResults = [] } = useResultsBySession(sessionId ?? '');
  const results = sessionId ? sessionResults : allResults;

  const cohorts: CohortRow[] = (programs as Array<{ programId: string; programName: string; count: number }>).map((program) => {
    const programResults = (results as Array<{ application?: { programId?: string }; totalScore?: number; status?: string }>).filter(
      (r) => r.application?.programId === program.programId
    );
    const withScores = programResults.filter((r) => r.totalScore != null).length;
    let status: CohortRow['status'] = 'Pending';
    if (withScores === 0 && program.count > 0) status = 'Missing Scores';
    else if (withScores >= program.count * 0.8) status = 'Ready';

    return {
      id: program.programId,
      name: program.programName || 'Program',
      subtitle: `${withScores} scored of ${program.count}`,
      candidates: program.count,
      status,
    };
  });

  const getStatusBadge = (status: CohortRow['status']) => {
    const base = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold';
    switch (status) {
      case 'Ready':
        return `${base} bg-secondary-container text-secondary`;
      case 'Pending':
        return `${base} bg-blue-50 text-blue-700 border border-blue-200/50`;
      case 'Missing Scores':
        return `${base} bg-error-container text-error`;
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['analytics', 'programs'] });
    queryClient.invalidateQueries({ queryKey: ['results'] });
    queryClient.invalidateQueries({ queryKey: ['results', 'session', sessionId] });
    toast.success('Cohort release statuses refreshed.');
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-md font-headline font-bold text-primary">Cohort Release Status</h3>
        <button onClick={handleRefresh} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh All
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-on-surface-variant">Loading cohort data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 text-on-surface-variant/70 pb-3">
                <th className="pb-3 text-[10px] font-black uppercase tracking-wider">Department / Cohort</th>
                <th className="pb-3 text-[10px] font-black uppercase tracking-wider">Candidates</th>
                <th className="pb-3 text-[10px] font-black uppercase tracking-wider">Status</th>
                <th className="pb-3 text-[10px] font-black uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {cohorts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-sm text-on-surface-variant">
                    No program cohorts found yet.
                  </td>
                </tr>
              ) : (
                cohorts.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div>
                        <p className="font-bold text-primary text-sm">{row.name}</p>
                        <p className="text-xs text-on-surface-variant/70">{row.subtitle}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-semibold text-primary">{row.candidates.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={getStatusBadge(row.status)}>{row.status}</span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => toast.info(`${row.name}: ${row.status}`)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
