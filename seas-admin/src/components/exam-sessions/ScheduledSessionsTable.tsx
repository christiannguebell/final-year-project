import { useMemo, useState } from 'react';
import { Search, Filter, Plus, BookOpen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateExamSession, useDeleteExamSession, useExamSessions } from '@/hooks/useExams';

export default function ScheduledSessionsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', examDate: '', description: '' });
  const { data, isLoading } = useExamSessions();
  const createSession = useCreateExamSession();
  const deleteSession = useDeleteExamSession();
  const sessions = data?.items ?? [];

  const filtered = useMemo(
    () =>
      sessions.filter(
        (session) =>
          session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String((session as { description?: string }).description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [sessions, searchTerm]
  );

  const getStatusBadge = (status: string) => {
    const base = 'inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider';
    switch (status) {
      case 'scheduled':
      case 'in_progress':
        return `${base} bg-secondary-container text-secondary`;
      case 'completed':
        return `${base} bg-blue-100 text-blue-700`;
      default:
        return `${base} bg-slate-100 text-on-surface-variant/80`;
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.examDate) {
      toast.error('Name and exam date are required');
      return;
    }
    createSession.mutate(
      { name: form.name, examDate: form.examDate, description: form.description || undefined },
      {
        onSuccess: () => {
          toast.success('Exam session created');
          setShowCreate(false);
          setForm({ name: '', examDate: '', description: '' });
        },
        onError: () => toast.error('Failed to create session'),
      }
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete session "${name}"?`)) return;
    deleteSession.mutate(id, {
      onSuccess: () => toast.success('Session deleted'),
      onError: () => toast.error('Failed to delete session'),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-outline-variant/15 shadow-sm overflow-hidden flex flex-col relative min-h-[440px]">
      <div className="p-6 border-b border-outline-variant/10 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
        <h3 className="text-md font-headline font-bold text-primary">Scheduled Sessions</h3>
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sessions..."
              className="w-full bg-white border border-outline-variant/30 pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={() => toast.info('Filter by status using the session list')}
            className="p-2 bg-white border border-outline-variant/30 rounded-lg hover:bg-slate-50 transition-colors text-on-surface-variant"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        {isLoading ? (
          <p className="p-6 text-sm text-on-surface-variant">Loading sessions...</p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-outline-variant/10 text-on-surface-variant/70">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider">Session Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.map((session) => {
                const extended = session as { examDate?: string; description?: string; status?: string };
                const examDate = extended.examDate ? new Date(extended.examDate) : null;
                return (
                  <tr key={session.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center border border-outline-variant/10">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm">{session.name}</p>
                          <p className="text-xs text-on-surface-variant/70">{extended.description || 'Exam session'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={getStatusBadge(extended.status || 'scheduled')}>
                        {(extended.status || 'scheduled').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <p className="text-sm font-bold text-primary">
                        {examDate
                          ? examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Not scheduled'}
                      </p>
                      <p className="text-xs text-on-surface-variant/70 font-mono">
                        {examDate ? examDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4.5">
                      <button
                        onClick={() => handleDelete(session.id, session.name)}
                        className="p-1.5 text-on-surface-variant hover:text-error hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-outline-variant/10 flex items-center justify-between">
        <p className="text-xs text-on-surface-variant/80 font-medium">
          Showing {filtered.length} of {sessions.length} scheduled sessions
        </p>
      </div>

      <button
        onClick={() => setShowCreate(true)}
        className="absolute bottom-6 right-6 px-5 py-3 rounded-full bg-secondary text-white hover:opacity-90 active:scale-95 shadow-lg flex items-center gap-1.5 transition-all text-xs font-bold"
      >
        <Plus className="w-4 h-4" />
        Create New Session
      </button>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-primary mb-4">Create Exam Session</h3>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Session name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="datetime-local"
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.examDate}
                onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                required
              />
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2 border rounded-lg text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={createSession.isPending} className="flex-1 py-2 bg-secondary text-white rounded-lg text-sm font-bold">
                  {createSession.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
