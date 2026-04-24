import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'up' | 'down' | 'stable' | 'critical';
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  borderColor?: string;
}

export function StatCard({ label, value, trend, trendType = 'stable', icon: Icon, iconBg, iconColor, borderColor }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn('architect-card p-6 border-b-2', borderColor)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{label}</p>
          <h3 className="text-3xl font-headline font-extrabold text-primary mt-1">{value}</h3>
          {trend && (
            <p className={cn(
              'text-xs font-bold mt-2 flex items-center gap-1',
              trendType === 'up' ? 'text-secondary' : trendType === 'critical' ? 'text-error' : 'text-on-surface-variant'
            )}>
              {trendType === 'up' && <TrendingUp className="w-3 h-3" />}
              {trendType === 'critical' && <AlertCircle className="w-3 h-3" />}
              {trendType === 'stable' && <Minus className="w-3 h-3" />}
              {trend}
            </p>
          )}
        </div>
        <div className={cn('w-12 h-12 flex items-center justify-center rounded-lg', iconBg)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 11L5 7L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 5H11V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Minus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 3V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="6" cy="8.5" r="0.5" fill="currentColor"/>
    </svg>
  );
}
