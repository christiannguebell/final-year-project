import { useEffect, useState } from 'react';
import { Download, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useResults } from '@/hooks/useResults';

interface CandidateScore {
  id: string;
  applicationId: string;
  name: string;
  candidateId: string;
  avatar: string;
  math: string;
  physics: string;
  chemistry: string;
  status: 'VALIDATED' | 'PENDING' | 'DATA_ERROR';
}

interface ManualScoreTableProps {
  onValidatedScoresChange?: (entries: Array<{ applicationId: string; scores: Array<{ subject: string; score: number }> }>) => void;
}

export default function ManualScoreTable({ onValidatedScoresChange }: ManualScoreTableProps) {
  const { data: results = [], isLoading } = useResults();
  const [candidates, setCandidates] = useState<CandidateScore[]>([]);

  useEffect(() => {
    const mapped = (results as Array<Record<string, unknown>>).map((result) => {
      const application = result.application as { candidate?: { firstName?: string; lastName?: string; candidateNumber?: string } } | undefined;
      const scores = (result.scores as Array<{ subject: string; score?: number }>) ?? [];
      const findScore = (subject: string) => scores.find((s) => s.subject.toLowerCase().includes(subject))?.score?.toString() ?? '';
      const name = application?.candidate
        ? `${application.candidate.firstName ?? ''} ${application.candidate.lastName ?? ''}`.trim()
        : 'Candidate';
      return {
        id: String(result.id),
        applicationId: String(result.applicationId),
        name: name || 'Candidate',
        candidateId: application?.candidate?.candidateNumber ?? String(result.applicationId).slice(0, 8),
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        math: findScore('math'),
        physics: findScore('phys'),
        chemistry: findScore('chem'),
        status: 'PENDING' as const,
      };
    });
    setCandidates(mapped.map((c) => ({ ...c, status: determineStatus(c.math, c.physics, c.chemistry) })));
  }, [results]);

  useEffect(() => {
    if (!onValidatedScoresChange) return;
    const validated = candidates
      .filter((c) => c.status === 'VALIDATED')
      .map((c) => ({
        applicationId: c.applicationId,
        scores: [
          { subject: 'Mathematics', score: parseFloat(c.math) },
          { subject: 'Physics', score: parseFloat(c.physics) },
          { subject: 'Chemistry', score: parseFloat(c.chemistry) },
        ],
      }));
    onValidatedScoresChange(validated);
  }, [candidates, onValidatedScoresChange]);

  const determineStatus = (math: string, physics: string, chemistry: string): 'VALIDATED' | 'PENDING' | 'DATA_ERROR' => {
    const vals = [math, physics, chemistry];
    
    // Check if any is invalid (non-numeric, or outside 0-100 range)
    for (const val of vals) {
      if (val === '') continue; // Empty is fine for pending
      const num = parseFloat(val);
      if (isNaN(num) || num < 0 || num > 100) {
        return 'DATA_ERROR';
      }
    }

    // Check if all are entered
    if (math !== '' && physics !== '' && chemistry !== '') {
      return 'VALIDATED';
    }

    return 'PENDING';
  };

  const handleScoreChange = (id: string, subject: 'math' | 'physics' | 'chemistry', value: string) => {
    // Basic formatting filter to allow numbers and single dot
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;

    setCandidates(prev => prev.map(cand => {
      if (cand.id === id) {
        const updated = { ...cand, [subject]: value };
        updated.status = determineStatus(updated.math, updated.physics, updated.chemistry);
        return updated;
      }
      return cand;
    }));
  };

  const handleAddRow = () => {
    const newId = String(candidates.length + 1);
    const newCand: CandidateScore = {
      id: newId,
      applicationId: '',
      name: `Candidate ${newId}`,
      candidateId: `SEAS-2024-00${Math.floor(100 + Math.random() * 900)}`,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      math: '',
      physics: '',
      chemistry: '',
      status: 'PENDING'
    };
    setCandidates([...candidates, newCand]);
    toast.success('New candidate row appended.');
  };

  const handleExport = () => {
    const csv = ['Candidate,Mathematics,Physics,Chemistry,Status', ...candidates.map((c) => `${c.name},${c.math},${c.physics},${c.chemistry},${c.status}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'score-entry-export.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Score spreadsheet exported');
  };

  if (isLoading) {
    return <div className="bg-white p-6 rounded-xl border">Loading results for score entry...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm space-y-6 animate-in fade-in slide-in-from-right-3 duration-300">
      
      {/* Table Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">edit_note</span>
          </div>
          <h3 className="font-headline font-bold text-lg text-primary">Manual Score Entry</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="px-4 py-2 border border-outline-variant/15 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT VIEW
          </button>
          <button 
            onClick={handleAddRow}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            ADD ROW
          </button>
        </div>
      </div>

      {/* Spreadsheet grid */}
      <div className="overflow-x-auto border border-outline-variant/15 rounded-lg">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-outline-variant/15">
              <th className="py-4 px-6 font-headline w-[250px]">Candidate Information</th>
              <th className="py-4 px-4 font-headline text-center">Mathematics</th>
              <th className="py-4 px-4 font-headline text-center">Physics</th>
              <th className="py-4 px-4 font-headline text-center">Chemistry</th>
              <th className="py-4 px-6 font-headline text-center w-[150px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {candidates.map((cand) => (
              <tr key={cand.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={cand.avatar} 
                      alt={cand.name} 
                      className="w-10 h-10 rounded-full object-cover border border-outline-variant/15 shadow-sm"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-primary">{cand.name}</h4>
                      <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">{cand.candidateId}</p>
                    </div>
                  </div>
                </td>
                
                {/* Math Score */}
                <td className="py-4 px-4 text-center">
                  <input 
                    type="text" 
                    value={cand.math} 
                    onChange={(e) => handleScoreChange(cand.id, 'math', e.target.value)}
                    placeholder="--"
                    className={`w-20 px-3 py-1.5 border rounded-lg text-center text-xs font-bold font-mono transition-all focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none ${
                      cand.math === '' 
                        ? 'bg-slate-50 text-slate-400 border-outline-variant/25'
                        : parseFloat(cand.math) < 50
                          ? 'bg-rose-50 text-rose-600 border-rose-200 focus:border-rose-400 focus:ring-rose-100'
                          : 'bg-indigo-50/50 text-indigo-700 border-indigo-200'
                    }`}
                  />
                </td>

                {/* Physics Score */}
                <td className="py-4 px-4 text-center">
                  <input 
                    type="text" 
                    value={cand.physics} 
                    onChange={(e) => handleScoreChange(cand.id, 'physics', e.target.value)}
                    placeholder="--"
                    className={`w-20 px-3 py-1.5 border rounded-lg text-center text-xs font-bold font-mono transition-all focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none ${
                      cand.physics === '' 
                        ? 'bg-slate-50 text-slate-400 border-outline-variant/25'
                        : parseFloat(cand.physics) < 50
                          ? 'bg-rose-50 text-rose-600 border-rose-200 focus:border-rose-400 focus:ring-rose-100'
                          : 'bg-indigo-50/50 text-indigo-700 border-indigo-200'
                    }`}
                  />
                </td>

                {/* Chemistry Score */}
                <td className="py-4 px-4 text-center">
                  <input 
                    type="text" 
                    value={cand.chemistry} 
                    onChange={(e) => handleScoreChange(cand.id, 'chemistry', e.target.value)}
                    placeholder="--"
                    className={`w-20 px-3 py-1.5 border rounded-lg text-center text-xs font-bold font-mono transition-all focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none ${
                      cand.chemistry === '' 
                        ? 'bg-slate-50 text-slate-400 border-outline-variant/25'
                        : parseFloat(cand.chemistry) < 50
                          ? 'bg-rose-50 text-rose-600 border-rose-200 focus:border-rose-400 focus:ring-rose-100'
                          : 'bg-indigo-50/50 text-indigo-700 border-indigo-200'
                    }`}
                  />
                </td>

                {/* Status Badge */}
                <td className="py-4 px-6 text-center">
                  <div className="flex justify-center">
                    {cand.status === 'VALIDATED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[9px] font-bold tracking-wider uppercase">
                        <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                        VALIDATED
                      </span>
                    )}
                    {cand.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[9px] font-bold tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse shrink-0" />
                        PENDING
                      </span>
                    )}
                    {cand.status === 'DATA_ERROR' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[9px] font-bold tracking-wider uppercase animate-bounce">
                        <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                        DATA ERROR
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-on-surface-variant">
        <p>Showing {candidates.length} candidate result{candidates.length === 1 ? '' : 's'}</p>
        <div className="flex items-center gap-1 font-bold">
          <button 
            disabled 
            className="w-8 h-8 border border-outline-variant/15 text-slate-400 rounded-lg flex items-center justify-center disabled:opacity-50"
          >
            &lt;
          </button>
          <button className="w-8 h-8 bg-slate-900 text-white border border-slate-900 rounded-lg flex items-center justify-center">
            1
          </button>
          <button 
            onClick={() => toast.success('Viewing page 2...')} 
            className="w-8 h-8 border border-outline-variant/15 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-center"
          >
            2
          </button>
          <button 
            onClick={() => toast.success('Viewing page 3...')} 
            className="w-8 h-8 border border-outline-variant/15 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-center"
          >
            3
          </button>
          <button 
            onClick={() => toast.success('Next page...')}
            className="w-8 h-8 border border-outline-variant/15 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-center"
          >
            &gt;
          </button>
        </div>
      </div>

    </div>
  );
}
