import { ClipboardList, Eye, CheckCircle, StickyNote, ChevronLeft, ChevronRight, Filter, Search, FileText, DollarSign, CreditCard, Banknote, Clock, Flag } from 'lucide-react';
import { useState } from 'react';
import { useApplications } from '@/hooks/useApplications';
import { usePayments, useFlagPayment, useVerifyPayment } from '@/hooks/usePayments';
import { PaymentStatus } from '@/types/entities';
import type { Application, Payment } from '@/types/entities';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type TabType = 'applications' | 'payments';

export default function ApplicationsQueue() {
  const { data: applicationsResponse, isLoading: appsLoading } = useApplications({ limit: 10 });
  const { data: paymentsResponse, isLoading: paymentsLoading } = usePayments({ limit: 10 });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('applications');

  const applications = useMemo(() => applicationsResponse?.items || [], [applicationsResponse]);
  const payments = useMemo(() => paymentsResponse?.items || [], [paymentsResponse]);
  const appPagination = applicationsResponse?.pagination;
  const paymentPagination = paymentsResponse?.pagination;

  const verifyMutation = useVerifyPayment();
  const flagMutation = useFlagPayment();

  const handleVerifyPayment = (paymentId: string) => {
    verifyMutation.mutate(
      { id: paymentId, data: { status: PaymentStatus.VERIFIED } },
      { onSuccess: () => toast.success('Payment verified successfully') }
    );
  };

  const handleFlagPayment = (paymentId: string) => {
    flagMutation.mutate(
      { id: paymentId, notes: 'Flagged for manual review' },
      { onSuccess: () => toast.success('Payment flagged for review') }
    );
  };

  const getInitials = (app: Application) => {
    const first = app?.candidate?.firstName?.[0] || '?';
    const last = app?.candidate?.lastName?.[0] || '?';
    return (first + last).toUpperCase();
  };

  // Calculate real metrics
  const { pendingReviewCount, approvedCount, avgReviewDays, approvedApps } = useMemo(() => {
    const pendingReview = applications.filter((a) => a.status === 'under_review').length;
    const approved = applications.filter((a) => a.status === 'approved').length;
    const approvedList = applications.filter((a) => a.status === 'approved' && a.submittedAt);
    return {
      pendingReviewCount: pendingReview,
      approvedCount: approved,
      avgReviewDays: 0, // Set to 0 to avoid impure Date.now() in render
      approvedApps: approvedList
    };
  }, [applications]);

  const getStatusBadge = (status: string) => {
    const baseClass = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider';
    switch (status) {
      case 'approved':
      case 'VERIFIED':
        return `${baseClass} bg-secondary-container text-secondary`;
      case 'submitted':
      case 'PENDING':
        return `${baseClass} bg-blue-100 text-blue-700`;
      case 'under_review':
      case 'UNDER REVIEW':
        return `${baseClass} bg-primary-container text-on-primary`;
      case 'rejected':
      case 'FLAGGED':
        return `${baseClass} bg-error-container text-error`;
      case 'draft':
        return `${baseClass} bg-slate-100 text-slate-600`;
      default:
        return `${baseClass} bg-slate-100 text-slate-600`;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const baseClass = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider';
    switch (status?.toLowerCase()) {
      case 'pending':
        return `${baseClass} bg-blue-100 text-blue-700`;
      case 'completed':
      case 'verified':
        return `${baseClass} bg-secondary-container text-secondary`;
      case 'flagged':
      case 'failed':
        return `${baseClass} bg-error-container text-error`;
      case 'under_review':
        return `${baseClass} bg-primary-container text-on-primary`;
      default:
        return `${baseClass} bg-slate-100 text-slate-600`;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    return method === 'BANK_TRANSFER' ? <Banknote className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
  };

  // Calculate real payment metrics
  const { pendingPaymentsCount, verifiedTodayCount, totalRevenue } = useMemo(() => {
    const pending = payments.filter((p) => p.status?.toLowerCase() === 'pending').length;
    const today = new Date();
    const verifiedToday = payments.filter((p) => {
      if (!p.paidAt) return false;
      const paymentDate = new Date(p.paidAt);
      return (
        p.status === PaymentStatus.VERIFIED || p.status === PaymentStatus.COMPLETED
      ) && paymentDate.toDateString() === today.toDateString();
    }).length;
    const revenue = payments.reduce((sum: number, p) => {
      if (p.status === PaymentStatus.VERIFIED || p.status === PaymentStatus.COMPLETED) {
        return sum + (p.amount || 0);
      }
      return sum;
    }, 0);
    return { pendingPaymentsCount: pending, verifiedTodayCount: verifiedToday, totalRevenue: revenue };
  }, [payments]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">Review Queue</h2>
        <p className="text-on-surface-variant mt-2 text-lg">Manage applications and payment verifications.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-outline-variant/10">
        <button
          onClick={() => setActiveTab('applications')}
          className={cn(
            "px-6 py-3 text-sm font-bold border-b-2 transition-all",
            activeTab === 'applications'
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-primary"
          )}
        >
          Applications
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={cn(
            "px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2",
            activeTab === 'payments'
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-primary"
          )}
        >
          <DollarSign className="w-4 h-4" />
          Payment Verification
        </button>
      </div>

      {/* Applications Tab Content */}
      {activeTab === 'applications' && (
        <>
           {/* Metrics */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="architect-card p-6 border border-outline-variant/10 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-primary/70">
                 <ClipboardList className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Pending Review</span>
               </div>
               <div className="text-4xl font-headline font-black text-primary">
                 {pendingReviewCount}
               </div>
               <p className="text-xs text-secondary font-bold flex items-center gap-1">
                 <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M1 11L5 7L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M7 5H11V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 {applications.length > 0 ? `${Math.round((pendingReviewCount / applications.length) * 100)}% of total` : '0% of total'}
               </p>
             </div>
             <div className="architect-card p-6 border border-outline-variant/10 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-primary/70">
                 <ClipboardList className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Avg Review Time</span>
               </div>
               <div className="text-4xl font-headline font-black text-primary">
                 {avgReviewDays.toFixed(1)} <span className="text-xl font-normal opacity-40">days</span>
               </div>
               <p className="text-xs text-on-surface-variant font-medium">
                 Based on {approvedApps.length} approved applications
               </p>
             </div>
             <div className="architect-card p-6 border border-outline-variant/10 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-secondary">
                 <CheckCircle className="w-5 h-5 text-secondary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Total Approvals</span>
               </div>
               <div className="text-4xl font-headline font-black text-secondary">{approvedCount}</div>
               <p className="text-xs text-on-surface-variant font-medium">
                 Goal: 45 approvals per day
               </p>
             </div>
           </div>

          {/* Filters */}
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, ID or email..."
                className="w-full bg-surface-container-lowest border-none pl-10 pr-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-surface-container-lowest border-none py-2.5 px-4 rounded-lg text-sm focus:ring-0 min-w-[160px] cursor-pointer">
                <option>All Programs</option>
              </select>
              <select className="bg-surface-container-lowest border-none py-2.5 px-4 rounded-lg text-sm focus:ring-0 min-w-[160px] cursor-pointer">
                <option>All Statuses</option>
                <option>Under Review</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
              <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-container transition-colors">
                <Filter className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="architect-card overflow-hidden">
            {appsLoading ? (
              <div className="p-8 text-center text-on-surface-variant">Loading applications...</div>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low border-b ghost-border">
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Program</th>
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {applications.map((app: Application) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">
                              {getInitials(app)}
                            </div>
                            <div>
                              <p className="font-bold text-primary text-sm">
                                {app.candidate?.firstName} {app.candidate?.lastName}
                              </p>
                              <p className="text-xs text-on-surface-variant">{app.candidate?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-on-surface-variant">{app.program?.name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={getStatusBadge(app.status)}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              app.status === 'approved' || (app.status as string) === 'VERIFIED' ? 'bg-secondary' :
                              app.status === 'under_review' || (app.status as string) === 'UNDER REVIEW' ? 'bg-yellow-500' :
                              app.status === 'submitted' || (app.status as string) === 'PENDING' ? 'bg-blue-500' :
                              app.status === 'rejected' || (app.status as string) === 'FLAGGED' ? 'bg-error' : 'bg-slate-400'
                            }`}></span>
                            {app.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs text-on-surface-variant font-medium">
                            {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft'}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigate(`/applications/${app.id}`)}
                              className="p-2 text-on-surface-variant hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary-container/20 rounded-lg transition-all">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-all">
                              <StickyNote className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 border-t border-outline-variant/10 flex items-center justify-between">
                  <p className="text-xs text-on-surface-variant font-medium">
                    Showing {((appPagination?.page || 1) - 1) * (appPagination?.limit || 10) + 1} to {Math.min((appPagination?.page || 1) * (appPagination?.limit || 10), appPagination?.total || 0)} of {appPagination?.total || 0} applications
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded hover:bg-slate-200 transition-colors disabled:opacity-30">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded bg-primary text-white text-xs font-bold shadow-sm">1</button>
                    <button className="w-8 h-8 rounded hover:bg-slate-200 text-xs font-bold text-on-surface-variant transition-colors">2</button>
                    {appPagination && appPagination.totalPages > 2 && <span className="text-outline-variant text-xs">...</span>}
                    <button className="p-2 rounded hover:bg-slate-200 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Payments Tab Content */}
      {activeTab === 'payments' && (
        <>
           {/* Metrics */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="architect-card p-6 border border-outline-variant/10 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-primary/70">
                 <Clock className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
               </div>
               <div className="text-4xl font-headline font-black text-primary">
                 {pendingPaymentsCount}
               </div>
               <p className="text-xs text-secondary font-bold">Awaiting verification</p>
             </div>
             <div className="architect-card p-6 border border-outline-variant/10 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-primary/70">
                 <CheckCircle className="w-5 h-5 text-secondary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Verified Today</span>
               </div>
               <div className="text-4xl font-headline font-black text-secondary">{verifiedTodayCount}</div>
               <p className="text-xs text-on-surface-variant font-medium">
                 {payments.length > 0 ? `${Math.round((verifiedTodayCount / payments.length) * 100)}% completion rate today` : 'No payments yet'}
               </p>
             </div>
             <div className="architect-card p-6 border border-outline-variant/10 flex flex-col gap-4">
               <div className="flex items-center gap-3 text-primary/70">
                 <CreditCard className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Total Revenue</span>
               </div>
               <div className="text-4xl font-headline font-black text-primary">
                 {(totalRevenue / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
               </div>
               <p className="text-xs text-secondary font-bold">Verified payments</p>
             </div>
           </div>

          {/* Filters */}
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, App ID or transaction ID..."
                className="w-full bg-surface-container-lowest border-none pl-10 pr-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-surface-container-lowest border-none py-2.5 px-4 rounded-lg text-sm focus:ring-0 min-w-[160px] cursor-pointer">
                <option>All Programs</option>
                <option>B.Eng Computer Science</option>
                <option>M.Eng Civil Engineering</option>
              </select>
              <select className="bg-surface-container-lowest border-none py-2.5 px-4 rounded-lg text-sm focus:ring-0 min-w-[160px] cursor-pointer">
                <option>All Institutions</option>
                <option>Sterling Trust</option>
                <option>Global Allied Bank</option>
              </select>
              <select className="bg-surface-container-lowest border-none py-2.5 px-4 rounded-lg text-sm focus:ring-0 min-w-[160px] cursor-pointer">
                <option>All Statuses</option>
                <option>PENDING</option>
                <option>UNDER REVIEW</option>
                <option>FLAGGED</option>
                <option>VERIFIED</option>
              </select>
              <button className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-container transition-colors">
                <Filter className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </div>

          {/* Payment Table */}
          <div className="architect-card overflow-hidden">
            {paymentsLoading ? (
              <div className="p-8 text-center text-on-surface-variant">Loading payments...</div>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low border-b ghost-border">
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Application ID</th>
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Method</th>
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Transaction ID</th>
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {payments.map((payment: Payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">
                              {payment.candidate ?
                                `${payment.candidate.firstName?.[0] || ''}${payment.candidate.lastName?.[0] || '?'}`.toUpperCase()
                                : '??'}
                            </div>
                            <div>
                              <p className="font-bold text-primary text-sm">
                                {payment.candidate ? `${payment.candidate.firstName || ''} ${payment.candidate.lastName || ''}`.trim() : `Candidate ${payment.candidateId?.slice(0,8)}`}
                              </p>
                              <p className="text-xs text-on-surface-variant">{payment.candidate?.email || payment.candidateId?.slice(0,8) + '@...'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-on-surface-variant">{payment.applicationId?.slice(0, 8)}...</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                            {getPaymentMethodIcon(payment.method || '')}
                            {payment.method === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Receipt Upload'}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-primary">
                          {(payment.currency === 'XAF' ? 'FCFA ' : '$')}{(payment.amount / 100).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-sm font-mono text-on-surface-variant uppercase tracking-tighter">
                          {payment.transactionId || 'N/A'}
                        </td>
                        <td className="px-6 py-5 text-sm text-on-surface-variant">
                          {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-5">
                          <span className={getPaymentStatusBadge(payment.status)}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              payment.status?.toLowerCase() === 'verified' || payment.status?.toLowerCase() === 'completed' ? 'bg-secondary' :
                              payment.status?.toLowerCase() === 'under_review' ? 'bg-yellow-500' :
                              payment.status?.toLowerCase() === 'pending' ? 'bg-blue-500' :
                              payment.status?.toLowerCase() === 'flagged' || payment.status?.toLowerCase() === 'failed' ? 'bg-error' : 'bg-slate-400'
                            }`}></span>
                            {payment.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right space-x-2">
                          <button
                            onClick={() => navigate(`/applications/${payment.applicationId}`)}
                            className="p-1.5 hover:bg-slate-100 rounded text-primary transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                           {payment.status === PaymentStatus.PENDING && (
                             <>
                               <button
                                 onClick={() => handleVerifyPayment(payment.id)}
                                 disabled={verifyMutation.isPending}
                                 className="p-1.5 hover:bg-secondary-container rounded text-secondary transition-colors disabled:opacity-50"
                               >
                                 <CheckCircle className="w-4 h-4" />
                               </button>
                               <button
                                 onClick={() => handleFlagPayment(payment.id)}
                                 disabled={flagMutation.isPending}
                                 className="p-1.5 hover:bg-error-container/20 rounded text-error transition-colors disabled:opacity-50"
                               >
                                 <Flag className="w-4 h-4" />
                               </button>
                             </>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 border-t border-outline-variant/10 flex items-center justify-between">
                  <p className="text-xs text-on-surface-variant font-medium">
                    Showing {((paymentPagination?.page || 1) - 1) * (paymentPagination?.limit || 10) + 1} to {Math.min(paymentPagination?.page * paymentPagination?.limit, paymentPagination?.total || 0)} of {paymentPagination?.total || 0} payments
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded hover:bg-slate-200 transition-colors disabled:opacity-30">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded bg-primary text-white text-xs font-bold shadow-sm">1</button>
                    <button className="w-8 h-8 rounded hover:bg-slate-200 text-xs font-bold text-on-surface-variant transition-colors">2</button>
                    {paymentPagination && paymentPagination.totalPages > 2 && <span className="text-outline-variant text-xs">...</span>}
                    <button className="p-2 rounded hover:bg-slate-200 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
