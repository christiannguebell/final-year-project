import { useState } from 'react';
import { Mail, Lock, Eye, LogIn, Accessibility, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useLogin } from '../../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password }, {
      onSuccess: () => {
        navigate('/dashboard');
      },
      onError: (error: AxiosError<{ message: string }>) => {
        const message = error.response?.data?.message;
        if (message === 'ACCOUNT_UNVERIFIED') {
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      <main className="flex-grow flex items-center justify-center relative px-6 py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            alt="engineering blueprint"
            className="w-full h-full object-cover opacity-10 blueprint-bg"
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuYgpjER7Z3j2m6FoPjOBHhsNI2siCsktg5yKXQ2G1H_v8Ad6AGTJS-Gk7Ga-XRIDxRtVWufxsP4YVUxC3jW2vDWeShTgm6x-adVZixsbeeOr3Zp4VUkRDdsKRUg4ac4ZB-USq-rD6jsF4BjwhFFS_jRyWl5iAMrgyh8O08ZwMb4LI6iwTiG5qUqYwbWPdu08Y1qayT7mH4WmLpVsmwto9Cp701aGzVcRNOgpGrcZjuaTXtIA036YZgI5cWYStRRZy6H3Y7shAPIGH"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-surface via-transparent to-primary-container/5"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-md z-10"
        >
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_8px_24px_rgba(25,28,30,0.06)] p-8 md:p-10">
            <div className="mb-10 text-center">
              <h1 className="font-headline font-extrabold text-3xl text-primary tracking-tight mb-2">Portal Access</h1>
              <p className="text-on-surface-variant font-sans">Engineering & Applied Sciences</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant px-1" htmlFor="email">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 text-outline w-4 h-4" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-high rounded-md border-none border-b-2 border-transparent focus:ring-0 focus:border-primary transition-all text-on-surface placeholder:text-outline"
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineering.student@seas.edu"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">Password</label>
                   <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs font-semibold text-secondary hover:underline transition-all">Forgot Password?</button>
                 </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 text-outline w-4 h-4" />
                  <input
                    className="w-full pl-10 pr-10 py-3 bg-surface-container-high rounded-md border-none border-b-2 border-transparent focus:ring-0 focus:border-primary transition-all text-on-surface placeholder:text-outline"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    className="absolute right-3 text-outline hover:text-primary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 px-1">
                <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" id="remember" type="checkbox" />
                <label className="text-sm font-medium text-on-surface-variant" htmlFor="remember">Remember my session</label>
              </div>

              <button
                disabled={loginMutation.isPending}
                className="w-full py-4 bg-primary text-white rounded-lg font-headline font-bold text-base hover:bg-primary-container transition-all active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg shadow-primary/10 disabled:opacity-70"
                type="submit"
              >
                <span>{loginMutation.isPending ? 'Authenticating...' : 'Enter Dashboard'}</span>
                <LogIn className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-outline-variant/15 text-center">
              <p className="text-xs text-on-surface-variant font-sans leading-relaxed">
                By logging in, you agree to the <a className="underline hover:text-primary" href="#">Technical Standards</a> and the <a className="underline hover:text-primary" href="#">Honor Code of Conduct</a>.
              </p>
              <p className="mt-4 text-sm">
                Don't have an account? <button type="button" onClick={() => navigate('/register')} className="text-primary font-bold hover:underline">Register here</button>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-8">
            <a className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold" href="#">
              <Accessibility className="w-4 h-4" />
              <span>Accessibility</span>
            </a>
            <a className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold" href="#">
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
