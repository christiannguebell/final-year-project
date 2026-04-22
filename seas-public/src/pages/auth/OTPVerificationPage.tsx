import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, KeyRound } from 'lucide-react';
import { useVerifyOtp } from '../../hooks/useAuth';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
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
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
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
        { onSuccess: () => navigate('/dashboard') }
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-10 h-10" />
            <span className="text-2xl font-bold font-headline">SEAS Portal</span>
          </div>
          <h1 className="text-5xl font-extrabold font-headline mb-6">
            Account Verification
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Enter the verification code sent to your email to activate your account and access the candidate portal.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
              <KeyRound className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-primary">SEAS Portal</span>
          </div>

          <h2 className="text-3xl font-bold text-primary mb-2 text-center">Verify Your Account</h2>
          <p className="text-on-surface-variant mb-8 text-center">
            Enter the 6-digit code sent to <span className="text-primary font-semibold">{email}</span>
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-xl font-bold bg-surface-container-low border-2 border-outline-variant/20 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={verifyMutation.isPending || otp.join('').length !== 6}
              className="w-full py-3 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50"
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Didn't receive the code?{' '}
            <button type="button" className="text-primary font-bold hover:underline">
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}