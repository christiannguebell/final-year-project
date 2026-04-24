import { Users, CircleDollarSign, BarChart, ShieldCheck, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { BarChart as ReBarChart, Bar, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboardStats, useApplicationsOverTime } from '@/hooks/useAnalytics';
import { StatCard } from '@/components/StatCard';
import { TaskItem } from '@/components/TaskItem';
import { ActivityItem } from '@/components/ActivityItem';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
}

const CHART_COLORS = ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#002d6233', '#002d6266', '#002d6299', '#00193c', '#046d40cc'];

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: trendData } = useApplicationsOverTime();

  const chartData = trendData?.map((item) => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.count
  })) || [
    { name: 'W1', value: 420 },
    { name: 'W2', value: 550 },
    { name: 'W3', value: 480 },
    { name: 'W4', value: 720 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full">
      {/* Summary Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          label="Total Candidates" 
          value={statsLoading ? '...' : stats?.totalCandidates?.toLocaleString() || '0'} 
          trend="+14.2%" 
          trendType="up" 
          icon={Users} 
          iconBg="bg-primary-fixed" 
          iconColor="text-primary"
          borderColor="border-primary/10"
        />
        <StatCard 
          label="Total Applications" 
          value={statsLoading ? '...' : stats?.totalApplications?.toLocaleString() || '0'} 
          trend="+8.1%" 
          trendType="up" 
          icon={CircleDollarSign} 
          iconBg="bg-secondary-container" 
          iconColor="text-on-secondary-container"
          borderColor="border-secondary/10"
        />
        <StatCard 
          label="Application Volume" 
          value={statsLoading ? '...' : stats?.totalApplications?.toLocaleString() || '0'} 
          trend="Stable" 
          trendType="stable" 
          icon={BarChart} 
          iconBg="bg-surface-container-high" 
          iconColor="text-primary"
          borderColor="border-primary/10"
        />
        <StatCard 
          label="Pending Verification" 
          value={statsLoading ? '...' : stats?.pendingApplications?.toLocaleString() || '0'} 
          trend="Critical" 
          trendType="critical" 
          icon={ShieldCheck} 
          iconBg="bg-error-container" 
          iconColor="text-error"
          borderColor="border-error/10"
        />
      </section>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Analytics Content */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="architect-card p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-20"></div>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-headline font-bold text-primary">Registration Trends</h3>
                <p className="text-sm text-on-surface-variant">Candidate onboarding over time</p>
              </div>
            </div>

            <div className="h-64 mt-4" style={{ minHeight: '300px' }}>
               <ResponsiveContainer width="100%" height={300}>
                 <ReBarChart data={chartData}>
                   <Tooltip 
                     cursor={{fill: 'transparent'}}
                     content={({ active, payload }: ChartTooltipProps) => {
                       if (active && payload && payload.length) {
                         return (
                           <div className="bg-primary text-white text-[10px] py-1 px-2 rounded">
                             {payload[0].value}
                           </div>
                         );
                       }
                       return null;
                     }}
                   />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {chartData.map((_, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
              <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest px-1">
                <span>Week 01</span>
                <span>Week 02</span>
                <span>Week 03</span>
                <span>Week 04</span>
              </div>
            </div>
          </div>

          {/* Task Summary */}
          <div className="architect-card p-8 border-l-4 border-secondary">
            <h3 className="text-xl font-headline font-bold text-primary mb-6">Task Summary</h3>
            <div className="space-y-4">
              <TaskItem 
                title="Verify Engineering Credentials" 
                subtitle={`${stats?.pendingApplications || 0} pending reviews`} 
                badge="High Priority" 
                icon={CheckCircle2} 
                iconBg="bg-secondary/10" 
                iconColor="text-secondary"
              />
              <TaskItem 
                title="Schedule Hall Logistics" 
                subtitle="Update seating arrangements" 
                badge="Due in 2d" 
                icon={Clock} 
                iconBg="bg-primary/10" 
                iconColor="text-primary"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-primary-container text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute right-[-10%] top-[-10%] opacity-10">
              <ShieldCheck className="w-[160px] h-[160px]" />
            </div>
            <h3 className="text-lg font-headline font-bold mb-2 text-white">System Integrity</h3>
            <p className="text-sm text-blue-200 font-medium mb-6">Security protocols are currently optimal.</p>
            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-lg p-3">
                <p className="text-[10px] uppercase font-bold text-blue-300">Uptime</p>
                <p className="text-xl font-headline font-extrabold">99.98%</p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-lg p-3">
                <p className="text-[10px] uppercase font-bold text-blue-300">Response</p>
                <p className="text-xl font-headline font-extrabold">124ms</p>
              </div>
            </div>
          </div>

          <div className="architect-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-headline font-bold text-primary">Recent Activity</h3>
            </div>
            <div className="space-y-8 relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-slate-100"></div>
              
              <ActivityItem 
                name="System"
                action="processed"
                target={`${stats?.totalApplications || 0} applications`}
                time="Just now"
                icon={TrendingUp}
                statusColor="border-secondary"
              />
              <ActivityItem 
                name="Admin"
                action="approved"
                target={`${stats?.approvedApplications || 0} applications`}
                time="Recently"
                icon={CheckCircle2}
                statusColor="border-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
