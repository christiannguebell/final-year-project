import {
  LayoutDashboard,
  BarChart3,
  Trophy,
  CheckSquare,
  HelpCircle,
  LogOut,
  Download,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLogout } from '../../hooks/useAuth';
import { useDownloadResultReport } from '../../hooks/useDownloads';
import { openSupportEmail } from '../../config/navigation';

const subNavItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'Dashboard' },
  { icon: BarChart3, label: 'My Scores', id: 'Score Breakdown' },
  { icon: Trophy, label: 'Peer Ranking', id: 'Ranking' },
  { icon: CheckSquare, label: 'Final Status', id: 'Admissions' },
];

interface ResultSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ResultSidebar({ activeTab, onTabChange }: ResultSidebarProps) {
  const { mutate: logout } = useLogout();
  const downloadReport = useDownloadResultReport();

  return (
    <aside className="h-screen w-64 fixed left-0 top-16 bg-surface-container-low flex flex-col p-4 space-y-2 border-r border-outline-variant/10">
      <div className="px-4 py-5 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-extrabold text-sm font-headline">
            A
          </div>
          <div>
            <h3 className="text-primary font-headline font-bold text-sm leading-tight">
              Engineering<br />Admissions
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium mt-0.5">
              2024-25 Cycle
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {subNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.label}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out hover:translate-x-1',
                isActive
                  ? 'bg-white text-secondary shadow-sm font-bold'
                  : 'text-slate-600 hover:bg-slate-200/50 font-medium'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive && 'fill-secondary/20')} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-3">
        <button
          type="button"
          onClick={() => downloadReport.mutate()}
          disabled={downloadReport.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-primary/90 active:scale-95 disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {downloadReport.isPending ? 'Generating...' : 'Download Report'}
        </button>
      </div>

      <div className="pt-4 border-t border-outline-variant/15 space-y-1">
        <button
          type="button"
          onClick={() => openSupportEmail()}
          className="flex w-full items-center gap-3 px-4 py-3 text-slate-600 transition-all duration-200 ease-in-out hover:translate-x-1 hover:bg-slate-200/50 rounded-lg"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Support</span>
        </button>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/20 transition-all duration-200 ease-in-out hover:translate-x-1 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
