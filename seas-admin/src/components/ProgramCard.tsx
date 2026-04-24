import type { Program } from '@/types/entities';
import { cn } from '@/lib/utils';
import { Code, LayoutGrid, Edit, TrendingUp } from 'lucide-react';

interface ProgramCardProps {
  program: Program & { applicants?: number; capacity?: number; deadline?: string; department?: string };
}

export function ProgramCard({ program }: ProgramCardProps) {
  const isFull = program.applicants ? program.applicants >= (program.capacity || 100) : false;
  const progress = program.capacity ? Math.min(((program.applicants || 0) / program.capacity) * 100, 100) : 0;

  return (
    <div className="architect-card p-6 group relative overflow-hidden border ghost-border shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 bg-slate-50 hover:bg-primary hover:text-white rounded-full transition-colors">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-white transition-colors">
          {program.department === 'Computer Science' ? <Code className="w-6 h-6" /> : <LayoutGrid className="w-6 h-6" />}
        </div>
        <div>
          <h3 className="font-headline font-bold text-primary leading-tight">{program.name}</h3>
          <span className={cn(
            'px-2 py-0.5 mt-1 inline-block text-[9px] font-bold rounded uppercase tracking-wider',
            'bg-secondary-container text-on-secondary-container'
          )}>
            {program.code}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-on-surface-variant font-medium">Applicants</span>
          <span className="font-bold text-primary">{program.applicants?.toLocaleString() || 0}</span>
        </div>
        
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={cn('h-full rounded-full transition-all duration-500', isFull ? 'bg-error' : 'bg-secondary')} 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Status</div>
            <div className={cn('text-sm font-semibold', program.isActive ? 'text-secondary' : 'text-error')}>
              {program.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Created</div>
            <div className="text-sm font-semibold text-primary">
              {new Date(program.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrendingIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 11L5 7L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 5H11V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
