import type { AcademicRecord } from '../../types/application';

interface NewAcademicEntryFormProps {
  value: Partial<AcademicRecord> & { gpa?: string; scale?: string };
  onChange: (value: Partial<AcademicRecord> & { gpa?: string; scale?: string }) => void;
  onSave: () => void;
  onCancel: () => void;
}

const inputClass =
  'w-full rounded-lg border border-outline-variant/30 bg-white px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50';

const labelClass = 'block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5';

export default function NewAcademicEntryForm({ value, onChange, onSave, onCancel }: NewAcademicEntryFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/10 shadow-sm p-6">
      <h3 className="font-headline text-lg font-bold text-on-surface mb-6">New Academic Entry</h3>

      <div className="space-y-5">
        {/* Institution Name — full width */}
        <div>
          <label className={labelClass}>Institution Name</label>
          <input
            type="text"
            value={value.institution ?? ''}
            onChange={(e) => onChange({ ...value, institution: e.target.value })}
            placeholder="e.g., Stanford University"
            className={inputClass}
          />
        </div>

        {/* Degree Type + Major/Field of Study */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Degree Type</label>
            <select
              value={value.degree ?? ''}
              onChange={(e) => onChange({ ...value, degree: e.target.value })}
              className={`${inputClass} appearance-none`}
            >
              <option value="">Select Degree</option>
              <option value="Bachelors Degree">Bachelors Degree</option>
              <option value="Masters Degree">Masters Degree</option>
              <option value="PhD / Doctorate">PhD / Doctorate</option>
              <option value="Secondary School">Secondary School</option>
              <option value="International Baccalaureate">International Baccalaureate</option>
              <option value="Associate Degree">Associate Degree</option>
              <option value="Diploma">Diploma / Certificate</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Major / Field of Study</label>
            <input
              type="text"
              value={value.fieldOfStudy ?? ''}
              onChange={(e) => onChange({ ...value, fieldOfStudy: e.target.value })}
              placeholder="e.g., Civil Engineering"
              className={inputClass}
            />
          </div>
        </div>

        {/* Graduation Date + GPA + Scale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-1">
            <label className={labelClass}>Graduation Date</label>
            <input
              type="date"
              value={value.endDate ?? ''}
              onChange={(e) => onChange({ ...value, endDate: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>GPA</label>
            <input
              type="text"
              value={value.gpa ?? ''}
              onChange={(e) => onChange({ ...value, gpa: e.target.value })}
              placeholder="3.8"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Scale</label>
            <input
              type="text"
              value={value.scale ?? '4.0'}
              onChange={(e) => onChange({ ...value, scale: e.target.value })}
              placeholder="4.0"
              className={inputClass}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-8 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}
