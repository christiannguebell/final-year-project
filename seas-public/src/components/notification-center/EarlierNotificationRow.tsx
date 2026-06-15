import { Info } from 'lucide-react';

interface EarlierNotificationRowProps {
  title: string;
  timeAgo: string;
  ctaLabel: string;
  ctaHref?: string;
}

export default function EarlierNotificationRow({
  title,
  timeAgo,
  ctaLabel,
  ctaHref = '#',
}: EarlierNotificationRowProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-outline-variant/15 last:border-0 group">
      {/* Info icon */}
      <div className="w-9 h-9 bg-surface-container rounded-lg flex items-center justify-center flex-shrink-0">
        <Info className="w-4 h-4 text-on-surface-variant" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary">{title}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{timeAgo}</p>
      </div>

      {/* CTA */}
      <a
        href={ctaHref}
        className="text-sm font-bold text-primary hover:text-secondary transition-colors duration-200 flex-shrink-0"
      >
        {ctaLabel}
      </a>
    </div>
  );
}
