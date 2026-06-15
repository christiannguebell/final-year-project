import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { useForgotPassword } from '../../hooks/useAuth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const forgotMutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      forgotMutation.mutate(
        { email },
        { onSuccess: () => setSuccessMsg('A password reset link has been sent to your email.') }
      );
    }
  };

  if (successMsg) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Check Your Email</h2>
          <p className="text-on-surface-variant mb-8">{successMsg}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-primary font-bold hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-surface">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-primary font-bold tracking-tight">SEAS Exam Management</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-on-surface-variant">
          <a href="#" className="hover:text-primary">Admissions</a>
          <a href="#" className="hover:text-primary">Programs</a>
          <a href="#" className="hover:text-primary">Resources</a>
          <a href="#" className="hover:text-primary">Help</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex bg-surface-container-lowest">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 lg:px-24 xl:px-32 relative z-10 shadow-[20px_0_40px_rgba(0,0,0,0.02)]">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-3xl font-bold font-headline text-primary mb-4">
              Account Recovery
            </h1>
            <p className="text-on-surface-variant mb-8 text-sm leading-relaxed">
              To reset your password, please enter the institutional email address associated with your SEAS candidate profile. We will send a secure recovery link to that address.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-2">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-none rounded-lg text-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50"
                    placeholder="e.g. candidate@seas.edu"
                    required
                  />
                </div>
                <p className="text-xs text-on-surface-variant mt-2">Password reset instructions are valid for 1 hour.</p>
              </div>

              <button
                type="submit"
                disabled={forgotMutation.isPending}
                className="w-full py-4 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                {forgotMutation.isPending ? 'Sending...' : 'Send Recovery Link'}
                {!forgotMutation.isPending && <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-transparent text-primary font-bold flex items-center justify-center gap-2 hover:bg-surface-container-low rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Login
              </button>
            </form>

            <div className="mt-12 bg-surface-container-low rounded-xl p-6 border-l-4 border-secondary flex gap-4">
              <div className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center shrink-0">
                <span className="text-xs font-bold">i</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary mb-1">Need technical assistance?</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  If you no longer have access to your institutional email, please contact the SEAS Registrar's Office for identity verification.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Hero */}
        <div className="hidden lg:block lg:w-1/2 relative bg-primary overflow-hidden">
          {/* Blueprint/Gears Background pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-transparent to-transparent opacity-80" />
          
          <div className="absolute inset-0 flex items-center justify-center p-16">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-sm shadow-2xl relative z-10 border border-white/20">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold font-headline text-primary mb-3">Secure Access</h3>
              <p className="text-sm text-primary/80 leading-relaxed font-medium">
                SEAS employs multi-factor identity verification to ensure the integrity of our engineering assessment platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-surface py-8 px-8 border-t border-outline-variant flex flex-col md:flex-row items-center justify-between text-xs text-on-surface-variant gap-4">
        <div>
          <p className="font-bold text-primary mb-1">SEAS Engineering Excellence</p>
          <p>© 2024 SEAS Engineering Excellence. All rights reserved.</p>
        </div>
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-primary transition-colors">Institutional Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
          <a href="#" className="hover:text-primary transition-colors">Technical Standards</a>
          <a href="#" className="hover:text-primary transition-colors">Contact SEAS</a>
        </div>
      </footer>
    </div>
  );
}