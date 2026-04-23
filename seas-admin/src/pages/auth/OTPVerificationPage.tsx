import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, KeyRound } from 'lucide-react';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = new URLSearchParams(location.search).get('email') || '';
  const userId = new URLSearchParams(location.search).get('userId') || '';

  useEffect(() => {
    if (!email && !userId) {
      navigate('/admin/login');
    }
  }, [email, userId, navigate]);

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
    if (code.length !== 6) return;

    try {
      const response = await fetch('http://localhost:3000/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp: code }),
      });
      const data = await response.json();
      if (data.success) {
        navigate('/admin/setup-password', { state: { userId, email } });
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-10 h-10" />
            <span className="text-2xl font-bold font-headline">SEAS Admin</span>
          </div>
          <h1 className="text-5xl font-extrabold font-headline mb-6">
            Account Verification
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Enter the verification code sent to your email to activate your admin account.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
              <KeyRound className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-primary">SEAS Admin</span>
          </div>

          <h2 className="text-3xl font-bold text-primary mb-2 text-center">Verify Your Account</h2>
          <p className="text-on-surface-variant mb-8 text-center">
            Enter the 6-digit code sent to your email
          </p>

          <div className="flex justify-center gap-3 mb-8">
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
            onClick={handleVerify}
            disabled={otp.join('').length !== 6}
            className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            Verify Account
          </button>

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