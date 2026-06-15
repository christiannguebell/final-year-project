import { Link, useNavigate } from 'react-router-dom';
import {
  Edit3,
  Download,
  CheckCircle2,
  Clock,
  Calendar,
  ArrowRight,
  CreditCard,
  Library,
  Mail,
  ExternalLink,
} from 'lucide-react';
import TopNav from '../../components/layout/TopNav';
import Sidebar from '../../components/layout/Sidebar';
import PortalFooter from '../../components/layout/PortalFooter';
import { cn } from '../../lib/utils';
import { useAuth } from '../../providers';
import { useDownloadAdmissionSlip } from '../../hooks/useDownloads';
import { useUnreadNotificationCount } from '../../hooks/useNotifications';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const downloadSlip = useDownloadAdmissionSlip();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const quickActions = [
    { icon: CreditCard, title: 'Payment History', desc: 'View receipts and pending dues.', path: '/payments' },
    { icon: Library, title: 'Prep Resources', desc: 'Access sample papers and syllabus.', path: '/exams' },
    { icon: Mail, title: 'Messages', desc: `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`, path: '/notifications' },
  ];

  const handleSyncCalendar = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'SUMMARY:SEAS Application Deadline',
      'DTSTART:20241031',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'seas-deadlines.ics';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Calendar file downloaded');
  };

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <Sidebar />

      <main className="ml-64 pt-24 pb-12 px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-primary">
                Welcome back, {user?.firstName || 'Candidate'}.
              </h1>
              <p className="mt-2 text-lg text-on-surface-variant">
                Track your engineering journey and upcoming milestones.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/application/new"
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:bg-primary-container active:scale-95"
              >
                <Edit3 className="h-4 w-4" />
                Complete Application
              </Link>
              <button
                type="button"
                onClick={() => downloadSlip.mutate()}
                disabled={downloadSlip.isPending}
                className="flex items-center gap-2 rounded-lg border border-outline-variant px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-low active:scale-95 disabled:opacity-60"
              >
                <Download className="h-4 w-4" />
                {downloadSlip.isPending ? 'Downloading...' : 'Admission Slip'}
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="relative overflow-hidden rounded-xl bg-white p-8 shadow-[0px_8px_24px_rgba(25,28,30,0.06)] md:col-span-8">
              <div className="absolute top-0 right-0 p-6">
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-secondary">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                  <span className="text-xs font-bold tracking-wider uppercase">Status: In Review</span>
                </div>
              </div>

              <h3 className="mb-6 text-xl font-bold text-primary">M.S. Structural Engineering</h3>

              <div className="space-y-8">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="mb-1 text-sm text-on-surface-variant">Completion Progress</p>
                    <p className="text-3xl font-bold text-primary">85%</p>
                  </div>
                  <p className="text-sm font-medium text-on-surface-variant">2 tasks remaining</p>
                </div>

                <div className="flex h-3 gap-1.5">
                  <div className="flex-1 rounded-full bg-secondary" />
                  <div className="flex-1 rounded-full bg-secondary" />
                  <div className="flex-1 rounded-full bg-secondary" />
                  <div className="flex-1 rounded-full bg-primary" />
                  <div className="flex-1 rounded-full bg-outline-variant/30" />
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg border border-transparent bg-surface-container-low p-4 transition-colors hover:border-secondary/20">
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-xs font-bold text-primary">Academic Transcripts</p>
                      <p className="text-[11px] text-on-surface-variant">Verified on Oct 12</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-transparent bg-surface-container-low p-4 transition-colors hover:border-primary/20">
                    <Clock className="h-5 w-5 text-on-surface-variant" />
                    <div>
                      <p className="text-xs font-bold text-primary">Reference Letters</p>
                      <p className="text-[11px] text-on-surface-variant">1 of 2 Received</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl bg-primary p-8 text-white shadow-lg md:col-span-4">
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Deadlines</h3>
                  <Calendar className="h-5 w-5 opacity-50" />
                </div>
                <div className="space-y-6">
                  {[
                    { date: 'October 31, 2024', title: 'Final Submission Window Closes', active: true },
                    { date: 'November 15, 2024', title: 'Entrance Exam (Phase I)' },
                    { date: 'December 05, 2024', title: 'Interview Shortlist Announcement' },
                  ].map((deadline, i) => (
                    <div
                      key={i}
                      className={cn('border-l-2 pl-4', deadline.active ? 'border-secondary' : 'border-outline-variant/30')}
                    >
                      <p className="text-xs font-medium text-white/70">{deadline.date}</p>
                      <p className="mt-1 text-sm font-bold">{deadline.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSyncCalendar}
                className="group mt-8 flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-transform hover:translate-x-1"
              >
                Sync to Calendar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:col-span-12">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className="group cursor-pointer rounded-xl border border-transparent bg-surface-container-low p-6 text-left transition-all duration-300 hover:border-outline-variant/10 hover:bg-white hover:shadow-[0px_8px_24px_rgba(25,28,30,0.06)]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition-colors group-hover:bg-primary group-hover:text-white">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-primary">{action.title}</h4>
                  <p className="mt-1 text-xs text-on-surface-variant">{action.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-4 md:col-span-12">
              <div className="flex flex-col items-center gap-10 overflow-hidden rounded-xl bg-surface-container-high p-8 md:flex-row">
                <div className="w-full shrink-0 md:w-1/3">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvuQ8U0lqLIv4Lao04LQEIyTtzLQO-xJR4yJo6o9HZQB5jm0PTXOkRXfsBEnT8s3WHHhd1T8HP87lSphL18Lr1-veDsDupgqeprhBkMH-jStJDqSIuUMRFytuIJaO0mHpDKAD-5Dn574BM9eIGm99Glk3NYoT4x_SxjlYcqvt-dripThKalFfZwR08563YrPgbBKL5Mrn4QW74MrB10_CmZmzR90jYoUO2gjoGut0LitJoKUqR2JH-H7xdCZ05meceNpZGJSwZ2Ew3"
                    alt="Engineering lab"
                    className="aspect-video w-full rounded-lg object-cover shadow-md transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">
                    Institution Spotlight
                  </span>
                  <h3 className="text-2xl font-extrabold text-primary">New Precision Engineering Hub</h3>
                  <p className="leading-relaxed text-on-surface-variant">
                    Our newly inaugurated hub at the SEAS campus offers candidates an early glimpse into the
                    state-of-the-art facilities available for the upcoming academic year.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/programs')}
                    className="group inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                  >
                    Learn about our facilities
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PortalFooter />
    </div>
  );
}
