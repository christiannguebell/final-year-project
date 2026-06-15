import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Bell, Settings, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LANDING_SECTIONS, openSupportEmail, scrollToSection } from "../../config/navigation";

const LANDING_NAV = [
  { label: 'Admissions', section: LANDING_SECTIONS.admissions },
  { label: 'Programs', section: LANDING_SECTIONS.programs },
  { label: 'Resources', section: LANDING_SECTIONS.resources },
  { label: 'Help', action: 'help' as const },
] as const;
export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "glass-header py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <span className="text-xl font-extrabold font-headline tracking-tighter text-primary">
            SEAS Exam Management
          </span>
          <div className="hidden md:flex items-center gap-8">
            {LANDING_NAV.map((item) =>
              'action' in item ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => openSupportEmail()}
                  className="font-headline text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
                >
                  {item.label}
                </button>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => scrollToSection(item.section)}
                  className={`font-headline text-sm font-semibold transition-colors ${
                    item.label === 'Admissions'
                      ? 'border-b-2 border-secondary pb-1 text-secondary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <Link to="/login" className="p-2 text-on-surface-variant transition-colors hover:text-primary">
              <Bell size={20} />
            </Link>
            <Link to="/login" className="p-2 text-on-surface-variant transition-colors hover:text-primary">
              <Settings size={20} />
            </Link>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-primary text-white rounded-lg font-headline font-bold text-sm hover:opacity-90 transition-opacity active:scale-95"
          >
            Login
          </button>
          <button 
            className="md:hidden p-2 text-on-surface-variant"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant p-6 flex flex-col gap-4 shadow-xl"
        >
          {LANDING_NAV.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if ('action' in item) {
                  openSupportEmail();
                  return;
                }
                scrollToSection(item.section);
              }}
              className="text-left text-lg font-bold font-headline text-primary"
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </nav>
  );
};