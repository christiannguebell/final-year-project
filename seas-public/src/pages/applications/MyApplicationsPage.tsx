/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import {
  Search,
  ListFilter,
  ArrowUpDown,
  Plus,
  FileText,
  FileEdit,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Wallet,
} from 'lucide-react';
import { useMyApplications } from '../../hooks/useApplications';
import type { Application } from '../../types/entities';
import TopNav from '../../components/layout/TopNav';
import Sidebar from '../../components/layout/Sidebar';

const statusLabels: Record<string, string> = {
  under_review: 'Under Review',
  draft: 'Draft',
  approved: 'Approved',
  rejected: 'Rejected',
  submitted: 'Submitted',
};

export default function MyApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: response, isLoading, error } = useMyApplications();

  const applicationList = useMemo<Application[]>(() => (response as any)?.data?.items || (response as any)?.items || [], [response]);

  const filteredApplications = useMemo(
    () =>
      applicationList.filter(
        (app: Application) =>
          app.program?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.id.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [applicationList, searchQuery]
  );

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <Sidebar />
      <main className="ml-64 pt-24 pb-12 px-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-headline font-extrabold text-primary tracking-tight mb-2"
              >
                My Applications
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-on-surface-variant text-lg max-w-2xl leading-relaxed"
              >
                Manage your academic journey. Track the status of your current submissions and review
                past academic records.
              </motion.p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/application/new')}
              className="px-6 py-3 bg-primary text-white rounded-xl font-headline font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 hover:bg-primary-container transition-all"
            >
              <Plus size={18} />
              New Application
            </motion.button>
          </div>

          <div className="flex gap-4 mb-10">
            <div className="flex-1 relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by application ID or program name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 placeholder:text-outline transition-all"
              />
            </div>
            <div className="flex gap-3">
              <FilterButton icon={<ListFilter size={18} />} label="Filter" />
              <FilterButton icon={<ArrowUpDown size={18} />} label="Sort" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-on-surface-variant">Loading applications...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-error">Failed to load applications</div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-on-surface-variant">No applications found</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredApplications.map((app: Application, index: number) => (
                <ApplicationCard key={app.id} app={app} index={index} />
              ))}
            </div>
          )}

          <section className="bg-primary-container rounded-[2rem] overflow-hidden flex flex-col lg:flex-row relative">
            <div className="flex-1 p-12 lg:p-16 z-10">
              <h2 className="text-3xl lg:text-4xl font-headline font-extrabold text-white mb-6 leading-tight max-w-lg">
                Navigating your Academic Future with Precision
              </h2>
              <p className="text-surface-container-lowest/70 text-lg mb-10 leading-relaxed max-w-xl font-medium">
                Our evaluation process typically takes 4-6 weeks for graduate applications. You
                will receive notification for each phase transition including technical review,
                committee interview, and final decision.
              </p>
              <div className="flex flex-wrap gap-8">
                <EditorialLink label="Evaluation Criteria" />
                <EditorialLink label="Technical Standards" />
              </div>
            </div>
            <div className="lg:w-2/5 relative h-64 lg:h-auto overflow-hidden">
              <img
                src="https://picsum.photos/seed/university/800/600"
                alt="University Architecture"
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 mix-blend-overlay"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/80 to-transparent"></div>
            </div>
          </section>
        </main>
    </div>
  );
}

interface FilterButtonProps {
  icon: React.ReactNode;
  label: string;
}

function FilterButton({ icon, label }: FilterButtonProps) {
  return (
    <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-low text-on-surface rounded-2xl text-sm font-bold hover:bg-surface-container-high transition-all border border-transparent hover:border-outline-variant/20">
      {icon}
      {label}
    </button>
  );
}

const ApplicationCard: React.FC<{ app: Application; index: number }> = ({ app, index }) => {
  const navigate = useNavigate();
  const isPrimary = index === 0;

  const statusColors: Record<string, string> = {
    under_review: 'bg-secondary-container/50 text-secondary',
    draft: 'bg-surface-container-high text-on-surface-variant',
    approved: 'bg-secondary/10 text-secondary border border-secondary/20',
    rejected: 'bg-error-container/30 text-error border border-error/20',
    submitted: 'bg-primary-container text-white',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    under_review: <FileText size={16} />,
    draft: <FileEdit size={16} />,
    approved: <CheckCircle2 size={16} />,
    rejected: <XCircle size={16} />,
    submitted: <FileText size={16} />,
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const paymentStatus = useMemo(() => {
    const payments = app.payments || [];
    if (payments.length === 0) return 'unpaid';
    if (payments.some(p => p.status === 'verified')) return 'paid';
    if (payments.some(p => p.status === 'pending')) return 'pending_verification';
    if (payments.every(p => p.status === 'rejected')) return 'rejected';
    return 'unpaid';
  }, [app]);

  const paymentStatusConfig: Record<string, { label: string; class: string }> = {
    paid: { label: 'Paid', class: 'bg-secondary/10 text-secondary border border-secondary/20' },
    pending_verification: { label: 'Pending Verification', class: 'bg-primary-container/20 text-primary border border-primary/20' },
    rejected: { label: 'Payment Rejected', class: 'bg-error/10 text-error border border-error/20' },
    unpaid: { label: 'Unpaid', class: 'bg-surface-container-high text-on-surface-variant' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
      className={`bg-surface-container-lowest rounded-3xl p-8 shadow-[0px_8px_32px_rgba(0,0,0,0.03)] border border-outline-variant/5 transition-all flex flex-col ${
        isPrimary ? 'md:col-span-2' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          {isPrimary && (
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">
              Current Intake
            </span>
          )}
          <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-primary mb-4">
            {statusIcons[app.status]}
          </div>
          <h3
            className={`${
              isPrimary ? 'text-2xl' : 'text-lg'
            } font-headline font-bold text-primary leading-tight`}
          >
            {app.program?.name || 'Unknown Program'}
          </h3>
          <p className="text-xs text-on-surface-variant font-semibold mt-1 opacity-60">
            ID: {app.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight ${statusColors[app.status]}`}
          >
            {statusLabels[app.status]}
          </span>
          {app.status !== 'draft' && (
            <span
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight ${paymentStatusConfig[paymentStatus].class}`}
            >
              {paymentStatusConfig[paymentStatus].label}
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-outline-variant/5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">
            {app.status === 'draft' ? 'LAST SAVED' : 'SUBMITTED ON'}
          </p>
          <p className="text-sm font-headline font-bold text-on-surface">
            {app.status === 'draft'
              ? formatDate(app.updatedAt)
              : formatDate(app.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (app.status === 'draft') {
              sessionStorage.setItem('seas_application_draft', JSON.stringify(app));
              navigate(`/application/edit/${app.id}`);
            } else if (app.status === 'approved') {
              navigate(`/applications/${app.id}/decision`);
            } else {
              navigate(`/applications/${app.id}`);
            }
          }}
          className={`text-xs font-headline font-bold px-4 py-2 rounded-lg transition-all ${
            isPrimary
              ? 'bg-primary text-white hover:bg-primary-container'
              : 'text-primary hover:underline'
          }`}
        >
          {app.status === 'draft'
            ? 'Continue'
            : app.status === 'approved'
              ? 'View Decision'
              : 'View Details'}
        </button>
        {app.status === 'submitted' && paymentStatus !== 'paid' && (
          <button
            onClick={() => navigate(`/applications/${app.id}/payment`)}
            className={`text-xs font-headline font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
              paymentStatus === 'pending_verification'
                ? 'bg-primary-container/10 text-primary border border-primary/20 hover:bg-primary-container/20'
                : 'bg-secondary text-white hover:bg-secondary-container'
            }`}
          >
            <Wallet size={12} />
            {paymentStatus === 'pending_verification' ? 'Payment Pending' : 'Pay Now'}
          </button>
        )}
        </div>
      </div>
    </motion.div>
  );
};

function EditorialLink({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 text-white font-headline font-bold text-sm group">
      <span className="border-b-2 border-secondary pb-1 group-hover:border-white transition-all">
        {label}
      </span>
      <ArrowUpRight
        size={16}
        className="text-secondary group-hover:text-white transition-all"
      />
    </button>
  );
};
