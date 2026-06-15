import { useState } from 'react';
import ExamCenterStats from '@/components/exam-centers/ExamCenterStats';
import ExamCenterTable from '@/components/exam-centers/ExamCenterTable';
import CampusSpatialView from '@/components/exam-centers/CampusSpatialView';
import CapacityUtilization from '@/components/exam-centers/CapacityUtilization';
import { Filter, Plus, Info, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateExamCenter } from '@/hooks/useExams';

export default function ExamCenters() {
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', city: '', capacity: '' });
  const createCenter = useCreateExamCenter();

  const handleFilter = () => {
    setShowFilter((prev) => !prev);
    toast.info(showFilter ? 'Filter panel closed' : 'Use the search bar in the table to filter venues');
  };

  const handleAddCenter = () => setShowModal(true);

  const handleCreateCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.city || !form.capacity) {
      toast.error('Please fill in all fields');
      return;
    }
    createCenter.mutate(
      {
        name: form.name,
        address: form.address,
        city: form.city,
        capacity: parseInt(form.capacity, 10),
      },
      {
        onSuccess: () => {
          toast.success('Exam center created successfully');
          setShowModal(false);
          setForm({ name: '', address: '', city: '', capacity: '' });
        },
        onError: () => toast.error('Failed to create exam center'),
      }
    );
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="space-y-1">
          <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            Admin Console <span className="text-[9px]">•</span> Infrastructure
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Exam Centers</h2>
          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Manage physical testing environments, terminal distribution, and accessibility protocols across the SEAS campus network.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleFilter}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-primary border border-outline-variant/30 rounded-lg hover:bg-slate-50 transition-all text-xs font-bold shadow-sm"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={handleAddCenter}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-secondary text-white rounded-lg hover:opacity-90 transition-all text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Center
          </button>
        </div>
      </div>

      <ExamCenterStats />
      <ExamCenterTable />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 xl:col-span-8">
          <CampusSpatialView />
        </div>
        <div className="lg:col-span-7 xl:col-span-4 space-y-6">
          <CapacityUtilization />
          <div className="bg-blue-50 border-l-4 border-primary p-5 rounded-r-lg flex items-start gap-3 shadow-sm border border-blue-100/30">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">System Notice</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Centers marked inactive will be excluded from auto-allocation. Ensure capacity values are accurate before running assignment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary">Add Exam Center</h3>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCenter} className="space-y-4">
              <input
                className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm"
                placeholder="Center name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
              <input
                className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
              <input
                type="number"
                min="1"
                className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 text-sm"
                placeholder="Capacity"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                required
              />
              <button
                type="submit"
                disabled={createCenter.isPending}
                className="w-full py-2.5 bg-secondary text-white rounded-lg font-bold text-sm disabled:opacity-60"
              >
                {createCenter.isPending ? 'Creating...' : 'Create Center'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
