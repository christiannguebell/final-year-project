import React, { useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, Circle, ArrowRight, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResetPassword } from '../../hooks/useAuth';

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const resetMutation = useResetPassword();

  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const strength = {
    length: password.length >= 12,
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password) && /\d/.test(password),
    cases: /[A-Z]/.test(password) && /[a-z]/.test(password),
  };

  const strengthCount = Object.values(strength).filter(Boolean).length;
  const strengthText = strengthCount === 3 ? 'Strong' : strengthCount === 2 ? 'Medium' : 'Weak';
  const strengthColor = strengthCount === 3 ? 'bg-secondary' : strengthCount === 2 ? 'bg-yellow-500' : 'bg-error';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    if (token) {
      resetMutation.mutate(
        { token, newPassword: password },
        {
          onSuccess: () => setSuccess(true),
        }
      );
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 bg-surface-container-low">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full mx-auto text-center bg-surface-container-lowest p-12 rounded-xl shadow-[0px_8px_24px_rgba(25,28,30,0.06)]">
          <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-headline font-extrabold text-primary mb-4">Password Updated</h2>
          <p className="text-on-surface-variant mb-8">
            Your institutional password has been successfully reset. You can now log in to the SEAS Portal.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all font-headline"
          >
            Return to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 bg-surface-container-low">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto w-full"
      >
        <div className="bg-surface-container-lowest rounded-xl p-8 border-none shadow-[0px_8px_24px_rgba(25,28,30,0.06)]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary/10">
              <Lock className="text-surface-container-lowest w-8 h-8" />
            </div>
            <h1 className="font-headline font-extrabold text-2xl text-primary tracking-tight text-center">
              Reset Your Password
            </h1>
            <p className="text-on-surface-variant text-sm mt-2 text-center max-w-[280px]">
              Ensure your account security by choosing a strong, unique password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {resetMutation.isError && (
               <div className="p-3 bg-error-container text-on-error-container rounded-md text-xs text-center font-medium">
                 Failed to reset password. The token may be expired or invalid.
               </div>
            )}
            <div className="space-y-2">
              <label className="block font-label text-sm font-semibold text-primary px-1">
                New Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-high border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 transition-all text-on-surface placeholder:text-outline/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-outline hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Security Strength
                </span>
                <span className={`font-label text-[10px] uppercase tracking-widest font-bold ${strengthCount === 3 ? 'text-secondary' : 'text-primary'}`}>
                  {strengthText}
                </span>
              </div>
              <div className="flex gap-1.5 h-1.5 w-full">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      i <= strengthCount ? strengthColor : 'bg-outline-variant/30'
                    }`}
                  />
                ))}
              </div>
              <ul className="space-y-2 mt-4">
                <li className={`flex items-center gap-2 text-xs ${strength.length ? 'text-secondary' : 'text-on-surface-variant/70'}`}>
                  {strength.length ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  Minimum 12 characters
                </li>
                <li className={`flex items-center gap-2 text-xs ${strength.symbols ? 'text-secondary' : 'text-on-surface-variant/70'}`}>
                  {strength.symbols ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  Includes symbols and numbers
                </li>
                <li className={`flex items-center gap-2 text-xs ${strength.cases ? 'text-secondary' : 'text-on-surface-variant/70'}`}>
                  {strength.cases ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  Mixed case letters (A, a)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="block font-label text-sm font-semibold text-primary px-1">
                Confirm New Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-high border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 transition-all text-on-surface placeholder:text-outline/50"
                />
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-error mt-1 px-1">Passwords do not match.</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={resetMutation.isPending || password !== confirmPassword || strengthCount === 0}
                className="w-full bg-primary text-surface-container-lowest font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {resetMutation.isPending ? 'Updating...' : 'Update Password'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center px-4">
          <p className="text-on-surface-variant text-xs leading-relaxed">
            Experiencing issues? Contact the <span className="text-primary font-bold">SEAS IT Service Desk</span> for immediate technical assistance regarding your institutional credentials.
          </p>
          <div className="flex justify-center gap-4 mt-4 opacity-40 grayscale">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
