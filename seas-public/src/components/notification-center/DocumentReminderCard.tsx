import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DocumentReminderCardProps {
  unread?: boolean;
}

export default function DocumentReminderCard({ unread = true }: DocumentReminderCardProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-[0px_4px_16px_rgba(25,28,30,0.06)] overflow-hidden transition-shadow duration-200 hover:shadow-md ${
        unread ? 'border border-outline-variant/20' : 'border border-outline-variant/10'
      }`}
    >
      {/* Red unread accent bar on left */}
      {unread && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-error rounded-l-2xl" />
      )}

      <div className="p-6 pl-8">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-11 h-11 bg-error-container/60 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-error" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-primary font-headline">
                Document Reminder
              </h3>
              <span className="text-xs text-on-surface-variant ml-4 flex-shrink-0">
                2 hours ago
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
              Mandatory document missing: Please upload your final semester transcript in the
              Document Center to avoid application withdrawal.
            </p>
            <Link
              to="/application/new"
              className="inline-flex items-center gap-1 text-sm font-bold text-error transition-colors duration-200 hover:text-error/80"
            >
              Upload Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
