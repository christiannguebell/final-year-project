import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';
import { useResetPassword } from '../../hooks/useAuth';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const resetMutation = useResetPassword();

  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    // Enable this for real token enforcement
    // if (!token) {
    //   navigate('/login');
    // }
  }, [token, navigate]);

  const passwordChecks = {
    length: password.length >= 12,
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password) && /\d/.test(password),
    mixed: /[a-z]/.test(password) && /[A-Z]/.test(password),
  };

  const calculateStrength = () => {
    const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
    if (passedChecks === 0) return { label: 'WEAK', score: 0, color: 'bg-error', w: 'w-1/4' };
    if (passedChecks === 1) return { label: 'FAIR', score: 1, color: 'bg-yellow-500', w: 'w-2/4' };
    if (passedChecks === 2) return { label: 'GOOD', score: 2, color: 'bg-secondary/60', w: 'w-3/4' };
    return { label: 'STRONG', score: 3, color: 'bg-secondary', w: 'w-full' };
  };

  const strength = calculateStrength();
  const isValid = strength.score === 3 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    resetMutation.mutate(
      { token: token || 'mock', newPassword: password },
      { onSuccess: () => navigate('/login', { state: { message: 'Password reset! Please login with new password.' } }) }
    );
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-surface">
        <span className="text-primary font-bold font-headline tracking-tight text-xl">SEAS Portal</span>
        <div className="flex gap-4 text-primary">
          <button className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-colors font-bold">?</button>
          <button className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-colors font-bold">🌐</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        
        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 mb-8 border border-outline-variant/30">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-md">
              <RotateCcw className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-headline text-primary mb-2">Reset Your Password</h1>
            <p className="text-sm text-on-surface-variant text-center leading-relaxed">
              Ensure your account security by choosing a strong, unique password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-primary mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-surface-container-low border-none rounded-lg text-primary focus:ring-2 focus:ring-primary/20 tracking-[0.2em] font-mono text-lg"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Strength Meter */}
              {password.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Security Strength</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${strength.score === 3 ? 'text-secondary' : 'text-on-surface-variant'}`}>{strength.label}</span>
                  </div>
                  <div className="flex gap-1 h-1.5 w-full mb-4">
                    <div className={`flex-1 rounded-full ${strength.score >= 0 ? strength.color : 'bg-surface-container-high'}`} />
                    <div className={`flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-surface-container-high'}`} />
                    <div className={`flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-surface-container-high'}`} />
                    <div className={`flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-surface-container-high'}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <PasswordCheckItem label="Minimum 12 characters" valid={passwordChecks.length} />
                    <PasswordCheckItem label="Includes symbols and numbers" valid={passwordChecks.symbols} />
                    <PasswordCheckItem label="Mixed case letters (A, a)" valid={passwordChecks.mixed} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-surface-container-low border-none rounded-lg text-primary focus:ring-2 focus:ring-primary/20 tracking-[0.2em] font-mono text-lg"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={resetMutation.isPending || !isValid}
                className="w-full py-3.5 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                {resetMutation.isPending ? 'Updating...' : 'Update Password'}
                {!resetMutation.isPending && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm font-bold text-primary hover:underline"
              >
                Back to Recovery
              </button>
            </div>
          </form>
        </div>

        <p className="text-xs text-on-surface-variant text-center max-w-sm mb-6 leading-relaxed">
          Experiencing issues? Contact the <span className="font-bold text-primary">SEAS IT Service Desk</span> for immediate technical assistance regarding your institutional credentials.
        </p>

        <div className="w-10 h-10 bg-outline-variant/50 rounded-lg mb-8 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-on-surface-variant" />
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full bg-surface py-8 text-center border-t border-outline-variant">
        <div className="flex justify-center gap-8 text-[10px] font-bold text-on-surface-variant tracking-[0.1em] uppercase mb-4">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Academic Integrity</a>
          <a href="#" className="hover:text-primary">Digital Security</a>
        </div>
        <p className="text-[10px] text-on-surface-variant/70">
          © 2024 School of Engineering and Applied Sciences. All technical rights reserved.
        </p>
      </footer>
    </div>
  );
}

function PasswordCheckItem({ label, valid }: { label: string; valid: boolean }) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      {valid ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border border-on-surface-variant/40" />
      )}
      <span className={valid ? 'text-secondary font-medium' : 'text-on-surface-variant'}>{label}</span>
    </div>
  );
}