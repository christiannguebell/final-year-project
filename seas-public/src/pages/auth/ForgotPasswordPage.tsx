import React from 'react';
import { Mail, ArrowRight, MoveLeft, Info, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/useAuth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      forgotPasswordMutation.mutate(
        { email },
        {
          onSuccess: () => {
            setSuccessMsg('A password recovery link has been sent to your institutional email.');
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row bg-surface-container-low rounded-xl overflow-hidden shadow-sm w-full max-w-5xl"
      >
        {/* Left Side: Form */}
        <div className="md:w-1/2 p-12 lg:p-16 bg-surface-container-lowest flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h1 className="font-headline font-extrabold text-3xl text-primary tracking-tight mb-4">
                Account Recovery
              </h1>
              <p className="text-on-surface-variant leading-relaxed">
                To reset your password, please enter the institutional email address associated with your SEAS candidate profile. We will send a secure recovery link to that address.
              </p>
            </div>

            {successMsg ? (
              <div className="p-4 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg mb-6">
                <p className="font-bold font-headline">{successMsg}</p>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="mt-4 flex items-center justify-center gap-2 py-3 w-full bg-primary text-white font-headline font-bold rounded-lg transition-colors group"
                >
                  <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {forgotPasswordMutation.isError && (
                   <div className="p-3 bg-error-container text-on-error-container rounded-md text-sm font-medium">
                     Failed to request password reset. Please verify your email.
                   </div>
                )}
                <div className="relative">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-label">
                    Institutional Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-0 bottom-3 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. candidate@seas.edu"
                      className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 pt-2 pb-3 pl-8 text-on-surface placeholder:text-outline/50 transition-all font-body text-lg"
                    />
                  </div>
                  <p className="mt-2 text-xs text-outline font-label">
                    Password reset instructions are valid for 1 hour.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full py-4 px-6 bg-primary text-surface-container-lowest font-headline font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                  >
                    {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Recovery Link'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="flex items-center justify-center gap-2 py-3 w-full text-primary font-headline font-bold hover:bg-surface-container-low rounded-lg transition-colors group"
                  >
                    <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Login
                  </button>
                </div>
              </form>
            )}

            <div className="mt-12 p-6 bg-surface-container-low rounded-lg border-l-4 border-secondary/30">
              <div className="flex gap-4">
                <Info className="text-secondary w-5 h-5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-primary mb-1 font-headline">Need technical assistance?</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-body">
                    If you no longer have access to your institutional email, please contact the SEAS Registrar's Office for identity verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual/Context */}
        <div className="md:w-1/2 relative min-h-[400px] hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-secondary/40 opacity-90 z-10" />
          <img
            src="https://picsum.photos/seed/engineering/1200/1200"
            alt="Engineering workspace"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-16">
            <div className="glass-effect p-8 rounded-xl border-l-4 border-secondary shadow-lg max-w-sm" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.1)'}}>
              <ShieldCheck className="text-secondary w-10 h-10 mb-4" />
              <h3 className="font-headline font-extrabold text-2xl text-white mb-3">Secure Access</h3>
              <p className="text-white/80 text-sm leading-relaxed font-medium">
                SEAS employs multi-factor identity verification to ensure the integrity of our engineering assessment platform.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
