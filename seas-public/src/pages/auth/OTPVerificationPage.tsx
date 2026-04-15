import React, { useEffect, useState } from 'react';
import { ShieldCheck, Headset } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyOtp } from '../../hooks/useAuth';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const verifyMutation = useVerifyOtp();

  const email = new URLSearchParams(location.search).get('email') || '';

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === 6) {
      verifyMutation.mutate(
        { email, otp: code },
        {
          onSuccess: () => navigate('/dashboard'),
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 bg-surface-container-low">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full mx-auto"
      >
        <div className="bg-surface-container-lowest p-10 md:p-14 rounded-xl border border-outline-variant/15 shadow-[0px_8px_24px_rgba(25,28,30,0.04)]">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-surface-container-lowest w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-3 font-headline">
              Verification Required
            </h1>
            <p className="text-on-surface-variant font-body leading-relaxed max-w-sm mx-auto">
              For institutional security, please enter the 6-digit code sent to <span className="text-primary font-semibold">{email}</span>
            </p>
          </div>

          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            <div className="flex justify-between gap-2 md:gap-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  placeholder="0"
                  className="w-full h-14 md:h-16 text-center text-xl md:text-2xl font-bold bg-surface-container-high rounded-lg border-none focus:ring-0 border-b-2 border-transparent focus:border-primary transition-all text-primary"
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifyMutation.isPending || otp.join('').length !== 6}
                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-surface-container-lowest font-bold rounded-lg shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all font-headline disabled:opacity-50"
              >
                {verifyMutation.isPending ? 'Verifying...' : 'Verify Identity'}
              </button>
              
              <div className="flex flex-col items-center gap-6 mt-4">
                <p className="text-sm text-on-surface-variant font-medium">
                  Didn't receive the code? 
                  <button 
                    type="button"
                    onClick={() => {}}
                    className="text-secondary hover:underline font-bold transition-all ml-1"
                  >
                    Resend Code
                  </button>
                </p>
                
                <a 
                  href="mailto:support@seas.edu" 
                  className="inline-flex items-center gap-2 text-on-surface-variant/80 text-xs font-semibold hover:text-primary transition-colors py-2 px-4 rounded-full border border-outline-variant/20"
                >
                  <Headset className="w-4 h-4" />
                  Contact Registrar Support
                </a>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-8 flex justify-center items-center gap-4 md:gap-8 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">
          <span>© 2024 SEAS GLOBAL SECURITY</span>
          <span className="w-1 h-1 bg-outline-variant rounded-full hidden md:block" />
          <span className="hidden md:block">ENGINEERING EXCELLENCE</span>
        </div>
      </motion.div>
    </div>
  );
}
