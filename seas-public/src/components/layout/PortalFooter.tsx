import { FOOTER_LINKS } from '../../config/navigation';

interface PortalFooterProps {
  className?: string;
}

export default function PortalFooter({ className = '' }: PortalFooterProps) {
  return (
    <footer className={`border-t border-outline-variant/15 bg-surface py-12 ${className}`}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-10 md:flex-row">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="text-sm font-bold text-primary">SEAS Engineering Excellence</span>
          <p className="text-xs tracking-wide text-on-surface-variant">
            © 2024 SEAS Engineering Excellence. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-wide text-on-surface-variant transition-colors duration-200 hover:text-secondary"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
