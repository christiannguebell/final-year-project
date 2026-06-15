import NotificationTopNav from '../../components/notification-center/NotificationTopNav';
import NotificationSidebar from '../../components/notification-center/NotificationSidebar';
import NotificationHeader from '../../components/notification-center/NotificationHeader';
import EarlierNotificationRow from '../../components/notification-center/EarlierNotificationRow';
import NotificationSupportBanner from '../../components/notification-center/NotificationSupportBanner';
import PortalFooter from '../../components/layout/PortalFooter';
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from '../../hooks/useNotifications';
import type { Notification } from '../../types/entities';

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

function getNotificationLink(notification: Notification) {
  switch (notification.type) {
    case 'payment':
      return '/payments';
    case 'exam':
      return '/exams';
    case 'result':
      return '/results';
    case 'application':
      return '/applications';
    default:
      return '/dashboard';
  }
}

export default function NotificationCenterPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAllRead = useMarkAllNotificationsAsRead();
  const markRead = useMarkNotificationAsRead();

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  function handleMarkAllRead() {
    markAllRead.mutate();
  }

  function handleMarkRead(id: string) {
    markRead.mutate(id);
  }

  return (
    <div className="min-h-screen bg-surface">
      <NotificationTopNav />
      <NotificationSidebar />

      <main className="ml-64 pt-24 pb-12 px-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <NotificationHeader onMarkAllRead={handleMarkAllRead} />

          {isLoading && (
            <p className="text-sm text-on-surface-variant">Loading notifications...</p>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="bg-white rounded-2xl border border-outline-variant/15 p-8 text-center">
              <p className="text-on-surface-variant">No notifications yet.</p>
            </div>
          )}

          {unread.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-2xl shadow-[0px_4px_16px_rgba(25,28,30,0.04)] border border-primary/20 p-6"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">{formatTimeAgo(notification.createdAt)}</p>
                  <h3 className="font-bold text-primary">{notification.title}</h3>
                  <p className="text-sm text-on-surface-variant mt-2">{notification.message}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                  New
                </span>
              </div>
              <div className="mt-4 flex gap-3">
                <a
                  href={getNotificationLink(notification)}
                  className="text-xs font-bold text-secondary hover:underline"
                >
                  View Details
                </a>
                <button
                  type="button"
                  onClick={() => handleMarkRead(notification.id)}
                  className="text-xs font-bold text-on-surface-variant hover:text-primary"
                >
                  Mark as read
                </button>
              </div>
            </div>
          ))}

          {read.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-primary font-headline mb-2">Earlier</h2>
              <div className="bg-white rounded-2xl shadow-[0px_4px_16px_rgba(25,28,30,0.04)] border border-outline-variant/15 px-6 divide-y divide-outline-variant/10">
                {read.map((notification) => (
                  <EarlierNotificationRow
                    key={notification.id}
                    title={notification.title}
                    timeAgo={formatTimeAgo(notification.createdAt)}
                    ctaLabel="View"
                    ctaHref={getNotificationLink(notification)}
                  />
                ))}
              </div>
            </div>
          )}

          <NotificationSupportBanner />
        </div>
      </main>

      <div className="ml-64">
        <PortalFooter />
      </div>
    </div>
  );
}
