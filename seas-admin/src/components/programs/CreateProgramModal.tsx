import React, { useState } from 'react';
import { useCreateProgram } from '@/hooks/usePrograms';
import { toast } from 'sonner';
import { X, CheckCircle } from 'lucide-react';

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProgramModal({ isOpen, onClose }: CreateProgramModalProps) {
  const { mutate, isPending } = useCreateProgram();
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [level, setLevel] = useState<'Graduate' | 'Undergrad'>('Graduate');
  const [capacity, setCapacity] = useState('100');
  const [deadline, setDeadline] = useState('');
  const [durationYears, setDurationYears] = useState('4');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('Program Title is required');
      return;
    }

    // Generate program code from title (e.g. "Mechanical Engineering" -> "MECH-01")
    const words = title.replace(/[^a-zA-Z0-9\s]/g, '').split(' ');
    let code = '';
    if (words.length >= 2) {
      code = (words[0].substring(0, 3) + '-' + words[1].substring(0, 2)).toUpperCase();
    } else if (words.length === 1) {
      code = words[0].substring(0, 4).toUpperCase() + '-01';
    } else {
      code = 'PROG-' + Math.floor(100 + Math.random() * 900);
    }
    
    // Add unique random tag to prevent conflicts
    code = `${code}-${Math.floor(10 + Math.random() * 90)}`;

    mutate(
      {
        name: title,
        code,
        durationYears: parseInt(durationYears, 10),
        description: `${description || 'No description provided.'} | Dept: ${department} | Level: ${level} | Cap: ${capacity} | Deadline: ${deadline}`,
      },
      {
        onSuccess: () => {
          toast.success('Program created successfully!');
          setTitle('');
          setDescription('');
          onClose();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to create program.');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-outline-variant/10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-primary text-white p-6 relative">
          <h2 className="text-xl font-headline font-bold text-white">Create New Program</h2>
          <p className="text-xs text-blue-200 mt-1">Define the parameters for a new academic curriculum.</p>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Program Title */}
          <div>
            <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
              Program Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. M.S. Quantum Computing"
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Structural Engineering">Structural Engineering</option>
              </select>
            </div>

            {/* Academic Level */}
            <div>
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
                Academic Level
              </label>
              <div className="grid grid-cols-2 bg-surface-container-low p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLevel('Graduate')}
                  className={`py-2 text-xs font-bold rounded-md transition-all ${
                    level === 'Graduate'
                      ? 'bg-white text-primary shadow-sm border border-outline-variant/10'
                      : 'text-on-surface-variant/70 hover:text-primary'
                  }`}
                >
                  Graduate
                </button>
                <button
                  type="button"
                  onClick={() => setLevel('Undergrad')}
                  className={`py-2 text-xs font-bold rounded-md transition-all ${
                    level === 'Undergrad'
                      ? 'bg-white text-primary shadow-sm border border-outline-variant/10'
                      : 'text-on-surface-variant/70 hover:text-primary'
                  }`}
                >
                  Undergrad
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Enrollment Capacity */}
            <div>
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
                Enrollment Capacity
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="100"
                  min="1"
                  className="w-full bg-surface-container-low border-none rounded-lg pl-4 pr-12 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
                <span className="absolute right-4 text-xs font-bold text-on-surface-variant/50">Seats</span>
              </div>
            </div>

            {/* Duration Years */}
            <div>
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
                Duration (Years)
              </label>
              <select
                value={durationYears}
                onChange={(e) => setDurationYears(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                required
              >
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5">5 Years</option>
                <option value="6">6 Years</option>
              </select>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              />
            </div>
          </div>

          {/* Program Description */}
          <div>
            <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
              Program Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of the program objectives..."
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-surface-container-lowest text-primary hover:bg-surface-container-high rounded-lg text-xs font-bold border border-outline-variant/20 transition-all"
            >
              Cancel Action
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-secondary text-white hover:opacity-90 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {isPending ? 'Creating...' : 'Confirm and Create'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
