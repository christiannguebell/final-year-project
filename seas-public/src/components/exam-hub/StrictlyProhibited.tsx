import { SmartphoneNfc, Headphones, BookOpen, Briefcase, AlertTriangle } from 'lucide-react';

const prohibited = [
  { Icon: SmartphoneNfc, label: 'Mobile phones & Smartwatches' },
  { Icon: Headphones, label: 'Headphones & Electronic earplugs' },
  { Icon: BookOpen, label: 'Textbooks, notes, or scrap paper' },
  { Icon: Briefcase, label: 'Bags and opaque pencil cases' },
];

export default function StrictlyProhibited() {
  return (
    <div className="w-full md:w-80 shrink-0 bg-red-50 border-l-4 border-error rounded-xl p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <AlertTriangle className="w-5 h-5 text-error" />
        <h2 className="text-lg font-extrabold text-error tracking-tight">Strictly Prohibited</h2>
      </div>

      {/* Items */}
      <ul className="space-y-3">
        {prohibited.map(({ Icon, label }) => (
          <li key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 bg-error rounded flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-on-surface">{label}</span>
          </li>
        ))}
      </ul>

      {/* Note */}
      <p className="mt-6 text-xs text-error/80 italic leading-relaxed border-t border-error/20 pt-4">
        Note: A secure locker area will be available for personal belongings, but SEAS holds no responsibility for lost items.
      </p>
    </div>
  );
}
