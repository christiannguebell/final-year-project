import { useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      setValidationError("You must accept the absolute terms");
      return;
    }

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName; // fallback if only one name

    registerMutation.mutate({
      email,
      password,
      firstName,
      lastName,
      phone
    }, {
      onSuccess: () => {
        // Assume email verification is required
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden shadow-[0px_8px_24px_rgba(25,28,30,0.06)] bg-surface-container-lowest z-10"
        >
          {/* Left Panel */}
          <div className="hidden md:flex md:w-5/12 bg-primary-container p-12 flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-white/60 font-sans text-xs tracking-widest uppercase mb-4 block">Future Engineers</span>
              <h2 className="text-3xl font-headline font-extrabold text-white leading-tight mb-6">Start Your Journey at SEAS</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Join a community dedicated to technical precision and academic excellence. Your registration is the first step toward a global career in Engineering and Applied Sciences.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-white font-medium text-sm">Account Creation</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-white/70">
                    <span className="font-bold text-xs">2</span>
                  </div>
                  <span className="text-white/70 font-medium text-sm">Verification</span>
                </div>
                <div className="flex items-center gap-4 opacity-40">
                  <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-white/70">
                    <span className="font-bold text-xs">3</span>
                  </div>
                  <span className="text-white/70 font-medium text-sm">Program Selection</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 pt-12">
              <p className="text-xs text-white/40 italic">"Engineering is the professional art of applying science to the optimum conversion of natural resources to the benefit of humankind."</p>
            </div>
            
            {/* Decorative element */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mb-32 -mr-32 blur-3xl"></div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16">
            <div className="mb-10">
              <h1 className="text-2xl font-headline font-bold text-primary tracking-tight mb-2">Create New Candidate Account</h1>
              <p className="text-on-surface-variant text-sm">Provide your official details as per your identification documents.</p>
            </div>

            <form className="space-y-8" onSubmit={handleRegister}>
              {(validationError || registerMutation.isError) && (
                <div className="p-3 bg-error-container text-on-error-container rounded-md text-sm font-medium">
                  {validationError || (registerMutation.error instanceof Error ? registerMutation.error.message : 'Registration failed. Please try again.')}
                </div>
              )}
              <div className="space-y-2 group">
                <label className="block text-xs font-semibold text-outline tracking-wider uppercase group-focus-within:text-primary transition-colors" htmlFor="full_name">Full Name</label>
                <div className="bg-surface-container-high rounded-t-lg transition-all border-b-2 border-transparent group-focus-within:border-primary">
                  <input 
                    className="w-full bg-transparent border-none py-3 px-4 text-on-surface placeholder:text-outline/50 focus:ring-0" 
                    id="full_name" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full legal name" 
                    type="text" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="block text-xs font-semibold text-outline tracking-wider uppercase group-focus-within:text-primary transition-colors" htmlFor="reg_email">Email Address</label>
                  <div className="bg-surface-container-high rounded-t-lg transition-all border-b-2 border-transparent group-focus-within:border-primary">
                    <input 
                      className="w-full bg-transparent border-none py-3 px-4 text-on-surface placeholder:text-outline/50 focus:ring-0" 
                      id="reg_email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@university.edu" 
                      type="email" 
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block text-xs font-semibold text-outline tracking-wider uppercase group-focus-within:text-primary transition-colors" htmlFor="phone">Phone Number</label>
                  <div className="bg-surface-container-high rounded-t-lg transition-all border-b-2 border-transparent group-focus-within:border-primary">
                    <input 
                      className="w-full bg-transparent border-none py-3 px-4 text-on-surface placeholder:text-outline/50 focus:ring-0" 
                      id="phone" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000" 
                      type="tel" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="block text-xs font-semibold text-outline tracking-wider uppercase group-focus-within:text-primary transition-colors" htmlFor="reg_password">Password</label>
                  <div className="bg-surface-container-high rounded-t-lg transition-all border-b-2 border-transparent group-focus-within:border-primary">
                    <input 
                      className="w-full bg-transparent border-none py-3 px-4 text-on-surface placeholder:text-outline/50 focus:ring-0" 
                      id="reg_password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="••••••••" 
                      type="password" 
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block text-xs font-semibold text-outline tracking-wider uppercase group-focus-within:text-primary transition-colors" htmlFor="confirm_password">Confirm Password</label>
                  <div className="bg-surface-container-high rounded-t-lg transition-all border-b-2 border-transparent group-focus-within:border-primary">
                    <input 
                      className="w-full bg-transparent border-none py-3 px-4 text-on-surface placeholder:text-outline/50 focus:ring-0" 
                      id="confirm_password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      type="password" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input 
                  className="mt-1 rounded-sm border-outline-variant text-secondary focus:ring-secondary transition-all" 
                  id="terms" 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label className="text-xs text-on-surface-variant leading-relaxed" htmlFor="terms">
                  I agree to the <a className="text-primary font-bold hover:underline" href="#">Technical Standards</a> and <a className="text-primary font-bold hover:underline" href="#">Institutional Privacy</a> policy of SEAS.
                </label>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                <button 
                  disabled={registerMutation.isPending}
                  className="w-full sm:w-auto px-10 py-3.5 bg-primary text-white font-headline font-bold rounded-lg shadow-sm active:scale-95 transition-all duration-300 disabled:opacity-70" 
                  type="submit"
                >
                  {registerMutation.isPending ? 'Creating...' : 'Create Account'}
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  type="button"
                  className="text-sm font-medium text-outline hover:text-primary transition-colors flex items-center gap-2"
                >
                  Already have an account? <span className="font-bold text-primary">Login</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
