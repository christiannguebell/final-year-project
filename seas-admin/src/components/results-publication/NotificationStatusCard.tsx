import { Mail, MessageSquare, Globe } from 'lucide-react';

export default function NotificationStatusCard() {
  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant/15 shadow-sm flex flex-col space-y-6">
      
      {/* Title */}
      <div>
        <h3 className="text-md font-headline font-bold text-primary">Notification Status</h3>
        <p className="text-xs text-on-surface-variant/70 mt-1 leading-normal">
          Real-time delivery tracking for automated release alerts.
        </p>
      </div>

      {/* Lists */}
      <div className="space-y-4">
        {/* Emails */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5 text-primary">
              <Mail className="w-4 h-4 text-on-surface-variant/80" /> Emails
            </span>
            <span className="text-secondary">Sent</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
          <p className="text-[10px] text-on-surface-variant/70 text-right">
            2,690 of 2,690 Delivered
          </p>
        </div>

        {/* SMS */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5 text-primary">
              <MessageSquare className="w-4 h-4 text-on-surface-variant/80" /> SMS Gateway
            </span>
            <span className="text-blue-700">Queued</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '67%' }}></div>
          </div>
          <p className="text-[10px] text-on-surface-variant/70 text-right">
            1,800 of 2,690 Pending Approval
          </p>
        </div>

        {/* Webhooks */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="flex items-center gap-1.5 text-primary">
              <Globe className="w-4 h-4 text-on-surface-variant/80" /> API Webhooks
            </span>
            <span className="text-on-surface-variant/50">Inactive</span>
          </div>
        </div>
      </div>



    </div>
  );
}
