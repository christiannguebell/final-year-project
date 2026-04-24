import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  name: string;
  action: string;
  target: string;
  time: string;
  avatar?: string;
  icon?: LucideIcon;
  statusColor?: string;
}

export function ActivityItem({ name, action, target, time, avatar, icon: Icon, statusColor = 'border-primary' }: ActivityItemProps) {
  return (
    <div className="relative flex items-start gap-4">
      <div className={cn('w-10 h-10 rounded-full bg-white border-2 z-10 flex items-center justify-center overflow-hidden', statusColor)}>
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : Icon ? (
          <div className="w-5 h-5 flex items-center justify-center text-on-surface-variant">
            <Icon />
          </div>
        ) : null}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-primary leading-tight">
          {name} <span className="font-medium text-on-surface-variant">{action}</span> {target}
        </p>
        <p className="text-[11px] text-slate-400 mt-1 font-medium">{time}</p>
      </div>
    </div>
  );
}
