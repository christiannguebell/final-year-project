export default function DocumentCenterHeader() {
  return (
    <header className="mb-10">
      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
        <span>Step 4 of 6</span>
        <span className="h-px w-8 bg-outline-variant/30" />
      </div>
      <h1 className="mb-4 text-center font-headline text-4xl font-extrabold tracking-tight text-primary md:text-left">
        Document Center
      </h1>
      <p className="max-w-2xl text-center leading-relaxed text-on-surface-variant md:text-left">
        Please upload high-resolution documents for institutional verification. Supported formats: PDF, JPEG,
        PNG (Max 10MB).
      </p>
    </header>
  );
}
