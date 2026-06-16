import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { useVerifyOtp } from '../../hooks/useAuth';
import { useAuth } from '../../providers';
import { authApi } from '../../api/modules/auth';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
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

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length === 6) {
      try {
        const response = await verifyMutation.mutateAsync({ email, otp: code });
        if (response.data) {
          const { tokens, user } = response.data;
          login(user, tokens.accessToken, tokens.refreshToken);
        }
        sessionStorage.removeItem('seas_pending_verification');
        navigate('/dashboard');
      } catch {
        // Error toast handled by API client interceptor
      }
    }
  };

  const handleResend = async () => {
    const stored = sessionStorage.getItem('seas_pending_verification');
    if (!stored) {
      toast.error('Please log in again to receive a new code');
      navigate('/login');
      return;
    }

    try {
      const { email: storedEmail, password } = JSON.parse(stored) as {
        email: string;
        password: string;
      };
      await authApi.login({ email: storedEmail, password });
      toast.success('You are already verified. Redirecting...');
      navigate('/dashboard');
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '';
      if (message === 'ACCOUNT_UNVERIFIED') {
        toast.success('A new verification code has been sent to your email');
        return;
      }
      toast.error('Could not resend code. Please try logging in again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="relative hidden bg-primary lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8 flex items-center gap-3">
            <GraduationCap className="h-10 w-10" />
            <span className="font-headline text-2xl font-bold">SEAS Portal</span>
          </div>
          <h1 className="mb-6 font-headline text-5xl font-extrabold">Account Verification</h1>
          <p className="max-w-md text-lg text-white/80">
            Enter the verification code sent to your email to activate your account and access the
            candidate portal.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
              <KeyRound className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-primary">SEAS Portal</span>
          </div>

          <h2 className="mb-2 text-center text-3xl font-bold text-primary">Verify Your Account</h2>
          <p className="mb-8 text-center text-on-surface-variant">
            Enter the 6-digit code sent to <span className="font-semibold text-primary">{email}</span>
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="space-y-6"
          >
            <div className="flex justify-center gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="h-14 w-12 rounded-lg border-2 border-outline-variant/20 bg-surface-container-low text-center text-xl font-bold focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={verifyMutation.isPending || otp.join('').length !== 6}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-white transition-colors hover:bg-primary-container disabled:opacity-50"
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Didn&apos;t receive the code?{' '}
            <button type="button" onClick={handleResend} className="font-bold text-primary hover:underline">
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
