import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Download, Copy, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function ApplicationSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const appId = (location.state as { id?: string })?.id || '';

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8">
      
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-sm p-12 mb-12 flex flex-col lg:flex-row gap-12 items-center lg:items-start">
        
        {/* Left Side: Success Icon */}
        <div className="lg:w-1/3 flex flex-col items-center justify-center pt-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-secondary/10 rounded-3xl transform rotate-3" />
            <div className="relative bg-white border border-outline-variant rounded-2xl p-8 flex items-center justify-center shadow-sm">
              <div className="bg-secondary rounded-xl p-6">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-secondary/30 rounded-full" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-headline text-primary mb-2">Submission Successful</h2>
          <p className="text-on-surface-variant text-sm">Welcome to the future of Engineering.</p>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="lg:w-2/3 space-y-8">
          <div>
            <div className="inline-block px-4 py-1.5 bg-surface-container-low text-on-surface-variant text-xs font-bold tracking-wider rounded-full mb-6">
              APPLICATION RECEIVED
            </div>
            <h1 className="text-4xl font-extrabold font-headline text-primary mb-6 leading-tight">
              Engineering Excellence Starts Here.
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Your application to the <span className="font-bold text-primary">SEAS School of Engineering</span> has been successfully logged into our central registry. Our faculty review board will commence the technical evaluation shortly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-surface-container-low rounded-xl p-6 border-l-4 border-primary">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">APPLICATION ID</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-primary font-mono">{appId ? appId.slice(0, 8).toUpperCase() : 'N/A'}</p>
                <button onClick={() => { navigator.clipboard.writeText(appId); toast.success('Application ID copied!'); }} className="text-on-surface-variant hover:text-primary transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-surface-container-low rounded-xl p-6 border-l-4 border-secondary">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">ESTIMATED REVIEW</p>
              <p className="text-xl font-bold text-primary">10-14 Business Days</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => navigate('/payments')}
              className="flex-1 bg-primary text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              Go to Payment Center
            </button>
            <button
              className="flex-1 bg-surface-container-low text-primary py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Confirmation PDF
            </button>
          </div>

          <div className="pt-4 flex items-start gap-3 text-sm text-on-surface-variant">
            <div className="w-5 h-5 bg-secondary text-white rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold">i</span>
            </div>
            <p>
              A copy of this confirmation has been sent to your registered academic email address.
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-surface-container-low/50 rounded-2xl p-8 hover:bg-surface-container-low transition-colors">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm mb-6">
            01
          </div>
          <h3 className="text-lg font-bold text-primary mb-3">Payment Settlement</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Complete your processing fee to activate your technical interview slot.
          </p>
        </div>

        <div className="bg-surface-container-low/50 rounded-2xl p-8 hover:bg-surface-container-low transition-colors">
          <div className="w-8 h-8 bg-surface-container-highest text-on-surface-variant rounded-full flex items-center justify-center font-bold text-sm mb-6">
            02
          </div>
          <h3 className="text-lg font-bold text-primary mb-3">Credential Verification</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Our registrars will verify your submitted engineering prerequisites.
          </p>
        </div>

        <div className="bg-surface-container-low/50 rounded-2xl p-8 hover:bg-surface-container-low transition-colors">
          <div className="w-8 h-8 bg-surface-container-highest text-on-surface-variant rounded-full flex items-center justify-center font-bold text-sm mb-6">
            03
          </div>
          <h3 className="text-lg font-bold text-primary mb-3">Portal Access</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Monitor your Dashboard for real-time updates on faculty decisions.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-center pb-8 border-t border-outline-variant pt-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 bg-primary rounded text-white flex items-center justify-center">
            <span className="font-bold text-[10px]">S</span>
          </div>
          <span className="text-sm font-bold text-primary tracking-wider uppercase">SEAS EXAM PORTAL</span>
        </div>
        <p className="text-[10px] text-on-surface-variant tracking-[0.2em] uppercase mb-6">
          Engineering Excellence & Academic Rigor
        </p>
        <div className="flex justify-center gap-8 text-[11px] font-medium text-on-surface-variant">
          <a href="#" className="hover:text-primary transition-colors">ACADEMIC INTEGRITY POLICY</a>
          <a href="#" className="hover:text-primary transition-colors">TECHNICAL SUPPORT</a>
        </div>
      </footer>
    </div>
  );
}
