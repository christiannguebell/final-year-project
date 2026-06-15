import { Check } from 'lucide-react';

interface NotificationHeaderProps {
  onMarkAllRead: () => void;
}

export default function NotificationHeader({ onMarkAllRead }: NotificationHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-primary font-headline">Notifications</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Manage your academic updates and application progress.
        </p>
      </div>
      <button
        onClick={onMarkAllRead}
        className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-200 mt-1"
      >
        <Check className="w-4 h-4" />
        Mark all as read
      </button>
    </div>
  );
}
