import { BadgeCheck } from 'lucide-react';

export default function ReviewHeader() {
  return (
    <header className="mb-10">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-secondary uppercase">
        <BadgeCheck size={14} />
        <span>Final Review</span>
      </div>
      <h1 className="mb-4 text-center font-headline text-4xl font-extrabold tracking-tight text-primary md:text-left">
        Review &amp; Submit Application
      </h1>
      <p className="max-w-2xl text-center text-lg leading-relaxed text-on-surface-variant md:text-left">
        Please verify all information provided. Once submitted, your application enters the verification phase
        and cannot be modified.
      </p>
    </header>
  );
}
