import { FOOTER_LINKS } from '../../config/navigation';

export const Footer = () => {
  return (
    <footer id="help" className="scroll-mt-24 border-t border-outline-variant/20 bg-surface-container-low px-6 py-16 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-center md:text-left">
          <span className="text-lg font-headline font-extrabold text-primary block mb-2">SEAS Engineering Excellence</span>
          <p className="text-xs text-on-surface-variant/60 font-medium">
            © 2024 SEAS Engineering Excellence. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-xs font-semibold text-on-surface-variant transition-colors hover:text-secondary">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};