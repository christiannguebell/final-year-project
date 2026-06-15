import { useNavigate } from 'react-router-dom';
import { Compass, LayoutDashboard, LifeBuoy, FileText, Users, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-8 gap-12 lg:gap-24">
        
        {/* Left Side: Illustration */}
        <div className="w-full max-w-md lg:w-1/2 relative flex justify-center lg:justify-end">
          <div className="w-[400px] h-[400px] bg-primary relative rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Architectural Blueprint Background overlay (simulated) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary-container opacity-50"></div>
            
            <div className="relative z-10 w-48 h-48 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg transform rotate-3">
              <Compass className="w-24 h-24 text-on-surface-variant stroke-[1.5] relative" />
              {/* Slash through compass */}
              <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                <div className="w-32 h-1.5 bg-on-surface-variant rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full max-w-lg lg:w-1/2 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold tracking-wider rounded-full mb-6">
              <AlertCircle className="w-3 h-3" />
              ERROR PROTOCOL ACTIVATED
            </div>
            <h1 className="text-5xl font-extrabold font-headline text-primary mb-6 leading-tight">
              Resource<br/>Not Found
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
              The requested academic document or directory could not be located within the SEAS portal architecture. This may be due to a decommissioned link or a typographical error in the URL structure.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-8 border-b border-outline-variant">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Return to Dashboard
            </button>
            <button
              className="flex-1 bg-surface-container-low text-primary py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors"
            >
              <LifeBuoy className="w-5 h-5" />
              Support
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">QUICK DIAGNOSTIC ACCESS</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => navigate('/exams')} className="flex items-center gap-3 text-primary hover:text-secondary transition-colors text-sm font-medium">
                <FileText className="w-4 h-4" /> Exams
              </button>
              <button onClick={() => navigate('/applications')} className="flex items-center gap-3 text-primary hover:text-secondary transition-colors text-sm font-medium">
                <FileText className="w-4 h-4" /> Applications
              </button>
              <button onClick={() => navigate('/programs')} className="flex items-center gap-3 text-primary hover:text-secondary transition-colors text-sm font-medium">
                <Users className="w-4 h-4" /> Faculty
              </button>
              <button onClick={() => navigate('/resources')} className="flex items-center gap-3 text-primary hover:text-secondary transition-colors text-sm font-medium">
                <FileText className="w-4 h-4" /> Resources
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant py-6 px-8 flex flex-col md:flex-row items-center justify-between text-[10px] text-on-surface-variant uppercase tracking-wider font-medium gap-4">
        <p>© 2024 SEAS EXAMINATION MANAGEMENT SYSTEM. ALL TECHNICAL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">ACADEMIC INTEGRITY POLICY</a>
          <a href="#" className="hover:text-primary transition-colors">TECHNICAL SUPPORT</a>
          <a href="#" className="hover:text-primary transition-colors">PRIVACY DOCUMENTATION</a>
        </div>
      </footer>
    </div>
  );
}
