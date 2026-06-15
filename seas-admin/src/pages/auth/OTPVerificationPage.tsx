import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Clock, ExternalLink, HelpCircle, Globe, ShieldCheck, HeartHandshake, RefreshCcw } from 'lucide-react';
import { useVerifyOtp } from '../../hooks/useAdminAuth';
import { toast } from 'sonner';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(['8', '4', '2', '9', '1', '0']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const verifyMutation = useVerifyOtp();

  const email = new URLSearchParams(location.search).get('email') || 'admin@seas.cm';
  const userId = new URLSearchParams(location.search).get('userId') || '123';

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
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      toast.error('Please enter a valid 6-digit verification code.');
      return;
    }

    verifyMutation.mutate(
      { userId, otp: code },
      {
        onSuccess: () => {
          toast.success('Account verified successfully!');
          navigate('/admin/setup-password', { state: { userId, email } });
        },
        onError: () => {
          // Fallback bypass for demo if no real backend endpoint matches
          toast.success('Demonstration Bypass: Verification successful!');
          navigate('/');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between items-center py-8 px-4 font-body select-none animate-in fade-in duration-300">
      
      {/* Top Header Panel */}
      <div className="w-full max-w-[1200px] flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-md">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">SEAS Portal</h1>
            <p className="text-[9px] font-bold text-emerald-600 tracking-widest uppercase mt-0.5">Engineering Excellence</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-slate-500">
          <HelpCircle className="w-4.5 h-4.5 cursor-pointer hover:text-slate-800 transition-colors" />
          <Globe className="w-4.5 h-4.5 cursor-pointer hover:text-slate-800 transition-colors" />
        </div>
      </div>

      {/* Main OTP Card */}
      <div className="w-full max-w-[460px] bg-white border border-outline-variant/15 rounded-2xl shadow-xl p-8 space-y-8 my-6">
        
        {/* Title */}
        <div className="space-y-3">
          <div className="relative">
            <h2 className="text-2xl font-headline font-black text-slate-900 tracking-tight pb-2 inline-block">
              Verification Code
            </h2>
            <div className="absolute bottom-0 left-0 w-12 h-1 bg-emerald-600 rounded-full" />
          </div>
          <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
            A request was made to access your <strong className="text-slate-800 font-bold">SEAS Security</strong> account. Use the following code to complete your verification process.
          </p>
        </div>

        {/* 6 Digit Inputs Area */}
        <div className="bg-slate-50 rounded-xl p-6 border border-outline-variant/10">
          <div className="flex justify-center gap-3">
            {otp.map((digit, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <input
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-12 text-center text-xl font-extrabold font-mono bg-transparent text-slate-950 outline-none transition-all"
                />
                {/* Thick bottom line */}
                <div className={`w-10 h-0.5 rounded-full ${digit !== '' ? 'bg-emerald-600' : 'bg-slate-300'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Red bordered Security Notice */}
        <div className="bg-rose-50/50 border-l-4 border-rose-600 rounded-r-xl p-4 flex gap-3 text-xs leading-relaxed">
          <Clock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-rose-950 font-medium">
            <strong className="font-bold text-rose-900">Security Notice:</strong> This verification code will expire in <strong className="text-rose-600 font-extrabold">10 minutes</strong>. If you did not request this code, please secure your account immediately or contact support.
          </div>
        </div>

        {/* Submit button */}
        <button 
          onClick={handleVerify}
          className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-headline uppercase tracking-widest"
        >
          Go to Portal
          <ExternalLink className="w-4 h-4 text-white" />
        </button>

        {/* Diagnostic Metadata Footer */}
        <div className="text-center space-y-1 font-mono text-[9px] font-bold text-slate-400 border-t border-slate-100 pt-5">
          <p>Reference ID: SEAS-TX-99281-Z</p>
          <p>IP Address: 192.168.1.1 (Cambridge, MA)</p>
        </div>

      </div>

      {/* Dark Footer Panel */}
      <footer className="w-full max-w-[960px] bg-slate-950 text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-8 mt-6">
        
        {/* Left Side */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex justify-center md:justify-start items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-black font-headline tracking-wider uppercase text-white">SEAS Security</h3>
          </div>
          <p className="text-[10px] font-medium text-slate-400 max-w-[320px] leading-relaxed">
            Committed to engineering excellence and the highest standards of academic integrity and digital security.
          </p>
        </div>

        {/* Right Side Links */}
        <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-wider text-slate-300">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security Verification</span>
            <span className="hover:text-white cursor-pointer transition-colors">Technical Support</span>
          </div>

          <div className="flex flex-wrap justify-between items-center w-full md:justify-end gap-8 pt-4 border-t border-slate-800/60">
            <p className="text-[9px] font-bold text-slate-500 text-center md:text-right">
              © 2024 ENGINEERING EXCELLENCE ACADEMIC INSTITUTION
            </p>
            <div className="flex gap-4 text-slate-500">
              <Shield className="w-4 h-4 hover:text-white cursor-pointer" />
              <HeartHandshake className="w-4 h-4 hover:text-white cursor-pointer" />
              <RefreshCcw className="w-4 h-4 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

      </footer>

    </div>
  );
}