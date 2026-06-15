import { Download, Filter } from 'lucide-react';
import { toast } from 'sonner';

export interface LogItem {
  timestamp: string;
  actionType: string;
  description: string;
  status: 'SUCCESS' | 'ROUTED' | 'ERROR';
}

interface LiveLogsProps {
  logs: LogItem[];
}

export default function LiveLogs({ logs }: LiveLogsProps) {
  const handleExportCSV = () => {
    toast.success('Downloading allocation transaction logs CSV...');
  };

  const handleFilterErrors = () => {
    toast.success('Filtering logs by ERRORS...');
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      
      {/* Title & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-headline font-bold text-base text-primary">Live Allocation Logs</h3>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleFilterErrors}
            className="px-3 py-1.5 border border-outline-variant/15 text-slate-700 hover:bg-slate-50 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5"
          >
            <Filter className="w-3 h-3 text-slate-500" />
            FILTER: ERRORS
          </button>
          <button 
            onClick={handleExportCSV}
            className="px-3 py-1.5 border border-outline-variant/15 text-slate-700 hover:bg-slate-50 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            EXPORT CSV
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto border border-outline-variant/15 rounded-lg">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-outline-variant/15">
              <th className="py-3.5 px-6 font-headline w-[120px]">Timestamp</th>
              <th className="py-3.5 px-4 font-headline w-[180px]">Action Type</th>
              <th className="py-3.5 px-4 font-headline">Description</th>
              <th className="py-3.5 px-6 font-headline text-center w-[120px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 font-mono text-[11px] font-medium text-primary">
            {logs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-6 text-on-surface-variant font-semibold">{log.timestamp}</td>
                <td className="py-3 px-4 font-bold">{log.actionType}</td>
                <td className="py-3 px-4 text-on-surface-variant font-body">{log.description}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center">
                    {log.status === 'SUCCESS' && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold tracking-wider uppercase">
                        SUCCESS
                      </span>
                    )}
                    {log.status === 'ROUTED' && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[9px] font-bold tracking-wider uppercase">
                        ROUTED
                      </span>
                    )}
                    {log.status === 'ERROR' && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[9px] font-bold tracking-wider uppercase">
                        ERROR
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
