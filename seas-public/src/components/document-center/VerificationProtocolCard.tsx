import { Check } from 'lucide-react';

const RULES = [
  'Ensure all edges are visible.',
  'Resolution must be at least 300 DPI.',
  'Only English or officially translated copies are accepted.',
];

export default function VerificationProtocolCard() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-white shadow-lg">
      <h4 className="mb-4 font-headline text-xl font-bold">Verification Protocol</h4>
      <ul className="space-y-4">
        {RULES.map((text) => (
          <li key={text} className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-secondary-container p-1">
              <Check size={10} className="text-secondary" />
            </div>
            <p className="text-xs leading-relaxed font-medium text-white/80">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
