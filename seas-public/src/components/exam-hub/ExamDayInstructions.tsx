import { Clock, Briefcase, PenLine } from 'lucide-react';

const instructions = [
  {
    Icon: Clock,
    title: 'Arrival Protocol',
    description:
      'Candidates must report to the examination hall exactly 30 minutes before the scheduled start time. Late entry beyond 09:15 AM will not be permitted under any circumstances.',
  },
  {
    Icon: Briefcase,
    title: 'Mandatory Documentation',
    description:
      'Ensure you have a printed copy of your Admission Slip and a valid Government-issued ID (Passport, National ID, or Student ID). Digital copies are not accepted.',
  },
  {
    Icon: PenLine,
    title: 'Permitted Items',
    description:
      'Non-programmable calculators (model FX-991EX only), blue/black ink pens, and a clear water bottle without labels.',
  },
];

export default function ExamDayInstructions() {
  return (
    <div className="flex-1 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
      <h2 className="text-lg font-bold text-primary mb-6">Exam Day Instructions</h2>
      <div className="space-y-6">
        {instructions.map(({ Icon, title, description }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-outline-variant/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-sm">{title}</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
