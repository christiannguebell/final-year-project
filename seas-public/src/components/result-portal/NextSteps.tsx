import { useState } from 'react';
import { CheckCircle, FileText, ChevronRight, Calendar, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { openAdmissionsEmail } from '../../config/navigation';
import { useRequestCounselling } from '../../hooks/useDownloads';

const nextSteps = [
  {
    icon: CheckCircle,
    title: 'Fee Payment Portal',
    description: 'Deposit the initial admission fee to secure your seat before July 15th, 2024.',
    to: '/payments',
  },
  {
    icon: FileText,
    title: 'Upload Documents',
    description: 'Complete your verification by uploading high school transcripts and identity proof.',
    to: '/application/new',
  },
];

export default function NextSteps() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [topic, setTopic] = useState('');
  const requestCounselling = useRequestCounselling();

  const handleScheduleCall = () => {
    if (!showBookingForm) {
      setShowBookingForm(true);
      return;
    }

    if (!preferredDate || !preferredTime) {
      return;
    }

    requestCounselling.mutate(
      { preferredDate, preferredTime, topic: topic || undefined },
      {
        onSuccess: () => {
          setShowBookingForm(false);
          setPreferredDate('');
          setPreferredTime('');
          setTopic('');
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="mb-5 font-headline text-xl font-bold text-primary">Immediate Next Steps</h2>
        <div className="space-y-4">
          {nextSteps.map((step) => (
            <Link
              key={step.title}
              to={step.to}
              className="group flex items-start gap-4 rounded-xl border border-outline-variant/20 bg-white p-5 transition-all duration-200 hover:border-secondary/40 hover:shadow-md"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10 transition-colors duration-200 group-hover:bg-secondary/20">
                <step.icon className="h-5 w-5 text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-primary">{step.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant">{step.description}</p>
              </div>
              <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-on-surface-variant transition-colors duration-200 group-hover:text-secondary" />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col rounded-2xl bg-white p-6 shadow-[0px_8px_24px_rgba(25,28,30,0.06)]">
        <div className="mb-5 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container shadow-lg">
            <User className="h-10 w-10 text-white/60" />
          </div>
        </div>
        <p className="mb-3 text-center text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
          Admissions Desk
        </p>

        <h3 className="mb-2 text-center font-headline text-base leading-snug font-bold text-primary">
          Need guidance on your next steps?
        </h3>
        <p className="mb-5 text-center text-xs leading-relaxed text-on-surface-variant">
          Our counseling team is available Monday–Friday to help you with the transition to campus life
          and answer technical questions about your major.
        </p>

        {showBookingForm && (
          <div className="mb-4 space-y-3">
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full rounded-lg border border-outline-variant/30 px-3 py-2 text-sm"
            />
            <input
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full rounded-lg border border-outline-variant/30 px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Topic (optional)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg border border-outline-variant/30 px-3 py-2 text-sm"
            />
          </div>
        )}

        <div className="mt-auto flex gap-3">
          <button
            type="button"
            onClick={handleScheduleCall}
            disabled={requestCounselling.isPending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-primary/90 active:scale-95 disabled:opacity-60"
          >
            <Calendar className="h-3.5 w-3.5" />
            {requestCounselling.isPending
              ? 'Submitting...'
              : showBookingForm
                ? 'Confirm Booking'
                : 'Schedule Call'}
          </button>
          <button
            type="button"
            onClick={() => openAdmissionsEmail('Counselling Request')}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-outline-variant/40 py-2.5 text-xs font-semibold text-on-surface-variant transition-all duration-200 hover:bg-surface-container-low active:scale-95"
          >
            <Mail className="h-3.5 w-3.5" />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}
