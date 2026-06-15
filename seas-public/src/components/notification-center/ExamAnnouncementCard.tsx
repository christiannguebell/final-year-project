import { Megaphone, Compass } from 'lucide-react';

export default function ExamAnnouncementCard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-white rounded-2xl shadow-[0px_4px_16px_rgba(25,28,30,0.06)] border border-outline-variant/20 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Main notification content */}
      <div className="lg:col-span-2 p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-primary font-headline">
                Exam Announcement
              </h3>
              <span className="text-xs text-on-surface-variant ml-4 flex-shrink-0">
                5 hours ago
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              Exam schedule for Phase I has been published. Check the Exam Hub for detailed
              venue information and timing.
            </p>
            <a
              href="/exams"
              className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all duration-200 active:scale-95"
            >
              Check Exam Hub
            </a>
          </div>
        </div>
      </div>

      {/* Navy promo panel */}
      <div
        className="relative flex flex-col justify-end p-6 overflow-hidden min-h-[140px]"
        style={{ background: 'linear-gradient(135deg, #00193c 0%, #002d62 100%)' }}
      >
        {/* Subtle background icon */}
        <Compass className="absolute top-4 right-4 w-12 h-12 text-white/10" />

        {/* Decorative circle */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full border border-white/5" />

        <div className="relative z-10">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-semibold mb-1">
            Admissions 2024
          </p>
          <h4 className="text-lg font-extrabold text-white font-headline leading-snug">
            Excellence in<br />Engineering Analytics
          </h4>
        </div>
      </div>
    </div>
  );
}
