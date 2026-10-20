import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, 
  Search,
  Bell,
  Filter,
  Edit2,
  Shield,
  Calendar,
  Layout,
  Wallet,
  TrendingUp,
  Target,
  Download,
  Upload,
  Save,
  X,
  FileText,
  Megaphone,
  DollarSign,
  TrendingDown,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { BLOG_POSTS, USER_ACCOUNTS, MOCK_FEEDBACKS, PROGRAMS } from '../constants';
import { BlogPost, UserAccount, Program } from '../types';
import {
  ADMIN_ROLE_PERMISSIONS,
  isAdminTabAllowed,
  type AdminRole,
  type AdminTab,
} from '../features/admin/shell/adminWorkspaceModel';
import { useAdminShell } from '../features/admin/shell/AdminShellContext';
import { readStorageArray } from '../features/admin/adminStorage';
import { AdminOverviewPage, COLORS } from '../features/admin/platform';
import {
  AdminUsersPage,
  useAdminUsersDomain,
  isApprovedStudentRecord,
  userFromStudentRecord,
} from '../features/admin/users';
import {
  AdminQuestionBankPage,
  useAdminQuestionsDomain,
} from '../features/admin/academic';
import {
  AdminContentLibraryPage,
  useAdminContentDomain,
} from '../features/admin/studio/content';
import {
  AdminWebsiteEditorPage,
  AdminWebsiteSaveConfirmDialog,
  AdminBlogEditorDialog,
  AdminBlogMiddleInsertDialog,
  AdminBlogAssetEditorDialog,
  AdminBlogPreviewDialog,
  useAdminWebsiteDomain,
} from '../features/admin/studio/website';
import {
  AdminInquiriesPage,
  useAdminInquiriesDomain,
  AdminTestimonialsPage,
  useAdminTestimonialsDomain,
} from '../features/admin/review';
import {
  AdminProgramsPage,
  useAdminProgramsDomain,
  AdminProgramEditorDialog,
  AdminProgramSaveConfirmDialog,
  AdminLeadsPage,
  useAdminLeadsDomain,
  AdminLeadEditorDialog,
  AdminLeadConvertDialog,
  AdminLeadDetailDialog,
  AdminMarketingPage,
  useAdminMarketingDomain,
  AdminCampaignEditorDialog,
} from '../features/admin/commerce';
import {
  AdminFinancePage,
  useAdminFinanceDomain,
} from '../features/admin/commerce/finance';


const currencyOptions = [
  { code: 'IDR', label: 'Rupiah Indonesia', symbol: 'Rp', locale: 'id-ID' },
  { code: 'USD', label: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
  { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM', locale: 'ms-MY' },
];

const parseCurrencyAmount = (value: string | number): number =>
  Number(String(value).replace(/[^\d]/g, '')) || 0;

const formatCurrencyAmount = (value: string | number, currencyCode = 'IDR'): string => {
  const currency = currencyOptions.find((item) => item.code === currencyCode) || currencyOptions[0];
  const amount = typeof value === 'number' ? value : parseCurrencyAmount(value);
  return `${currency.symbol} ${amount.toLocaleString(currency.locale)}`;
};


const revenueData = [
  { name: 'Mon', rev: 4000, students: 240 },
  { name: 'Tue', rev: 3000, students: 139 },
  { name: 'Wed', rev: 2000, students: 980 },
  { name: 'Thu', rev: 2780, students: 390 },
  { name: 'Fri', rev: 1890, students: 480 },
  { name: 'Sat', rev: 2390, students: 380 },
  { name: 'Sun', rev: 3490, students: 430 },
];

const programPerformanceData = [
  { name: 'SNBT Kedokteran', active: 420, leads: 650, revenue: 1050 },
  { name: 'SKD CPNS', active: 215, leads: 450, revenue: 268 },
  { name: 'Kedinasan', active: 180, leads: 310, revenue: 270 },
  { name: 'OSN Math', active: 95, leads: 220, revenue: 95 },
  { name: 'Poltekkes', active: 154, leads: 280, revenue: 185 },
];





interface AuditEvent {
  id: string;
  module: string;
  action: string;
  detail: string;
  actor: string;
  createdAt: string;
}

interface NotificationEvent {
  id: string;
  channel: 'Email' | 'WhatsApp' | 'System';
  recipient: string;
  subject: string;
  message: string;
  status: 'Draft' | 'Queued' | 'Sent';
  createdAt: string;
}










interface AdminMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastActive: string;
}

// B1.4D-T1: `AdminRole`, `AdminTab`, `rolePermissions` and the tab <-> path
// mapping now live in the pure model at
// `src/features/admin/shell/adminWorkspaceModel.ts`. The local duplicate
// definitions were removed so the routing contract has ONE source of truth.

export const AdminDashboard: React.FC<{ logout: () => void, setView?: (v: any) => void, programs?: Program[], onProgramsChange?: (programs: Program[]) => void, blogPosts?: BlogPost[], onBlogPostsChange?: (posts: BlogPost[]) => void }> = ({ logout, setView, programs = PROGRAMS, onProgramsChange, blogPosts = BLOG_POSTS, onBlogPostsChange }) => {
  // B1.4D-T2: shell-level state (adminRole, activeTab, navigation) now comes
  // from AdminShellContext, mounted in AdminLayout. The URL is the single
  // source of truth for the active tab; the shell derives it from the
  // pathname. AdminDashboard no longer owns `adminRole` or a local active-tab
  // state.
  //
  // `setActiveTab` is retained as a thin compatibility shim so the ~76 existing
  // cross-section call sites inside this 6,500-line file do NOT need a bulk
  // rewrite: it now delegates to the shell's navigateToTab.
  const { adminRole, activeTab, navigateToTab } = useAdminShell();
  const setActiveTab = (tab: AdminTab) => {
    navigateToTab(tab);
  };
  const [actionMessage, setActionMessage] = useState('');
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => readStorageArray('theprams_demo_audit_events'));
  const [notificationEvents, setNotificationEvents] = useState<NotificationEvent[]>(() => readStorageArray('theprams_demo_notifications'));
  // Admin Team Management State
  const [adminTeam, setAdminTeam] = useState<AdminMember[]>([
    { id: '1', name: 'dr. Pramono', email: 'pram@theprams.com', role: 'Super Admin', lastActive: 'Sekarang' },
    { id: '2', name: 'Maya Sari', email: 'maya@theprams.com', role: 'Content Manager', lastActive: '2 jam lalu' },
    { id: '3', name: 'Rudi Hermawan', email: 'help@theprams.com', role: 'Support', lastActive: '1 hari lalu' },
  ]);

  // Tab permissions mapping.
  //
  // B1.4D-T1: the registry now lives in the pure model
  // (`ADMIN_ROLE_PERMISSIONS`). This local alias keeps the ~3 downstream
  // references inside this file working unchanged.
  //
  // NOTE: this is UI presentation filtering ONLY. It is not authorization.
  // SEC-P1-03 (real admin auth) remains OPEN and is owned by B2.
  const rolePermissions: Record<AdminRole, AdminTab[]> = ADMIN_ROLE_PERMISSIONS;

  const isTabAllowed = (tab: AdminTab) => isAdminTabAllowed(adminRole, tab);

  const notify = (message: string) => {
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(''), 2600);
  };

  const recordAudit = (module: string, action: string, detail: string) => {
    const event: AuditEvent = {
      id: `audit-${Date.now()}`,
      module,
      action,
      detail,
      actor: adminRole,
      createdAt: new Date().toLocaleString('id-ID')
    };
    const nextEvents = [event, ...auditEvents].slice(0, 100);
    setAuditEvents(nextEvents);
    localStorage.setItem('theprams_demo_audit_events', JSON.stringify(nextEvents));
  };

  const queueNotification = (channel: NotificationEvent['channel'], recipient: string, subject: string, message: string) => {
    const event: NotificationEvent = {
      id: `notif-${Date.now()}`,
      channel,
      recipient,
      subject,
      message,
      status: 'Queued',
      createdAt: new Date().toLocaleString('id-ID')
    };
    const nextEvents = [event, ...notificationEvents].slice(0, 100);
    setNotificationEvents(nextEvents);
    localStorage.setItem('theprams_demo_notifications', JSON.stringify(nextEvents));
  };

  const downloadTextFile = (filename: string, content: string, mime = 'text/csv') => {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    notify(`${filename} berhasil dibuat.`);
  };


















  const runContextualAdd = () => {
    if (activeTab === 'leads') leadsDomain.addDemoLead();
    else if (activeTab === 'users') {
      const newUser: UserAccount = {
        id: Date.now().toString(),
        name: 'Staff Baru',
        email: 'staffbaru@theprams.com',
        role: 'Support',
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        status: 'Active',
        joinedAt: new Date().toISOString().split('T')[0]
      };
    persistUsers([newUser, ...users]);
    notify('Staff baru ditambahkan.');
    } else if (activeTab === 'programs') {
      programsDomain.openContextualProgramDraft();
    } else if (activeTab === 'questions') {
      questionsDomain.openContextualQuestionDraft();
    } else if (activeTab === 'content') {
      contentDomain.openUpload();
    } else if (activeTab === 'marketing') {
      marketingDomain.openCampaignEditor();
    } else {
      notify(`Aksi tambah untuk tab ${activeTab} tersedia di mode demo.`);
    }
  };
  
  // B1.4D-T6 â€” Review / Testimonials domain.
  //
  // The testimonials list + moderation filter used to live inline here, ABOVE
  // the conditional `activeTab === 'testimonials'` JSX. They now live in a
  // focused domain hook invoked by THIS persistent orchestrator, so a filter
  // selection still survives client-side tab changes. Testimonials stay
  // IN-MEMORY (seeded from the TESTIMONIALS constant) â€” no persistence is
  // added, and only `notify` is injected.
  const testimonialsDomain = useAdminTestimonialsDomain({ notify });
  // B1.4D-T7A â€” Commerce Programs domain.
  //
  // Programs becomes the CANONICAL source for the editable program list. The
  // legacy prop bridge is preserved (initial state from `programs` + the
  // `useEffect` re-sync) with NO persistence added. The same `programsList`
  // now feeds the Users domain, the Content Library editor, the Leads domain
  // and the Programs page â€” there is deliberately NO second programs store.
  const programsDomain = useAdminProgramsDomain({ programs, onProgramsChange, notify, recordAudit });

  // B1.4D-T3 â€” Users domain.
  //
  // The Users state (users / editingUser / userDirectoryView / roleFilter /
  // usersSearchTerm) now lives in a dedicated domain hook invoked by this
  // PERSISTENT orchestrator, not by the route-mounted AdminUsersPage. That
  // keeps one canonical users store for the cross-domain consumers that also
  // read/write it: Lead conversion, Finance approval auto-create, and the
  // contextual add. `notify`/`recordAudit`/`programsList` are injected so the
  // hook never imports this component.
  const usersDomain = useAdminUsersDomain({
    programs: programsDomain.programsList,
    notify,
    recordAudit,
  });
  const { users, persistUsers } = usersDomain;

  const financeDomain = useAdminFinanceDomain({
    users,
    persistUsers,
    notify,
    recordAudit,
    queueNotification,
    downloadTextFile,
  });
  // B1.4D-T7A â€” Commerce Leads domain.
  //
  // Leads has a DUAL data source (persisted `theprams_demo_leads` + the
  // in-memory seed/demo list). It consumes the SAME canonical Programs list
  // and the SAME canonical Users store (`users` / `persistUsers`) so Lead â†’
  // Student conversion persists through `usersDomain.persistUsers` â€” no second
  // Users store and no second UserAccount persistence implementation.
  const leadsDomain = useAdminLeadsDomain({
    programs: programsDomain.programsList,
    users: usersDomain.users,
    persistUsers: usersDomain.persistUsers,
    notify,
    recordAudit,
  });

  // B1.4D-T7B â€” Commerce Marketing domain.
  //
  // The Marketing state (campaignForm + isCampaignEditorOpen) used to live
  // inline here, ABOVE the conditional `activeTab === 'marketing'` JSX. It now
  // lives in a focused domain hook invoked by THIS persistent orchestrator, so
  // an in-progress campaign draft survives client-side tab changes. Campaign
  // state is IN-MEMORY (no persistence). `notify`/`recordAudit` are injected so
  // the hook never imports this component.
  const marketingDomain = useAdminMarketingDomain({ notify, recordAudit });

  // B1.4D-T4 â€” Question Bank (academic) domain.
  //
  // Same reasoning as Users: the Question Bank state lived ABOVE the
  // conditional questions JSX so a transient draft survived tab changes. The
  // canonical (in-memory, demo) question store therefore stays owned by this
  // PERSISTENT orchestrator, not by the route-mounted AdminQuestionBankPage.
  // Only `notify` is injected; no finance/users/programs/Studio state.
  const questionsDomain = useAdminQuestionsDomain({ notify });

  // B1.4D-T5A â€” Content Library (Studio / video) domain.
  //
  // Same reasoning as Users/Questions: the Content Library state (video list,
  // upload modal, editor draft, upload progress) lived ABOVE the conditional
  // content JSX so a transient upload/editor draft survived tab changes. The
  // canonical store therefore stays owned by this PERSISTENT orchestrator, not
  // by the route-mounted AdminContentLibraryPage. `notify` and `recordAudit`
  // are injected so the hook never imports this component.
  //
  // T5A extracts the CONTENT LIBRARY only. The Website/Blog T5B state below is
  // intentionally NOT part of this domain.
  const contentDomain = useAdminContentDomain({ notify, recordAudit });
  // B1.4D-T5B: the Website Editor + Blog/Literasi domain now lives in
  // `src/features/admin/studio/website`. The hook is invoked by THIS
  // persistent orchestrator (not by the route-mounted page) so an
  // in-progress article draft / asset edit / modal flag keeps surviving
  // client-side tab changes exactly as the legacy inline state did.
  // `blogPosts` / `onBlogPostsChange` remain the canonical legacy bridge;
  // `notify` and `recordAudit` are injected so the hook never imports this
  // component.
  const websiteDomain = useAdminWebsiteDomain({ blogPosts, onBlogPostsChange, notify, recordAudit });
  // B1.4D-T6 â€” Review / Inquiries domain.
  //
  // The Inquiries state used to live inline here, ABOVE the conditional
  // `activeTab === 'inquiries'` JSX. It now lives in a focused domain hook
  // invoked by THIS persistent orchestrator (not by the route-mounted page),
  // preserving the legacy transient state. `queueNotification`/`recordAudit`/
  // `notify` are injected so the hook never imports this component.
  const inquiriesDomain = useAdminInquiriesDomain({ notify, recordAudit, queueNotification });







  
  // B1.4D-T5A â€” the Content Library (video list / upload / editor) state and
  // its helpers were extracted into `useAdminContentDomain`; see `contentDomain`
  // above. No video/upload state may be re-declared here.

  return (
    <div className="min-w-0 flex flex-col bg-slate-50 font-sans">
      {/* Notification action row (B1.4D-T3).
          The T2 transitional toolbar carried a "Search dashboard..." input
          that only ever filtered Users; T3 moved that search into the Users
          page. What remains is the notification bell, which is business-coupled
          (notify() uses actionMessage) and stays owned by AdminDashboard.
          It must NOT become a sticky second global header. */}
      <div className="flex items-center justify-end gap-4 px-8 py-4 bg-white border-b border-slate-200">
        <button
          onClick={() => notify('Notifikasi: 3 pembayaran menunggu verifikasi dan 2 testimoni pending.')}
          aria-label="Lihat notifikasi admin"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 border border-slate-100 relative"
        >
           <Bell size={20} aria-hidden="true" />
           <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed right-6 bottom-6 z-[2000] bg-brand-navy text-white px-5 py-4 rounded-2xl shadow-2xl max-w-sm text-sm font-bold"
          >
            {actionMessage}
          </motion.div>
        )}
      </AnimatePresence>

         <div className="p-8">
            {activeTab === 'overview' && <AdminOverviewPage />}

            {activeTab === 'leads' && (
              <AdminLeadsPage domain={leadsDomain} />
            )}

             {activeTab === 'users' && (
              <AdminUsersPage
                domain={usersDomain}
                programs={programsDomain.programsList}
                rolePermissions={rolePermissions}
                notify={notify}
              />
            )}

            {/* Feedback Tab content skipped for brevity... */}

            {activeTab === 'inquiries' && (
              <AdminInquiriesPage domain={inquiriesDomain} />
            )}

            {activeTab === 'content' && (
              <AdminContentLibraryPage domain={contentDomain} programs={programsDomain.programsList} />
            )}

            {activeTab === 'marketing' && (
              <AdminMarketingPage domain={marketingDomain} />
            )}

            {activeTab === 'website' && (
              <AdminWebsiteEditorPage
                domain={websiteDomain}
                onPreviewWebsite={() => setView?.('landing')}
              />
            )}
            {activeTab === 'finance' && (
              <AdminFinancePage domain={financeDomain} auditEvents={auditEvents} notificationEvents={notificationEvents} />
            )}            {activeTab === 'programs' && (
              <AdminProgramsPage domain={programsDomain} onNewProgram={runContextualAdd} />
            )}

            {activeTab === 'questions' && (
              <AdminQuestionBankPage
                domain={questionsDomain}
                onDownloadTemplate={() => downloadTextFile('question-import-template.csv', 'subject,difficulty,text,option_a,option_b,correct_ans,tags\nPenalaran Umum,Medium,Contoh soal...,Pilihan A,Pilihan B,A,SNBT')}
              />
            )}

            {activeTab === 'testimonials' && (
              <AdminTestimonialsPage domain={testimonialsDomain} />
            )}

            {activeTab === 'reports' && (
              <div className="animate-in fade-in duration-500 space-y-8">
                <div className="flex justify-between items-center">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">Deep Analytics & Reports</h2>
                      <p className="text-sm text-slate-500">Comprehensive breakdown of revenue, growth, and payment metrics</p>
                   </div>
                   <div className="flex gap-3">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <Calendar size={16} className="text-slate-400" />
                        <select className="text-xs font-bold text-slate-600 bg-transparent border-none outline-none cursor-pointer">
                          <option>7 Days Lately</option>
                          <option>Last 30 Days</option>
                          <option>Year to Date</option>
                          <option>Custom Range</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <Filter size={16} className="text-slate-400" />
                        <select className="text-xs font-bold text-slate-600 bg-transparent border-none outline-none cursor-pointer">
                          <option>All Programs</option>
                          <option>SNBT Only</option>
                          <option>CPNS Only</option>
                        </select>
                      </div>
                      <button
                        onClick={() => downloadTextFile('analytics-report.csv', 'metric,value\nActive Subscriptions,950\nRetention Rate,92.4%\nGross Revenue MTD,Rp 1.84M')}
                        className="btn-secondary flex items-center gap-2 px-6"
                      >
                        <Download size={18} />
                        Export
                      </button>
                   </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { title: 'Date Range', desc: 'Filter periode laporan 7 hari, 30 hari, year-to-date, atau custom range.', icon: Calendar },
                    { title: 'Program Filter', desc: 'Membatasi data analitik berdasarkan semua program, SNBT, atau CPNS.', icon: Filter },
                    { title: 'Export CSV', desc: 'Mengunduh ringkasan metrik demo seperti subscription, retention, dan revenue.', icon: Download },
                    { title: 'Metric Panels', desc: 'Menampilkan growth, revenue method, acquisition, revenue per program, dan quick stats.', icon: LineChartIcon },
                  ].map((item) => (
                    <div key={item.title} className="card-premium p-5 bg-white">
                      <item.icon size={20} className="text-brand-orange mb-3" />
                      <p className="text-sm font-black text-brand-navy mb-1">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Subscription Growth Trends */}
                    <div className="card-premium p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="font-bold text-brand-navy">Subscription Growth Trends</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Active vs New Subscriptions</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-brand-blue" />
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Rate</span>
                           </div>
                        </div>
                      </div>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { name: 'Jan', active: 400, new: 50 },
                            { name: 'Feb', active: 450, new: 65 },
                            { name: 'Mar', active: 580, new: 120 },
                            { name: 'Apr', active: 750, new: 180 },
                            { name: 'May', active: 820, new: 150 },
                            { name: 'Jun', active: 950, new: 210 },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                            <Tooltip 
                               contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line type="monotone" dataKey="active" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="new" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Revenue by Payment Method */}
                      <div className="card-premium p-8 flex flex-col">
                        <h3 className="font-bold text-brand-navy mb-6">Revenue by Payment Method</h3>
                        <div className="flex-1 flex items-center justify-center min-h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'VA Bank', value: 45 },
                                  { name: 'E-Wallet', value: 35 },
                                  { name: 'CC/Debit', value: 15 },
                                  { name: 'Other', value: 5 },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="85%"
                                paddingAngle={8}
                                dataKey="value"
                              >
                                {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none' }}
                                formatter={(value: number) => `${value}%`}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-6">
                           {[
                             { name: 'VA Bank', color: COLORS[0], val: '45%' },
                             { name: 'E-Wallet', color: COLORS[1], val: '35%' },
                             { name: 'CC/Debit', color: COLORS[2], val: '15%' },
                             { name: 'Other', color: COLORS[3], val: '5%' },
                           ].map((m, i) => (
                             <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                                <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                                   <span className="text-[10px] font-bold text-slate-500">{m.name}</span>
                                </div>
                                <span className="text-[10px] font-black text-brand-navy">{m.val}</span>
                             </div>
                           ))}
                        </div>
                      </div>

                      {/* Revenue Breakdown (Alt view) */}
                      <div className="card-premium p-8">
                         <h3 className="font-bold text-brand-navy mb-6">User Acquisition Trends</h3>
                         <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 8}} />
                                <YAxis hide />
                                <Tooltip cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="students" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={24} />
                              </BarChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="mt-6 space-y-4">
                            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white rounded-lg text-indigo-500"><Users size={16} /></div>
                                  <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Retention Rate</div>
                               </div>
                               <span className="text-sm font-black text-indigo-900">92.4%</span>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Revenue by Program */}
                    <div className="card-premium p-8 h-fit">
                       <h3 className="font-bold text-brand-navy mb-8">Revenue by Program</h3>
                       <div className="h-64 w-full mb-8">
                          <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={programPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                                <YAxis hide />
                                <Tooltip 
                                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={32}>
                                   {programPerformanceData.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                   ))}
                                </Bar>
                             </BarChart>
                          </ResponsiveContainer>
                       </div>
                       <div className="space-y-5">
                         {programPerformanceData.map((item, i) => (
                           <div key={i} className="space-y-2">
                             <div className="flex justify-between items-center text-[10px] font-bold">
                               <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                  <span className="text-slate-500 uppercase tracking-widest">{item.name}</span>
                               </div>
                               <span className="text-brand-navy font-black">Rp {item.revenue}jt</span>
                             </div>
                             <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 whileInView={{ width: `${(item.revenue / 1100) * 100}%` }}
                                 viewport={{ once: true }}
                                 transition={{ duration: 1, delay: i * 0.1 }}
                                 className="h-full bg-brand-orange" 
                               />
                             </div>
                           </div>
                         ))}
                       </div>
                       <div className="mt-8 p-6 bg-brand-navy rounded-[2rem] text-white shadow-xl shadow-brand-navy/20 relative overflow-hidden">
                          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full" />
                          <p className="text-[10px] font-bold uppercase opacity-60 mb-1 tracking-widest">Gross Revenue MTD</p>
                          <div className="flex items-end gap-2">
                            <p className="text-3xl font-black">Rp 1.84M</p>
                            <span className="text-[10px] font-bold text-emerald-400 mb-1.5">+12.5%</span>
                          </div>
                       </div>
                    </div>

                    <div className="card-premium p-8">
                       <h3 className="font-bold text-brand-navy mb-6">Quick Stats</h3>
                       <div className="space-y-4">
                          {[
                            { label: 'Avg Sale Value', val: 'Rp 2.4jt', icon: DollarSign },
                            { label: 'Churn Rate', val: '1.2%', icon: TrendingDown },
                            { label: 'CAC', val: 'Rp 280rb', icon: Target },
                          ].map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 group hover:bg-white hover:shadow-lg transition-all duration-300">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-slate-50"><s.icon size={16} className="text-slate-400" /></div>
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
                               </div>
                               <span className="text-sm font-black text-brand-navy">{s.val}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div>
                   <h2 className="text-2xl font-bold text-brand-navy">General Settings</h2>
                   <p className="text-sm text-slate-500">Configure global platform behavior</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'Admin Security', desc: 'Mengatur 2FA dan penguncian sesi admin agar akses panel lebih aman.', icon: Shield },
                    { title: 'Notifications', desc: 'Mengatur alert saat lead baru masuk dari website, tryout gratis, atau pembayaran.', icon: Bell },
                    { title: 'Role Scope', desc: 'Hak akses menu mengikuti role aktif: Super Admin, Content Manager, atau Support.', icon: Users },
                  ].map((item) => (
                    <div key={item.title} className="card-premium p-5 bg-white">
                      <item.icon size={20} className="text-emerald-500 mb-3" />
                      <p className="text-sm font-black text-brand-navy mb-1">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="card-premium p-8 space-y-6">
                      <h3 className="font-bold text-brand-navy flex items-center gap-2">
                        <Shield size={18} className="text-brand-blue" />
                        Platform Security
                      </h3>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <div>
                               <p className="text-sm font-bold text-brand-navy">Two-Factor Authentication</p>
                               <p className="text-xs text-slate-400">Force 2FA for all admin accounts</p>
                            </div>
                            <button onClick={() => notify('Pengaturan 2FA admin diperbarui.')} className="w-10 h-6 bg-slate-200 rounded-full relative">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all translate-x-4 bg-brand-blue" />
                            </button>
                         </div>
                         <div className="flex items-center justify-between">
                            <div>
                               <p className="text-sm font-bold text-brand-navy">Auto-Lock Session</p>
                               <p className="text-xs text-slate-400">Logout after 30 minutes of inactivity</p>
                            </div>
                            <button onClick={() => notify('Auto-lock session diperbarui.')} className="w-10 h-6 bg-brand-blue rounded-full relative">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all translate-x-4" />
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="card-premium p-8 space-y-6">
                      <h3 className="font-bold text-brand-navy flex items-center gap-2">
                        <Bell size={18} className="text-emerald-500" />
                        System Notifications
                      </h3>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <div>
                               <p className="text-sm font-bold text-brand-navy">New Lead Alerts</p>
                               <p className="text-xs text-slate-400">Notify when a new lead registers</p>
                            </div>
                            <button onClick={() => notify('Notifikasi lead baru diperbarui.')} className="w-10 h-6 bg-brand-blue rounded-full relative">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all translate-x-4" />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
         </div>

         {/* Program Editor Modal */}
          <AdminCampaignEditorDialog domain={marketingDomain} />

          <AdminWebsiteSaveConfirmDialog domain={websiteDomain} />

          <AdminLeadEditorDialog domain={leadsDomain} />

          <AdminLeadConvertDialog domain={leadsDomain} />

          <AdminLeadDetailDialog domain={leadsDomain} downloadTextFile={downloadTextFile} />

          <AdminBlogEditorDialog domain={websiteDomain} />

          <AdminBlogMiddleInsertDialog domain={websiteDomain} />

          <AdminBlogAssetEditorDialog domain={websiteDomain} />

          <AdminBlogPreviewDialog domain={websiteDomain} />

          <AdminProgramEditorDialog domain={programsDomain} />

          <AdminProgramSaveConfirmDialog domain={programsDomain} />

      </div>
  );
};
