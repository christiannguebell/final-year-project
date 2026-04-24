import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatSummaryCardProps {
  label: string;
  value: string | number;
  subValue: string;
  icon: LucideIcon;
  theme?: 'primary' | 'low';
}

export function StatSummaryCard({ label, value, subValue, icon: Icon, theme = 'low' }: StatSummaryCardProps) {
  return (
    <div className={cn(
      'p-6 rounded-xl relative overflow-hidden group architect-card border-none',
      theme === 'primary' ? 'bg-primary text-white' : 'bg-surface-container-low'
    )}>
      <div className="relative z-10">
        <p className={cn(
          'text-[10px] font-bold uppercase tracking-widest mb-1',
          theme === 'primary' ? 'text-blue-200' : 'text-on-surface-variant'
        )}>{label}</p>
        <h3 className={cn(
          'text-4xl font-headline font-black',
          theme === 'primary' ? 'text-white' : 'text-primary'
        )}>{value}</h3>
        <div className={cn(
          'mt-4 flex items-center gap-2 text-xs font-bold',
          theme === 'primary' ? 'text-secondary-fixed' : 'text-primary/60'
        )}>
          <Icon className="w-4 h-4" />
          <span>{subValue}</span>
        </div>
      </div>
      <Icon className={cn(
        'absolute -right-4 -bottom-4 w-32 h-32 transition-transform group-hover:scale-110',
        theme === 'primary' ? 'text-white/5' : 'text-primary/5'
      )} />
    </div>
  );
}
