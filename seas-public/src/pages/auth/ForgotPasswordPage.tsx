import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft } from 'lucide-react';
import { useForgotPassword } from '../../hooks/useAuth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const forgotMutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      forgotMutation.mutate(
        { email },
        { onSuccess: () => setSuccessMsg('A password reset link has been sent to your email.') }
      );
    }
  };

  if (successMsg) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Check Your Email</h2>
          <p className="text-on-surface-variant mb-8">{successMsg}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-primary font-bold hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

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
            Password Recovery
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-primary">SEAS Portal</span>
          </div>

          <h2 className="text-3xl font-bold text-primary mb-2">Forgot Password</h2>
          <p className="text-on-surface-variant mb-8">
            Enter your email to receive a password reset link
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-lg text-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={forgotMutation.isPending}
              className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-container transition-colors disabled:opacity-50"
            >
              {forgotMutation.isPending ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}