import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  title: string;
  subtitle: string;
  badge: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export function TaskItem({ title, subtitle, badge, icon: Icon, iconBg, iconColor }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        <div>
          <p className="font-headline text-sm font-bold text-primary">{title}</p>
          <p className="text-xs text-on-surface-variant">{subtitle}</p>
        </div>
      </div>
      <span className="text-xs font-bold bg-white text-on-surface-variant group-hover:text-primary px-3 py-1 rounded-full shadow-sm transition-colors border border-outline-variant/10">
        {badge}
      </span>
    </div>
  );
}
