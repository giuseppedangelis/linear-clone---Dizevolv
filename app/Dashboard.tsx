
import React, { useMemo } from 'react';
import { useStore } from '../store';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { Status, Analytics } from '../types';
import { ActivityFeed } from '../components/ActivityFeed';

const StatCard = ({ label, value, subtext, trend }: { label: string, value: number | string, subtext?: string, trend?: { value: string, positive: boolean } }) => (
  <div className="bg-app-surface border border-app-border p-5 rounded-xl">
    <div className="flex justify-between items-start mb-2">
      <div className="text-[10px] font-bold text-content-secondary uppercase tracking-widest">{label}</div>
      {trend && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend.positive ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-error/10 text-brand-error'}`}>
          {trend.positive ? '↑' : '↓'} {trend.value}
        </span>
      )}
    </div>
    <div className="text-3xl font-bold text-content-primary mb-1">{value}</div>
    {subtext && <div className="text-[10px] text-content-secondary font-medium">{subtext}</div>}
  </div>
);

// Fix: Make children optional in the type definition to resolve JSX children mapping issues in some TS configurations
const ChartContainer = ({ title, children, className = "" }: { title: string, children?: React.ReactNode, className?: string }) => (
  <div className={`bg-app-surface border border-app-border rounded-xl p-6 flex flex-col ${className}`}>
    <h3 className="text-[11px] font-bold uppercase tracking-widest text-content-secondary mb-6 border-b border-app-border pb-2 flex items-center gap-2">
      <span className="w-1 h-3 bg-brand-primary rounded-full"></span>
      {title}
    </h3>
    <div className="flex-1 min-h-[240px]">
      {children}
    </div>
  </div>
);

const Dashboard = () => {
  const issues = useStore(s => s.issues);
  const currentUser = useStore(s => s.currentUser);

  // Mock Analytics Generation Logic
  const analyticsData: Analytics = useMemo(() => {
    // Velocity
    const velocity = [
      { cycleName: 'Cycle 12', completed: 24, total: 30 },
      { cycleName: 'Cycle 13', completed: 18, total: 22 },
      { cycleName: 'Cycle 14', completed: 32, total: 35 },
      { cycleName: 'Cycle 15', completed: 28, total: 40 },
    ];

    // Cycle Time Distribution
    const distribution = [
      { days: 1, count: 5 }, { days: 2, count: 12 }, { days: 3, count: 25 },
      { days: 4, count: 18 }, { days: 5, count: 10 }, { days: 6, count: 4 },
      { days: 7, count: 2 },
    ];

    // Burndown
    const burndown = [
      { day: 'Mon', expected: 40, actual: 40 },
      { day: 'Tue', expected: 32, actual: 34 },
      { day: 'Wed', expected: 24, actual: 28 },
      { day: 'Thu', expected: 16, actual: 18 },
      { day: 'Fri', expected: 8, actual: 12 },
      { day: 'Sat', expected: 0, actual: 5 },
    ];

    // Status Breakdown
    const statusBreakdown = Object.values(Status).map(s => ({
      name: s,
      value: issues.filter(i => i.status === s).length || Math.floor(Math.random() * 10) + 1
    }));

    // Activity Map (Simulated for last 28 days)
    const activityMap = Array.from({ length: 28 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (27 - i));
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 8)
      };
    });

    return {
      velocity,
      cycleTime: { min: 1, max: 12, average: 4.2, median: 3.5, distribution },
      burndown,
      statusBreakdown,
      activityMap
    };
  }, [issues]);

  const COLORS = ['#FF5500', '#FF7733', '#8a8f98', '#E68159', '#C01540'];

  // Global activity feed
  const allActivities = useMemo(() => {
    return issues.flatMap(i => i.activities).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
  }, [issues]);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-app-bg transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-brand-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">Team Analytics</div>
            <h1 className="text-3xl font-bold text-content-primary tracking-tight">
              Welcome back, <span className="text-brand-primary">{currentUser.name.split(' ')[0]}</span>
            </h1>
            <p className="text-content-secondary text-sm mt-1">Here's a look at your team's performance and delivery metrics.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-app-surface border border-app-border rounded-lg text-xs font-bold text-content-primary hover:bg-app-border transition-colors">Export Report</button>
            <button className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20">Invite Team</button>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Scope"
            value={issues.length}
            subtext="Issues in backlog"
            trend={{ value: '12%', positive: true }}
          />
          <StatCard
            label="Completed"
            value={issues.filter(i => i.status === Status.DONE).length}
            subtext="Merged this cycle"
            trend={{ value: '5%', positive: true }}
          />
          <StatCard
            label="Avg. Cycle Time"
            value={`${analyticsData.cycleTime.average}d`}
            subtext="From started to done"
            trend={{ value: '0.8d', positive: false }}
          />
          <StatCard
            label="Throughput"
            value="18.5"
            subtext="Issues per week"
            trend={{ value: '3.2', positive: true }}
          />
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Velocity Chart */}
          <ChartContainer title="Team Velocity" className="lg:col-span-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.velocity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="cycleName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
                />
                <Tooltip
                  cursor={{ fill: 'var(--color-bg-sidebar)', opacity: 0.5 }}
                  contentStyle={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px' }} />
                <Bar dataKey="completed" name="Completed" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="total" name="Planned" fill="var(--color-border-strong)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Status Distribution Pie */}
          <ChartContainer title="Status Breakdown" className="lg:col-span-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.statusBreakdown}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', bottom: 0 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Burndown Chart */}
          <ChartContainer title="Active Cycle Burndown" className="lg:col-span-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.burndown} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="actual" name="Actual Remaining" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorActual)" strokeWidth={3} />
                <Line type="monotone" dataKey="expected" name="Ideal Burndown" stroke="var(--color-text-secondary)" strokeDasharray="5 5" dot={false} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Activity Heatmap Grid */}
          <ChartContainer title="Recent Team Activity" className="lg:col-span-6">
            <div className="flex flex-col h-full">
              <div className="flex-1 grid grid-cols-7 gap-2">
                {analyticsData.activityMap.map((day, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-sm border border-app-border/50 group relative transition-all`}
                    style={{
                      backgroundColor: day.count === 0 ? 'transparent' : `rgba(255, 85, 0, ${Math.min(day.count / 8, 1)})`
                    }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-app-surface border border-app-border-strong px-2 py-1 rounded text-[10px] whitespace-nowrap z-30 shadow-xl">
                      {day.date}: {day.count} contributions
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] text-content-secondary font-mono">
                <span>Last 28 days</span>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded-sm bg-app-bg border border-app-border"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-brand-primary/20"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-brand-primary/50"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-brand-primary/80"></div>
                  <div className="w-2.5 h-2.5 rounded-sm bg-brand-primary"></div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>

        {/* Bottom Section: Feed & Details */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
          <div className="lg:col-span-4 bg-app-surface border border-app-border rounded-xl p-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-content-secondary mb-6 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Recent History
            </h3>
            <ActivityFeed activities={allActivities} />
            {allActivities.length === 0 && (
              <div className="py-10 text-center text-xs text-content-secondary italic">No recent activity</div>
            )}
          </div>
          <div className="lg:col-span-8 bg-app-surface border border-app-border rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <h2 className="text-xl font-bold text-content-primary mb-2">High Team Health</h2>
            <p className="text-sm text-content-secondary max-w-md mx-auto mb-6">Your team's velocity has increased by 15% compared to the last cycle. Focus on maintaining this momentum while keeping an eye on the backlog growth.</p>
            <button className="text-xs font-bold text-brand-primary hover:underline uppercase tracking-widest">Generate Detailed Insights →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
