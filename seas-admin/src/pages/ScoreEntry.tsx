import { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

import BulkUploadZone from '@/components/score-entry/BulkUploadZone';
import ManualScoreTable from '@/components/score-entry/ManualScoreTable';
import ScoreEntryStats from '@/components/score-entry/ScoreEntryStats';
import ConfirmSubmissionModal from '@/components/score-entry/ConfirmSubmissionModal';
import { useEnterScores } from '@/hooks/useResults';

export default function ScoreEntry() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingScores, setPendingScores] = useState<Array<{ applicationId: string; scores: Array<{ subject: string; score: number }> }>>([]);
  const enterScores = useEnterScores();

  const handleCommitChanges = () => {
    const committable = pendingScores.filter((s) => s.applicationId !== '');
    const skipped = pendingScores.length - committable.length;
    if (committable.length === 0) {
      toast.error(skipped > 0 ? 'Manually added rows have no application linked. Use the Excel template upload instead, or ensure candidates have existing results.' : 'No validated scores to commit. Enter scores in the table first.');
      return;
    }
    if (skipped > 0) {
      toast.warning(`${skipped} manually added row(s) skipped — no application linked. ${committable.length} row(s) will be committed.`);
    }
    setIsModalOpen(true);
  };

  const handleConfirmSubmission = async () => {
    const toCommit = pendingScores.filter((s) => s.applicationId !== '');
    let successCount = 0;
    const errors: string[] = [];
    for (const entry of toCommit) {
      try {
        await enterScores.mutateAsync(entry);
        successCount++;
      } catch (err: any) {
        errors.push(`${entry.applicationId.slice(0, 8)}: ${err?.response?.data?.message || err?.message || 'Unknown error'}`);
      }
    }
    setIsModalOpen(false);
    setPendingScores([]);
    if (successCount > 0) {
      toast.success(`Successfully saved ${successCount} score entr${successCount === 1 ? 'y' : 'ies'}!`);
    }
    if (errors.length > 0) {
      toast.error(`Failed to commit ${errors.length} row(s): ${errors.join('; ')}`);
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-wrap justify-between items-center gap-6 bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
            Score Entry Management
          </h2>
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
            Undergraduate Engineering Entrance Examination Cycle
          </p>
        </div>

        <div>
          <button
            onClick={handleCommitChanges}
            disabled={enterScores.isPending}
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider flex items-center gap-2 rounded-lg shadow transition-all uppercase disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {enterScores.isPending ? 'Saving...' : 'Commit Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-4 h-full">
          <BulkUploadZone />
        </div>
        <div className="lg:col-span-8 h-full">
          <ManualScoreTable onValidatedScoresChange={setPendingScores} />
        </div>
      </div>

      <ScoreEntryStats />

      <ConfirmSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmission}
        isLoading={enterScores.isPending}
        entryCount={pendingScores.filter(s => s.applicationId !== '').length}
        subjectList={[...new Set(pendingScores.flatMap(s => s.scores.map(sc => sc.subject)))]}
      />
    </div>
  );
}
