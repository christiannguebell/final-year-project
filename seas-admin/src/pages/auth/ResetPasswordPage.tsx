import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const checks = {
    length: password.length >= 12,
    symbolsAndNumbers: /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password),
    mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password)
  };

  const getStrength = () => {
    let score = 0;
    if (checks.length) score++;
    if (checks.symbolsAndNumbers) score++;
    if (checks.mixedCase) score++;
    
    if (password.length > 0 && password.length < 8) return { label: 'WEAK', bars: 1, color: 'bg-rose-500' };
    if (score === 1) return { label: 'WEAK', bars: 1, color: 'bg-rose-500' };
    if (score === 2) return { label: 'MEDIUM', bars: 2, color: 'bg-amber-500' };
    if (score === 3) return { label: 'STRONG', bars: 3, color: 'bg-emerald-600' };
    if (score === 3 && password.length >= 16) return { label: 'VERY STRONG', bars: 4, color: 'bg-emerald-600' };
    
    return { label: 'WEAK', bars: 0, color: 'bg-slate-200' };
  };

  const strength = getStrength();
  const isValid = checks.length && checks.symbolsAndNumbers && checks.mixedCase && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error('Please fulfill all security requirements before updating your password.');
      return;
    }

    toast.success('Password updated successfully! Redirecting to login...');
    setTimeout(() => {
      navigate('/admin/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between items-center py-12 px-4 select-none animate-in fade-in duration-300">
      
      {/* Top Header Placeholder */}
      <div className="w-full max-w-[1200px] flex justify-between items-center px-4 md:px-8">
        <h1 className="text-sm font-extrabold text-slate-800 tracking-tight font-headline">SEAS Portal</h1>
        <div className="flex items-center gap-4 text-slate-500">
          <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-slate-800">help</span>
          <span className="material-symbols-outlined text-[18px] cursor-pointer hover:text-slate-800">language</span>
        </div>
      </div>

      {/* Core Center Card */}
      <div className="w-full max-w-[460px] bg-white border border-outline-variant/15 rounded-2xl shadow-xl p-8 space-y-8 my-6">
        
        {/* Reset Icon and Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-md">
            <RotateCcw className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-headline font-black text-slate-900 tracking-tight">
            Reset Your Password
          </h2>
          <p className="text-xs text-on-surface-variant font-medium max-w-[300px] leading-relaxed">
            Ensure your account security by choosing a strong, unique password.
          </p>
        </div>

        {/* Input Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* New Password input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 font-headline uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-slate-800 focus:ring-4 focus:ring-slate-100 rounded-xl px-4 py-3.5 text-slate-800 text-sm font-bold transition-all outline-none pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Strength Indicator */}
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[9px] font-bold tracking-widest font-headline">
                <span className="text-slate-500">SECURITY STRENGTH</span>
                <span className={strength.label === 'WEAK' ? 'text-rose-500' : strength.label === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-600'}>
                  {strength.label}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx < strength.bars ? strength.color : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Validation Checklist Requirements */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${checks.length ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span className={checks.length ? 'text-emerald-800 font-bold' : 'text-slate-500'}>
                Minimum 12 characters
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${checks.symbolsAndNumbers ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span className={checks.symbolsAndNumbers ? 'text-emerald-800 font-bold' : 'text-slate-500'}>
                Includes symbols and numbers
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${checks.mixedCase ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span className={checks.mixedCase ? 'text-emerald-800 font-bold' : 'text-slate-500'}>
                Mixed case letters (A, a)
              </span>
            </div>
          </div>

          {/* Confirm New Password input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 font-headline uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white border-2 border-transparent focus:border-slate-800 focus:ring-4 focus:ring-slate-100 rounded-xl px-4 py-3.5 text-slate-800 text-sm font-bold transition-all outline-none pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Update Password Submit Button */}
          <button 
            type="submit"
            disabled={!isValid}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-headline uppercase tracking-widest mt-8"
          >
            Update Password
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Back link */}
        <div className="flex justify-center pt-2">
          <button 
            onClick={() => navigate('/admin/login')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline transition-all"
          >
            Back to Recovery
          </button>
        </div>

      </div>

      {/* Brand & IT Desk support info */}
      <div className="w-full max-w-[500px] text-center space-y-6 px-4">
        <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
          Experiencing issues? Contact the <strong className="text-slate-700 font-extrabold hover:underline cursor-pointer">SEAS IT Service Desk</strong> for immediate technical assistance regarding your institutional credentials.
        </p>
        
        {/* Shield Logo SVG */}
        <div className="flex justify-center opacity-60">
          <svg className="w-8 h-8 text-slate-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>

        {/* Footer Brand Navigation */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="hover:text-slate-700 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-700 cursor-pointer">Academic Integrity</span>
            <span>•</span>
            <span className="hover:text-slate-700 cursor-pointer">Digital Security</span>
          </div>
          <p className="text-[9px] font-bold text-slate-400">
            © 2024 School of Engineering and Applied Sciences. All technical rights reserved.
          </p>
        </div>
      </div>

    </div>
  );
}
