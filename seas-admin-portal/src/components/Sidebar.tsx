import React from 'react';
import { 
  BarChart2, 
  History, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Users, 
  CreditCard,
  Briefcase,
  HelpCircle,
  Download,
  Building2,
  Folder,
  ClipboardCheck,
  CalendarCheck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  activeView: 'payments' | 'admissions';
  onNavigate: (view: 'payments' | 'admissions') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#f8f9fb] border-r border-slate-200/50 z-40 pt-24 pb-8 px-4 flex flex-col">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Building2 size={18} />
          </div>
          <h1 className="font-headline font-extrabold tracking-tighter text-primary text-lg">
            {activeView === 'payments' ? 'SEAS Finance' : 'SEAS Admissions'}
          </h1>
        </div>
        <p className="text-xs text-slate-500 px-1 font-body">Entrance Exam Portal</p>
      </div>

      <nav className="flex-1 space-y-1">
        {activeView === 'payments' ? (
          <>
            <NavItem icon={<CreditCard size={18} />} label="Verification Queue" active />
            <NavItem icon={<History size={18} />} label="History" />
            <NavItem icon={<BarChart2 size={18} />} label="Analytics" />
            <NavItem icon={<Briefcase size={18} />} label="Refunds" />
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </>
        ) : (
          <>
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem icon={<Folder size={18} />} label="Applications" active />
            <NavItem icon={<ClipboardCheck size={18} />} label="Review Queue" />
            <NavItem icon={<CalendarCheck size={18} />} label="Interviews" />
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </>
        )}
      </nav>

      <div className="mt-auto space-y-1 pt-4 border-t border-slate-200/50">
        <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-bold text-sm mb-6 hover:opacity-90 transition-opacity shadow-lg shadow-primary/10">
          <Download size={14} />
          Export Report
        </button>
        
        {activeView === 'admissions' && (
          <div className="flex items-center gap-3 px-2 mb-4">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs font-bold text-primary">Dr. Julian Vance</p>
              <p className="text-[10px] text-on-surface-variant font-medium">Senior Registrar</p>
            </div>
          </div>
        )}

        <NavItem icon={<HelpCircle size={18} />} label="Support" />
        <NavItem icon={<LogOut size={18} />} label="Log Out" />
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <a 
    href="#"
    className={cn(
      "flex items-center gap-3 px-3 py-2 text-sm transition-all duration-200 rounded-lg group",
      active 
        ? "bg-white text-primary font-bold shadow-sm ring-1 ring-slate-200/50" 
        : "text-slate-500 hover:text-primary hover:bg-white/50"
    )}
  >
    <span className={cn("transition-colors", active ? "text-secondary" : "text-slate-400 group-hover:text-primary")}>
      {icon}
    </span>
    <span className="font-headline tracking-tight">{label}</span>
  </a>
);
