import { Download, BarChart2, Copy, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface BroadcastLog {
  id: string;
  code: string;
  subject: string;
  targeting: string;
  date: string;
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
}

const mockLogs: BroadcastLog[] = [
  {
    id: '1',
    code: 'BC-9901',
    subject: 'Fall 2024 Enrollment Open',
    targeting: 'All Candidates',
    date: 'Oct 12, 2023',
    status: 'SENT',
  },
  {
    id: '2',
    code: 'BC-9884',
    subject: 'Lab Safety Policy Guidelines',
    targeting: 'Engineering Dept',
    date: 'Oct 14, 2023',
    status: 'SCHEDULED',
  },
  {
    id: '3',
    code: 'BC-9872',
    subject: 'Alumni Gala Invitation',
    targeting: 'Selected Programs',
    date: 'Draft',
    status: 'DRAFT',
  },
  {
    id: '4',
    code: 'BC-9850',
    subject: 'Quarterly Tuition Fees Notice',
    targeting: 'Payment Pending',
    date: 'Oct 05, 2023',
    status: 'SENT',
  },
];

export default function RecentBroadcasts() {
  const getStatusBadge = (status: 'SENT' | 'SCHEDULED' | 'DRAFT') => {
    const base = 'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider';
    switch (status) {
      case 'SENT':
        return `${base} bg-secondary-container text-secondary`;
      case 'SCHEDULED':
        return `${base} bg-yellow-100 text-yellow-700`;
      case 'DRAFT':
        return `${base} bg-slate-100 text-slate-600`;
      default:
        return `${base} bg-slate-100 text-slate-600`;
    }
  };

  const handleExportLogs = () => {
    const csv = ['Code,Subject,Targeting,Date,Status', ...mockLogs.map((l) => `"${l.code}","${l.subject}","${l.targeting}","${l.date}","${l.status}"`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'broadcast-logs.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Broadcast logs exported as CSV');
  };

  const handleAction = (action: string, code: string) => {
    toast.success(`${action} action triggered on broadcast ${code}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm flex flex-col relative min-h-[480px]">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-md font-headline font-bold text-primary">Recent Broadcasts</h3>
        <button 
          onClick={handleExportLogs}
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <Download className="w-3.5 h-3.5" />
          Export Logs
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/10 pb-3">
              <th className="pb-3 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Broadcast & Subject</th>
              <th className="pb-3 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Targeting</th>
              <th className="pb-3 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Date</th>
              <th className="pb-3 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
              <th className="pb-3 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {mockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono text-on-surface-variant/70 uppercase">{log.code}</p>
                    <p className="text-sm font-bold text-primary max-w-[200px] truncate" title={log.subject}>
                      {log.subject}
                    </p>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-xs font-bold text-on-surface-variant/80 bg-surface-container px-2.5 py-1 rounded">
                    {log.targeting}
                  </span>
                </td>
                <td className="py-4 text-xs font-semibold text-on-surface-variant">
                  {log.date}
                </td>
                <td className="py-4">
                  <span className={getStatusBadge(log.status)}>
                    {log.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    {log.status === 'SENT' ? (
                      <>
                        <button 
                          onClick={() => handleAction('View Analytics', log.code)}
                          className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Analytics"
                        >
                          <BarChart2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('Duplicate', log.code)}
                          className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleAction('Edit', log.code)}
                          className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {log.status === 'DRAFT' ? (
                          <button 
                            onClick={() => handleAction('Delete', log.code)}
                            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAction('Duplicate', log.code)}
                            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-slate-100 rounded transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer view history */}
      <div className="pt-4 border-t border-outline-variant/10 text-center">
        <button 
          onClick={() => handleAction('View All History', 'LOGS')}
          className="text-xs font-bold text-primary hover:underline"
        >
          View All History
        </button>
      </div>

      {/* Floating Plus Action Button */}
      <button 
        onClick={() => handleAction('Create Quick Draft', 'DRAFT')}
        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-secondary text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        title="Quick Broadcast Draft"
      >
        <Plus className="w-6 h-6" />
      </button>

    </div>
  );
}
