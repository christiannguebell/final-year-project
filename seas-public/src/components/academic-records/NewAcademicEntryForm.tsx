import type { AcademicRecord } from '../../types/application';

interface NewAcademicEntryFormProps {
  value: Partial<AcademicRecord> & { gpa?: string; scale?: string };
  onChange: (value: Partial<AcademicRecord> & { gpa?: string; scale?: string }) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function NewAcademicEntryForm({ value, onChange, onSave, onCancel }: NewAcademicEntryFormProps) {
  return (
    <div className="rounded-xl border border-primary/10 bg-surface-container-low p-8 shadow-sm">
      <h3 className="mb-6 font-headline text-lg font-bold text-primary">New Academic Entry</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold text-on-surface-variant uppercase">Institution Name</label>
            <input
              type="text"
              value={value.institution ?? ''}
              onChange={(e) => onChange({ ...value, institution: e.target.value })}
              placeholder="e.g., Stanford University"
              className="w-full rounded-t-lg border-b-2 border-primary bg-surface-container-lowest p-3 text-sm shadow-sm focus:ring-0 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-on-surface-variant uppercase">Degree Type</label>
            <select
              value={value.degree ?? ''}
              onChange={(e) => onChange({ ...value, degree: e.target.value })}
              className="w-full appearance-none rounded-t-lg border-b-2 border-primary bg-surface-container-lowest p-3 text-sm shadow-sm focus:ring-0 focus:outline-none"
            >
              <option value="">Select Degree</option>
              <option value="Bachelors Degree">Bachelors Degree</option>
              <option value="Masters Degree">Masters Degree</option>
              <option value="PhD / Doctorate">PhD / Doctorate</option>
              <option value="Secondary School">Secondary School</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-on-surface-variant uppercase">
              Major / Field of Study
            </label>
            <input
              type="text"
              value={value.fieldOfStudy ?? ''}
              onChange={(e) => onChange({ ...value, fieldOfStudy: e.target.value })}
              placeholder="e.g., Civil Engineering"
              className="w-full rounded-t-lg border-b-2 border-primary bg-surface-container-lowest p-3 text-sm shadow-sm focus:ring-0 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-on-surface-variant uppercase">Graduation Date</label>
            <input
              type="date"
              value={value.endDate ?? ''}
              onChange={(e) => onChange({ ...value, endDate: e.target.value })}
              className="w-full rounded-t-lg border-b-2 border-primary bg-surface-container-lowest p-3 text-sm shadow-sm focus:ring-0 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold text-on-surface-variant uppercase">GPA</label>
              <input
                type="text"
                value={value.gpa ?? ''}
                onChange={(e) => onChange({ ...value, gpa: e.target.value })}
                placeholder="3.8"
                className="w-full rounded-t-lg border-b-2 border-primary bg-surface-container-lowest p-3 text-sm shadow-sm focus:ring-0 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold text-on-surface-variant uppercase">Scale</label>
              <input
                type="text"
                value={value.scale ?? '4.0'}
                onChange={(e) => onChange({ ...value, scale: e.target.value })}
                placeholder="4.0"
                className="w-full rounded-t-lg border-b-2 border-primary bg-surface-container-lowest p-3 text-sm shadow-sm focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-6 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-surface-container-high"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="ml-4 rounded-lg bg-primary px-8 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}
