/**
 * Admin Platform Overview Page
 * =============================
 * B1.4D-T3 — Platform (overview) extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/12-b1.4d-t3-platform-users.md
 *
 * The complete "overview" tab content, extracted out of `AdminDashboard`. It is
 * STATELESS today, so it takes no props and owns no state. Overview-only chart
 * data and the shared chart palette come from `./adminPlatformData`.
 *
 * ## NOT a redesign
 *
 * T3 is decomposition. The four summary cards, Growth Analytics, Program
 * Popularity, their values, chart data and labels are preserved exactly. The
 * only changes are accessibility fixes to normal-size text:
 *
 *   - the Growth Analytics legend labels no longer use raw `brand-blue` /
 *     `brand-orange` (#009688 / #f59e0b) as normal text on white; and
 *   - the summary-card trend badge uses `emerald-700` instead of `emerald-600`.
 *
 * Chart stroke/fill semantics and the decorative summary-card icon colours are
 * deliberately unchanged — formal visual cleanup is B1.5/T10.
 */

import { DollarSign, MapPin, UserPlus, Users2 } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { COLORS, programData } from './adminPlatformData';

export function AdminOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Siswa Aktif', value: '1,284', trend: '+12%', icon: Users2, color: 'text-brand-blue' },
          { label: 'Active Leads', value: '450', trend: '+25%', icon: UserPlus, color: 'text-brand-orange' },
          { label: 'Tryout Offline Boyolali', value: '15 Mei', trend: 'Upcoming', icon: MapPin, color: 'text-brand-orange' },
          { label: 'Revenue (MTD)', value: 'Rp 420jt', trend: '+14%', icon: DollarSign, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="card-premium p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-bold text-brand-navy mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card-premium p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-brand-navy">Growth Analytics</h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-brand-blue" /> Students</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-brand-orange" /> Leads</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Week 1', students: 40, leads: 120 },
                { name: 'Week 2', students: 65, leads: 180 },
                { name: 'Week 3', students: 85, leads: 240 },
                { name: 'Week 4', students: 120, leads: 310 },
              ]}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="students" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                <Area type="monotone" dataKey="leads" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-premium p-8">
          <h3 className="font-bold text-brand-navy mb-8">Program Popularity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={programData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {programData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {programData.map((prog, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs font-medium text-slate-600">{prog.name}</span>
                </div>
                <span className="text-xs font-bold text-brand-navy">{prog.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverviewPage;
