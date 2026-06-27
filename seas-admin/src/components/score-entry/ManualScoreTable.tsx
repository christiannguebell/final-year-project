import { useEffect, useState, useRef } from 'react';
import { Download, Plus, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import { useResults } from '@/hooks/useResults';
import { useApplications } from '@/hooks/useApplications';
import { ApplicationStatus } from '@/types/entities';

interface CandidateScore {
  id: string;
  applicationId: string;
  name: string;
  candidateId: string;
  avatar: string;
  math: string;
  caseStudy: string;
  englishLanguage: string;
  status: 'VALIDATED' | 'PENDING' | 'NOT_VALIDATED';
}

interface ManualScoreTableProps {
  onValidatedScoresChange?: (entries: Array<{ applicationId: string; scores: Array<{ subject: string; score: number }> }>) => void;
}

export default function ManualScoreTable({ onValidatedScoresChange }: ManualScoreTableProps) {
  const { data: results = [], isLoading } = useResults();
  const [candidates, setCandidates] = useState<CandidateScore[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: appsData, isLoading: appsLoading } = useApplications(
    showAddModal ? { status: ApplicationStatus.APPROVED, limit: 200 } : undefined
  );
  const approvedApps = Array.isArray(appsData) ? appsData : (appsData as any)?.items ?? [];

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
        caseStudy: findScore('case'),
        englishLanguage: findScore('english'),
        status: 'PENDING' as const,
      };
    });
    setCandidates(mapped.map((c) => ({ ...c, status: determineStatus(c.math, c.caseStudy, c.englishLanguage) })));
  }, [results]);

  useEffect(() => {
    if (!onValidatedScoresChange) return;
    const validated = candidates
      .filter((c) => c.status === 'VALIDATED')
      .map((c) => ({
        applicationId: c.applicationId,
        scores: [
          { subject: 'Mathematics', score: parseFloat(c.math) },
          { subject: 'Case Study', score: parseFloat(c.caseStudy) },
          { subject: 'English Language', score: parseFloat(c.englishLanguage) },
        ],
      }));
    onValidatedScoresChange(validated);
  }, [candidates, onValidatedScoresChange]);

  const determineStatus = (math: string, caseStudy: string, englishLanguage: string): 'VALIDATED' | 'PENDING' | 'NOT_VALIDATED' => {
    const vals = [math, caseStudy, englishLanguage];
    
    for (const val of vals) {
      if (val === '') continue;
      const num = parseFloat(val);
      if (isNaN(num) || num < 10 || num > 100) {
        return 'NOT_VALIDATED';
      }
    }

    if (math !== '' && caseStudy !== '' && englishLanguage !== '') {
      return 'VALIDATED';
    }

    return 'PENDING';
  };

  const handleScoreChange = (id: string, subject: 'math' | 'caseStudy' | 'englishLanguage', value: string) => {
    // Basic formatting filter to allow numbers and single dot
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;

    setCandidates(prev => prev.map(cand => {
      if (cand.id === id) {
        const updated = { ...cand, [subject]: value };
        updated.status = determineStatus(updated.math, updated.caseStudy, updated.englishLanguage);
        return updated;
      }
      return cand;
    }));
  };

  const confirmAddRow = (application: any) => {
    const appId = application.id;
    const candidate = application.candidate as { firstName?: string; lastName?: string; candidateNumber?: string } | undefined;
    const name = candidate ? `${candidate.firstName ?? ''} ${candidate.lastName ?? ''}`.trim() : 'Unknown';
    const newId = String(Date.now());
    const newCand: CandidateScore = {
      id: newId,
      applicationId: appId,
      name: name || 'Unknown',
      candidateId: candidate?.candidateNumber ?? appId.slice(0, 8),
      avatar: '',
      math: '',
      caseStudy: '',
      englishLanguage: '',
      status: 'PENDING'
    };
    setCandidates([...candidates, newCand]);
    setShowAddModal(false);
    setSearchInput('');
    toast.success(`Row added for ${name}. Enter scores and commit to save.`);
  };

  const filteredApps = approvedApps.filter((app: any) => {
    const q = searchInput.toLowerCase();
    const c = app.candidate as { firstName?: string; lastName?: string; candidateNumber?: string } | undefined;
    const name = c ? `${c.firstName ?? ''} ${c.lastName ?? ''}`.toLowerCase() : '';
    return name.includes(q) || (c?.candidateNumber ?? '').toLowerCase().includes(q) || app.id.toLowerCase().includes(q);
  });

  const handleExport = () => {
    const csv = ['Candidate,Mathematics,Case Study,English Language,Status', ...candidates.map((c) => `${c.name},${c.math},${c.caseStudy},${c.englishLanguage},${c.status}`)].join('\n');
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
            onClick={() => { setSearchInput(''); setCandidates(prev => prev.filter(c => c.applicationId)); setShowAddModal(true); setTimeout(() => inputRef.current?.focus(), 50); }}
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
              <th className="py-4 px-4 font-headline text-center">Case Study</th>
              <th className="py-4 px-4 font-headline text-center">English Language</th>
              <th className="py-4 px-6 font-headline text-center w-[150px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {candidates.map((cand) => (
              <tr key={cand.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {cand.avatar ? (
                      <img 
                        src={cand.avatar} 
                        alt={cand.name} 
                        className="w-10 h-10 rounded-full object-cover border border-outline-variant/15 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-bold shadow-sm">
                        {cand.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-primary">{cand.name}</h4>
                      <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">{cand.candidateId}</p>
                      {!cand.applicationId && (
                        <p className="text-[9px] text-amber-600 font-bold mt-0.5">No application linked</p>
                      )}
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

                {/* Case Study Score */}
                <td className="py-4 px-4 text-center">
                  <input 
                    type="text" 
                    value={cand.caseStudy} 
                    onChange={(e) => handleScoreChange(cand.id, 'caseStudy', e.target.value)}
                    placeholder="--"
                    className={`w-20 px-3 py-1.5 border rounded-lg text-center text-xs font-bold font-mono transition-all focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none ${
                      cand.caseStudy === '' 
                        ? 'bg-slate-50 text-slate-400 border-outline-variant/25'
                        : parseFloat(cand.caseStudy) < 50
                          ? 'bg-rose-50 text-rose-600 border-rose-200 focus:border-rose-400 focus:ring-rose-100'
                          : 'bg-indigo-50/50 text-indigo-700 border-indigo-200'
                    }`}
                  />
                </td>

                {/* English Language Score */}
                <td className="py-4 px-4 text-center">
                  <input 
                    type="text" 
                    value={cand.englishLanguage} 
                    onChange={(e) => handleScoreChange(cand.id, 'englishLanguage', e.target.value)}
                    placeholder="--"
                    className={`w-20 px-3 py-1.5 border rounded-lg text-center text-xs font-bold font-mono transition-all focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none ${
                      cand.englishLanguage === '' 
                        ? 'bg-slate-50 text-slate-400 border-outline-variant/25'
                        : parseFloat(cand.englishLanguage) < 50
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
                    {cand.status === 'NOT_VALIDATED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[9px] font-bold tracking-wider uppercase">
                        <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                        NOT VALIDATED
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

      {/* Add Row Modal — Candidate Picker */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAddModal(false)}>
          <div className="bg-white p-6 rounded-xl shadow-xl border border-outline-variant/15 max-w-lg w-full mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline font-bold text-lg text-primary">Select Candidate</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, candidate number, or application ID..."
              className="w-full px-4 py-2.5 border border-outline-variant/25 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none mb-3"
            />
            <div className="overflow-y-auto flex-1 -mx-2 px-2 space-y-1">
              {appsLoading ? (
                <p className="text-xs text-on-surface-variant text-center py-8">Loading approved applications...</p>
              ) : filteredApps.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-8">No approved applications found.</p>
              ) : filteredApps.map((app: any) => {
                const c = app.candidate as { firstName?: string; lastName?: string; candidateNumber?: string } | undefined;
                const name = c ? `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() : 'Unknown';
                const alreadyAdded = candidates.some((row) => row.applicationId === app.id);
                return (
                  <button
                    key={app.id}
                    onClick={() => !alreadyAdded && confirmAddRow(app)}
                    disabled={alreadyAdded}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                      alreadyAdded
                        ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                        : 'hover:bg-indigo-50 border-outline-variant/15 hover:border-indigo-200 cursor-pointer'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-primary truncate">{name}</p>
                      <p className="text-[10px] text-on-surface-variant font-mono truncate">
                        {c?.candidateNumber ?? app.id.slice(0, 8)} {alreadyAdded ? '(already in table)' : ''}
                      </p>
                    </div>
                    <span className="ml-auto text-[9px] text-on-surface-variant/60 font-mono truncate max-w-[120px]">{app.id.slice(0, 8)}...</span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-outline-variant/10">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-outline-variant/15 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-lg transition-all">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
