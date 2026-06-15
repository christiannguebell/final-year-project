import { Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { openSupportEmail } from '../../config/navigation';

export default function NotificationSupportBanner() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-outline-variant/15 bg-surface-container-low px-8 py-10 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
        <Headphones className="h-7 w-7 text-primary" />
      </div>

      <h3 className="mb-2 font-headline text-lg font-bold text-primary">Questions about your alerts?</h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-on-surface-variant">
        Our admissions technical team is available 24/7 to assist with document uploads or payment
        verification issues.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => openSupportEmail('Notification Support')}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-primary/90 active:scale-95"
        >
          Contact Support
        </button>
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-lg border border-outline-variant/40 px-6 py-2.5 text-sm font-semibold text-on-surface-variant transition-all duration-200 hover:bg-white active:scale-95"
        >
          Notification Settings
        </Link>
      </div>
    </div>
  );
}
