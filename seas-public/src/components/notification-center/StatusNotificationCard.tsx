import { CheckCircle2 } from 'lucide-react';

interface StatusNotificationCardProps {
  title: string;
  timeAgo: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
}

export default function StatusNotificationCard({
  title,
  timeAgo,
  description,
  ctaLabel,
  ctaHref = '#',
}: StatusNotificationCardProps) {
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-[0px_4px_16px_rgba(25,28,30,0.06)] border border-outline-variant/20 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4">
        {/* Green check icon */}
        <div className="w-11 h-11 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 text-secondary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-primary font-headline">{title}</h3>
            <span className="text-xs text-on-surface-variant ml-3 flex-shrink-0">{timeAgo}</span>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed mb-3">{description}</p>
          <a
            href={ctaHref}
            className="inline-flex items-center gap-1 text-sm font-bold text-secondary hover:text-secondary/80 transition-colors duration-200"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
