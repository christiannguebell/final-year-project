import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useAdminResetPassword } from '../../hooks/useAdminAuth';
import { useToast } from '../../providers';

function PasswordCheck({ label, valid }: { label: string; valid: boolean }) {
  return (
    <p className={`text-sm flex items-center gap-2 ${valid ? 'text-secondary' : 'text-on-surface-variant'}`}>
      {valid ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      {label}
    </p>
  );
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const resetMutation = useAdminResetPassword();
  const { addToast } = useToast();

  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const passwordChecks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isValid = Object.values(passwordChecks).every(Boolean) && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !token) return;

    resetMutation.mutate(
      { token, newPassword: password },
      {
        onSuccess: () => {
          addToast('Password reset successfully!', 'success');
          navigate('/admin/login', { state: { message: 'Password reset! Please login with new password.' } });
        },
        onError: () => {
          addToast('Failed to reset password. The link may be expired.', 'error');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-10 h-10" />
            <span className="text-2xl font-bold font-headline">SEAS Admin</span>
          </div>
          <h1 className="text-5xl font-extrabold font-headline mb-6">
            Reset Password
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Create a new secure password for your admin account. Make sure it's strong and memorable.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-primary">SEAS Admin</span>
          </div>

          <h2 className="text-3xl font-bold text-primary mb-2 text-center">Set Your Password</h2>
          <p className="text-on-surface-variant mb-8 text-center">
            Create a secure password for your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-surface-container-low border-none rounded-lg text-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Create a strong password"
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
            </div>

            <div className="space-y-2">
              <PasswordCheck label="At least 8 characters" valid={passwordChecks.length} />
              <PasswordCheck label="Contains a number" valid={passwordChecks.number} />
              <PasswordCheck label="Contains a special character" valid={passwordChecks.special} />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-surface-container-low border-none rounded-lg text-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="text-secondary text-sm mt-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={resetMutation.isPending || !isValid}
              className="w-full py-3 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50"
            >
              {resetMutation.isPending ? 'Setting Password...' : 'Set Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
