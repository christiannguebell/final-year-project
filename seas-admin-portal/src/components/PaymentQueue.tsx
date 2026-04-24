import React from 'react';
import { 
  Hourglass, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Calendar,
  CloudUpload,
  Building,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flag
} from 'lucide-react';
import { motion } from 'motion/react';
import { CANDIDATES, Candidate } from '@/src/constants';
import { cn } from '@/src/lib/utils';

export const PaymentQueue: React.FC<{ onSelectCandidate: (c: Candidate) => void }> = ({ onSelectCandidate }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight mb-2">
          Payment Verification Queue
        </h2>
        <p className="text-slate-500 font-body">
          Review and authorize student application fee payments for the current admission cycle.
        </p>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          label="Pending Verification" 
          value="84" 
          change="↑ 12% from yesterday" 
          icon={<Hourglass className="text-primary" size={24} />} 
          borderClass="border-primary"
        />
        <MetricCard 
          label="Total Verified Today" 
          value="142" 
          change="89% completion rate" 
          icon={<CheckCircle className="text-secondary" size={24} />} 
          borderClass="border-secondary"
          changeColor="text-secondary"
        />
        <MetricCard 
          label="Unmatched Transactions" 
          value="12" 
          change="Requires manual link" 
          icon={<AlertCircle className="text-red-500" size={24} />} 
          borderClass="border-red-500"
          changeColor="text-red-500"
        />
      </div>

      {/* Filters */}
      <div className="bg-surface-container-low p-6 rounded-xl flex flex-col lg:flex-row items-end gap-4 shadow-sm">
        <div className="w-full lg:w-1/4">
          <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Search Candidate</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Name or App ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border-none rounded-lg text-sm focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>
        </div>
        <div className="w-full lg:w-1/5">
          <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Program</label>
          <select className="w-full py-2.5 bg-white border-none rounded-lg text-sm focus:ring-2 focus:ring-primary shadow-sm appearance-none px-4">
            <option>All Programs</option>
            <option>B.Eng Computer Science</option>
            <option>M.Eng Civil Engineering</option>
          </select>
        </div>
        <div className="w-full lg:w-1/5">
          <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Bank</label>
          <select className="w-full py-2.5 bg-white border-none rounded-lg text-sm focus:ring-2 focus:ring-primary shadow-sm appearance-none px-4">
            <option>All Institutions</option>
            <option>Sterling Trust</option>
            <option>Global Allied Bank</option>
          </select>
        </div>
        <div className="w-full lg:w-1/5">
          <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Date Range</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              defaultValue="Oct 20 - Oct 27, 2023"
              className="w-full pl-10 pr-4 py-2.5 bg-white border-none rounded-lg text-sm focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>
        </div>
        <button className="w-full lg:w-auto px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
          <Filter size={16} />
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 border-b border-slate-200/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Application ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {CANDIDATES.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary text-xs">
                      {c.initials}
                    </div>
                    <button 
                      onClick={() => onSelectCandidate(c)}
                      className="text-sm font-semibold text-primary hover:underline underline-offset-4"
                    >
                      {c.name}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-600 font-medium">{c.appId}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    {c.method === 'Receipt Upload' ? <CloudUpload size={14} /> : <Building size={14} />}
                    {c.method}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-primary">{c.amount}</td>
                <td className="px-6 py-5 text-sm font-mono text-slate-400 uppercase tracking-tighter">{c.txnId}</td>
                <td className="px-6 py-5 text-sm text-slate-500">{c.date}</td>
                <td className="px-6 py-5">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    c.status === 'PENDING' && "bg-emerald-100 text-emerald-700",
                    c.status === 'UNDER REVIEW' && "bg-primary-container text-white",
                    c.status === 'FLAGGED' && "bg-red-100 text-red-700",
                    c.status === 'VERIFIED' && "bg-blue-100 text-blue-700"
                  )}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right space-x-2">
                  <button className="p-1.5 hover:bg-slate-100 rounded text-primary transition-colors">
                    <Eye size={18} />
                  </button>
                  <button className="p-1.5 hover:bg-emerald-50 rounded text-secondary transition-colors">
                    <CheckCircle size={18} />
                  </button>
                  <button className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors">
                    <Flag size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 flex justify-between items-center border-t border-slate-200/50">
          <span className="text-xs font-medium text-slate-500">
            Showing <span className="text-primary font-bold">1-10</span> of 84 entries
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-xs font-medium hover:bg-slate-50">2</button>
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-xs font-medium hover:bg-slate-50">3</button>
            <span className="text-slate-400 px-1">...</span>
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-xs font-medium hover:bg-slate-50">9</button>
            <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-400 hover:bg-slate-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, change, icon, borderClass, changeColor = 'text-secondary' }: any) => (
  <div className={cn("bg-white p-6 rounded-xl border-l-4 shadow-sm flex flex-col justify-between transition-transform hover:scale-[1.02]", borderClass)}>
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      {icon}
    </div>
    <div className="mt-4">
      <span className="text-4xl font-headline font-extrabold text-primary">{value}</span>
      <span className={cn("ml-2 text-xs font-medium", changeColor)}>{change}</span>
    </div>
  </div>
);
