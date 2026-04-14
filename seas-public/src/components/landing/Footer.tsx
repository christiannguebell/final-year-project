export const Footer = () => {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/20 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-center md:text-left">
          <span className="text-lg font-headline font-extrabold text-primary block mb-2">SEAS Engineering Excellence</span>
          <p className="text-xs text-on-surface-variant/60 font-medium">
            © 2024 SEAS Engineering Excellence. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {["Institutional Privacy", "Accessibility", "Technical Standards", "Contact SEAS"].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs font-semibold text-on-surface-variant hover:text-secondary transition-colors">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};