import { CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import { PaymentStatus } from '../../types/entities';

export interface PaymentHistoryItem {
  id: string;
  title: string;
  date: string;
  transactionId?: string;
  amount: number;
  status: PaymentStatus | 'pending' | 'verified' | 'rejected';
}

interface PaymentHistoryListProps {
  payments: PaymentHistoryItem[];
}

function StatusIcon({ status }: { status: PaymentHistoryItem['status'] }) {
  const normalized = String(status).toLowerCase();
  if (normalized === 'verified') return <CheckCircle2 size={14} className="text-white" />;
  if (normalized === 'pending') return <RefreshCw size={14} className="text-white" />;
  return <XCircle size={14} className="text-error" />;
}

function statusClasses(status: PaymentHistoryItem['status']) {
  const normalized = String(status).toLowerCase();
  if (normalized === 'verified') return 'bg-secondary';
  if (normalized === 'pending') return 'bg-primary-container';
  return 'bg-error/10';
}

function statusBadgeClasses(status: PaymentHistoryItem['status']) {
  const normalized = String(status).toLowerCase();
  if (normalized === 'verified') return 'bg-secondary/10 text-secondary';
  if (normalized === 'pending') return 'bg-primary-container/10 text-primary-container';
  return 'bg-error/10 text-error';
}

export default function PaymentHistoryList({ payments }: PaymentHistoryListProps) {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-8 shadow-sm">
      <h2 className="mb-8 font-headline text-xl font-bold text-primary">Payment History</h2>

      {payments.length === 0 ? (
        <p className="text-sm text-on-surface-variant">No payments yet.</p>
      ) : (
        <div className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-outline-variant/20 before:content-['']">
          {payments.map((payment) => (
            <div key={payment.id} className="relative pl-10">
              <div
                className={`absolute top-1 left-0 z-10 flex h-6 w-6 items-center justify-center rounded-full ${statusClasses(payment.status)}`}
              >
                <StatusIcon status={payment.status} />
              </div>
              <div className={String(payment.status).toLowerCase() === PaymentStatus.REJECTED ? 'opacity-60' : ''}>
                <div className="mb-1.5 flex items-start justify-between">
                  <h4 className="text-sm font-bold text-primary">{payment.title}</h4>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${statusBadgeClasses(payment.status)}`}
                  >
                    {payment.status}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-on-surface-variant">
                  {payment.date}
                  {payment.transactionId ? ` • #${payment.transactionId}` : ''}
                </p>
                <p className="mt-2 text-sm font-bold text-primary">FCFA {payment.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
