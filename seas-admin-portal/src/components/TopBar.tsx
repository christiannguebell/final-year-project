import React from 'react';
import { Bell, Settings, Search, HelpCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface TopBarProps {
  activeView: 'payments' | 'admissions';
  setView: (view: 'payments' | 'admissions') => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeView, setView }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 border-b border-slate-200/10">
      <div className="flex items-center gap-12">
        <span className="text-xl font-bold font-headline text-primary">
          {activeView === 'payments' ? 'SEAS Admin' : 'Academic Review System'}
        </span>
        
        <div className="hidden md:flex gap-8 items-center">
          <NavLink 
            label="Dashboard" 
            active={false} 
            onClick={() => setView('payments')} 
          />
          <NavLink 
            label={activeView === 'payments' ? "Exams" : "Analytics"} 
            active={false} 
          />
          <NavLink 
            label={activeView === 'payments' ? "Payments" : "Queue"} 
            active={true} 
            onClick={() => setView(activeView === 'payments' ? 'payments' : 'admissions')}
          />
          <NavLink 
            label={activeView === 'payments' ? "Students" : "Archive"} 
            active={false} 
            onClick={() => setView('admissions')}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-100 transition-all rounded-full text-slate-500">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-slate-100 transition-all rounded-full text-slate-500">
          <Settings size={20} />
        </button>
        {activeView === 'admissions' && (
          <button className="p-2 hover:bg-slate-100 transition-all rounded-full text-slate-500">
            <HelpCircle size={20} />
          </button>
        )}
        
        {activeView === 'payments' ? (
          <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-white shadow-sm">
            <img 
              alt="Profile" 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <button className="bg-secondary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-secondary/20 hover:opacity-90 active:scale-95 transition-all">
            Submit Decision
          </button>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ label, active, onClick }: { label: string, active: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "text-sm font-headline font-semibold tracking-tight transition-colors pb-1",
      active 
        ? "text-secondary border-b-2 border-secondary" 
        : "text-slate-500 hover:text-primary"
    )}
  >
    {label}
  </button>
);
