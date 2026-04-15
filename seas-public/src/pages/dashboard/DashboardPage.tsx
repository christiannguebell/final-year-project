import { Link } from 'react-router-dom';
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
  ExternalLink 
} from 'lucide-react';
import TopNav from '../../components/layout/TopNav';
import Sidebar from '../../components/layout/Sidebar';
import { cn } from '../../lib/utils';
import { useAuth } from '../../providers';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <Sidebar />
      
      <main className="ml-64 pt-24 pb-12 px-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-primary">
                Welcome back, {user?.firstName || 'Candidate'}.
              </h1>
              <p className="text-lg text-on-surface-variant mt-2">Track your engineering journey and upcoming milestones.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/application" className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm flex items-center gap-2 active:scale-95 transition-transform hover:bg-primary-container">
                <Edit3 className="w-4 h-4" />
                Complete Application
              </Link>
              <button className="px-5 py-2.5 rounded-lg border border-outline-variant text-primary font-semibold text-sm flex items-center gap-2 hover:bg-surface-container-low transition-colors active:scale-95 transition-transform">
                <Download className="w-4 h-4" />
                Admission Slip
              </button>
            </div>
          </header>

          {/* Bento Grid Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Application Status Summary */}
            <div className="md:col-span-8 bg-white rounded-xl p-8 shadow-[0px_8px_24px_rgba(25,28,30,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <div className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider">Status: In Review</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-primary mb-6">M.S. Structural Engineering</h3>
              
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-on-surface-variant mb-1">Completion Progress</p>
                    <p className="text-3xl font-bold text-primary">85%</p>
                  </div>
                  <p className="text-sm font-medium text-on-surface-variant">2 tasks remaining</p>
                </div>

                {/* Segmented Progress Bar */}
                <div className="flex h-3 gap-1.5">
                  <div className="flex-1 bg-secondary rounded-full"></div>
                  <div className="flex-1 bg-secondary rounded-full"></div>
                  <div className="flex-1 bg-secondary rounded-full"></div>
                  <div className="flex-1 bg-primary rounded-full"></div>
                  <div className="flex-1 bg-outline-variant/30 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-lg border border-transparent hover:border-secondary/20 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-xs font-bold text-primary">Academic Transcripts</p>
                      <p className="text-[11px] text-on-surface-variant">Verified on Oct 12</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-lg border border-transparent hover:border-primary/20 transition-colors">
                    <Clock className="w-5 h-5 text-on-surface-variant" />
                    <div>
                      <p className="text-xs font-bold text-primary">Reference Letters</p>
                      <p className="text-[11px] text-on-surface-variant">1 of 2 Received</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="md:col-span-4 bg-primary text-white rounded-xl p-8 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold">Deadlines</h3>
                  <Calendar className="w-5 h-5 opacity-50" />
                </div>
                <div className="space-y-6">
                  {[
                    { date: 'October 31, 2024', title: 'Final Submission Window Closes', active: true },
                    { date: 'November 15, 2024', title: 'Entrance Exam (Phase I)' },
                    { date: 'December 05, 2024', title: 'Interview Shortlist Announcement' },
                  ].map((deadline, i) => (
                    <div key={i} className={cn("border-l-2 pl-4", deadline.active ? "border-secondary" : "border-outline-variant/30")}>
                      <p className="text-xs text-white/70 font-medium">{deadline.date}</p>
                      <p className="text-sm font-bold mt-1">{deadline.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-8 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform group">
                Sync to Calendar 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: CreditCard, title: 'Payment History', desc: 'View receipts and pending dues.' },
                { icon: Library, title: 'Prep Resources', desc: 'Access sample papers and syllabus.' },
                { icon: Mail, title: 'Messages', desc: '3 unread from Admissions Office.' },
              ].map((action, i) => (
                <div key={i} className="bg-surface-container-low p-6 rounded-xl group hover:bg-white hover:shadow-[0px_8px_24px_rgba(25,28,30,0.06)] transition-all duration-300 cursor-pointer border border-transparent hover:border-outline-variant/10">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-primary">{action.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">{action.desc}</p>
                </div>
              ))}
            </div>

            {/* Institution Spotlight */}
            <div className="md:col-span-12 mt-4">
              <div className="bg-surface-container-high rounded-xl p-8 flex flex-col md:flex-row items-center gap-10 overflow-hidden">
                <div className="w-full md:w-1/3 shrink-0">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvuQ8U0lqLIv4Lao04LQEIyTtzLQO-xJR4yJo6o9HZQB5jm0PTXOkRXfsBEnT8s3WHHhd1T8HP87lSphL18Lr1-veDsDupgqeprhBkMH-jStJDqSIuUMRFytuIJaO0mHpDKAD-5Dn574BM9eIGm99Glk3NYoT4x_SxjlYcqvt-dripThKalFfZwR08563YrPgbBKL5Mrn4QW74MrB10_CmZmzR90jYoUO2gjoGut0LitJoKUqR2JH-H7xdCZ05meceNpZGJSwZ2Ew3" 
                    alt="Engineering lab" 
                    className="rounded-lg w-full aspect-video object-cover shadow-md hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Institution Spotlight</span>
                  <h3 className="text-2xl font-extrabold text-primary">New Precision Engineering Hub</h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    Our newly inaugurated hub at the SEAS campus offers candidates an early glimpse into the state-of-the-art facilities available for the upcoming academic year.
                  </p>
                  <a href="#" className="text-primary font-bold text-sm inline-flex items-center gap-2 hover:underline group">
                    Learn about our facilities 
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 mt-auto bg-surface border-t border-outline-variant/15">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-sm font-bold text-primary">SEAS Engineering Excellence</span>
            <p className="text-xs tracking-wide text-on-surface-variant">© 2024 SEAS Engineering Excellence. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {['Institutional Privacy', 'Accessibility', 'Technical Standards', 'Contact SEAS'].map((link) => (
              <a 
                key={link} 
                href="#" 
                className="text-xs tracking-wide text-on-surface-variant hover:text-secondary transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
