import { Clock, IdCard, Wallet } from 'lucide-react';

interface CurrentStatusCardProps {
  statusLabel: string;
  updatedAt?: string;
  referenceId?: string;
}

export default function CurrentStatusCard({ statusLabel, updatedAt, referenceId }: CurrentStatusCardProps) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-primary p-8 text-white shadow-lg">
      <div className="relative z-10">
        <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-on-primary-container uppercase">Current Status</p>
        <h3 className="mb-5 font-headline text-3xl font-extrabold tracking-tight">{statusLabel}</h3>
        <div className="flex flex-wrap items-center gap-6 text-xs font-medium opacity-90">
          {updatedAt && (
            <div className="flex items-center gap-2">
              <Clock size={16} />
              {updatedAt}
            </div>
          )}
          {referenceId && (
            <div className="flex items-center gap-2">
              <IdCard size={16} />
              ID: {referenceId}
            </div>
          )}
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 opacity-10">
        <Wallet className="h-40 w-40" />
      </div>
    </section>
  );
}
