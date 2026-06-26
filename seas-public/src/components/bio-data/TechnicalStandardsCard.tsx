export default function TechnicalStandardsCard() {
  return (
    <div className="bg-primary text-white rounded-2xl p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 -left-4 w-20 h-20 bg-secondary/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        <h4 className="font-headline font-bold text-base mb-2">Technical Standards</h4>
        <p className="text-xs leading-relaxed opacity-80">
          Please ensure all bio-data matches your official government-issued documents.
          Discrepancies may delay your examination scheduling.
        </p>
      </div>
    </div>
  );
}
