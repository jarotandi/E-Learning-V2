import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, 
  GraduationCap,
  BookOpen, 
  Rocket, 
  DollarSign, 
  Users2, 
  CheckCircle2, 
  MoreVertical,
  Plus,
  Search,
  Bell,
  PieChart as PieChartIcon,
  Filter,
  Trash2,
  Edit2,
  MessageSquare,
  Star,
  LogOut,
  UserPlus,
  Award,
  FileText,
  Shield,
  ThumbsUp,
  MapPin,
  Calendar,
  Clock,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  Globe,
  Wallet,
  Megaphone,
  Layout,
  Banknote,
  Video,
  Play,
  TrendingDown,
  TrendingUp,
  Target,
  Download,
  Settings,
  Copy,
  Tags,
  Upload,
  FileUp,
  Save,
  X,
  Check,
  Info,
  Image as ImageIcon,
  Bot,
  Link,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from 'lucide-react';
import Markdown from 'react-markdown';
import { BLOG_POSTS, USER_ACCOUNTS, MOCK_FEEDBACKS, TESTIMONIALS, PROGRAMS } from '../constants';
import { BlogPost, UserAccount, Lead, Question, Testimonial, Program, ProgramPackage, WebsiteQuestion } from '../types';

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Rina Wijaya', email: 'rina@mail.com', phone: '0812345678', programOfInterest: 'SNBT Kedokteran', source: 'Instagram', status: 'Qualified', createdAt: '2026-04-20' },
  { id: '2', name: 'Andi Pratama', email: 'andi@mail.com', phone: '0819876543', programOfInterest: 'SKD CPNS', source: 'Google', status: 'New', createdAt: '2026-04-22' },
  { id: '3', name: 'Siska Putri', email: 'siska@mail.com', phone: '0811223344', programOfInterest: 'Kedinasan', source: 'TikTok', status: 'Contacted', createdAt: '2026-04-23' },
];

const MOCK_QUESTIONS: Question[] = [
  { id: '1', subject: 'Penalaran Umum', difficulty: 'Hard', text: 'Semua X adalah Y...', options: [], correctOptionId: 'A', explanation: '...', program: 'SNBT' },
  { id: '2', subject: 'Penalaran Matematika', difficulty: 'Medium', text: 'Hasil dari 2x + 5...', options: [], correctOptionId: 'B', explanation: '...', program: 'SNBT' },
];

const revenueData = [
  { name: 'Mon', rev: 4000, students: 240 },
  { name: 'Tue', rev: 3000, students: 139 },
  { name: 'Wed', rev: 2000, students: 980 },
  { name: 'Thu', rev: 2780, students: 390 },
  { name: 'Fri', rev: 1890, students: 480 },
  { name: 'Sat', rev: 2390, students: 380 },
  { name: 'Sun', rev: 3490, students: 430 },
];

const programData = [
  { name: 'SNBT Kedokteran', value: 420 },
  { name: 'SKD CPNS', value: 215 },
  { name: 'Sekolah Kedinasan', value: 180 },
  { name: 'OSN Matematika', value: 95 },
];

const programPerformanceData = [
  { name: 'SNBT Kedokteran', active: 420, leads: 650, revenue: 1050 },
  { name: 'SKD CPNS', active: 215, leads: 450, revenue: 268 },
  { name: 'Kedinasan', active: 180, leads: 310, revenue: 270 },
  { name: 'OSN Math', active: 95, leads: 220, revenue: 95 },
  { name: 'Poltekkes', active: 154, leads: 280, revenue: 185 },
];

const COLORS = ['#2563eb', '#1e3a8a', '#f59e0b', '#10b981', '#6366f1'];

const currencyOptions = [
  { code: 'IDR', label: 'Rupiah Indonesia', symbol: 'Rp', locale: 'id-ID' },
  { code: 'USD', label: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
  { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM', locale: 'ms-MY' }
];

const parseCurrencyAmount = (value: string) => Number(String(value).replace(/[^\d]/g, '')) || 0;

const formatCurrencyAmount = (value: string | number, currencyCode = 'IDR') => {
  const currency = currencyOptions.find((item) => item.code === currencyCode) || currencyOptions[0];
  const amount = typeof value === 'number' ? value : parseCurrencyAmount(value);
  return `${currency.symbol} ${amount.toLocaleString(currency.locale)}`;
};

const readStorageArray = <T,>(key: string, fallback: T[] = []): T[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const USER_STORAGE_KEY = 'theprams_demo_users';
const LEAD_STORAGE_KEY = 'theprams_demo_leads';

const getAccountTypeFromRecord = (record: any): UserAccount['accountType'] => {
  const text = `${record.type || ''} ${record.status || ''} ${record.packageName || ''}`.toLowerCase();
  if (text.includes('scholar') || text.includes('beasiswa')) return 'Scholarship';
  if (text.includes('free') || text.includes('gratis')) return 'Free';
  return 'Paid';
};

const isApprovedStudentRecord = (record: any) => {
  const type = getAccountTypeFromRecord(record);
  const status = String(record.status || '').toLowerCase();
  if (type === 'Free') return true;
  if (type === 'Scholarship') return status.includes('approved');
  return status.includes('approved') || status.includes('success');
};

const userFromStudentRecord = (record: any, prefix = 'student'): UserAccount => {
  const sourceId = record.invoiceNumber || record.id || `${prefix}-${Date.now()}`;
  const data = record.registrationData || {};
  const accountType = getAccountTypeFromRecord(record);
  return {
    id: `${prefix}-${sourceId}`,
    name: data.name || record.name || record.student || 'Siswa Baru',
    email: data.email || record.email || '-',
    role: 'Student',
    program: record.program || data.program || '-',
    status: 'Active',
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(sourceId)}`,
    joinedAt: String(record.createdAt || new Date().toISOString()).slice(0, 10),
    accountType,
    packageName: record.packageName || '-',
    paymentStatus: record.status || '-',
    source: accountType === 'Free' ? 'Paket Gratis' : accountType === 'Scholarship' ? 'Approval Beasiswa' : 'Approval Pembayaran'
  };
};

const parseRupiah = (value: string | number | undefined) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  return Number(String(value).replace(/[^\d]/g, '')) || 0;
};

const formatRupiah = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

interface FinanceEntry {
  id: string;
  type: 'fixed' | 'variable' | 'budget';
  name: string;
  category: string;
  amount: number;
  period: string;
  note: string;
  createdAt: string;
}

interface FinanceRealization {
  id: string;
  financeEntryId: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  note: string;
  createdAt: string;
}

interface AssetEntry {
  id: string;
  type: 'fixed_asset' | 'current_asset';
  name: string;
  category: string;
  acquisitionValue: number;
  currentValue: number;
  acquisitionDate: string;
  usefulLifeMonths: number;
  depreciationPerMonth: number;
  note: string;
  createdAt: string;
}

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

interface VideoLessonRecord {
  id: string;
  title: string;
  program: string;
  duration: string;
  views: string;
  date: string;
  status: 'Draft' | 'Published' | 'Archived';
  access: 'Free' | 'Premium' | 'Scholarship';
  thumbnail: string;
  description: string;
  mentor: string;
  module: string;
  tags: string[];
  notes: string;
}

interface BlogEditorAsset {
  id: string;
  type: 'image' | 'document';
  source: 'pc' | 'internet';
  name: string;
  url: string;
  note: string;
  createdAt: string;
}

const defaultFinanceEntries: FinanceEntry[] = [
  { id: 'fixed-mentor', type: 'fixed', name: 'Honor Mentor Tetap', category: 'Gaji & Mentor', amount: 8500000, period: 'Bulanan', note: 'Biaya tetap operasional kelas', createdAt: '2026-04-01' },
  { id: 'fixed-tools', type: 'fixed', name: 'Tools Pembelajaran', category: 'Software', amount: 1200000, period: 'Bulanan', note: 'LMS, meeting, dan storage', createdAt: '2026-04-01' },
  { id: 'var-ads', type: 'variable', name: 'Iklan Tryout Gratis', category: 'Marketing', amount: 2500000, period: 'April 2026', note: 'Campaign pendaftaran', createdAt: '2026-04-18' },
  { id: 'budget-scholarship', type: 'budget', name: 'Kuota Beasiswa Prams Scholar', category: 'Beasiswa', amount: 15000000, period: 'Batch berjalan', note: 'Subsidi akses siswa terpilih', createdAt: '2026-04-20' }
];

const defaultAssetEntries: AssetEntry[] = [
  { id: 'asset-laptop', type: 'fixed_asset', name: 'Laptop Editor Konten', category: 'Peralatan Kantor', acquisitionValue: 12000000, currentValue: 10800000, acquisitionDate: '2026-04-01', usefulLifeMonths: 36, depreciationPerMonth: 333333, note: 'Aset tetap untuk produksi materi', createdAt: '2026-04-01' },
  { id: 'asset-cash', type: 'current_asset', name: 'Kas Operasional', category: 'Aset Lancar', acquisitionValue: 25000000, currentValue: 25000000, acquisitionDate: '2026-04-01', usefulLifeMonths: 0, depreciationPerMonth: 0, note: 'Saldo kas demo', createdAt: '2026-04-01' }
];

const defaultVideoLessons: VideoLessonRecord[] = [
  { id: 'video-1', title: 'Anatomi Dasar Bagian 1', program: 'Kedokteran Express', duration: '45:20', views: '1.2k', date: '2 hari lalu', status: 'Published', access: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400', description: 'Pengenalan anatomi dasar untuk calon mahasiswa kedokteran dengan pendekatan visual.', mentor: 'dr. Pramono', module: 'Foundation Kedokteran', tags: ['Kedokteran', 'Anatomi'], notes: 'Tambahkan kuis singkat setelah menit 20.' },
  { id: 'video-2', title: 'TPA Penalaran Logis', program: 'SNBT Intensive', duration: '32:15', views: '2.5k', date: '3 hari lalu', status: 'Published', access: 'Free', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400', description: 'Materi pola penalaran logis, implikasi, negasi, dan penarikan kesimpulan.', mentor: 'Siti Aminah, M.Pd.', module: 'Penalaran Umum', tags: ['SNBT', 'Logika'], notes: 'Cocok sebagai materi gratis setelah tryout.' },
  { id: 'video-3', title: 'UUD 1945 & Amandemen', program: 'CPNS Masterclass', duration: '58:40', views: '840', date: '5 hari lalu', status: 'Draft', access: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400', description: 'Pembahasan TWK tentang konstitusi dan perubahan amandemen penting.', mentor: 'Admin The Prams', module: 'TWK CPNS', tags: ['CPNS', 'TWK'], notes: 'Review ulang contoh soal sebelum publish.' },
  { id: 'video-4', title: 'Persiapan Psikotes', program: 'Kedinasan Special', duration: '25:10', views: '1.1k', date: '1 minggu lalu', status: 'Published', access: 'Scholarship', thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400', description: 'Strategi dasar psikotes untuk sekolah kedinasan dan latihan konsentrasi.', mentor: 'Admin The Prams', module: 'Kedinasan', tags: ['Psikotes', 'Kedinasan'], notes: 'Bisa dibuka untuk siswa beasiswa approved.' },
];

const nonDepreciableFixedAssetCategories = ['Tanah/Bangunan'];

const budgetDirections = [
  { value: 'Marketing', label: 'Anggaran Marketing', target: 'Digital Marketing' },
  { value: 'Digital Marketing', label: 'Anggaran Digital Marketing', target: 'Digital Marketing' },
  { value: 'Editor Konten', label: 'Anggaran Editor / Desain Konten', target: 'Website Editor & Content Library' },
  { value: 'Pembuatan Program', label: 'Anggaran Pembuatan Program', target: 'Program Inventory' },
  { value: 'Materi Program', label: 'Anggaran Materi Program', target: 'Perancangan Materi' },
  { value: 'Freelance', label: 'Anggaran Freelance', target: 'Vendor / Freelancer' },
  { value: 'Lainnya', label: 'Anggaran Lainnya', target: 'Operasional Lainnya' }
];

const BLOG_EDITOR_TEMPLATES: Array<{ label: string; category: BlogPost['category']; title: string; excerpt: string; content: string; tags: string[] }> = [
  {
    label: 'Template Tips Belajar',
    category: 'Tips & Trik',
    title: 'Judul Tips Belajar yang Spesifik',
    excerpt: 'Ringkas masalah utama siswa dan janji solusi praktis dalam satu kalimat.',
    content: `# Judul Tips Belajar yang Spesifik

Pembuka singkat: jelaskan masalah yang sering dialami siswa dan kenapa topik ini penting.

## 1. Diagnosis Masalah
Tuliskan cara mengenali masalah belajar, contoh gejala, dan data yang perlu dilihat.

## 2. Langkah Praktis
Berikan langkah yang bisa langsung dilakukan siswa hari ini.

## 3. Contoh Penerapan
Masukkan contoh jadwal, cara review soal, atau pola latihan.

## Checklist
- Target harian jelas.
- Ada evaluasi kesalahan.
- Ada waktu istirahat.
- Ada tryout atau latihan terukur.
`,
    tags: ['Tips Belajar', 'Strategi', 'Tryout']
  },
  {
    label: 'Template Literasi',
    category: 'Literasi',
    title: 'Judul Artikel Literasi',
    excerpt: 'Ringkas teknik membaca, memahami teks, atau menjawab soal literasi.',
    content: `# Judul Artikel Literasi

Pembuka: jelaskan jenis bacaan atau kesalahan literasi yang sering muncul.

## Konsep Utama
Jelaskan prinsip membaca aktif, ide pokok, inferensi, atau bukti teks.

## Contoh Pola Soal
Tulis contoh pola pertanyaan dan cara mengeliminasi pilihan jawaban.

## Latihan Mandiri
Berikan latihan kecil yang bisa dilakukan siswa setelah membaca artikel.
`,
    tags: ['Literasi', 'SNBT', 'Membaca']
  },
  {
    label: 'Template Info Seleksi',
    category: 'Info PTN',
    title: 'Judul Info Seleksi Terbaru',
    excerpt: 'Ringkas informasi seleksi, administrasi, jadwal, atau persiapan dokumen.',
    content: `# Judul Info Seleksi Terbaru

Pembuka: jelaskan konteks seleksi dan siapa yang perlu membaca artikel ini.

## Hal yang Perlu Diperhatikan
Uraikan poin penting secara praktis dan mudah dipindai.

## Dokumen atau Data yang Perlu Disiapkan
Tuliskan daftar dokumen, data diri, atau bukti pendukung.

## Rekomendasi Langkah Berikutnya
Berikan saran aksi yang realistis untuk siswa.
`,
    tags: ['Info Seleksi', 'Pendaftaran', 'Persiapan']
  },
  {
    label: 'Template CPNS/SKD',
    category: 'Materi',
    title: 'Judul Strategi SKD CPNS',
    excerpt: 'Ringkas strategi TWK, TIU, TKP, manajemen waktu, atau evaluasi simulasi.',
    content: `# Judul Strategi SKD CPNS

Pembuka: jelaskan tantangan SKD yang ingin diselesaikan.

## TWK
Tuliskan fokus materi, contoh konteks, dan cara review.

## TIU
Jelaskan pola logika/hitungan dan strategi waktu.

## TKP
Jelaskan prinsip memilih jawaban yang konsisten dengan pelayanan publik.

## Simulasi
Berikan pola latihan dengan timer dan cara evaluasi.
`,
    tags: ['CPNS', 'SKD', 'Strategi']
  }
];

type AdminRole = 'Super Admin' | 'Content Manager' | 'Support';

interface AdminMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastActive: string;
}

type AdminTab = 'overview' | 'users' | 'leads' | 'inquiries' | 'marketing' | 'website' | 'finance' | 'programs' | 'content' | 'questions' | 'testimonials' | 'reports' | 'settings';

export const AdminDashboard: React.FC<{ logout: () => void, setView?: (v: any) => void, programs?: Program[], onProgramsChange?: (programs: Program[]) => void, blogPosts?: BlogPost[], onBlogPostsChange?: (posts: BlogPost[]) => void }> = ({ logout, setView, programs = PROGRAMS, onProgramsChange, blogPosts = BLOG_POSTS, onBlogPostsChange }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [adminRole, setAdminRole] = useState<AdminRole>('Super Admin');
  const [actionMessage, setActionMessage] = useState('');
  const [isSaveWebsiteConfirmOpen, setIsSaveWebsiteConfirmOpen] = useState(false);
  const [isCampaignEditorOpen, setIsCampaignEditorOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: 'Campaign Tryout Gratis',
    objective: 'Lead Generation',
    channel: 'Meta Ads',
    audience: 'Siswa kelas 12 dan gap year',
    currency: 'IDR',
    totalBudget: '5000000',
    dailyBudget: '250000',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    landingPage: '/tryout-gratis',
    note: 'Fokus akuisisi lead WhatsApp dan pendaftaran tryout gratis.'
  });
  const [programSearchTerm, setProgramSearchTerm] = useState('');
  const [programCategoryFilter, setProgramCategoryFilter] = useState('All');
  const [financeTransactions, setFinanceTransactions] = useState<any[]>(() => readStorageArray('theprams_demo_transactions'));
  const [paymentProofs, setPaymentProofs] = useState<any[]>(() => readStorageArray('theprams_demo_payment_proofs'));
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>(() => readStorageArray('theprams_demo_finance_entries', defaultFinanceEntries));
  const [financeRealizations, setFinanceRealizations] = useState<FinanceRealization[]>(() => readStorageArray('theprams_demo_finance_realizations'));
  const [assetEntries, setAssetEntries] = useState<AssetEntry[]>(() => readStorageArray('theprams_demo_assets', defaultAssetEntries));
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => readStorageArray('theprams_demo_audit_events'));
  const [notificationEvents, setNotificationEvents] = useState<NotificationEvent[]>(() => readStorageArray('theprams_demo_notifications'));
  const [financeForm, setFinanceForm] = useState({
    type: 'fixed' as FinanceEntry['type'],
    name: '',
    category: 'Operasional',
    amount: '',
    period: 'Bulanan',
    note: ''
  });
  const [realizationForm, setRealizationForm] = useState({
    financeEntryId: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    note: ''
  });
  const [assetForm, setAssetForm] = useState({
    type: 'fixed_asset' as AssetEntry['type'],
    name: '',
    category: 'Peralatan Kantor',
    acquisitionValue: '',
    currentValue: '',
    acquisitionDate: new Date().toISOString().slice(0, 10),
    usefulLifeMonths: '36',
    note: ''
  });
  const [financeSubView, setFinanceSubView] = useState<'payments' | 'inputs' | 'realization' | 'assets' | 'accounting' | 'reports' | 'audit'>('payments');
  const [financialReportPeriod, setFinancialReportPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('All');
  const [financeMetricDetail, setFinanceMetricDetail] = useState<null | { title: string; rows: any[]; description: string }>(null);
  const [selectedFinanceRecord, setSelectedFinanceRecord] = useState<any | null>(null);
  const [leadsList, setLeadsList] = useState<Lead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadPendingConvert, setLeadPendingConvert] = useState<Lead | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [leadForm, setLeadForm] = useState<Omit<Lead, 'id' | 'createdAt'>>({
    name: '',
    email: '',
    phone: '',
    programOfInterest: programs[0]?.title || 'SNBT Kedokteran',
    source: 'Admin Input',
    status: 'New',
    note: '',
    lastContactedAt: ''
  });
  const [leadNoteDraft, setLeadNoteDraft] = useState('');
  const localLeads: Lead[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(LEAD_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  })();
  const localTransactions = (() => {
    try {
      return JSON.parse(localStorage.getItem('theprams_demo_transactions') || '[]');
    } catch {
      return [];
    }
  })();
  
  // Admin Team Management State
  const [adminTeam, setAdminTeam] = useState<AdminMember[]>([
    { id: '1', name: 'dr. Pramono', email: 'pram@theprams.com', role: 'Super Admin', lastActive: 'Sekarang' },
    { id: '2', name: 'Maya Sari', email: 'maya@theprams.com', role: 'Content Manager', lastActive: '2 jam lalu' },
    { id: '3', name: 'Rudi Hermawan', email: 'help@theprams.com', role: 'Support', lastActive: '1 hari lalu' },
  ]);

  // Tab permissions mapping
  const rolePermissions: Record<AdminRole, AdminTab[]> = {
    'Super Admin': ['overview', 'users', 'leads', 'inquiries', 'marketing', 'website', 'finance', 'programs', 'content', 'questions', 'testimonials', 'reports', 'settings'],
    'Content Manager': ['overview', 'programs', 'content', 'questions', 'testimonials', 'website'],
    'Support': ['overview', 'users', 'leads', 'inquiries', 'settings', 'finance']
  };

  const isTabAllowed = (tab: AdminTab) => rolePermissions[adminRole].includes(tab);
  const campaignTotalBudget = parseCurrencyAmount(campaignForm.totalBudget);
  const campaignDailyBudget = parseCurrencyAmount(campaignForm.dailyBudget);
  const campaignEstimatedDays = campaignDailyBudget > 0 ? Math.max(1, Math.floor(campaignTotalBudget / campaignDailyBudget)) : 0;

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

  const refreshFinanceCenter = () => {
    setFinanceTransactions(readStorageArray('theprams_demo_transactions'));
    setPaymentProofs(readStorageArray('theprams_demo_payment_proofs'));
    setFinanceEntries(readStorageArray('theprams_demo_finance_entries', defaultFinanceEntries));
    setFinanceRealizations(readStorageArray('theprams_demo_finance_realizations'));
    setAssetEntries(readStorageArray('theprams_demo_assets', defaultAssetEntries));
    notify('Financial Center disinkronkan dengan pembayaran dan dokumen terbaru.');
  };

  const saveFinanceEntries = (nextEntries: FinanceEntry[]) => {
    setFinanceEntries(nextEntries);
    localStorage.setItem('theprams_demo_finance_entries', JSON.stringify(nextEntries));
  };

  const addFinanceEntry = () => {
    if (!financeForm.name.trim() || !financeForm.category.trim() || parseRupiah(financeForm.amount) <= 0) {
      notify('Nama, kategori, dan nominal wajib diisi.');
      return;
    }
    const nextEntry: FinanceEntry = {
      id: `finance-${Date.now()}`,
      type: financeForm.type,
      name: financeForm.name.trim(),
      category: financeForm.category.trim(),
      amount: parseRupiah(financeForm.amount),
      period: financeForm.period.trim() || 'Bulanan',
      note: financeForm.note.trim(),
      createdAt: new Date().toISOString().slice(0, 10)
    };
    saveFinanceEntries([nextEntry, ...financeEntries]);
    setFinanceForm({ type: 'fixed', name: '', category: 'Operasional', amount: '', period: 'Bulanan', note: '' });
    recordAudit('Financial Center', 'Create Finance Plan', `${nextEntry.name} - ${formatRupiah(nextEntry.amount)}`);
    notify('Input keuangan berhasil ditambahkan.');
  };

  const deleteFinanceEntry = (id: string) => {
    saveFinanceEntries(financeEntries.filter((entry) => entry.id !== id));
    recordAudit('Financial Center', 'Delete Finance Plan', id);
    notify('Input keuangan dihapus.');
  };

  const saveFinanceRealizations = (nextRows: FinanceRealization[]) => {
    setFinanceRealizations(nextRows);
    localStorage.setItem('theprams_demo_finance_realizations', JSON.stringify(nextRows));
  };

  const addFinanceRealization = () => {
    const source = financeEntries.find((entry) => entry.id === realizationForm.financeEntryId);
    const amount = parseRupiah(realizationForm.amount);
    if (!source || amount <= 0) {
      notify('Pilih rencana biaya/anggaran dan isi nominal realisasi.');
      return;
    }
    const nextRow: FinanceRealization = {
      id: `realization-${Date.now()}`,
      financeEntryId: source.id,
      name: source.name,
      category: source.category,
      amount,
      date: realizationForm.date,
      note: realizationForm.note.trim(),
      createdAt: new Date().toISOString()
    };
    saveFinanceRealizations([nextRow, ...financeRealizations]);
    setRealizationForm({ financeEntryId: '', amount: '', date: new Date().toISOString().slice(0, 10), note: '' });
    recordAudit('Financial Center', 'Realize Budget/Cost', `${nextRow.name} - ${formatRupiah(nextRow.amount)}`);
    notify('Realisasi biaya/anggaran masuk pembukuan otomatis.');
  };

  const saveAssetEntries = (nextRows: AssetEntry[]) => {
    setAssetEntries(nextRows);
    localStorage.setItem('theprams_demo_assets', JSON.stringify(nextRows));
  };

  const addAssetEntry = () => {
    const acquisitionValue = parseRupiah(assetForm.acquisitionValue);
    const currentValue = parseRupiah(assetForm.currentValue) || acquisitionValue;
    const isNonDepreciableFixedAsset = assetForm.type === 'fixed_asset' && nonDepreciableFixedAssetCategories.includes(assetForm.category);
    const usefulLifeMonths = assetForm.type === 'fixed_asset' && !isNonDepreciableFixedAsset ? Number(assetForm.usefulLifeMonths) || 1 : 0;
    if (!assetForm.name.trim() || acquisitionValue <= 0) {
      notify('Nama aset dan nilai perolehan wajib diisi.');
      return;
    }
    const nextAsset: AssetEntry = {
      id: `asset-${Date.now()}`,
      type: assetForm.type,
      name: assetForm.name.trim(),
      category: assetForm.category.trim() || (assetForm.type === 'fixed_asset' ? 'Aset Tetap' : 'Aset Lancar'),
      acquisitionValue,
      currentValue,
      acquisitionDate: assetForm.acquisitionDate,
      usefulLifeMonths,
      depreciationPerMonth: assetForm.type === 'fixed_asset' && !isNonDepreciableFixedAsset ? Math.round(acquisitionValue / usefulLifeMonths) : 0,
      note: assetForm.note.trim(),
      createdAt: new Date().toISOString()
    };
    saveAssetEntries([nextAsset, ...assetEntries]);
    setAssetForm({ type: 'fixed_asset', name: '', category: 'Peralatan Kantor', acquisitionValue: '', currentValue: '', acquisitionDate: new Date().toISOString().slice(0, 10), usefulLifeMonths: '36', note: '' });
    recordAudit('Financial Center', 'Register Asset', `${nextAsset.name} - ${formatRupiah(nextAsset.currentValue)}`);
    notify('Aset berhasil ditambahkan ke pembukuan.');
  };

  const openStoredInvoice = (tx: any) => {
    const invoice = window.open('', '_blank');
    if (!invoice) return;
    const invoiceNumber = tx.invoiceNumber || tx.id || 'INV/DEMO/TP/00000';
    const invoiceTime = tx.invoiceTime || tx.date || new Date().toLocaleString('id-ID');
    const methodLabel = tx.method || 'Manual/Admin';
    const amount = tx.amount || 'Rp 0';
    const fallbackInvoice = `
      <html>
        <head>
          <title>${invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; color:#0f172a; margin:40px; }
            .head { display:flex; justify-content:space-between; border-bottom:3px solid #2563eb; padding-bottom:18px; margin-bottom:28px; }
            .brand { font-size:24px; font-weight:900; color:#1e3a8a; }
            .muted { color:#64748b; font-size:12px; }
            .box { border:1px solid #e2e8f0; border-radius:14px; padding:18px; margin-top:18px; }
            table { width:100%; border-collapse:collapse; margin:24px 0; }
            td, th { padding:12px; border-bottom:1px solid #e2e8f0; text-align:left; }
            th { background:#f8fafc; color:#64748b; font-size:11px; text-transform:uppercase; }
            .total { font-size:24px; font-weight:900; color:#f59e0b; }
            @media print { button { display:none; } body { margin:24px; } }
          </style>
        </head>
        <body>
          <div class="head">
            <div><div class="brand">Bimbel The Prams</div><div class="muted">Invoice Pembayaran Program</div></div>
            <div><strong>${invoiceNumber}</strong><div class="muted">${invoiceTime}</div></div>
          </div>
          <div class="box">
            <div class="muted">Calon Siswa</div>
            <h2>${tx.student || '-'}</h2>
            <p>Email: <strong>${tx.email || '-'}</strong></p>
            <p>WhatsApp: <strong>${tx.phone || '-'}</strong></p>
          </div>
          <table>
            <thead><tr><th>Program</th><th>Paket</th><th>Metode</th><th>Nominal</th></tr></thead>
            <tbody>
              <tr>
                <td>${tx.program || '-'}</td>
                <td>${tx.packageName || '-'}</td>
                <td>${methodLabel}</td>
                <td>${amount}</td>
              </tr>
            </tbody>
          </table>
          <p class="total">Total: ${amount}</p>
          <div class="box">Status: <strong>${tx.status || '-'}</strong></div>
          <button onclick="window.print()">Cetak / Simpan PDF</button>
        </body>
      </html>
    `;
    invoice.document.write(tx.invoiceHtml || fallbackInvoice);
    invoice.document.close();
  };

  const openStoredProof = (proof: any) => {
    if (!proof.fileData) {
      notify('Dokumen hanya tersedia sebagai metadata file.');
      return;
    }
    const doc = window.open('', '_blank');
    if (!doc) return;
    if (String(proof.fileType).includes('pdf')) {
      doc.document.write(`<iframe src="${proof.fileData}" style="border:0;width:100%;height:100vh"></iframe>`);
    } else {
      doc.document.write(`<img src="${proof.fileData}" style="max-width:100%;height:auto" alt="${proof.fileName || 'Bukti pembayaran'}" />`);
    }
    doc.document.close();
  };

  const updateFinanceRecordStatus = (invoiceId: string, nextStatus: string) => {
    const nextTransactions = financeTransactions.map((tx) => (
      (tx.invoiceNumber || tx.id) === invoiceId ? { ...tx, status: nextStatus, reviewedAt: new Date().toISOString() } : tx
    ));
    setFinanceTransactions(nextTransactions);
    localStorage.setItem('theprams_demo_transactions', JSON.stringify(nextTransactions));

    const nextProofs = paymentProofs.map((proof) => (
      proof.invoiceId === invoiceId ? { ...proof, status: nextStatus, reviewedAt: new Date().toISOString() } : proof
    ));
    setPaymentProofs(nextProofs);
    localStorage.setItem('theprams_demo_payment_proofs', JSON.stringify(nextProofs));
    setSelectedFinanceRecord((current: any) => current ? { ...current, tx: { ...current.tx, status: nextStatus }, proof: current.proof ? { ...current.proof, status: nextStatus } : current.proof } : current);
    const updatedTx = financeTransactions.find((tx) => (tx.invoiceNumber || tx.id) === invoiceId) || selectedFinanceRecord?.tx;
    recordAudit('Payment Workflow', 'Update Status', `${invoiceId} -> ${nextStatus}`);
    if (updatedTx) {
      const template = buildReviewTemplate({ ...updatedTx, status: nextStatus });
      if (nextStatus === 'Needs Revision') {
        queueNotification('Email', updatedTx.email || '-', 'Review Ulang Data Pendaftaran The Prams', template);
        queueNotification('WhatsApp', updatedTx.phone || '-', 'Review Ulang Data Pendaftaran The Prams', template);
      } else if (nextStatus.includes('Approved')) {
        queueNotification('Email', updatedTx.email || '-', 'Pendaftaran The Prams Disetujui', `Halo ${updatedTx.student || 'Calon Siswa'}, status kamu sudah diperbarui menjadi ${nextStatus}. Silakan lanjut mengikuti arahan admin The Prams.`);
      }
      const approvedTx = { ...updatedTx, status: nextStatus };
      if (isApprovedStudentRecord(approvedTx)) {
        const studentUser = userFromStudentRecord(approvedTx, 'tx');
        const exists = users.some((item) => item.id === studentUser.id || `${item.email}-${item.program}-${item.packageName || ''}`.toLowerCase() === `${studentUser.email}-${studentUser.program}-${studentUser.packageName || ''}`.toLowerCase());
        if (!exists) {
          persistUsers([studentUser, ...users]);
          recordAudit('User & Roles', 'Auto Create Student', `${studentUser.name} - ${studentUser.accountType}`);
        }
      }
    }
    notify(`Status diperbarui menjadi ${nextStatus}.`);
  };

  const buildReviewTemplate = (tx: any) => {
    const invoiceId = tx.invoiceNumber || tx.id || '-';
    const isScholarship = String(tx.status || '').toLowerCase().includes('scholarship') || String(tx.packageName || '').toLowerCase().includes('beasiswa');
    const documentLabel = isScholarship ? 'dokumen beasiswa' : 'bukti pembayaran';
    return [
      `Halo ${tx.student || 'Calon Siswa'},`,
      '',
      'Terima kasih sudah mendaftar di Bimbel The Prams.',
      '',
      'Setelah pengecekan oleh admin, data pendaftaran kamu perlu direview ulang dengan detail berikut:',
      `- Program: ${tx.program || '-'}`,
      `- Paket: ${tx.packageName || '-'}`,
      `- No. Invoice: ${invoiceId}`,
      `- Status saat ini: ${tx.status || '-'}`,
      '',
      `Mohon cek kembali data pendaftaran dan ${documentLabel} yang kamu lampirkan. Jika ada data yang belum sesuai, silakan kirim ulang ${documentLabel} yang benar atau hubungi admin untuk bantuan verifikasi.`,
      '',
      'Yang perlu dipastikan:',
      '- Nama, email, dan nomor WhatsApp sesuai dengan data pendaftaran.',
      `- ${documentLabel} terlihat jelas dan dapat dibaca.`,
      '- Nomor invoice/program/paket sesuai dengan pilihan pendaftaran.',
      '',
      'Terima kasih,',
      'Admin Bimbel The Prams'
    ].join('\n');
  };

  const openReviewEmail = (tx: any) => {
    const subject = encodeURIComponent('Review Ulang Data Pendaftaran The Prams');
    const body = encodeURIComponent(buildReviewTemplate(tx));
    window.open(`mailto:${tx.email || ''}?subject=${subject}&body=${body}`, '_blank');
  };

  const openReviewWhatsapp = (tx: any) => {
    const phone = String(tx.phone || '').replace(/\D/g, '').replace(/^0/, '62');
    window.open(`https://wa.me/${phone || '6281234567890'}?text=${encodeURIComponent(buildReviewTemplate(tx))}`, '_blank');
  };

  const addDemoLead = () => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: 'Lead Baru',
      email: 'leadbaru@mail.com',
      phone: '081234000999',
      programOfInterest: 'SNBT Kedokteran',
      source: 'Admin Input',
      status: 'New',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setLeadsList([newLead, ...leadsList]);
    notify('Lead baru ditambahkan.');
  };

  const allLeads = useMemo(() => [...localLeads, ...leadsList], [localLeads, leadsList]);

  const openNewLeadForm = () => {
    setLeadForm({
      name: '',
      email: '',
      phone: '',
      programOfInterest: programsList[0]?.title || 'SNBT Kedokteran',
      source: 'Admin Input',
      status: 'New',
      note: '',
      lastContactedAt: ''
    });
    setIsLeadFormOpen(true);
  };

  const saveLeadForm = () => {
    if (!leadForm.name.trim() || !leadForm.phone.trim()) {
      notify('Nama dan nomor WhatsApp lead wajib diisi.');
      return;
    }
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadForm.name.trim(),
      email: leadForm.email.trim() || '-',
      phone: leadForm.phone.trim(),
      programOfInterest: leadForm.programOfInterest.trim() || 'Konsultasi Program',
      source: leadForm.source.trim() || 'Admin Input',
      status: leadForm.status,
      note: leadForm.note?.trim(),
      lastContactedAt: leadForm.lastContactedAt || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const nextLocalLeads = [newLead, ...localLeads];
    localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(nextLocalLeads));
    setIsLeadFormOpen(false);
    recordAudit('Lead Management', 'Create Lead', `${newLead.name} - ${newLead.programOfInterest}`);
    notify('Lead baru berhasil ditambahkan.');
  };

  const convertLeadToStudent = (lead: Lead) => {
    const exists = users.some((user) => user.email === lead.email && user.role === 'Student');
    if (!exists) {
      persistUsers([
        {
          id: `student-${lead.id}`,
          name: lead.name,
          email: lead.email,
          role: 'Student',
          program: lead.programOfInterest,
          status: 'Active',
          avatar: `https://i.pravatar.cc/150?u=${lead.id}`,
          joinedAt: new Date().toISOString().slice(0, 10),
          accountType: 'Free',
          packageName: 'Trial / Lead',
          paymentStatus: 'Converted',
          source: 'Konversi Lead'
        },
        ...users
      ]);
    }
    updateLeadStatus(lead, 'Converted', 'Lead dikonversi menjadi siswa gratis/trial.');
    setLeadPendingConvert(null);
    notify(exists ? `${lead.name} sudah terdaftar sebagai siswa. Status lead ditandai Converted.` : `${lead.name} berhasil dikonversi menjadi siswa.`);
  };

  const updateLeadStatus = (lead: Lead, status: Lead['status'], note?: string) => {
    const nextLead: Lead = {
      ...lead,
      status,
      note: note ?? lead.note,
      lastContactedAt: ['Contacted', 'Qualified', 'Converted'].includes(status) ? new Date().toLocaleString('id-ID') : lead.lastContactedAt
    };
    const localLeadExists = localLeads.some((item) => item.id === lead.id);
    if (localLeadExists) {
      const nextLocalLeads = localLeads.map((item) => item.id === lead.id ? nextLead : item);
      localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(nextLocalLeads));
    } else {
      setLeadsList((prev) => prev.map((item) => item.id === lead.id ? nextLead : item));
    }
    setSelectedLead(nextLead);
    setLeadNoteDraft(nextLead.note || '');
  };

  const openLeadWhatsapp = (lead: Lead) => {
    const phone = String(lead.phone || '').replace(/\D/g, '').replace(/^0/, '62');
    window.open(`https://wa.me/${phone || '6281234567890'}?text=${encodeURIComponent(`Halo ${lead.name}, saya admin The Prams. Saya melihat kamu tertarik dengan ${lead.programOfInterest}. Boleh saya bantu jelaskan pilihan program yang paling sesuai?`)}`, '_blank');
    updateLeadStatus(lead, lead.status === 'New' ? 'Contacted' : lead.status, lead.note);
  };

  const runContextualAdd = () => {
    if (activeTab === 'leads') addDemoLead();
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
      setEditingProgram({
        id: `program-${Date.now()}`,
        title: 'Program Baru',
        category: 'Persiapan Akademik',
        description: 'Deskripsi singkat program baru.',
        target: 'Siswa umum',
        price: 'Rp 0',
        facilities: ['Tryout', 'Modul Digital'],
        image: PROGRAMS[0].image,
        color: 'bg-brand-blue',
        packages: []
      });
    } else if (activeTab === 'questions') {
      setEditingQuestion({
        id: Date.now().toString(),
        subject: 'Penalaran Umum',
        difficulty: 'Medium',
        text: '',
        options: [{ id: 'A', text: '' }, { id: 'B', text: '' }],
        correctOptionId: 'A',
        explanation: '',
        program: 'SNBT',
        tags: []
      });
    } else if (activeTab === 'content') {
      setIsUploadVideoModalOpen(true);
    } else if (activeTab === 'marketing') {
      setIsCampaignEditorOpen(true);
    } else {
      notify(`Aksi tambah untuk tab ${activeTab} tersedia di mode demo.`);
    }
  };
  
  // User Management State
  const [users, setUsers] = useState<UserAccount[]>(() => readStorageArray(USER_STORAGE_KEY, USER_ACCOUNTS.map((user) => ({
    ...user,
    accountType: user.role === 'Student' ? 'Paid' : 'Staff',
    source: 'Demo Seed'
  }))));
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [userDirectoryView, setUserDirectoryView] = useState<'students' | 'staff'>('students');
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [testimonialFilter, setTestimonialFilter] = useState<'All' | 'Pending' | 'Approved'>('All');
  const [programsList, setProgramsList] = useState<Program[]>(programs);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programPendingSave, setProgramPendingSave] = useState<Program | null>(null);
  const [websiteQuestions, setWebsiteQuestions] = useState<WebsiteQuestion[]>(() => readStorageArray('theprams_demo_website_questions'));
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [previewBlogPost, setPreviewBlogPost] = useState<BlogPost | null>(null);
  const [blogEditorAssets, setBlogEditorAssets] = useState<BlogEditorAsset[]>(() => readStorageArray('theprams_demo_blog_assets'));
  const [editingBlogAsset, setEditingBlogAsset] = useState<BlogEditorAsset | null>(null);
  const [isMiddleInsertOpen, setIsMiddleInsertOpen] = useState(false);
  const [isBlogAiChatOpen, setIsBlogAiChatOpen] = useState(false);
  const [middlePreviewAsset, setMiddlePreviewAsset] = useState<BlogEditorAsset | null>(null);
  const [middlePreviewRelatedId, setMiddlePreviewRelatedId] = useState<string>('');
  const [internetAssetUrl, setInternetAssetUrl] = useState('');
  const [internetAssetName, setInternetAssetName] = useState('');
  const [aiChatPrompt, setAiChatPrompt] = useState('');
  const [aiChatDraft, setAiChatDraft] = useState('');
  const [blogPostDrafts, setBlogPostDrafts] = useState<BlogPost[]>(blogPosts);
  const [blogEditorSearchTerm, setBlogEditorSearchTerm] = useState('');
  const [blogEditorCategory, setBlogEditorCategory] = useState<'Semua' | BlogPost['category']>('Semua');

  useEffect(() => {
    setProgramsList(programs);
  }, [programs]);

  useEffect(() => {
    setBlogPostDrafts(blogPosts);
  }, [blogPosts]);

  const blogCategoryOptions: Array<'Semua' | BlogPost['category']> = ['Semua', 'Tips & Trik', 'Info PTN', 'Materi', 'Inspirasi', 'Literasi'];
  const visibleBlogPosts = useMemo(() => {
    const keyword = blogEditorSearchTerm.trim().toLowerCase();
    return blogPostDrafts.filter((post) => {
      const matchesCategory = blogEditorCategory === 'Semua' || post.category === blogEditorCategory;
      const matchesKeyword = !keyword || `${post.title} ${post.excerpt} ${post.author} ${post.tags.join(' ')}`.toLowerCase().includes(keyword);
      return matchesCategory && matchesKeyword;
    });
  }, [blogPostDrafts, blogEditorCategory, blogEditorSearchTerm]);
  const blogEditorStats = useMemo(() => ({
    total: blogPostDrafts.length,
    literasi: blogPostDrafts.filter((post) => post.category === 'Literasi').length,
    infoMenarik: blogPostDrafts.filter((post) => post.category !== 'Literasi').length,
    words: blogPostDrafts.reduce((sum, post) => sum + post.content.trim().split(/\s+/).filter(Boolean).length, 0)
  }), [blogPostDrafts]);

  const persistUsers = (nextUsers: UserAccount[]) => {
    setUsers(nextUsers);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUsers));
  };

  const syncApprovedStudentsToUsers = (baseUsers = users) => {
    const registrations = readStorageArray<any>('theprams_demo_registrations');
    const transactions = readStorageArray<any>('theprams_demo_transactions');
    const systemStudents = [
      ...transactions.filter(isApprovedStudentRecord).map((record) => userFromStudentRecord(record, 'tx')),
      ...registrations.filter(isApprovedStudentRecord).map((record) => userFromStudentRecord(record, 'reg'))
    ];
    const existingIds = new Set(baseUsers.map((user) => user.id));
    const existingEmails = new Set(baseUsers.map((user) => `${user.email}-${user.program}-${user.packageName || ''}`.toLowerCase()));
    const newStudents = systemStudents.filter((student) => {
      const key = `${student.email}-${student.program}-${student.packageName || ''}`.toLowerCase();
      return !existingIds.has(student.id) && !existingEmails.has(key);
    });
    if (!newStudents.length) return baseUsers;
    const nextUsers = [...newStudents, ...baseUsers];
    persistUsers(nextUsers);
    return nextUsers;
  };

  useEffect(() => {
    syncApprovedStudentsToUsers();
  }, []);

  const saveWebsiteQuestions = (nextQuestions: WebsiteQuestion[]) => {
    setWebsiteQuestions(nextQuestions);
    localStorage.setItem('theprams_demo_website_questions', JSON.stringify(nextQuestions));
  };

  const saveWebsiteQuestionAnswer = (question: WebsiteQuestion, answer: string) => {
    const nextQuestions = websiteQuestions.map((item) => item.id === question.id ? {
      ...item,
      adminAnswer: answer,
      status: 'Dibalas' as const,
      answeredAt: new Date().toLocaleString('id-ID')
    } : item);
    saveWebsiteQuestions(nextQuestions);
    queueNotification('WhatsApp', question.phone || '-', 'Jawaban pertanyaan The Prams', answer);
    recordAudit('Website Questions', 'Answer Question', `${question.name} - ${question.phone}`);
    notify('Jawaban tersimpan dan masuk outbox WhatsApp.');
  };

  const openQuestionWhatsapp = (question: WebsiteQuestion) => {
    const phone = String(question.phone || '').replace(/\D/g, '').replace(/^0/, '62');
    const message = question.adminAnswer || `Halo ${question.name}, terima kasih sudah bertanya ke Bimbel The Prams. Saya bantu jawab pertanyaan kamu: ${question.question}`;
    window.open(`https://wa.me/${phone || '6281234567890'}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const createBlogPostDraft = (category: BlogPost['category'] = 'Literasi') => {
    const template = BLOG_EDITOR_TEMPLATES.find((item) => item.category === category) || BLOG_EDITOR_TEMPLATES[0];
    setEditingBlogPost({
      id: `blog-${Date.now()}`,
      title: template?.title || 'Artikel Baru',
      excerpt: template?.excerpt || 'Ringkasan singkat artikel untuk kartu Info Menarik.',
      content: template?.content || '# Artikel Baru\n\nTulis isi artikel di sini.',
      author: 'Admin The Prams',
      authorRole: 'Content Specialist',
      authorAvatar: 'https://i.pravatar.cc/150?u=admin',
      category,
      image: BLOG_POSTS[0].image,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: '5 min read',
      tags: template?.tags || [category]
    });
  };

  const saveBlogPost = (post: BlogPost) => {
    const sanitized: BlogPost = {
      ...post,
      id: post.id.trim() || `blog-${Date.now()}`,
      title: post.title.trim() || 'Judul Artikel Baru',
      excerpt: post.excerpt.trim() || 'Ringkasan artikel belum diisi.',
      content: post.content.trim() || '# Artikel Baru\n\nTulis konten artikel di sini.',
      author: post.author.trim() || 'Admin The Prams',
      authorRole: post.authorRole.trim() || 'Content Specialist',
      authorAvatar: post.authorAvatar.trim() || 'https://i.pravatar.cc/150?u=admin',
      image: post.image.trim() || BLOG_POSTS[0].image,
      date: post.date.trim() || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: post.readTime.trim() || '5 min read',
      tags: post.tags.map((tag) => tag.trim()).filter(Boolean)
    };
    const nextPosts = blogPostDrafts.find((item) => item.id === sanitized.id)
      ? blogPostDrafts.map((item) => item.id === sanitized.id ? sanitized : item)
      : [sanitized, ...blogPostDrafts];
    setBlogPostDrafts(nextPosts);
    onBlogPostsChange?.(nextPosts);
    setEditingBlogPost(null);
    recordAudit('Website Editor', 'Save Blog/Literasi', sanitized.title);
    notify('Konten Info Menarik tersimpan dan tampil di website.');
  };

  const syncBlogPostsToWebsite = (posts = blogPostDrafts) => {
    setBlogPostDrafts(posts);
    onBlogPostsChange?.(posts);
    recordAudit('Website Editor', 'Publish Info Menarik', `${posts.length} artikel`);
    notify('Info Menarik & Literasi sudah disinkronkan ke website publik.');
  };

  const deleteBlogPost = (id: string) => {
    const nextPosts = blogPostDrafts.filter((item) => item.id !== id);
    syncBlogPostsToWebsite(nextPosts);
    notify('Artikel dihapus dari Info Menarik.');
  };

  const duplicateBlogPost = (post: BlogPost) => {
    const copy: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
      title: `${post.title} - Copy`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    const nextPosts = [copy, ...blogPostDrafts];
    syncBlogPostsToWebsite(nextPosts);
    setEditingBlogPost(copy);
  };

  const insertBlogContentBlock = (block: string) => {
    if (!editingBlogPost) return;
    setEditingBlogPost({
      ...editingBlogPost,
      content: `${editingBlogPost.content.trim()}\n\n${block}`.trim()
    });
  };

  const getBlogRelatedOptions = (post: BlogPost, selectedId?: string) => {
    const selected = selectedId ? blogPostDrafts.find((item) => item.id === selectedId && item.id !== post.id) : null;
    return [
      ...(selected ? [selected] : []),
      ...blogPostDrafts.filter((item) => item.id !== post.id && item.id !== selected?.id)
    ].slice(0, 3);
  };

  const saveBlogEditorAssets = (nextAssets: BlogEditorAsset[]) => {
    setBlogEditorAssets(nextAssets);
    localStorage.setItem('theprams_demo_blog_assets', JSON.stringify(nextAssets));
  };

  const addInternetBlogAsset = () => {
    const url = internetAssetUrl.trim();
    if (!url) {
      notify('URL gambar/dokumen wajib diisi.');
      return;
    }
    const isImage = /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(url) || url.includes('images.unsplash.com') || url.includes('source.unsplash.com');
    const asset: BlogEditorAsset = {
      id: `asset-${Date.now()}`,
      type: isImage ? 'image' : 'document',
      source: 'internet',
      name: internetAssetName.trim() || (isImage ? 'Gambar Internet' : 'Dokumen Internet'),
      url,
      note: 'Disimpan dari URL internet',
      createdAt: new Date().toLocaleString('id-ID')
    };
    saveBlogEditorAssets([asset, ...blogEditorAssets]);
    setInternetAssetUrl('');
    setInternetAssetName('');
    notify('Aset internet tersimpan ke database editor.');
  };

  const importBlogAssetFromPc = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const asset: BlogEditorAsset = {
        id: `asset-${Date.now()}`,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        source: 'pc',
        name: file.name,
        url: String(reader.result || ''),
        note: `${Math.round(file.size / 1024)} KB dari PC`,
        createdAt: new Date().toLocaleString('id-ID')
      };
      saveBlogEditorAssets([asset, ...blogEditorAssets]);
      notify('File dari PC tersimpan ke database editor.');
    };
    reader.readAsDataURL(file);
  };

  const insertBlogAsset = (asset: BlogEditorAsset) => {
    if (asset.type === 'image') {
      insertBlogContentBlock(`![${asset.name}](${asset.url})`);
    } else {
      insertBlogContentBlock(`[${asset.name}](${asset.url})`);
    }
  };

  const deleteBlogAsset = (id: string) => {
    saveBlogEditorAssets(blogEditorAssets.filter((asset) => asset.id !== id));
    notify('Aset editor dihapus dari database.');
  };

  const generateAiBlogDraft = () => {
    const topic = aiChatPrompt.trim() || editingBlogPost?.title || 'topik artikel';
    const draft = `## ${topic}\n\nPembuka singkat: jelaskan masalah utama pembaca dan kenapa bagian ini penting.\n\n### Poin Penting\n- Jelaskan konsep utama secara sederhana.\n- Tambahkan contoh yang dekat dengan kebutuhan siswa.\n- Akhiri dengan langkah praktis yang bisa dicoba hari ini.\n\n> **Catatan editor:** cek kembali akurasi data sebelum publish.`;
    setAiChatDraft(draft);
    notify('AI chat agent membuat draft blok artikel.');
  };

  const saveProgram = (updatedProg: Program) => {
    const sanitizedProgram: Program = {
      ...updatedProg,
      id: updatedProg.id.trim() || `program-${Date.now()}`,
      title: updatedProg.title.trim() || 'Program Tanpa Nama',
      category: updatedProg.category.trim() || 'General',
      description: updatedProg.description.trim() || 'Deskripsi program belum diisi.',
      target: updatedProg.target.trim() || 'Siswa umum',
      price: updatedProg.price.trim() || 'Rp 0',
      image: updatedProg.image.trim() || PROGRAMS[0].image,
      color: updatedProg.color.trim() || 'bg-brand-blue',
      facilities: (updatedProg.facilities || []).map((item) => item.trim()).filter(Boolean),
      curriculum: (updatedProg.curriculum || []).filter((item) => item.topic.trim() || item.description.trim()),
      packages: (updatedProg.packages || []).map((pkg, index) => ({
        ...pkg,
        id: pkg.id || `pkg-${Date.now()}-${index}`,
        name: pkg.name.trim() || `Paket ${index + 1}`,
        price: pkg.price.trim() || 'Rp 0',
        duration: pkg.duration.trim() || '-',
        features: pkg.features.map((feature) => feature.trim()).filter(Boolean)
      }))
    };
    let nextPrograms: Program[];
    if (programsList.find(p => p.id === sanitizedProgram.id)) {
      nextPrograms = programsList.map(p => p.id === sanitizedProgram.id ? sanitizedProgram : p);
    } else {
      nextPrograms = [...programsList, sanitizedProgram];
    }
    setProgramsList(nextPrograms);
    onProgramsChange?.(nextPrograms);
    setEditingProgram(null);
    recordAudit('Program Inventory', 'Save Program', sanitizedProgram.title);
    notify('Program berhasil disimpan dan tersinkron ke menu program.');
  };

  const deleteProgram = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus program ini?')) {
      const nextPrograms = programsList.filter(p => p.id !== id);
      setProgramsList(nextPrograms);
      onProgramsChange?.(nextPrograms);
      recordAudit('Program Inventory', 'Delete Program', id);
      notify('Program berhasil dihapus.');
    }
  };

  const resetProgramsToDefault = () => {
    if (confirm('Reset semua program demo ke data awal?')) {
      setProgramsList(PROGRAMS);
      onProgramsChange?.(PROGRAMS);
      notify('Program demo dikembalikan ke data awal.');
    }
  };

  const programCategories = useMemo(() => ['All', ...Array.from(new Set(programsList.map((program) => program.category)))], [programsList]);
  const filteredProgramsList = useMemo(() => {
    return programsList.filter((program) => {
      const keyword = programSearchTerm.toLowerCase();
      const matchesSearch = `${program.title} ${program.category} ${program.description} ${program.schedule || ''}`.toLowerCase().includes(keyword);
      const matchesCategory = programCategoryFilter === 'All' || program.category === programCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [programsList, programSearchTerm, programCategoryFilter]);


  const pendingTestimonials = useMemo(() => testimonials.filter(t => t.status === 'Pending'), [testimonials]);
  const approvedTestimonials = useMemo(() => testimonials.filter(t => t.status === 'Approved'), [testimonials]);
  const rejectedTestimonials = useMemo(() => testimonials.filter(t => t.status === 'Rejected'), [testimonials]);

  const updateTestimonialStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    notify(`Testimoni ditandai ${status}.`);
  };

  const visibleTestimonials = useMemo(() => {
    if (testimonialFilter === 'All') return testimonials;
    return testimonials.filter((item) => item.status === testimonialFilter);
  }, [testimonialFilter, testimonials]);

  const openNewUserForm = (kind: 'student' | 'staff') => {
    setEditingUser({
      id: `user-${Date.now()}`,
      name: '',
      email: '',
      role: kind === 'student' ? 'Student' : 'Support',
      program: kind === 'student' ? (programsList[0]?.title || 'SNBT Kedokteran') : 'Admin Panel',
      status: 'Active',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      joinedAt: new Date().toISOString().slice(0, 10),
      accountType: kind === 'student' ? 'Free' : 'Staff',
      packageName: kind === 'student' ? 'Manual Input' : 'Staff Account',
      paymentStatus: kind === 'student' ? 'Manual Active' : 'Internal',
      source: kind === 'student' ? 'Add User Siswa' : 'Add User Admin'
    });
  };

  const saveUser = (user: UserAccount) => {
    if (!user.name.trim() || !user.email.trim()) {
      notify('Nama dan email user wajib diisi.');
      return;
    }
    const sanitizedUser: UserAccount = {
      ...user,
      id: user.id || `user-${Date.now()}`,
      name: user.name.trim(),
      email: user.email.trim(),
      avatar: user.avatar.trim() || `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email)}`,
      joinedAt: user.joinedAt || new Date().toISOString().slice(0, 10),
      program: ['Student', 'Tutor'].includes(user.role) ? (user.program?.trim() || programsList[0]?.title || 'General') : user.program?.trim(),
      accountType: user.role === 'Student' ? (user.accountType === 'Staff' ? 'Free' : user.accountType || 'Free') : 'Staff',
      packageName: user.packageName?.trim() || (user.role === 'Student' ? 'Manual Input' : 'Staff Account'),
      paymentStatus: user.paymentStatus?.trim() || (user.role === 'Student' ? 'Manual Active' : 'Internal'),
      source: user.source?.trim() || (user.role === 'Student' ? 'Add User Siswa' : 'Add User Admin')
    };
    const nextUsers = users.some((item) => item.id === sanitizedUser.id)
      ? users.map((item) => item.id === sanitizedUser.id ? sanitizedUser : item)
      : [sanitizedUser, ...users];
    persistUsers(nextUsers);
    setEditingUser(null);
    recordAudit('User & Roles', 'Save User', `${sanitizedUser.name} - ${sanitizedUser.role}`);
    notify('User berhasil disimpan.');
  };

  const financeRows = useMemo(() => {
    const demoRows = [
      { id: 'demo-1', student: 'Andi Pratama', program: 'Med-Express', packageName: 'Premium', amount: 'Rp 3.500.000', status: 'Success', method: 'Virtual Account', date: '25 Apr 2026', type: 'paid' },
      { id: 'demo-2', student: 'Salsabila Putri', program: 'SNBT Gold', packageName: 'Premium', amount: 'Rp 2.250.000', status: 'Success', method: 'E-Wallet', date: '25 Apr 2026', type: 'paid' },
      { id: 'demo-3', student: 'Dewi Lestari', program: 'CPNS Master', packageName: 'Beasiswa Prams Scholar', amount: 'Rp 0', status: 'Scholarship Review', method: 'Beasiswa', date: '24 Apr 2026', type: 'scholarship' }
    ];
    return [...financeTransactions, ...demoRows];
  }, [financeTransactions]);

  const paymentStatusOptions = useMemo(() => ['All', ...Array.from(new Set(financeRows.map((tx) => tx.status || 'Unknown')))], [financeRows]);
  const filteredFinanceRows = useMemo(() => {
    const keyword = paymentSearchTerm.toLowerCase();
    return financeRows.filter((tx) => {
      const rowType = String(tx.type || (String(tx.status).toLowerCase().includes('scholarship') ? 'scholarship' : String(tx.status).toLowerCase().includes('free') ? 'free' : 'paid'));
      const matchesSearch = `${tx.student || ''} ${tx.email || ''} ${tx.phone || ''} ${tx.program || ''} ${tx.packageName || ''} ${tx.invoiceNumber || tx.id || ''}`.toLowerCase().includes(keyword);
      const matchesStatus = paymentStatusFilter === 'All' || tx.status === paymentStatusFilter;
      const matchesType = paymentTypeFilter === 'All' || rowType === paymentTypeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [financeRows, paymentSearchTerm, paymentStatusFilter, paymentTypeFilter]);

  const financeSummary = useMemo(() => {
    const paidRevenue = financeRows
      .filter((tx) => !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free'))
      .reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const pendingRevenue = financeRows
      .filter((tx) => String(tx.status).toLowerCase().includes('pending'))
      .reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const scholarshipApplications = financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship')).length;
    const fixedCost = financeRealizations
      .filter((row) => financeEntries.find((entry) => entry.id === row.financeEntryId)?.type === 'fixed')
      .reduce((sum, row) => sum + row.amount, 0);
    const variableCost = financeRealizations
      .filter((row) => financeEntries.find((entry) => entry.id === row.financeEntryId)?.type === 'variable')
      .reduce((sum, row) => sum + row.amount, 0);
    const budget = financeEntries.filter((entry) => entry.type === 'budget').reduce((sum, entry) => sum + entry.amount, 0);
    return {
      paidRevenue,
      pendingRevenue,
      scholarshipApplications,
      fixedCost,
      variableCost,
      budget,
      netProfit: paidRevenue - fixedCost - variableCost
    };
  }, [financeRows, financeEntries, financeRealizations]);

  const accountingRows = useMemo(() => {
    const paymentRows = financeRows.map((tx) => {
      const amount = parseRupiah(tx.amount);
      const isIncome = amount > 0 && !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free');
      return {
        id: `ledger-${tx.id || tx.invoiceNumber}`,
        date: tx.createdAt || tx.date || '-',
        source: tx.invoiceNumber || tx.id || '-',
        description: `Pendaftaran ${tx.program || '-'} - ${tx.packageName || '-'}`,
        account: isIncome ? 'Pendapatan Kelas' : String(tx.status).toLowerCase().includes('scholarship') ? 'Piutang/Kuota Beasiswa' : 'Akun Gratis',
        debit: isIncome ? amount : 0,
        credit: 0,
        status: tx.status || '-'
      };
    });
    const realizationRows = financeRealizations.map((row) => {
      const source = financeEntries.find((entry) => entry.id === row.financeEntryId);
      return {
      id: `ledger-${row.id}`,
      date: row.date,
      source: row.id,
      description: `${row.name}${row.note ? ` - ${row.note}` : ''}`,
      account: source?.type === 'budget' ? `Realisasi Anggaran - ${row.category}` : source?.type === 'fixed' ? `Realisasi Biaya Tetap - ${row.category}` : `Realisasi Biaya Variabel - ${row.category}`,
      debit: 0,
      credit: row.amount,
      status: 'Realized'
    };
    });
    const assetRows = assetEntries.flatMap((asset) => {
      const baseRow = {
        id: `ledger-${asset.id}`,
        date: asset.acquisitionDate,
        source: asset.id,
        description: asset.name,
        account: asset.type === 'fixed_asset' ? `Aset Tetap - ${asset.category}` : `Aset Lancar - ${asset.category}`,
        debit: asset.currentValue,
        credit: 0,
        status: 'Asset Registered'
      };
      if (asset.type !== 'fixed_asset' || asset.depreciationPerMonth <= 0 || nonDepreciableFixedAssetCategories.includes(asset.category)) return [baseRow];
      return [
        baseRow,
        {
          id: `ledger-dep-${asset.id}`,
          date: new Date().toISOString().slice(0, 10),
          source: asset.id,
          description: `Depresiasi bulanan ${asset.name}`,
          account: `Beban Depresiasi - ${asset.category}`,
          debit: 0,
          credit: asset.depreciationPerMonth,
          status: 'Depreciation'
        }
      ];
    });
    return [...paymentRows, ...realizationRows, ...assetRows];
  }, [financeRows, financeEntries, financeRealizations, assetEntries]);

  const financialReports = useMemo(() => {
    const now = new Date();
    const periodLabel = financialReportPeriod === 'monthly'
      ? now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      : financialReportPeriod === 'quarterly'
        ? `Kuartal ${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`
        : `Tahun ${now.getFullYear()}`;
    const revenue = financeRows
      .filter((tx) => !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free'))
      .reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const realizedExpenses = financeRealizations.reduce((sum, row) => sum + row.amount, 0);
    const depreciationExpense = assetEntries
      .filter((asset) => asset.type === 'fixed_asset' && asset.depreciationPerMonth > 0 && !nonDepreciableFixedAssetCategories.includes(asset.category))
      .reduce((sum, asset) => sum + asset.depreciationPerMonth, 0);
    const fixedAssets = assetEntries.filter((asset) => asset.type === 'fixed_asset').reduce((sum, asset) => sum + asset.currentValue, 0);
    const currentAssets = assetEntries.filter((asset) => asset.type === 'current_asset').reduce((sum, asset) => sum + asset.currentValue, 0);
    const pendingReceivable = financeRows.filter((tx) => String(tx.status).toLowerCase().includes('pending')).reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const scholarshipReserve = financeEntries.filter((entry) => entry.type === 'budget' && entry.category.toLowerCase().includes('beasiswa')).reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = realizedExpenses + depreciationExpense;
    const netIncome = revenue - totalExpenses;
    const totalAssets = currentAssets + fixedAssets + pendingReceivable;
    const liabilities = financeSummary.pendingRevenue;
    const equity = totalAssets - liabilities;
    return {
      periodLabel,
      incomeStatement: [
        { label: 'Pendapatan Kelas Berbayar', amount: revenue },
        { label: 'Realisasi Biaya & Anggaran', amount: -realizedExpenses },
        { label: 'Beban Depresiasi Aset Tetap', amount: -depreciationExpense },
        { label: 'Laba/Rugi Bersih', amount: netIncome, total: true }
      ],
      balanceSheet: [
        { label: 'Aset Lancar', amount: currentAssets },
        { label: 'Piutang/Pending Payment', amount: pendingReceivable },
        { label: 'Aset Tetap Bersih', amount: fixedAssets },
        { label: 'Total Aset', amount: totalAssets, total: true },
        { label: 'Kewajiban/Pending Operasional', amount: liabilities },
        { label: 'Cadangan Beasiswa', amount: scholarshipReserve },
        { label: 'Ekuitas Demo', amount: equity, total: true }
      ],
      cashFlow: [
        { label: 'Kas Masuk dari Pembayaran', amount: revenue },
        { label: 'Kas Keluar Realisasi Biaya', amount: -realizedExpenses },
        { label: 'Investasi/Pencatatan Aset', amount: -assetEntries.reduce((sum, asset) => sum + asset.acquisitionValue, 0) },
        { label: 'Arus Kas Bersih Demo', amount: revenue - realizedExpenses - assetEntries.reduce((sum, asset) => sum + asset.acquisitionValue, 0), total: true }
      ]
    };
  }, [financialReportPeriod, financeRows, financeRealizations, assetEntries, financeEntries, financeSummary.pendingRevenue]);
  
  // Question Bank State
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>(['IRT', 'SNBT', 'CPNS', 'Kedokteran', 'Matematika']);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isManageTagsModalOpen, setIsManageTagsModalOpen] = useState(false);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const [videoLessons, setVideoLessons] = useState<VideoLessonRecord[]>(() => readStorageArray('theprams_demo_video_lessons', defaultVideoLessons));
  const [editingVideo, setEditingVideo] = useState<VideoLessonRecord | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'completed'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    duration: '',
    program: PROGRAMS[0].title
  });

  const saveVideoLessons = (nextVideos: VideoLessonRecord[]) => {
    setVideoLessons(nextVideos);
    localStorage.setItem('theprams_demo_video_lessons', JSON.stringify(nextVideos));
  };

  const saveVideoEditor = (video: VideoLessonRecord) => {
    if (!video.title.trim()) {
      notify('Judul video wajib diisi.');
      return;
    }
    const sanitized: VideoLessonRecord = {
      ...video,
      title: video.title.trim(),
      program: video.program.trim() || PROGRAMS[0].title,
      duration: video.duration.trim() || '00:00',
      thumbnail: video.thumbnail.trim() || defaultVideoLessons[0].thumbnail,
      tags: video.tags.map((tag) => tag.trim()).filter(Boolean)
    };
    const nextVideos = videoLessons.some((item) => item.id === sanitized.id)
      ? videoLessons.map((item) => item.id === sanitized.id ? sanitized : item)
      : [sanitized, ...videoLessons];
    saveVideoLessons(nextVideos);
    setEditingVideo(null);
    recordAudit('Content Library', 'Save Video Lesson', sanitized.title);
    notify('Detail video berhasil disimpan.');
  };
  
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      const matchesDirectory = userDirectoryView === 'students'
        ? u.role === 'Student'
        : u.role !== 'Student';
      return matchesSearch && matchesRole && matchesDirectory;
    });
  }, [users, searchTerm, roleFilter, userDirectoryView]);

  const deleteUser = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      persistUsers(users.filter(u => u.id !== id));
      notify('User berhasil dihapus.');
    }
  };

  // Question Bank Functions
  const duplicateQuestion = (q: Question) => {
    const newQuestion: Question = {
      ...q,
      id: Date.now().toString(),
      text: `${q.text} (Copy)`
    };
    setQuestions([newQuestion, ...questions]);
    notify('Soal berhasil diduplikasi.');
  };

  const saveQuestion = (updatedQ: Question) => {
    if (questions.find(q => q.id === updatedQ.id)) {
      setQuestions(questions.map(q => q.id === updatedQ.id ? updatedQ : q));
    } else {
      setQuestions([updatedQ, ...questions]);
    }
    setEditingQuestion(null);
    notify('Soal berhasil disimpan.');
  };

  const deleteQuestion = (id: string) => {
    if (confirm('Delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
      notify('Soal berhasil dihapus.');
    }
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('processing');
    
    // Simulate parsing
    setTimeout(() => {
      const newQuestions: Question[] = [
        { 
          id: (Date.now() + 1).toString(), 
          subject: 'Penalaran Umum', 
          difficulty: 'Medium', 
          text: 'Hasil import CSV 1...', 
          options: [{id: 'A', text: 'Option A'}, {id: 'B', text: 'Option B'}], 
          correctOptionId: 'A', 
          explanation: 'Imported explanation', 
          program: 'SNBT',
          tags: ['CSV Import']
        },
        { 
          id: (Date.now() + 2).toString(), 
          subject: 'Penalaran Matematika', 
          difficulty: 'Hard', 
          text: 'Hasil import CSV 2...', 
          options: [{id: 'A', text: 'Option A'}, {id: 'B', text: 'Option B'}], 
          correctOptionId: 'B', 
          explanation: 'Imported explanation 2', 
          program: 'SKD',
          tags: ['CSV Import']
        }
      ];
      
      setQuestions([...newQuestions, ...questions]);
      setImportStatus('done');
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStatus('idle');
      }, 1500);
    }, 2000);
  };

  const addTag = (tag: string) => {
    if (!availableTags.includes(tag)) {
      setAvailableTags([...availableTags, tag]);
    }
  };

  const simulateVideoUpload = () => {
    if (!videoForm.title) return;
    setUploadStatus('uploading');
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('completed');
          setTimeout(() => {
            setIsUploadVideoModalOpen(false);
            setUploadStatus('idle');
            setVideoForm({ title: '', description: '', duration: '', program: PROGRAMS[0].title });
          }, 1500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const toggleQuestionTag = (tag: string) => {
    if (!editingQuestion) return;
    const currentTags = editingQuestion.tags || [];
    const newTags = currentTags.includes(tag) 
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    setEditingQuestion({ ...editingQuestion, tags: newTags });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-navy text-white border-r border-white/5 hidden lg:flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center font-bold text-xl italic shadow-lg shadow-blue-600/30">
            TP
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">The Prams</h1>
            <span className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
            {[
              { id: 'overview', name: 'Dashboard', icon: PieChartIcon },
              { id: 'leads', name: 'Manage Leads', icon: UserPlus },
              { id: 'inquiries', name: 'Pertanyaan Website', icon: MessageSquare },
              { id: 'users', name: 'User & Roles', icon: Users },
              { id: 'programs', name: 'Programs', icon: Award },
              { id: 'content', name: 'Content Library', icon: Video },
              { id: 'marketing', name: 'Digital Marketing', icon: Megaphone },
              { id: 'website', name: 'Website Editor', icon: Globe },
              { id: 'finance', name: 'Financial Center', icon: Banknote },
              { id: 'questions', name: 'Question Bank', icon: BookOpen },
              { id: 'testimonials', name: 'Testimonials', icon: MessageSquare },
              { id: 'reports', name: 'Deep Analytics', icon: LineChartIcon },
              { id: 'settings', name: 'Settings', icon: Settings },
            ].filter(item => isTabAllowed(item.id as AdminTab)).map((item) => (
             <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all border-l-4 ${activeTab === item.id ? 'bg-brand-blue/20 text-brand-blue border-brand-blue font-bold' : 'text-slate-400 hover:text-white border-transparent'}`}
             >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
             </button>
           ))}
        </nav>
        
        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
           {adminRole === 'Super Admin' && (
             <div className="space-y-2 mb-4">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest px-1">Role Switcher (Debug)</p>
                <div className="grid grid-cols-1 gap-1">
                   {(['Super Admin', 'Content Manager', 'Support'] as AdminRole[]).map(role => (
                     <button 
                       key={role}
                       onClick={() => {
                         setAdminRole(role);
                         setActiveTab('overview');
                       }}
                       className={`px-2 py-1 rounded text-[8px] font-bold border transition-all ${adminRole === role ? 'bg-white text-brand-navy border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                     >
                        {role}
                     </button>
                   ))}
                </div>
             </div>
           )}
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <img src="https://i.pravatar.cc/150?u=admin" className="w-10 h-10 rounded-xl" alt="Admin" />
                 <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{adminRole === 'Super Admin' ? 'dr. Pramono' : adminRole}</p>
                    <p className="text-[10px] text-emerald-500 font-bold">{adminRole.toUpperCase()}</p>
                 </div>
              </div>
              <button 
                onClick={logout} 
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                 <LogOut size={18} />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
          <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
             <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 max-w-md w-full">
                <Search size={18} className="text-slate-400" />
                <input 
                 type="text" 
                 placeholder="Search dashboard..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-transparent border-none text-sm w-full focus:ring-0" 
                />
             </div>
             <div className="flex items-center gap-4">
                <h2 className="hidden md:block text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  Active: {activeTab}
                </h2>
                <button
                  onClick={() => notify('Notifikasi: 3 pembayaran menunggu verifikasi dan 2 testimoni pending.')}
                  className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 border border-slate-100 relative"
                >
                   <Bell size={20} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
             </div>
          </header>
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
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                     { label: 'Total Siswa Aktif', value: '1,284', trend: '+12%', icon: Users2, color: 'text-brand-blue' },
                     { label: 'Active Leads', value: '450', trend: '+25%', icon: UserPlus, color: 'text-brand-orange' },
                     { label: 'Tryout Offline Boyolali', value: '15 Mei', trend: 'Upcoming', icon: MapPin, color: 'text-brand-orange' },
                     { label: 'Revenue (MTD)', value: 'Rp 420jt', trend: '+14%', icon: DollarSign, color: 'text-emerald-500' }
                   ].map((stat, i) => (
                     <div key={i} className="card-premium p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                              <stat.icon size={24} />
                           </div>
                           <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
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
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-blue uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-brand-blue" /> Students</span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-orange uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-brand-orange" /> Leads</span>
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
                                     <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                     <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                     <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                               <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
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
            )}

            {activeTab === 'leads' && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div className="flex justify-between items-center">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">Lead Management</h2>
                      <p className="text-sm text-slate-500">Capture and convert potential students</p>
                   </div>
                   <button onClick={openNewLeadForm} className="btn-primary py-2 px-6">
                      <Plus size={18} />
                      Add New Lead
                   </button>
                </div>

                <div className="card-premium overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                         <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Lead Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Interest</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Source</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {allLeads.map((lead) => (
                           <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                 <p className="text-sm font-bold text-brand-navy">{lead.name}</p>
                                 <p className="text-[10px] text-slate-400 font-medium">{lead.email}</p>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-600">{lead.programOfInterest}</td>
                              <td className="px-6 py-4">
                                 <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">{lead.source}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                    lead.status === 'Qualified' ? 'bg-emerald-50 text-emerald-600' :
                                    'bg-amber-50 text-amber-600'
                                 }`}>
                                    {lead.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2 group-hover:opacity-100 opacity-0 transition-opacity">
                                    <button
                                      onClick={() => setLeadPendingConvert(lead)}
                                      className="p-2 text-brand-blue hover:bg-blue-50 rounded-lg"
                                      title="Convert to Student"
                                    >
                                       <UserPlus size={16} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedLead(lead);
                                        setLeadNoteDraft(lead.note || '');
                                      }}
                                      className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                                      title="Detail Lead"
                                    >
                                       <MoreVertical size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}

             {activeTab === 'users' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">User Management & Permissions</h2>
                      <p className="text-sm text-slate-500">Control role assignments and granular access levels</p>
                   </div>
                   <div className="flex flex-wrap items-center gap-3">
                      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                        <button onClick={() => setUserDirectoryView('students')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${userDirectoryView === 'students' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400 hover:text-slate-600'}`}>
                          User Siswa
                        </button>
                        <button onClick={() => setUserDirectoryView('staff')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${userDirectoryView === 'staff' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400 hover:text-slate-600'}`}>
                          Admin & Staff
                        </button>
                      </div>
                      <button 
                        onClick={() => openNewUserForm('student')}
                        className="btn-secondary py-2 px-5"
                      >
                         <Plus size={18} />
                         Add User Siswa
                      </button>
                      <button 
                        onClick={() => openNewUserForm('staff')}
                        className="btn-primary py-2 px-5"
                      >
                         <Plus size={18} />
                         Add User Admin
                      </button>
                      <button
                        onClick={() => {
                          syncApprovedStudentsToUsers();
                          notify('Daftar siswa disinkronkan dari registrasi, pembayaran approved, dan beasiswa approved.');
                        }}
                        className="btn-secondary py-2 px-5"
                      >
                         <RefreshCw size={18} />
                         Sync Approved
                      </button>
                   </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total User', value: users.length, icon: Users, color: 'text-brand-blue' },
                    { label: 'Student', value: users.filter((item) => item.role === 'Student').length, icon: GraduationCap, color: 'text-emerald-500' },
                    { label: 'Gratis', value: users.filter((item) => item.role === 'Student' && item.accountType === 'Free').length, icon: CheckCircle2, color: 'text-emerald-500' },
                    { label: 'Berbayar/Beasiswa', value: users.filter((item) => item.role === 'Student' && ['Paid', 'Scholarship'].includes(String(item.accountType))).length, icon: Award, color: 'text-brand-orange' },
                  ].map((stat) => (
                    <div key={stat.label} className="card-premium p-5 bg-white">
                      <stat.icon size={20} className={`${stat.color} mb-3`} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-black text-brand-navy mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="card-premium overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                         <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">System Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tipe Akun</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Access Level</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {filteredUsers.map((user) => (
                           <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="relative">
                                      <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-brand-navy">{user.name || 'New User'}</p>
                                       <p className="text-[10px] text-slate-400 font-medium">{user.email || 'pending email'}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <select 
                                    value={user.role}
                                    onChange={(e) => {
                                      const nextRole = e.target.value as UserAccount['role'];
                                      const updatedUsers = users.map((u) => {
                                        const nextAccountType: UserAccount['accountType'] = nextRole === 'Student' ? (u.accountType === 'Staff' ? 'Free' : u.accountType || 'Free') : 'Staff';
                                        return u.id === user.id ? { ...u, role: nextRole, accountType: nextAccountType } : u;
                                      });
                                      persistUsers(updatedUsers);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none border border-transparent transition-all hover:border-slate-200 ${
                                       user.role === 'Admin' ? 'bg-purple-50 text-purple-600' :
                                       user.role === 'Tutor' || user.role === 'Content Manager' ? 'bg-amber-50 text-amber-600' :
                                       'bg-blue-50 text-brand-blue'
                                    }`}
                                 >
                                    <option value="Admin">Super Admin</option>
                                    <option value="Content Manager">Content Manager</option>
                                    <option value="Support">Support Staff</option>
                                    <option value="Tutor">Educator</option>
                                    <option value="Student">Student User</option>
                                 </select>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                  user.accountType === 'Scholarship' ? 'bg-indigo-50 text-indigo-600' :
                                  user.accountType === 'Paid' ? 'bg-amber-50 text-amber-600' :
                                  user.accountType === 'Staff' ? 'bg-slate-100 text-slate-500' :
                                  'bg-emerald-50 text-emerald-600'
                                }`}>
                                  {user.accountType || (user.role === 'Student' ? 'Free' : 'Staff')}
                                </span>
                                <p className="text-[10px] text-slate-400 mt-1">{user.packageName || '-'}</p>
                                <p className="text-[10px] text-slate-400">{user.paymentStatus || user.source || '-'}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {rolePermissions[(user.role as any) === 'Admin' ? 'Super Admin' : (user.role as any)]?.slice(0, 3).map(tab => (
                                      <span key={tab} className="text-[8px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{tab}</span>
                                    ))}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => notify(`Hak akses ${user.name || 'New User'} mengikuti role: ${user.role}.`)} className="p-2 text-slate-400 hover:text-brand-blue transition-colors">
                                       <Shield size={16} />
                                    </button>
                                    <button onClick={() => setEditingUser(user)} className="p-2 text-slate-400 hover:text-brand-blue transition-colors">
                                       <Edit2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => deleteUser(user.id)}
                                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}

            {/* Feedback Tab content skipped for brevity... */}

            {activeTab === 'inquiries' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Pertanyaan dari Website</h2>
                    <p className="text-sm text-slate-500">Menampung semua pertanyaan dari form kontak dan tombol WhatsApp, termasuk nomor penanya.</p>
                  </div>
                  <button
                    onClick={() => {
                      const latest = readStorageArray<WebsiteQuestion>('theprams_demo_website_questions');
                      setWebsiteQuestions(latest);
                      notify('Data pertanyaan website disinkronkan.');
                    }}
                    className="btn-secondary py-2 px-5 flex items-center gap-2"
                  >
                    <RefreshCw size={18} /> Sync Data
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Pertanyaan', value: websiteQuestions.length, color: 'text-brand-blue' },
                    { label: 'Belum Dibalas', value: websiteQuestions.filter((q) => q.status === 'Baru').length, color: 'text-brand-orange' },
                    { label: 'Sudah Dibalas', value: websiteQuestions.filter((q) => q.status === 'Dibalas').length, color: 'text-emerald-500' },
                  ].map((stat) => (
                    <div key={stat.label} className="card-premium p-6">
                      <MessageSquare className={`${stat.color} mb-3`} size={22} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-black text-brand-navy mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {websiteQuestions.length === 0 && (
                    <div className="card-premium p-10 text-center">
                      <p className="font-bold text-brand-navy">Belum ada pertanyaan masuk.</p>
                      <p className="text-sm text-slate-500 mt-1">Pertanyaan dari halaman kontak dan direct WhatsApp akan muncul di sini.</p>
                    </div>
                  )}
                  {websiteQuestions.map((question) => (
                    <div key={question.id} className="card-premium p-6 bg-white">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${question.status === 'Dibalas' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{question.status}</span>
                            <span className="px-2 py-1 rounded-lg bg-blue-50 text-brand-blue text-[10px] font-black uppercase">{question.source}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{question.createdAt}</span>
                          </div>
                          <h3 className="text-lg font-black text-brand-navy">{question.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">{question.email} - WA: {question.phone || '-'}</p>
                          <p className="text-xs font-bold text-brand-blue mt-1">{question.programOfInterest}</p>
                          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{question.question}</p>
                          </div>
                        </div>
                        <div className="lg:w-[420px] space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Jawaban Admin</label>
                          <textarea
                            id={`answer-${question.id}`}
                            defaultValue={question.adminAnswer || `Halo ${question.name}, terima kasih sudah menghubungi The Prams. `}
                            className="w-full h-32 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600"
                          />
                          {question.answeredAt && <p className="text-[10px] text-slate-400">Terakhir dijawab: {question.answeredAt}</p>}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const textarea = document.getElementById(`answer-${question.id}`) as HTMLTextAreaElement | null;
                                saveWebsiteQuestionAnswer(question, textarea?.value || '');
                              }}
                              className="flex-1 btn-primary py-2.5"
                            >
                              <Save size={16} /> Simpan Jawaban
                            </button>
                            <button onClick={() => openQuestionWhatsapp(question)} className="px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-black text-xs">
                              WhatsApp
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Content Management</h2>
                    <p className="text-sm text-slate-500">Manage video lessons and learning materials</p>
                  </div>
                  <button 
                    onClick={() => setIsUploadVideoModalOpen(true)}
                    className="btn-primary py-2 px-6 flex items-center gap-2"
                  >
                    <Plus size={18} /> Upload Video
                  </button>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="card-premium p-6">
                    <Video className="text-brand-blue mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Videos</p>
                    <p className="text-3xl font-black text-brand-navy">{videoLessons.length}</p>
                  </div>
                  <div className="card-premium p-6">
                    <Clock className="text-brand-orange mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Watch Time</p>
                    <p className="text-3xl font-black text-brand-navy">8.5k hrs</p>
                  </div>
                  <div className="card-premium p-6">
                    <Users className="text-indigo-500 mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Viewers</p>
                    <p className="text-3xl font-black text-brand-navy">842</p>
                  </div>
                  <div className="card-premium p-6">
                    <CheckCircle2 className="text-emerald-500 mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion</p>
                    <p className="text-3xl font-black text-brand-navy">{Math.round((videoLessons.filter((video) => video.status === 'Published').length / Math.max(videoLessons.length, 1)) * 100)}%</p>
                  </div>
                </div>

                <div className="card-premium p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-brand-navy">Recent Lessons</h3>
                    <div className="flex gap-2">
                      <select className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none">
                        <option>All Programs</option>
                        <option>Kedokteran Express</option>
                        <option>SNBT Intensive</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {videoLessons.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-brand-blue/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-10 bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <img src={video.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
                            <Play size={16} className="text-slate-400 group-hover:text-brand-blue relative z-10" />
                            <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-brand-navy">{video.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{video.program}</p>
                            <div className="flex gap-1 mt-1">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${video.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : video.status === 'Draft' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{video.status}</span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-brand-blue text-[8px] font-black uppercase">{video.access}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 text-right">
                          <div className="hidden md:block">
                            <p className="text-xs font-bold text-brand-navy">{video.duration}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Duration</p>
                          </div>
                          <div className="hidden md:block">
                            <p className="text-xs font-bold text-brand-navy">{video.views}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Views</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingVideo(video)} className="p-2 text-slate-300 hover:text-brand-blue transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => {
                              saveVideoLessons(videoLessons.filter((item) => item.id !== video.id));
                              notify(`Video "${video.title}" dihapus dari daftar demo.`);
                            }} className="p-2 text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'marketing' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Marketing & Campaigns</h2>
                    <p className="text-sm text-slate-500">Manage landing pages and monitor conversion funnels</p>
                  </div>
                  <button onClick={() => setIsCampaignEditorOpen(true)} className="btn-primary py-2 px-6 flex items-center gap-2">
                    <Plus size={18} /> New Campaign
                  </button>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { title: 'Campaign Setup', desc: 'Buat nama campaign, objective, channel, audience, landing page, dan catatan eksekusi.', icon: Megaphone },
                    { title: 'Budget Fleksibel', desc: 'Budget total dan budget harian bisa diisi bebas dengan mata uang default IDR atau mata uang lain.', icon: Wallet },
                    { title: 'Daily Control', desc: 'Estimasi durasi campaign dihitung otomatis dari total budget dibagi budget harian.', icon: Calendar },
                    { title: 'Draft Mode', desc: 'Campaign baru tersimpan sebagai draft demo sebelum dieksekusi ke channel iklan.', icon: FileText },
                  ].map((item) => (
                    <div key={item.title} className="card-premium p-5 bg-white">
                      <item.icon size={20} className="text-brand-blue mb-3" />
                      <p className="text-sm font-black text-brand-navy mb-1">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="card-premium p-6">
                    <TrendingUp className="text-emerald-500 mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion Rate</p>
                    <p className="text-3xl font-black text-brand-navy">4.8%</p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-2">+0.5% from last week</p>
                  </div>
                  <div className="card-premium p-6">
                    <Users className="text-brand-blue mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Leads</p>
                    <p className="text-3xl font-black text-brand-navy">2,450</p>
                    <p className="text-[10px] text-brand-blue font-bold mt-2">Organic: 65% | Paid: 35%</p>
                  </div>
                  <div className="card-premium p-6">
                    <Target className="text-brand-orange mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total ROI</p>
                    <p className="text-3xl font-black text-brand-navy">3.2x</p>
                    <p className="text-[10px] text-brand-orange font-bold mt-2">Target ROI: 4.0x</p>
                  </div>
                </div>

                <div className="card-premium p-8">
                  <h3 className="font-bold text-brand-navy mb-6">Landing Page Management</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'SNBT Intensive 2025', url: '/snbt-2025', status: 'Active', hits: '12k' },
                      { name: 'Kedokteran Special', url: '/kedokteran', status: 'Active', hits: '8.5k' },
                      { name: 'CPNS Masterclass', url: '/cpns', status: 'Draft', hits: '0' },
                    ].map((page, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white shadow-sm rounded-xl"><Layout size={18} className="text-slate-400" /></div>
                          <div>
                            <p className="text-sm font-bold text-brand-navy">{page.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{page.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-xs font-bold text-brand-navy">{page.hits}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Views</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${page.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            {page.status}
                          </span>
                          <button onClick={() => notify(`Landing page ${page.name} dibuka di editor.`)} className="p-2 text-slate-300 hover:text-brand-blue"><Edit2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'website' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Website Editor Panel</h2>
                    <p className="text-sm text-slate-500">Panel editing visual untuk mengatur UI, konten, layout, brand, responsive behavior, dan SEO website publik.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setView?.('landing')} className="btn-secondary py-2 px-6">Preview Changes</button>
                    <button onClick={() => setIsSaveWebsiteConfirmOpen(true)} className="btn-secondary py-2 px-6">Save Changes</button>
                    <button onClick={() => notify('Update website dipublikasikan di mode demo.')} className="btn-primary py-2 px-6">Publish Updates</button>
                  </div>
                </div>

                <div className="card-premium p-8 bg-white">
                  <h3 className="font-bold text-brand-navy mb-6">Rincian Menu Website Editor</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Preview Changes', detail: 'Melihat hasil perubahan draft di halaman landing sebelum disimpan atau dipublikasikan.' },
                      { name: 'Save Changes', detail: 'Menyimpan draft konfigurasi UI. Saat diklik muncul konfirmasi Iya/Tidak.' },
                      { name: 'Publish Updates', detail: 'Mempublikasikan draft agar dianggap aktif di website publik pada mode demo.' },
                      { name: 'Home Hero Section', detail: 'Mengubah konten hero, gambar, overlay, tinggi section, dan alignment teks.' },
                      { name: 'Section Builder', detail: 'Mengatur urutan section, menambah section, toggle visibility, dan membuka editor section.' },
                      { name: 'Typography System', detail: 'Mengatur gaya heading, body text, dan button text agar konsisten.' },
                      { name: 'CTA & Button Style', detail: 'Mengatur teks tombol, gaya button, dan tampilan CTA utama.' },
                      { name: 'Global Navigation', detail: 'Mengatur item navbar, tambah menu, dan hapus menu dari draft.' },
                      { name: 'Brand Identity', detail: 'Mengatur warna brand, card radius, surface style, dan shadow system.' },
                      { name: 'Responsive Controls', detail: 'Mengatur perilaku UI di mobile/tablet seperti stacking, spacing, dan visibility.' },
                      { name: 'Reusable Components', detail: 'Membuka editor komponen yang dipakai berulang: card, accordion, testimonial, footer.' },
                      { name: 'SEO Metadata', detail: 'Mengatur preview Google, SEO title, meta description, dan SEO tags.' },
                    ].map((item) => (
                      <div key={item.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-sm font-black text-brand-navy mb-1">{item.name}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-premium p-8 bg-white">
                  <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-6">
                    <div>
                      <h3 className="font-bold text-brand-navy">Editor Info Menarik & Literasi</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
                        Tulis, edit, dan publish blog/artikel literasi yang tampil di menu Info Menarik. Perubahan judul, ringkasan, gambar, isi artikel, tag, author, bacaan lainnya, dan gambar tengah langsung dipakai halaman blog publik setelah disimpan.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setPreviewBlogPost(visibleBlogPosts[0] || blogPostDrafts[0] || null)} className="btn-secondary py-2 px-4 text-xs">Preview Draft</button>
                      <button onClick={() => syncBlogPostsToWebsite()} className="btn-secondary py-2 px-4 text-xs">Publish / Sinkronkan</button>
                      <button onClick={() => createBlogPostDraft('Literasi')} className="btn-primary py-2 px-5 flex items-center gap-2 text-xs">
                        <Plus size={18} /> Tulis Artikel
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 mb-6">
                    {[
                      { title: 'Yang Tampil di Publik', desc: 'Kartu artikel di menu Info Menarik dan halaman detail blog memakai data dari editor ini.' },
                      { title: 'Isi Artikel Fleksibel', desc: 'Konten mendukung Markdown, gambar tengah, bacaan lainnya 3 opsi, quote, highlight, CTA, dan heading.' },
                      { title: 'Alur Sinkron', desc: 'Simpan & Publish membuat artikel langsung masuk daftar publik; Preview membuka halaman Info Menarik.' }
                    ].map((item) => (
                      <div key={item.title} className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">{item.title}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'Total Artikel', value: blogEditorStats.total },
                      { label: 'Konten Literasi', value: blogEditorStats.literasi },
                      { label: 'Info Menarik', value: blogEditorStats.infoMenarik },
                      { label: 'Total Kata', value: blogEditorStats.words }
                    ].map((stat) => (
                      <div key={stat.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black text-brand-navy mt-1">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-[1fr_auto] gap-4 mb-6">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input
                        value={blogEditorSearchTerm}
                        onChange={(e) => setBlogEditorSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-brand-blue"
                        placeholder="Cari judul, ringkasan, author, atau tag..."
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {blogCategoryOptions.map((category) => (
                        <button
                          key={category}
                          onClick={() => setBlogEditorCategory(category)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${blogEditorCategory === category ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-slate-500 border-slate-200 hover:text-brand-blue'}`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {BLOG_EDITOR_TEMPLATES.map((template) => (
                      <button
                        key={template.label}
                        onClick={() => createBlogPostDraft(template.category)}
                        className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-colors"
                      >
                        {template.label}
                      </button>
                    ))}
                  </div>

                  {visibleBlogPosts.length === 0 ? (
                    <div className="p-10 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
                      <FileText size={36} className="mx-auto text-slate-300 mb-3" />
                      <p className="font-black text-brand-navy">Belum ada artikel yang cocok</p>
                      <p className="text-sm text-slate-500 mt-1">Ubah filter pencarian atau buat artikel baru.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {visibleBlogPosts.map((post) => (
                        <div key={post.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
                          <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100">
                            <img src={post.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded-lg bg-blue-50 text-brand-blue text-[9px] font-black uppercase">{post.category}</span>
                            <span className="text-[9px] text-slate-400 font-bold">{post.readTime}</span>
                            <span className="ml-auto text-[9px] text-slate-400 font-bold">{post.date}</span>
                          </div>
                          <p className="text-sm font-black text-brand-navy line-clamp-2">{post.title}</p>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2">{post.excerpt}</p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-1 rounded-lg bg-white border border-slate-100 text-[9px] font-bold text-slate-400">#{tag.trim()}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                            <img src={post.authorAvatar} className="w-7 h-7 rounded-full" alt="" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-black text-brand-navy truncate">{post.author}</p>
                              <p className="text-[9px] text-slate-400 truncate">{post.authorRole}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button onClick={() => setEditingBlogPost(post)} className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-brand-blue uppercase">Edit</button>
                            <button onClick={() => duplicateBlogPost(post)} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-brand-blue" title="Duplikasi artikel">
                              <Copy size={14} />
                            </button>
                            <button onClick={() => deleteBlogPost(post.id)} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-300 hover:text-red-500" title="Hapus artikel">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { title: 'Hero Section', desc: 'Mengatur judul utama, sub-headline, dan gambar pembuka halaman depan.', icon: Layout },
                    { title: 'Navigation', desc: 'Mengelola menu navbar publik seperti Beranda, Program, Tryout, Testimoni, dan Kontak.', icon: Globe },
                    { title: 'Brand Identity', desc: 'Meninjau warna brand utama dan sekunder yang dipakai di landing page.', icon: ImageIcon },
                    { title: 'SEO Metadata', desc: 'Mengatur judul pencarian, deskripsi Google preview, dan tag SEO dasar.', icon: Search },
                    { title: 'Typography', desc: 'Mengatur skala heading, gaya body text, weight, dan jarak antar elemen.', icon: FileText },
                    { title: 'Section Layout', desc: 'Mengatur urutan section, padding, container width, dan visibilitas blok halaman.', icon: Layout },
                    { title: 'CTA Buttons', desc: 'Mengatur teks tombol utama, link tujuan, warna, radius, dan gaya hover.', icon: Target },
                    { title: 'Responsive UI', desc: 'Mengontrol tampilan desktop/mobile, spacing, dan prioritas konten di layar kecil.', icon: Smartphone },
                  ].map((item) => (
                    <div key={item.title} className="card-premium p-5 bg-white">
                      <item.icon size={20} className="text-brand-blue mb-3" />
                      <p className="text-sm font-black text-brand-navy mb-1">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="card-premium p-8">
                      <h3 className="font-bold text-brand-navy mb-6">Home Hero Section</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hero Title</label>
                          <input className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold" defaultValue="Wujudkan Mimpi Menjadi Dokter Bersama The Prams" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Sub-headline</label>
                          <textarea className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 h-24" defaultValue="Bimbingan belajar spesialis persiapan masuk Kedokteran dan sekolah kedinasan dengan metode penalaran yang teruji." />
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <ImageIcon className="text-slate-300" size={32} />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-brand-navy">Hero Background Image</p>
                            <p className="text-[10px] text-slate-400">Recommended: 1920x1080px (Max 2MB)</p>
                          </div>
                          <button onClick={() => notify('Pemilih gambar hero dibuka di mode demo.')} className="px-4 py-2 bg-white rounded-lg text-[10px] font-bold text-brand-blue border border-slate-200">Change Image</button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hero Height</label>
                            <select onChange={() => notify('Tinggi hero diperbarui di draft.')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold">
                              <option>Large 750px</option>
                              <option>Medium 640px</option>
                              <option>Compact 520px</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Overlay</label>
                            <select onChange={() => notify('Overlay hero diperbarui di draft.')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold">
                              <option>Navy Gradient</option>
                              <option>Dark Soft</option>
                              <option>Light Clean</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Text Align</label>
                            <select onChange={() => notify('Alignment hero diperbarui di draft.')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold">
                              <option>Left</option>
                              <option>Center</option>
                              <option>Right</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-premium p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-brand-navy">Section Builder</h3>
                        <button onClick={() => notify('Section baru ditambahkan ke draft halaman.')} className="px-4 py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ Add Section</button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: 'Hero Carousel', status: 'Visible', order: '01' },
                          { name: 'Program Unggulan', status: 'Visible', order: '02' },
                          { name: 'Why Choose The Prams', status: 'Visible', order: '03' },
                          { name: 'Mentor Preview', status: 'Visible', order: '04' },
                          { name: 'Testimonials', status: 'Hidden Mobile', order: '05' },
                          { name: 'FAQ Section', status: 'Visible', order: '06' },
                        ].map((section) => (
                          <div key={section.name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-slate-400">{section.order}</span>
                              <div>
                                <p className="text-sm font-bold text-brand-navy">{section.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{section.status}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => notify(`${section.name} dipindahkan ke atas.`)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold">Up</button>
                              <button onClick={() => notify(`Visibilitas ${section.name} diubah.`)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold">Toggle</button>
                              <button onClick={() => notify(`Editor ${section.name} dibuka.`)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-brand-blue">Edit</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="card-premium p-8">
                        <h3 className="font-bold text-brand-navy mb-6">Typography System</h3>
                        <div className="space-y-4">
                          {['H1 Display', 'Section Heading', 'Body Text', 'Button Text'].map((type) => (
                            <div key={type} className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-500">{type}</span>
                              <select onChange={() => notify(`${type} typography diperbarui.`)} className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold">
                                <option>Default</option>
                                <option>Compact</option>
                                <option>Bold</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="card-premium p-8">
                        <h3 className="font-bold text-brand-navy mb-6">CTA & Button Style</h3>
                        <div className="space-y-4">
                          <input className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" defaultValue="Lihat Program" />
                          <input className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" defaultValue="Ikut Tryout Gratis" />
                          <div className="grid grid-cols-3 gap-3">
                            {['Solid', 'Outline', 'Soft'].map((style) => (
                              <button key={style} onClick={() => notify(`Style CTA ${style} dipilih.`)} className="py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase">{style}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-premium p-8">
                      <h3 className="font-bold text-brand-navy mb-6">Global Navigation</h3>
                      <div className="flex flex-wrap gap-3">
                        {['Beranda', 'Program', 'Tryout', 'Testimoni', 'Kontak'].map(nav => (
                          <div key={nav} className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                            <span className="text-sm font-bold text-brand-navy">{nav}</span>
                            <button onClick={() => notify(`Menu ${nav} dihapus dari draft navigasi.`)} className="text-slate-300 hover:text-red-400"><X size={14} /></button>
                          </div>
                        ))}
                        <button onClick={() => notify('Menu baru ditambahkan ke draft navigasi.')} className="px-4 py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ Add Menu</button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="card-premium p-8 bg-brand-navy text-white">
                      <h3 className="font-bold mb-6">Brand Identity</h3>
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Primary Color</p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-blue rounded-xl" />
                            <code className="text-xs text-white/60">#2563EB</code>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Secondary Color</p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-orange rounded-xl" />
                            <code className="text-xs text-white/60">#F59E0B</code>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Surface & Border Radius</p>
                          <div className="grid grid-cols-2 gap-3">
                            <select onChange={() => notify('Style card diperbarui.')} className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-xs">
                              <option>Card 8px</option>
                              <option>Card 12px</option>
                              <option>Card 16px</option>
                            </select>
                            <select onChange={() => notify('Shadow system diperbarui.')} className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-xs">
                              <option>Soft Shadow</option>
                              <option>Flat</option>
                              <option>Elevated</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-premium p-8">
                      <h3 className="font-bold text-brand-navy mb-4">Responsive Controls</h3>
                      <div className="space-y-3">
                        {[
                          'Mobile hero text wraps before CTA',
                          'Hide decorative stats on small screens',
                          'Stack program cards on mobile',
                          'Compress navbar spacing on tablet',
                        ].map((rule) => (
                          <button key={rule} onClick={() => notify(`${rule} diperbarui.`)} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
                            <span className="text-xs font-bold text-slate-600">{rule}</span>
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="card-premium p-8">
                      <h3 className="font-bold text-brand-navy mb-4">Reusable Components</h3>
                      <div className="space-y-3">
                        {['Program Card', 'Mentor Card', 'FAQ Accordion', 'Testimonial Card', 'Footer Block'].map((component) => (
                          <button key={component} onClick={() => notify(`Editor komponen ${component} dibuka.`)} className="w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:text-brand-blue">
                            Edit {component}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="card-premium p-8">
                       <h3 className="font-bold text-brand-navy mb-4">SEO Metadata</h3>
                       <div className="space-y-4">
                          <div className="p-3 bg-blue-50 rounded-xl">
                             <p className="text-[10px] font-bold text-brand-blue mb-1">Google Preview</p>
                             <p className="text-sm font-bold text-blue-800 line-clamp-1">The Prams - Bimbingan Belajar Kedokteran...</p>
                             <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">Lulus seleksi kampus impian dengan metode penalaran kedokteran eksklusif dr. Pramono.</p>
                          </div>
                          <button onClick={() => notify('Editor SEO tags dibuka.')} className="w-full py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest">Edit SEO Tags</button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'finance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Pusat Keuangan</h2>
                    <p className="text-sm text-slate-500">Transaksi pendaftaran, invoice, bukti bayar, beasiswa, biaya, dan anggaran demo.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={refreshFinanceCenter} className="btn-secondary py-2 px-5 flex items-center gap-2">
                      <RefreshCw size={18} /> Sync Data
                    </button>
                    <button
                      onClick={() => {
                        const rows = [
                          'type,name,program,package,amount,status,date',
                          ...financeRows.map((tx) => `transaction,"${tx.student || '-'}","${tx.program || '-'}","${tx.packageName || '-'}","${tx.amount || 0}","${tx.status || '-'}","${tx.date || tx.createdAt || '-'}"`),
                          ...financeEntries.map((entry) => `${entry.type},"${entry.name}","${entry.category}","${entry.period}",${entry.amount},"${entry.note}","${entry.createdAt}"`),
                          ...paymentProofs.map((proof) => `document,"${proof.student || '-'}","${proof.program || '-'}","${proof.packageName || '-'}","${proof.fileName || '-'}","${proof.status || '-'}","${proof.createdAt || '-'}"`)
                        ];
                        downloadTextFile('finance-center-report.csv', rows.join('\n'));
                      }}
                      className="btn-secondary py-2 px-5 flex items-center gap-2"
                    >
                      <Download size={18} /> Export Report
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { label: 'Revenue Tercatat', value: formatRupiah(financeSummary.paidRevenue), color: 'text-brand-blue', icon: Banknote, description: 'Transaksi berbayar yang tercatat sebagai pendapatan.', rows: financeRows.filter((tx) => !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free') && parseRupiah(tx.amount) > 0) },
                    { label: 'Pending Payment', value: formatRupiah(financeSummary.pendingRevenue), color: 'text-brand-orange', icon: Clock, description: 'Transaksi yang masih menunggu pembayaran atau verifikasi admin.', rows: financeRows.filter((tx) => String(tx.status).toLowerCase().includes('pending')) },
                    { label: 'Net Profit Demo', value: formatRupiah(financeSummary.netProfit), color: financeSummary.netProfit >= 0 ? 'text-emerald-500' : 'text-red-500', icon: TrendingUp, description: 'Perhitungan demo: revenue tercatat dikurangi biaya tetap dan biaya variabel.', rows: [
                      { student: 'Revenue Tercatat', program: 'Pendapatan', amount: formatRupiah(financeSummary.paidRevenue), status: 'Debit' },
                      { student: 'Biaya Tetap', program: 'Pengeluaran', amount: formatRupiah(financeSummary.fixedCost), status: 'Kredit' },
                      { student: 'Biaya Variabel', program: 'Pengeluaran', amount: formatRupiah(financeSummary.variableCost), status: 'Kredit' },
                      { student: 'Net Profit Demo', program: 'Saldo', amount: formatRupiah(financeSummary.netProfit), status: financeSummary.netProfit >= 0 ? 'Profit' : 'Loss' }
                    ] },
                    { label: 'Pengajuan Beasiswa', value: String(financeSummary.scholarshipApplications), color: 'text-indigo-500', icon: Award, description: 'Semua transaksi dengan status pengajuan atau approval beasiswa.', rows: financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship') || String(tx.packageName || '').toLowerCase().includes('beasiswa')) },
                  ].map((stat, i) => (
                    <button key={i} type="button" onClick={() => setFinanceMetricDetail({ title: stat.label, rows: stat.rows, description: stat.description })} className="card-premium p-6 text-left hover:border-brand-blue/40 transition-all">
                      <stat.icon className={`${stat.color} mb-3`} size={20} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-xl font-black text-brand-navy">{stat.value}</p>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl w-fit shadow-sm">
                  {[
                    { id: 'payments', label: 'Data Sistem Pembayaran' },
                    { id: 'inputs', label: 'Input Biaya & Anggaran' },
                    { id: 'realization', label: 'Realisasi Anggaran & Biaya' },
                    { id: 'assets', label: 'Aset' },
                    { id: 'accounting', label: 'Pembukuan Otomatis' },
                    { id: 'reports', label: 'Laporan Keuangan' },
                    { id: 'audit', label: 'Audit & Notifikasi' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFinanceSubView(item.id as typeof financeSubView)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${financeSubView === item.id ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-400 hover:text-brand-blue'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {financeSubView === 'payments' && (
                <>
                <div className="card-premium overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex flex-col gap-5">
                    <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-brand-navy">Data Sistem Pembayaran</h3>
                      <p className="text-xs text-slate-500 mt-1">Semua pendaftaran yang masuk pembayaran akan tercatat di sini.</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-[10px] font-black uppercase tracking-widest">{filteredFinanceRows.length}/{financeRows.length} Records</span>
                    </div>
                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="md:col-span-2 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Search size={16} className="text-slate-400" />
                        <input
                          value={paymentSearchTerm}
                          onChange={(event) => setPaymentSearchTerm(event.target.value)}
                          className="w-full bg-transparent outline-none text-sm font-medium text-slate-600"
                          placeholder="Cari siswa, invoice, program, paket..."
                        />
                      </div>
                      <select value={paymentStatusFilter} onChange={(event) => setPaymentStatusFilter(event.target.value)} className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600 outline-none">
                        {paymentStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <select value={paymentTypeFilter} onChange={(event) => setPaymentTypeFilter(event.target.value)} className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600 outline-none">
                        <option value="All">Semua Tipe</option>
                        <option value="paid">Berbayar</option>
                        <option value="free">Gratis</option>
                        <option value="scholarship">Beasiswa</option>
                      </select>
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Dokumen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredFinanceRows.map((tx, i) => {
                        const proof = paymentProofs.find((item) => item.invoiceId === (tx.invoiceNumber || tx.id));
                        const isScholarship = String(tx.status).toLowerCase().includes('scholarship');
                        const isFree = String(tx.status).toLowerCase().includes('free') || String(tx.type).toLowerCase() === 'free';
                        const uploadNotRequired = isScholarship || isFree;
                        return (
                        <tr key={tx.id || i} className="hover:bg-slate-50/50 transition-colors align-top">
                          <td className="px-8 py-4">
                            <button
                              type="button"
                              onClick={() => setSelectedFinanceRecord({ tx, proof })}
                              className="text-left text-sm font-bold text-brand-navy hover:text-brand-blue hover:underline"
                            >
                              {tx.student}
                            </button>
                            <p className="text-[10px] text-slate-400">{tx.email || '-'}</p>
                            <p className="text-[10px] text-slate-400">{tx.phone || '-'}</p>
                          </td>
                          <td className="px-8 py-4 text-xs text-slate-500">
                            {tx.program}
                            {tx.method && <p className="text-[10px] text-slate-400 mt-1">{tx.method} {tx.packageName ? `- ${tx.packageName}` : ''}</p>}
                            {tx.registrationData && (
                              <p className="text-[10px] text-slate-400 mt-1">Sekolah: {tx.registrationData.school || '-'}</p>
                            )}
                          </td>
                          <td className="px-8 py-4 text-sm font-mono font-bold text-brand-navy">{tx.amount}</td>
                          <td className="px-8 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${isScholarship ? 'bg-indigo-50 text-indigo-600' : tx.status === 'Success' || tx.status === 'Free Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {tx.status}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-2">{tx.date || '-'}</p>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex flex-col items-end gap-2">
                              <button onClick={() => openStoredInvoice(tx)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-brand-blue text-[10px] font-black uppercase tracking-widest">
                                Invoice
                              </button>
                              {proof ? (
                                <button onClick={() => openStoredProof(proof)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                  {isScholarship ? 'Dokumen Beasiswa' : 'Bukti Bayar'}
                                </button>
                              ) : uploadNotRequired ? (
                                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                  Tidak perlu upload
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-300">Belum upload bukti</span>
                              )}
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredFinanceRows.length === 0 && (
                    <div className="p-10 text-center text-sm font-bold text-slate-400">
                      Tidak ada data pembayaran yang cocok dengan filter.
                    </div>
                  )}
                  <div className="p-4 bg-slate-50 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Invoice dan bukti bayar dibaca dari database demo browser.
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Database Dokumen Bukti Pembayaran / Beasiswa</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {paymentProofs.length === 0 && <p className="p-6 text-sm text-slate-400 font-bold">Belum ada dokumen yang diupload.</p>}
                      {paymentProofs.map((proof) => (
                        <div key={proof.id} className="p-5 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-brand-navy">{proof.fileName}</p>
                            <p className="text-[10px] text-slate-400">{proof.student} - {proof.program}</p>
                            <p className="text-[10px] text-slate-400">{proof.type || 'Payment Proof'} - {Math.ceil((proof.fileSize || 0) / 1024)} KB</p>
                          </div>
                          <button onClick={() => openStoredProof(proof)} className="px-3 py-2 rounded-xl bg-slate-50 text-brand-blue text-[10px] font-black uppercase tracking-widest">
                            Buka
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-premium p-6">
                    <h3 className="font-bold text-brand-navy mb-4">Sistem Beasiswa</h3>
                    <div className="space-y-4">
                      {financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship')).map((tx) => {
                        const proof = paymentProofs.find((item) => item.invoiceId === (tx.invoiceNumber || tx.id));
                        return (
                          <div key={tx.id} className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-black text-brand-navy">{tx.student}</p>
                                <p className="text-xs text-slate-500">{tx.program} - {tx.packageName}</p>
                                <p className="text-[10px] font-bold text-indigo-600 mt-2">{proof ? 'Dokumen sudah diterima, siap review admin.' : 'Tidak perlu upload dokumen. Review dari data pendaftaran.'}</p>
                              </div>
                              <span className="px-2 py-1 rounded-lg bg-white text-indigo-600 text-[10px] font-black uppercase">Review</span>
                            </div>
                          </div>
                        );
                      })}
                      {financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship')).length === 0 && (
                        <p className="text-sm text-slate-400 font-bold">Belum ada pengajuan beasiswa.</p>
                      )}
                    </div>
                  </div>
                </div>
                </>
                )}

                {financeSubView === 'inputs' && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="card-premium p-6 lg:col-span-1">
                    <h3 className="font-bold text-brand-navy mb-5">Input Keuangan Lain</h3>
                    <div className="space-y-3">
                      <select value={financeForm.type} onChange={(e) => setFinanceForm({ ...financeForm, type: e.target.value as FinanceEntry['type'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                        <option value="fixed">Biaya Tetap</option>
                        <option value="variable">Biaya Variabel</option>
                        <option value="budget">Anggaran</option>
                      </select>
                      <input value={financeForm.name} onChange={(e) => setFinanceForm({ ...financeForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nama item, misal Honor Mentor" />
                      {financeForm.type === 'budget' ? (
                        <div className="space-y-2">
                          <select value={financeForm.category} onChange={(e) => setFinanceForm({ ...financeForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                            {budgetDirections.map((item) => (
                              <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                          </select>
                          <p className="text-[10px] text-slate-500 font-bold px-1">
                            Arah: {budgetDirections.find((item) => item.value === financeForm.category)?.target || 'Operasional Lainnya'}
                          </p>
                        </div>
                      ) : (
                        <input value={financeForm.category} onChange={(e) => setFinanceForm({ ...financeForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Kategori, misal Operasional" />
                      )}
                      <input value={financeForm.amount} onChange={(e) => setFinanceForm({ ...financeForm, amount: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nominal, misal 2500000" inputMode="numeric" />
                      <input value={financeForm.period} onChange={(e) => setFinanceForm({ ...financeForm, period: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Periode" />
                      <textarea value={financeForm.note} onChange={(e) => setFinanceForm({ ...financeForm, note: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none h-20 resize-none" placeholder="Catatan" />
                      <button onClick={addFinanceEntry} className="w-full btn-primary py-3">
                        <Plus size={18} /> Tambah Input
                      </button>
                    </div>
                  </div>

                  <div className="card-premium overflow-hidden lg:col-span-2">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Biaya Tetap, Biaya Variabel, dan Anggaran</h3>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {financeEntries.map((entry) => (
                          <tr key={entry.id}>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-brand-navy">{entry.name}</p>
                              <p className="text-[10px] text-slate-400">{entry.category} - {entry.period}</p>
                              {entry.note && <p className="text-[10px] text-slate-500 mt-1">{entry.note}</p>}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${entry.type === 'fixed' ? 'bg-red-50 text-red-500' : entry.type === 'variable' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-brand-blue'}`}>
                                {entry.type === 'fixed' ? 'Biaya Tetap' : entry.type === 'variable' ? 'Biaya Variabel' : 'Anggaran'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-sm font-black text-brand-navy">{formatRupiah(entry.amount)}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => deleteFinanceEntry(entry.id)} className="p-2 text-slate-400 hover:text-red-500">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="grid md:grid-cols-3 gap-4 p-6 bg-slate-50">
                      <div><p className="text-[10px] font-black uppercase text-slate-400">Total Biaya Tetap</p><p className="font-black text-brand-navy">{formatRupiah(financeSummary.fixedCost)}</p></div>
                      <div><p className="text-[10px] font-black uppercase text-slate-400">Total Biaya Variabel</p><p className="font-black text-brand-navy">{formatRupiah(financeSummary.variableCost)}</p></div>
                      <div><p className="text-[10px] font-black uppercase text-slate-400">Total Anggaran</p><p className="font-black text-brand-navy">{formatRupiah(financeSummary.budget)}</p></div>
                    </div>
                  </div>
                </div>
                )}

                {financeSubView === 'realization' && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="card-premium p-6">
                    <h3 className="font-bold text-brand-navy mb-5">Realisasi Anggaran / Biaya</h3>
                    <div className="space-y-3">
                      <select value={realizationForm.financeEntryId} onChange={(e) => setRealizationForm({ ...realizationForm, financeEntryId: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                        <option value="">Pilih rencana biaya/anggaran</option>
                        {financeEntries.map((entry) => (
                          <option key={entry.id} value={entry.id}>{entry.name} - {entry.type === 'budget' ? 'Anggaran' : entry.type === 'fixed' ? 'Biaya Tetap' : 'Biaya Variabel'}</option>
                        ))}
                      </select>
                      <input value={realizationForm.amount} onChange={(e) => setRealizationForm({ ...realizationForm, amount: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nominal yang dipakai" inputMode="numeric" />
                      <input type="date" value={realizationForm.date} onChange={(e) => setRealizationForm({ ...realizationForm, date: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                      <textarea value={realizationForm.note} onChange={(e) => setRealizationForm({ ...realizationForm, note: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none h-20 resize-none" placeholder="Catatan realisasi" />
                      <button onClick={addFinanceRealization} className="w-full btn-primary py-3">
                        <Plus size={18} /> Realisasikan
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed">Input biaya/anggaran tidak masuk pembukuan sampai direalisasikan di halaman ini.</p>
                  </div>
                  <div className="card-premium overflow-hidden lg:col-span-2">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Riwayat Realisasi</h3>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {financeRealizations.map((row) => (
                          <tr key={row.id}>
                            <td className="px-6 py-4"><p className="text-sm font-bold text-brand-navy">{row.name}</p><p className="text-[10px] text-slate-400">{row.category} {row.note ? `- ${row.note}` : ''}</p></td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.date}</td>
                            <td className="px-6 py-4 font-mono text-sm font-black text-red-500">{formatRupiah(row.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {financeRealizations.length === 0 && <div className="p-10 text-center text-sm font-bold text-slate-400">Belum ada realisasi biaya/anggaran.</div>}
                  </div>
                </div>
                )}

                {financeSubView === 'assets' && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="card-premium p-6">
                    <h3 className="font-bold text-brand-navy mb-5">Input Aset</h3>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-4">
                      <p className="text-xs font-black text-brand-navy mb-2">Aturan pencatatan aset</p>
                      <ul className="space-y-1 text-[11px] text-slate-600 font-medium leading-relaxed">
                        <li>Aset lancar tidak memakai depresiasi.</li>
                        <li>Aset tetap memakai depresiasi bulanan sesuai umur manfaat.</li>
                        <li>Tanah/Bangunan dicatat sebagai aset tetap tanpa depresiasi.</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <select value={assetForm.type} onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value as AssetEntry['type'], category: e.target.value === 'fixed_asset' ? 'Peralatan Kantor' : 'Kas/Bank' })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                        <option value="fixed_asset">Aset Tetap</option>
                        <option value="current_asset">Aset Lancar</option>
                      </select>
                      <input value={assetForm.name} onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nama aset" />
                      <select value={assetForm.category} onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                        {assetForm.type === 'fixed_asset' ? (
                          <>
                            <option>Kendaraan</option>
                            <option>Tanah/Bangunan</option>
                            <option>Peralatan Kantor</option>
                            <option>Perlengkapan Kantor</option>
                          </>
                        ) : (
                          <>
                            <option>Kas/Bank</option>
                            <option>Piutang</option>
                            <option>Persediaan Modul</option>
                          </>
                        )}
                      </select>
                      <input value={assetForm.acquisitionValue} onChange={(e) => setAssetForm({ ...assetForm, acquisitionValue: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nilai perolehan" inputMode="numeric" />
                      <input value={assetForm.currentValue} onChange={(e) => setAssetForm({ ...assetForm, currentValue: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nilai saat ini" inputMode="numeric" />
                      <input type="date" value={assetForm.acquisitionDate} onChange={(e) => setAssetForm({ ...assetForm, acquisitionDate: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                      {assetForm.type === 'fixed_asset' && !nonDepreciableFixedAssetCategories.includes(assetForm.category) && (
                        <input value={assetForm.usefulLifeMonths} onChange={(e) => setAssetForm({ ...assetForm, usefulLifeMonths: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Umur manfaat bulan" inputMode="numeric" />
                      )}
                      {assetForm.type === 'fixed_asset' && nonDepreciableFixedAssetCategories.includes(assetForm.category) && (
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs font-bold text-brand-blue">
                          Tanah/Bangunan dicatat sebagai aset tetap tanpa depresiasi.
                        </div>
                      )}
                      {assetForm.type === 'current_asset' && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700">
                          Aset lancar masuk neraca tanpa depresiasi. Penyesuaian nilai dilakukan sebagai koreksi persediaan/piutang bila diperlukan.
                        </div>
                      )}
                      <textarea value={assetForm.note} onChange={(e) => setAssetForm({ ...assetForm, note: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none h-20 resize-none" placeholder="Catatan aset" />
                      <button onClick={addAssetEntry} className="w-full btn-primary py-3">
                        <Plus size={18} /> Tambah Aset
                      </button>
                    </div>
                  </div>
                  <div className="card-premium overflow-hidden lg:col-span-2">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Daftar Aset</h3>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aset</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nilai</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Depresiasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {assetEntries.map((asset) => (
                          <tr key={asset.id}>
                            <td className="px-6 py-4"><p className="text-sm font-bold text-brand-navy">{asset.name}</p><p className="text-[10px] text-slate-400">{asset.type === 'fixed_asset' ? 'Aset Tetap' : 'Aset Lancar'} - {asset.category}</p></td>
                            <td className="px-6 py-4"><p className="font-mono text-sm font-black text-brand-navy">{formatRupiah(asset.currentValue)}</p><p className="text-[10px] text-slate-400">Perolehan {formatRupiah(asset.acquisitionValue)}</p></td>
                            <td className="px-6 py-4 text-sm font-mono font-bold text-red-500">
                              {asset.type === 'fixed_asset'
                                ? asset.depreciationPerMonth > 0 ? formatRupiah(asset.depreciationPerMonth) : 'Tanpa depresiasi'
                                : 'Tidak didepresiasi'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                )}

                {financeSubView === 'accounting' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="card-premium p-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Debit Otomatis</p>
                      <p className="text-2xl font-black text-emerald-600">{formatRupiah(accountingRows.reduce((sum, row) => sum + row.debit, 0))}</p>
                    </div>
                    <div className="card-premium p-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kredit Otomatis</p>
                      <p className="text-2xl font-black text-red-500">{formatRupiah(accountingRows.reduce((sum, row) => sum + row.credit, 0))}</p>
                    </div>
                    <div className="card-premium p-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Saldo Akuntansi Demo</p>
                      <p className="text-2xl font-black text-brand-navy">{formatRupiah(accountingRows.reduce((sum, row) => sum + row.debit - row.credit, 0))}</p>
                    </div>
                  </div>
                  <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Jurnal Pembukuan Otomatis</h3>
                      <p className="text-xs text-slate-500 mt-1">Dibentuk otomatis dari transaksi pembayaran, pengajuan beasiswa, biaya tetap, biaya variabel, dan anggaran.</p>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Akun</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Keterangan</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Debit</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kredit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {accountingRows.map((row) => (
                          <tr key={row.id}>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.date}</td>
                            <td className="px-6 py-4 text-sm font-black text-brand-navy">{row.account}</td>
                            <td className="px-6 py-4 text-xs text-slate-500">{row.description}<p className="text-[10px] text-slate-400 mt-1">{row.source} - {row.status}</p></td>
                            <td className="px-6 py-4 font-mono text-sm font-bold text-emerald-600">{row.debit ? formatRupiah(row.debit) : '-'}</td>
                            <td className="px-6 py-4 font-mono text-sm font-bold text-red-500">{row.credit ? formatRupiah(row.credit) : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                )}

                {financeSubView === 'reports' && (
                <div className="space-y-6">
                  <div className="card-premium p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-brand-navy">Laporan Keuangan</h3>
                      <p className="text-xs text-slate-500 mt-1">Neraca, Laba Rugi, dan Arus Kas untuk periode {financialReports.periodLabel}.</p>
                    </div>
                    <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl">
                      {[
                        { id: 'monthly', label: 'Bulanan' },
                        { id: 'quarterly', label: 'Kuartal' },
                        { id: 'yearly', label: 'Tahunan' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setFinancialReportPeriod(item.id as typeof financialReportPeriod)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${financialReportPeriod === item.id ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-400'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {[
                      { title: 'Laporan Laba Rugi', rows: financialReports.incomeStatement, color: 'text-emerald-600' },
                      { title: 'Neraca', rows: financialReports.balanceSheet, color: 'text-brand-blue' },
                      { title: 'Laporan Arus Kas', rows: financialReports.cashFlow, color: 'text-brand-orange' }
                    ].map((report) => (
                      <div key={report.title} className="card-premium overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                          <h4 className="font-black text-brand-navy">{report.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{financialReports.periodLabel}</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {report.rows.map((row) => (
                            <div key={row.label} className={`p-5 flex items-center justify-between gap-4 ${row.total ? 'bg-slate-50' : ''}`}>
                              <span className={`text-sm ${row.total ? 'font-black text-brand-navy' : 'font-bold text-slate-600'}`}>{row.label}</span>
                              <span className={`font-mono text-sm font-black ${row.total ? report.color : row.amount < 0 ? 'text-red-500' : 'text-brand-navy'}`}>
                                {row.amount < 0 ? `(${formatRupiah(Math.abs(row.amount))})` : formatRupiah(row.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {financeSubView === 'audit' && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Audit Trail Sistem</h3>
                      <p className="text-xs text-slate-500 mt-1">Riwayat aksi admin untuk pembayaran, biaya, realisasi, aset, dan approval.</p>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
                      {auditEvents.length === 0 && <p className="p-6 text-sm text-slate-400 font-bold">Belum ada audit trail.</p>}
                      {auditEvents.map((event) => (
                        <div key={event.id} className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-black text-brand-navy">{event.action}</p>
                              <p className="text-xs text-slate-500 mt-1">{event.detail}</p>
                              <p className="text-[10px] text-slate-400 mt-2">{event.module} - {event.actor}</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{event.createdAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Outbox Notifikasi</h3>
                      <p className="text-xs text-slate-500 mt-1">Draft/queue pesan email, WhatsApp, dan sistem dari workflow admin.</p>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
                      {notificationEvents.length === 0 && <p className="p-6 text-sm text-slate-400 font-bold">Belum ada notifikasi.</p>}
                      {notificationEvents.map((event) => (
                        <div key={event.id} className="p-5">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <p className="text-sm font-black text-brand-navy">{event.subject}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{event.channel} ke {event.recipient}</p>
                            </div>
                            <span className="px-2 py-1 rounded-lg bg-blue-50 text-brand-blue text-[10px] font-black uppercase">{event.status}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-4">{event.message}</p>
                          <p className="text-[10px] text-slate-400 mt-3">{event.createdAt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                )}
              </div>
            )}

            {activeTab === 'programs' && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">Program Inventory & Curriculum</h2>
                      <p className="text-sm text-slate-500">Manage all educational offerings and their detailed specifications</p>
                   </div>
                   <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
                        <Search size={18} className="text-slate-400" />
                        <input
                          type="text"
                          value={programSearchTerm}
                          onChange={(event) => setProgramSearchTerm(event.target.value)}
                          placeholder="Search programs..."
                          className="text-sm bg-transparent border-none focus:ring-0 font-medium"
                        />
                      </div>
                      <button
                        onClick={resetProgramsToDefault}
                        className="btn-secondary py-2 px-5 whitespace-nowrap"
                      >
                         Reset
                      </button>
                      <button
                        onClick={() => runContextualAdd()}
                        className="btn-primary py-2 px-6 whitespace-nowrap"
                      >
                         <Plus size={18} />
                         New Program
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { label: 'Courses', value: String(programsList.length), icon: BookOpen, color: 'text-brand-blue' },
                     { label: 'Packages', value: String(programsList.reduce((sum, program) => sum + (program.packages?.length || 0), 0)), icon: DollarSign, color: 'text-emerald-500' },
                     { label: 'Categories', value: String(programCategories.length - 1), icon: TrendingUp, color: 'text-brand-orange' },
                     { label: 'Published', value: String(programsList.length), icon: Globe, color: 'text-indigo-500' }
                   ].map((p, i) => (
                     <div key={i} className="card-premium p-5 flex flex-col gap-2">
                        <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${p.color}`}>
                           <p.icon size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{p.label}</p>
                           <p className="text-lg font-black text-brand-navy">{p.value}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="card-premium overflow-hidden">
                   <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                      <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                         <Filter size={14} />
                         <span>Category:</span>
                         <select
                           value={programCategoryFilter}
                           onChange={(event) => setProgramCategoryFilter(event.target.value)}
                           className="bg-transparent outline-none font-black text-slate-600"
                         >
                           {programCategories.map((category) => (
                             <option key={category} value={category}>{category}</option>
                           ))}
                         </select>
                      </label>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                         <TrendingUp size={14} />
                         <span>Sort: Newest</span>
                      </div>
                   </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50">
                         <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program & Schedule</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {filteredProgramsList.map((item) => (
                           <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-brand-navy line-clamp-1">{item.title}</p>
                                      <p className="text-[10px] text-slate-400 font-medium italic">{item.schedule || 'TBA'}</p>
                                   </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="px-2 py-1 bg-blue-50 text-brand-blue rounded-lg text-[10px] font-black uppercase tracking-wider">{item.category}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="text-sm font-black text-brand-navy">{item.price}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase">{item.packages?.length || 0} Packages</p>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Active
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => setEditingProgram(item)}
                                      className="p-2 text-slate-400 hover:text-brand-blue hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => deleteProgram(item.id)}
                                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                   {filteredProgramsList.length === 0 && (
                     <div className="p-10 text-center text-sm font-bold text-slate-400">
                       Tidak ada program yang cocok dengan filter editor.
                     </div>
                   )}

                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">Question Bank Central</h2>
                      <p className="text-sm text-slate-500">Manage {questions.length} indexed questions for all tryouts</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                         <Search size={18} className="text-slate-400" />
                         <input 
                           type="text" 
                           placeholder="Filter questions..." 
                           className="text-sm bg-transparent border-none focus:ring-0 font-medium text-slate-600 w-32 md:w-auto"
                         />
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                         <Filter size={18} className="text-slate-400" />
                         <select className="text-sm bg-transparent border-none focus:ring-0 font-medium text-slate-600">
                            <option>All Subjects</option>
                            <option>Penalaran Umum</option>
                            <option>Penalaran Matematika</option>
                         </select>
                      </div>
                      <button 
                        onClick={() => setEditingQuestion({
                          id: Date.now().toString(),
                          subject: 'Penalaran Umum',
                          difficulty: 'Medium',
                          text: '',
                          options: [
                            { id: 'A', text: '' },
                            { id: 'B', text: '' },
                            { id: 'C', text: '' },
                            { id: 'D', text: '' },
                            { id: 'E', text: '' }
                          ],
                          correctOptionId: 'A',
                          explanation: '',
                          program: 'SNBT',
                          tags: []
                        })}
                        className="btn-primary py-2 px-6 flex items-center gap-2"
                      >
                         <Plus size={18} />
                         <span className="hidden md:inline">Add Question</span>
                      </button>
                      <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="btn-secondary py-2 px-6 flex items-center gap-2"
                      >
                         <FileUp size={18} />
                         <span className="hidden md:inline">Batch Import</span>
                       </button>
                       <button 
                         onClick={() => setIsManageTagsModalOpen(true)}
                         className="btn-secondary py-2 px-6 flex items-center gap-2"
                       >
                          <Tags size={18} />
                          <span className="hidden md:inline">Manage Tags</span>
                       </button>
                    </div>
                </div>

                <div className="card-premium overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                         <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Question Preview</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Metadata</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Tags</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Difficulty</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {questions.map((q) => (
                           <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="py-5 px-6">
                                 <p className="text-sm font-medium text-brand-navy line-clamp-1 max-w-lg">{q.text || <span className="italic text-slate-300">(No text)</span>}</p>
                                 <div className="flex gap-2 mt-1">
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">Ans: {q.correctOptionId}</span>
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{q.program}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="text-xs font-bold text-slate-600 tracking-tight">{q.subject}</p>
                                 <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">ID: {q.id}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-wrap gap-1 justify-center max-w-[150px]">
                                    {q.tags?.map((tag, i) => (
                                      <span key={i} className="text-[8px] font-black text-brand-blue bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                        {tag}
                                      </span>
                                    )) || <span className="text-[8px] text-slate-300 font-bold uppercase">-</span>}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                                   q.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 
                                   q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                   'bg-emerald-50 text-emerald-600'
                                 }`}>
                                    {q.difficulty}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => duplicateQuestion(q)}
                                      className="p-2 text-slate-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors" 
                                      title="Duplicate Question"
                                    >
                                       <Copy size={16} />
                                    </button>
                                    <button 
                                      onClick={() => setEditingQuestion(q)}
                                      className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors" 
                                      title="Edit Question"
                                    >
                                       <Edit2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => deleteQuestion(q.id)}
                                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                                      title="Delete Question"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                {/* Question Editor Modal */}
                <AnimatePresence>
                  {editingQuestion && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-auto"
                      >
                         <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-white/10 rounded-xl">
                                  <BookOpen size={20} className="text-brand-blue" />
                               </div>
                               <div>
                                  <h3 className="font-bold">Edit Question</h3>
                                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-black">Question ID: {editingQuestion.id}</p>
                               </div>
                            </div>
                            <button onClick={() => setEditingQuestion(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                               <X size={20} />
                            </button>
                         </div>

                         <div className="p-8 grid md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh]">
                            <div className="space-y-6">
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Question Content</label>
                                  <textarea 
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600 h-40 resize-none focus:border-brand-blue transition-colors"
                                    value={editingQuestion.text}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                                    placeholder="Enter question text here..."
                                  />
                               </div>

                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Answer Options</label>
                                  <div className="space-y-3">
                                    {editingQuestion.options.map((opt, idx) => (
                                      <div key={idx} className="flex gap-3">
                                         <button 
                                           onClick={() => setEditingQuestion({ ...editingQuestion, correctOptionId: opt.id })}
                                           className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${editingQuestion.correctOptionId === opt.id ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                         >
                                            {opt.id}
                                         </button>
                                         <input 
                                           className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-medium text-slate-600 focus:border-brand-blue transition-colors"
                                           value={opt.text}
                                           onChange={(e) => {
                                             const newOpts = [...editingQuestion.options];
                                             newOpts[idx] = { ...opt, text: e.target.value };
                                             setEditingQuestion({ ...editingQuestion, options: newOpts });
                                           }}
                                           placeholder={`Option ${opt.id}...`}
                                         />
                                      </div>
                                    ))}
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-6">
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Subject</label>
                                     <select 
                                       className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-bold text-slate-600"
                                       value={editingQuestion.subject}
                                       onChange={(e) => setEditingQuestion({ ...editingQuestion, subject: e.target.value as any })}
                                     >
                                        <option>Penalaran Umum</option>
                                        <option>Literasi Bahasa</option>
                                        <option>Penalaran Matematika</option>
                                        <option>Pengetahuan Umum</option>
                                     </select>
                                  </div>
                                  <div>
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Difficulty</label>
                                     <select 
                                       className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-bold text-slate-600"
                                       value={editingQuestion.difficulty}
                                       onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as any })}
                                     >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                     </select>
                                  </div>
                               </div>

                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Explanation / Discussion</label>
                                  <textarea 
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600 h-32 resize-none focus:border-brand-blue transition-colors text-sm"
                                    value={editingQuestion.explanation}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                                    placeholder="Explain the correct answer steps..."
                                  />
                               </div>

                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Organization & Tags</label>
                                  <div className="space-y-4">
                                     <div className="flex flex-wrap gap-2">
                                        {availableTags.map((tag) => (
                                          <button 
                                            key={tag}
                                            onClick={() => toggleQuestionTag(tag)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${editingQuestion.tags?.includes(tag) ? 'bg-brand-blue text-white border-brand-blue' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-brand-blue'}`}
                                          >
                                             {tag}
                                          </button>
                                        ))}
                                        <div className="flex items-center gap-1">
                                           <input 
                                             type="text"
                                             placeholder="New tag..."
                                             className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 outline-none focus:border-brand-blue w-24"
                                             onKeyDown={(e) => {
                                               if (e.key === 'Enter') {
                                                 const val = (e.target as HTMLInputElement).value.trim();
                                                 if (val && !availableTags.includes(val)) {
                                                   addTag(val);
                                                   toggleQuestionTag(val);
                                                   (e.target as HTMLInputElement).value = '';
                                                 }
                                                 e.preventDefault();
                                               }
                                             }}
                                           />
                                        </div>
                                     </div>
                                     <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                                        <div className="flex gap-2">
                                           <Tags size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                           <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase tracking-widest">
                                             Tags help in filtering questions during tryout generation and IRT analysis.
                                           </p>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               <div className="flex items-center gap-1.5">
                                  <div className={`w-2 h-2 rounded-full ${editingQuestion.text.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                  Text
                               </div>
                               <div className="flex items-center gap-1.5">
                                  <div className={`w-2 h-2 rounded-full ${editingQuestion.options.every(o => o.text.length > 0) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                  Options
                               </div>
                               <div className="flex items-center gap-1.5">
                                  <div className={`w-2 h-2 rounded-full ${editingQuestion.explanation.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                  Exp
                               </div>
                            </div>
                            <div className="flex gap-3">
                               <button 
                                 onClick={() => setEditingQuestion(null)}
                                 className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors"
                               >
                                  Cancel
                               </button>
                               <button 
                                 onClick={() => saveQuestion(editingQuestion)}
                                 className="btn-primary py-2.5 px-8 shadow-xl shadow-blue-500/20"
                               >
                                  <Save size={18} />
                                  Save Question
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    </div>
                  )}

                  {isManageTagsModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                       <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                      >
                         <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <Tags size={24} className="text-brand-blue" />
                               <h3 className="font-bold">Manage Question Categories</h3>
                            </div>
                            <button onClick={() => setIsManageTagsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                               <X size={20} />
                            </button>
                         </div>
                         <div className="p-8 space-y-6">
                            <div className="space-y-4">
                               <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Add new category/tag..." 
                                    value={newTagInput}
                                    onChange={(e) => setNewTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && newTagInput.trim() && (addTag(newTagInput.trim()), setNewTagInput(''))}
                                    className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                                  />
                                  <button 
                                    onClick={() => {
                                      if (newTagInput.trim()) {
                                        addTag(newTagInput.trim());
                                        setNewTagInput('');
                                      }
                                    }}
                                    className="btn-primary px-6"
                                  >
                                     Add
                                  </button>
                               </div>

                               <div className="flex flex-wrap gap-2 pt-4">
                                  {availableTags.map(tag => (
                                    <div key={tag} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl group hover:border-brand-blue transition-all">
                                       <span className="text-xs font-bold text-brand-navy">{tag}</span>
                                       <button 
                                         onClick={() => setAvailableTags(availableTags.filter(t => t !== tag))}
                                         className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                       >
                                          <X size={12} />
                                       </button>
                                    </div>
                                  ))}
                               </div>

                               {availableTags.length === 0 && (
                                 <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                       <Tags size={32} className="text-slate-200" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400">No categories defined yet.</p>
                                 </div>
                               )}
                            </div>

                            <div className="p-6 bg-blue-50 rounded-2xl flex items-start gap-3">
                               <Info size={20} className="text-brand-blue shrink-0 mt-0.5" />
                               <div>
                                  <h5 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-1">Semantic Tagging</h5>
                                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                    Use consistent tags for better reporting. Suggestions: IRT-Stable, High-Discrimination, or sub-topics.
                                  </p>
                                </div>
                            </div>
                         </div>
                       </motion.div>
                    </div>
                  )}

                  {isImportModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                       <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                      >
                         <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <FileUp size={24} className="text-brand-orange" />
                               <h3 className="font-bold">Batch Question Import</h3>
                            </div>
                            <button onClick={() => setIsImportModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                               <X size={20} />
                            </button>
                         </div>
                         <div className="p-8 space-y-6">
                            <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-brand-blue transition-colors relative">
                               {importStatus === 'idle' ? (
                                 <>
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                                       <Upload size={32} className="text-slate-400 group-hover:text-brand-blue" />
                                    </div>
                                    <h4 className="font-bold text-brand-navy mb-1">Click or drag CSV file</h4>
                                    <p className="text-xs text-slate-400 mb-6">Compatible with standard The Prams mapping</p>
                                    <input 
                                      type="file" 
                                      accept=".csv"
                                      onChange={handleCsvImport}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="flex gap-2">
                                       <span className="px-3 py-1 bg-slate-100 rounded-lg text-[8px] font-black text-slate-500 uppercase">.CSV</span>
                                       <span className="px-3 py-1 bg-slate-100 rounded-lg text-[8px] font-black text-slate-500 uppercase">Max 5MB</span>
                                    </div>
                                 </>
                               ) : importStatus === 'processing' ? (
                                  <div className="py-8 flex flex-col items-center">
                                     <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin mb-4" />
                                     <h4 className="font-bold text-brand-navy mb-1">Processing Questions...</h4>
                                     <p className="text-xs text-slate-400">Mapping fields and verifying structure</p>
                                  </div>
                               ) : (
                                  <div className="py-8 flex flex-col items-center">
                                     <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                        <Check size={32} className="text-emerald-500" />
                                     </div>
                                     <h4 className="font-bold text-brand-navy mb-1">Import Successful!</h4>
                                     <p className="text-xs text-slate-400">Questions have been added to your bank</p>
                                  </div>
                               )}
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                               <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CSV Mapping Guide</h5>
                               <div className="grid grid-cols-2 gap-y-2 text-[10px] font-bold">
                                  <div className="text-slate-500">text</div>
                                  <div className="text-brand-navy text-right">Question Payload</div>
                                  <div className="text-slate-500">option_a, b, c...</div>
                                  <div className="text-brand-navy text-right">Choices Array</div>
                                  <div className="text-slate-500">correct_ans</div>
                                  <div className="text-brand-navy text-right">Key (A-E)</div>
                                  <div className="text-slate-500">tags</div>
                                  <div className="text-brand-navy text-right">Comma separated</div>
                               </div>
                               <button
                                  onClick={() => downloadTextFile('question-import-template.csv', 'subject,difficulty,text,option_a,option_b,correct_ans,tags\nPenalaran Umum,Medium,Contoh soal...,Pilihan A,Pilihan B,A,SNBT')}
                                  className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all"
                               >
                                  Download CSV Template
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="animate-in fade-in duration-500 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">Testimonials Moderation</h2>
                      <p className="text-sm text-slate-500">Manage student feedback and public testimonials</p>
                   </div>
                   <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                      <button onClick={() => setTestimonialFilter('All')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${testimonialFilter === 'All' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400 hover:text-slate-600'}`}>All ({testimonials.length})</button>
                      <button onClick={() => setTestimonialFilter('Pending')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${testimonialFilter === 'Pending' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400 hover:text-slate-600'}`}>Pending ({pendingTestimonials.length})</button>
                      <button onClick={() => setTestimonialFilter('Approved')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${testimonialFilter === 'Approved' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400 hover:text-slate-600'}`}>Approved ({approvedTestimonials.length})</button>
                   </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {visibleTestimonials.map((t) => (
                     <motion.div 
                       layout
                       key={t.id} 
                       className={`card-premium p-6 flex flex-col gap-4 border-l-4 transition-all ${
                         t.status === 'Approved' ? 'border-l-emerald-500' : 
                         t.status === 'Rejected' ? 'border-l-red-500' : 
                         'border-l-amber-500'
                       }`}
                     >
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <img src={t.image} className="w-10 h-10 rounded-xl object-cover" alt="" />
                              <div>
                                 <p className="text-sm font-bold text-brand-navy">{t.studentName}</p>
                                 <p className="text-[10px] text-slate-400 font-medium">{t.createdAt}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={14} className={s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-100 fill-slate-100'} />
                              ))}
                           </div>
                        </div>

                        <div className="flex-1">
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <Quote size={20} className="text-slate-200 mb-2" />
                            <p className="text-xs text-slate-600 italic leading-relaxed">"{t.content}"</p>
                          </div>
                          
                          <div className="mt-4 space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Program</p>
                            <p className="text-xs font-bold text-brand-blue">{t.programId || 'General'}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                           <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                             t.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                             t.status === 'Rejected' ? 'bg-red-50 text-red-600' : 
                             'bg-amber-50 text-amber-600'
                           }`}>
                              {t.status}
                           </span>

                           <div className="flex gap-2">
                             {t.status !== 'Approved' && (
                               <button 
                                 onClick={() => updateTestimonialStatus(t.id, 'Approved')}
                                 className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm shadow-emerald-500/10"
                                 title="Approve"
                               >
                                  <Check size={16} />
                               </button>
                             )}
                             {t.status !== 'Rejected' && (
                               <button 
                                 onClick={() => updateTestimonialStatus(t.id, 'Rejected')}
                                 className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-500/10"
                                 title="Reject"
                               >
                                  <X size={16} />
                               </button>
                             )}
                             <button onClick={() => {
                               setTestimonials((prev) => prev.filter((item) => item.id !== t.id));
                               notify('Testimoni dihapus.');
                             }} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-200 transition-all">
                                <Trash2 size={16} />
                             </button>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                </div>
              </div>
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
         <AnimatePresence>
           {isCampaignEditorOpen && (
             <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div>
                     <h3 className="font-bold">New Campaign</h3>
                     <p className="text-xs text-white/60 mt-1">Buat campaign digital marketing dengan budget fleksibel sesuai mata uang default.</p>
                   </div>
                   <button onClick={() => setIsCampaignEditorOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="p-8 overflow-y-auto grid lg:grid-cols-[1fr_300px] gap-8">
                   <div className="space-y-5">
                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Campaign</label>
                         <input value={campaignForm.name} onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Objective</label>
                         <select value={campaignForm.objective} onChange={(e) => setCampaignForm({ ...campaignForm, objective: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                           <option>Lead Generation</option>
                           <option>Traffic</option>
                           <option>Conversion</option>
                           <option>Brand Awareness</option>
                           <option>Retargeting</option>
                         </select>
                       </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Channel</label>
                         <select value={campaignForm.channel} onChange={(e) => setCampaignForm({ ...campaignForm, channel: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                           <option>Meta Ads</option>
                           <option>Google Ads</option>
                           <option>TikTok Ads</option>
                           <option>Instagram Organic</option>
                           <option>WhatsApp Broadcast</option>
                           <option>Email Campaign</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Landing Page</label>
                         <input value={campaignForm.landingPage} onChange={(e) => setCampaignForm({ ...campaignForm, landingPage: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" />
                       </div>
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Audience</label>
                       <input value={campaignForm.audience} onChange={(e) => setCampaignForm({ ...campaignForm, audience: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Contoh: siswa kelas 12, gap year, calon CPNS" />
                     </div>

                     <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                       <div className="flex items-center gap-2 mb-4">
                         <Wallet size={18} className="text-brand-blue" />
                         <div>
                           <p className="text-sm font-black text-brand-navy">Budget Campaign</p>
                           <p className="text-xs text-slate-500">Isi angka bebas. Format tampilan mengikuti mata uang yang dipilih.</p>
                         </div>
                       </div>
                       <div className="grid md:grid-cols-3 gap-4">
                         <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Mata Uang Default</label>
                           <select value={campaignForm.currency} onChange={(e) => setCampaignForm({ ...campaignForm, currency: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 text-sm font-bold outline-none">
                             {currencyOptions.map((currency) => (
                               <option key={currency.code} value={currency.code}>{currency.code} - {currency.label}</option>
                             ))}
                           </select>
                         </div>
                         <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Total Budget</label>
                           <input inputMode="numeric" value={campaignForm.totalBudget} onChange={(e) => setCampaignForm({ ...campaignForm, totalBudget: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 text-sm font-bold outline-none" placeholder="5000000" />
                           <p className="text-[10px] text-brand-blue font-black mt-1">{formatCurrencyAmount(campaignForm.totalBudget, campaignForm.currency)}</p>
                         </div>
                         <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Budget Harian</label>
                           <input inputMode="numeric" value={campaignForm.dailyBudget} onChange={(e) => setCampaignForm({ ...campaignForm, dailyBudget: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 text-sm font-bold outline-none" placeholder="250000" />
                           <p className="text-[10px] text-brand-blue font-black mt-1">{formatCurrencyAmount(campaignForm.dailyBudget, campaignForm.currency)} / hari</p>
                         </div>
                       </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Start Date</label>
                         <input type="date" value={campaignForm.startDate} onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">End Date Opsional</label>
                         <input type="date" value={campaignForm.endDate} onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" />
                       </div>
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Campaign</label>
                       <textarea value={campaignForm.note} onChange={(e) => setCampaignForm({ ...campaignForm, note: e.target.value })} className="w-full h-24 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                     </div>
                   </div>

                   <div className="space-y-4">
                     <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Preview Budget</p>
                       <div className="space-y-4">
                         <div>
                           <p className="text-xs text-slate-500 font-bold">Total Budget</p>
                           <p className="text-2xl font-black text-brand-navy">{formatCurrencyAmount(campaignTotalBudget, campaignForm.currency)}</p>
                         </div>
                         <div>
                           <p className="text-xs text-slate-500 font-bold">Budget Harian</p>
                           <p className="text-xl font-black text-brand-blue">{formatCurrencyAmount(campaignDailyBudget, campaignForm.currency)}</p>
                         </div>
                         <div className="p-4 rounded-xl bg-white border border-slate-200">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimasi Durasi</p>
                           <p className="text-lg font-black text-brand-navy mt-1">{campaignEstimatedDays || '-'} hari</p>
                           <p className="text-[10px] text-slate-500 mt-1">Dihitung dari total budget / budget harian.</p>
                         </div>
                       </div>
                     </div>

                     <div className="rounded-2xl bg-white border border-slate-200 p-5">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Rincian Draft</p>
                       <div className="space-y-2 text-xs">
                         <div className="flex justify-between gap-3"><span className="text-slate-500">Channel</span><span className="font-black text-brand-navy text-right">{campaignForm.channel}</span></div>
                         <div className="flex justify-between gap-3"><span className="text-slate-500">Objective</span><span className="font-black text-brand-navy text-right">{campaignForm.objective}</span></div>
                         <div className="flex justify-between gap-3"><span className="text-slate-500">Landing</span><span className="font-mono font-black text-brand-blue text-right">{campaignForm.landingPage}</span></div>
                         <div className="flex justify-between gap-3"><span className="text-slate-500">Currency</span><span className="font-black text-brand-navy text-right">{campaignForm.currency}</span></div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                   <button onClick={() => setIsCampaignEditorOpen(false)} className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100">Batal</button>
                   <button
                     onClick={() => {
                       recordAudit('Digital Marketing', 'Create Campaign Draft', `${campaignForm.name} - ${formatCurrencyAmount(campaignTotalBudget, campaignForm.currency)}`);
                       setIsCampaignEditorOpen(false);
                       notify('Campaign baru tersimpan sebagai draft dengan budget fleksibel.');
                     }}
                     className="btn-primary py-2.5 px-8"
                   >
                     <Save size={18} /> Simpan Draft Campaign
                   </button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {isSaveWebsiteConfirmOpen && (
             <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
                    <Save size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-brand-navy mb-3">Simpan perubahan website?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-8">
                    Perubahan UI akan disimpan sebagai draft Website Editor. Pilih Iya untuk menyimpan, atau Tidak untuk kembali mengedit tanpa menyimpan.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setIsSaveWebsiteConfirmOpen(false);
                        notify('Perubahan website tidak disimpan.');
                      }}
                      className="btn-secondary py-4"
                    >
                      Tidak
                    </button>
                    <button
                      onClick={() => {
                        setIsSaveWebsiteConfirmOpen(false);
                        notify('Perubahan website berhasil disimpan sebagai draft.');
                      }}
                      className="btn-primary py-4"
                    >
                      Iya
                    </button>
                  </div>
                </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {editingVideo && (
             <div className="fixed inset-0 z-[122] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <Video size={22} className="text-brand-blue" />
                     <div>
                       <h3 className="font-bold">Video Lesson Editor</h3>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest">Metadata, akses, thumbnail, dan catatan materi</p>
                     </div>
                   </div>
                   <button onClick={() => setEditingVideo(null)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="p-8 grid lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-5">
                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul Video</label>
                         <input value={editingVideo.title} onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program</label>
                         <select value={editingVideo.program} onChange={(e) => setEditingVideo({ ...editingVideo, program: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                           {programsList.map((program) => <option key={program.id} value={program.title}>{program.title}</option>)}
                           <option>Kedokteran Express</option>
                           <option>SNBT Intensive</option>
                           <option>CPNS Masterclass</option>
                           <option>Kedinasan Special</option>
                         </select>
                       </div>
                     </div>

                     <div className="grid md:grid-cols-4 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Durasi</label>
                         <input value={editingVideo.duration} onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Views</label>
                         <input value={editingVideo.views} onChange={(e) => setEditingVideo({ ...editingVideo, views: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status</label>
                         <select value={editingVideo.status} onChange={(e) => setEditingVideo({ ...editingVideo, status: e.target.value as VideoLessonRecord['status'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                           <option>Draft</option>
                           <option>Published</option>
                           <option>Archived</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Akses</label>
                         <select value={editingVideo.access} onChange={(e) => setEditingVideo({ ...editingVideo, access: e.target.value as VideoLessonRecord['access'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                           <option>Free</option>
                           <option>Premium</option>
                           <option>Scholarship</option>
                         </select>
                       </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Mentor</label>
                         <input value={editingVideo.mentor} onChange={(e) => setEditingVideo({ ...editingVideo, mentor: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Modul / Chapter</label>
                         <input value={editingVideo.module} onChange={(e) => setEditingVideo({ ...editingVideo, module: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                       </div>
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Deskripsi Video</label>
                       <textarea value={editingVideo.description} onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })} className="w-full h-28 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600" />
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Editor / Materi</label>
                       <textarea value={editingVideo.notes} onChange={(e) => setEditingVideo({ ...editingVideo, notes: e.target.value })} className="w-full h-24 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-100 outline-none text-sm text-amber-900" />
                     </div>
                   </div>

                   <div className="space-y-5">
                     <div className="card-premium p-5 bg-white">
                       <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-4">
                         <img src={editingVideo.thumbnail} className="w-full h-full object-cover" alt="" />
                       </div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Thumbnail URL</label>
                       <input value={editingVideo.thumbnail} onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs" />
                     </div>

                     <div className="card-premium p-5 bg-white">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tags (pisahkan koma)</label>
                       <input value={editingVideo.tags.join(', ')} onChange={(e) => setEditingVideo({ ...editingVideo, tags: e.target.value.split(',') })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm" />
                       <div className="flex flex-wrap gap-2 mt-4">
                         {editingVideo.tags.filter(Boolean).map((tag) => (
                           <span key={tag} className="px-2 py-1 rounded-lg bg-blue-50 text-brand-blue text-[10px] font-black uppercase">{tag.trim()}</span>
                         ))}
                       </div>
                     </div>

                     <div className="card-premium p-5 bg-slate-50">
                       <p className="text-sm font-black text-brand-navy mb-3">Checklist Publish</p>
                       {[
                         ['Judul', editingVideo.title],
                         ['Durasi', editingVideo.duration],
                         ['Thumbnail', editingVideo.thumbnail],
                         ['Deskripsi', editingVideo.description],
                       ].map(([label, value]) => (
                         <div key={label} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-b-0">
                           <span className="text-xs font-bold text-slate-500">{label}</span>
                           <CheckCircle2 size={16} className={value ? 'text-emerald-500' : 'text-slate-300'} />
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>

                 <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                   <button onClick={() => notify(`Preview video "${editingVideo.title}" dibuka di mode demo.`)} className="btn-secondary py-3 px-6">
                     <Play size={16} /> Preview
                   </button>
                   <div className="flex gap-3">
                     <button onClick={() => setEditingVideo(null)} className="btn-secondary py-3 px-6">Batal</button>
                     <button onClick={() => saveVideoEditor(editingVideo)} className="btn-primary py-3 px-8">
                       <Save size={18} /> Simpan Video
                     </button>
                   </div>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {isLeadFormOpen && (
             <div className="fixed inset-0 z-[122] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <UserPlus size={22} className="text-brand-orange" />
                     <div>
                       <h3 className="font-bold">Add New Lead</h3>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest">Input calon siswa baru ke pipeline follow-up</p>
                     </div>
                   </div>
                   <button onClick={() => setIsLeadFormOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="p-8 space-y-6">
                   <div className="grid md:grid-cols-2 gap-4">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Lead</label>
                       <input value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="Contoh: Rina Wijaya" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nomor WhatsApp</label>
                       <input value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="0812-xxxx-xxxx" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                       <input type="email" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="nama@email.com" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status Pipeline</label>
                       <select value={leadForm.status} onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value as Lead['status'] })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                         <option value="New">New</option>
                         <option value="Contacted">Contacted</option>
                         <option value="Qualified">Qualified</option>
                         <option value="Converted">Converted</option>
                         <option value="Lost">Lost</option>
                       </select>
                     </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-4">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Minat Program</label>
                       <select value={leadForm.programOfInterest} onChange={(e) => setLeadForm({ ...leadForm, programOfInterest: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                         {programsList.map((program) => (
                           <option key={program.id} value={program.title}>{program.title}</option>
                         ))}
                         <option value="Konsultasi Program">Konsultasi Program</option>
                         <option value="Tryout Gratis">Tryout Gratis</option>
                       </select>
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Sumber Lead</label>
                       <select value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                         <option>Admin Input</option>
                         <option>Form Kontak Website</option>
                         <option>Tryout Gratis</option>
                         <option>WhatsApp</option>
                         <option>Instagram</option>
                         <option>Google</option>
                         <option>TikTok</option>
                         <option>Referral</option>
                       </select>
                     </div>
                   </div>

                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Awal</label>
                     <textarea value={leadForm.note || ''} onChange={(e) => setLeadForm({ ...leadForm, note: e.target.value })} className="w-full h-28 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600" placeholder="Contoh: Tertarik paket premium, minta dihubungi malam hari." />
                   </div>

                   <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                     <div className="flex items-start gap-3">
                       <Info size={18} className="text-brand-blue shrink-0 mt-0.5" />
                       <p className="text-xs text-slate-600 leading-relaxed">
                         Lead yang ditambahkan di sini belum otomatis menjadi siswa. Gunakan tombol Convert to Student jika calon siswa sudah siap dimasukkan ke daftar user siswa.
                       </p>
                     </div>
                   </div>
                 </div>

                 <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                   <button onClick={() => setIsLeadFormOpen(false)} className="btn-secondary py-3 px-6">
                     Batal
                   </button>
                   <button onClick={saveLeadForm} className="btn-primary py-3 px-8">
                     <Save size={18} /> Simpan Lead
                   </button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {leadPendingConvert && (
             <div className="fixed inset-0 z-[126] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
               >
                 <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
                   <UserPlus size={26} />
                 </div>
                 <h3 className="text-xl font-black text-brand-navy mb-2">Convert lead menjadi siswa?</h3>
                 <p className="text-sm text-slate-500 leading-relaxed mb-6">
                   Lead <span className="font-bold text-brand-navy">{leadPendingConvert.name}</span> akan dibuat sebagai user siswa trial/gratis dan status lead berubah menjadi Converted.
                 </p>
                 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-8">
                   <p className="text-xs font-bold text-brand-navy">{leadPendingConvert.programOfInterest}</p>
                   <p className="text-[10px] text-slate-400 mt-1">{leadPendingConvert.email} - {leadPendingConvert.phone}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                   <button
                     onClick={() => setLeadPendingConvert(null)}
                     className="btn-secondary py-3"
                   >
                     Batal
                   </button>
                   <button
                     onClick={() => convertLeadToStudent(leadPendingConvert)}
                     className="btn-primary py-3"
                   >
                     Ya, Convert
                   </button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {selectedLead && (
             <div className="fixed inset-0 z-[123] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <UserPlus size={22} className="text-brand-orange" />
                     <div>
                       <h3 className="font-bold">Detail Lead</h3>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest">Calon siswa sebelum menjadi user aktif</p>
                     </div>
                   </div>
                   <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="p-8 grid lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-6">
                     <div className="grid md:grid-cols-2 gap-4">
                       {[
                         ['Nama', selectedLead.name],
                         ['Email', selectedLead.email],
                         ['WhatsApp', selectedLead.phone],
                         ['Tanggal Masuk', selectedLead.createdAt],
                         ['Minat Program', selectedLead.programOfInterest],
                         ['Sumber Lead', selectedLead.source],
                       ].map(([label, value]) => (
                         <div key={label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                           <p className="text-sm font-bold text-brand-navy break-words">{value || '-'}</p>
                         </div>
                       ))}
                     </div>

                     <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                       <div className="flex items-start gap-3">
                         <Info size={18} className="text-brand-blue shrink-0 mt-0.5" />
                         <div>
                           <p className="text-sm font-black text-brand-navy mb-1">Interpretasi Lead</p>
                           <p className="text-xs text-slate-600 leading-relaxed">
                             Lead ini adalah calon siswa yang sudah menunjukkan minat, tetapi belum tentu menjadi siswa aktif. Jika sudah siap ikut program, gunakan Convert to Student atau arahkan ke pendaftaran paket.
                           </p>
                         </div>
                       </div>
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Follow-up Admin</label>
                       <textarea
                         value={leadNoteDraft}
                         onChange={(event) => setLeadNoteDraft(event.target.value)}
                         className="w-full h-32 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600"
                         placeholder="Contoh: Sudah dihubungi, tertarik paket premium tetapi menunggu diskusi orang tua."
                       />
                       <button
                         onClick={() => {
                           updateLeadStatus(selectedLead, selectedLead.status, leadNoteDraft);
                           notify('Catatan lead disimpan.');
                         }}
                         className="mt-3 btn-secondary py-2 px-5"
                       >
                         <Save size={16} /> Simpan Catatan
                       </button>
                     </div>
                   </div>

                   <div className="space-y-5">
                     <div className="card-premium p-5 bg-white">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status Lead</p>
                       <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                         selectedLead.status === 'Converted' ? 'bg-emerald-50 text-emerald-600' :
                         selectedLead.status === 'Lost' ? 'bg-red-50 text-red-600' :
                         selectedLead.status === 'Qualified' ? 'bg-blue-50 text-brand-blue' :
                         'bg-amber-50 text-amber-600'
                       }`}>
                         {selectedLead.status}
                       </span>
                       <p className="text-[10px] text-slate-400 mt-3">Terakhir dihubungi: {selectedLead.lastContactedAt || '-'}</p>
                     </div>

                     <div className="card-premium p-5 bg-white">
                       <p className="text-sm font-black text-brand-navy mb-4">Update Pipeline</p>
                       <div className="grid grid-cols-2 gap-2">
                         {(['New', 'Contacted', 'Qualified', 'Lost'] as Lead['status'][]).map((status) => (
                           <button
                             key={status}
                             onClick={() => {
                               updateLeadStatus(selectedLead, status, leadNoteDraft);
                               notify(`Status lead menjadi ${status}.`);
                             }}
                             className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${selectedLead.status === status ? 'bg-brand-blue text-white border-brand-blue' : 'bg-slate-50 text-slate-500 border-slate-100'}`}
                           >
                             {status}
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="card-premium p-5 bg-white space-y-3">
                       <button onClick={() => openLeadWhatsapp(selectedLead)} className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest">
                         Hubungi WhatsApp
                       </button>
                       <button onClick={() => setLeadPendingConvert(selectedLead)} className="w-full btn-primary py-3 text-xs uppercase tracking-widest">
                         <UserPlus size={16} /> Convert to Student
                       </button>
                       <button
                         onClick={() => {
                           const csv = [
                             'field,value',
                             `name,"${selectedLead.name}"`,
                             `email,"${selectedLead.email}"`,
                             `phone,"${selectedLead.phone}"`,
                             `program,"${selectedLead.programOfInterest}"`,
                             `source,"${selectedLead.source}"`,
                             `status,"${selectedLead.status}"`,
                             `note,"${leadNoteDraft}"`
                           ].join('\n');
                           downloadTextFile(`lead-${selectedLead.id}.csv`, csv);
                         }}
                         className="w-full py-3 rounded-xl bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest"
                       >
                         Export Detail
                       </button>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {editingUser && (
             <div className="fixed inset-0 z-[124] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <Users size={22} className="text-brand-blue" />
                     <div>
                       <h3 className="font-bold">Add / Edit User</h3>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest">
                         {editingUser.role === 'Student' ? 'Form khusus user siswa' : 'Form khusus user admin/staff'}
                       </p>
                     </div>
                   </div>
                   <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="p-8 grid lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-5">
                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Lengkap</label>
                         <input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="Contoh: Budi Santoso" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Login</label>
                         <input type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="nama@email.com" />
                       </div>
                     </div>

                     <div className="grid md:grid-cols-3 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Role</label>
                         <select
                           value={editingUser.role}
                           onChange={(e) => {
                             const nextRole = e.target.value as UserAccount['role'];
                             setEditingUser({
                               ...editingUser,
                               role: nextRole,
                               accountType: nextRole === 'Student' ? (editingUser.accountType === 'Staff' ? 'Free' : editingUser.accountType || 'Free') : 'Staff'
                             });
                           }}
                           className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none"
                         >
                           {editingUser.role === 'Student' ? (
                             <option value="Student">Student User</option>
                           ) : (
                             <>
                               <option value="Support">Support Staff</option>
                               <option value="Content Manager">Content Manager</option>
                               <option value="Admin">Super Admin</option>
                               <option value="Tutor">Tutor / Educator</option>
                             </>
                           )}
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status</label>
                         <select value={editingUser.status} onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserAccount['status'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                           <option value="Active">Active</option>
                           <option value="Pending">Pending</option>
                           <option value="Inactive">Inactive</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tanggal Join</label>
                         <input type="date" value={editingUser.joinedAt} onChange={(e) => setEditingUser({ ...editingUser, joinedAt: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" />
                       </div>
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program / Scope</label>
                       <select value={editingUser.program || ''} onChange={(e) => setEditingUser({ ...editingUser, program: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                         <option value="">General / Semua Program</option>
                         {programsList.map((program) => (
                           <option key={program.id} value={program.title}>{program.title}</option>
                         ))}
                       </select>
                     </div>

                     {editingUser.role === 'Student' && (
                       <div className="grid md:grid-cols-3 gap-4">
                         <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tipe Siswa</label>
                           <select value={editingUser.accountType || 'Free'} onChange={(e) => setEditingUser({ ...editingUser, accountType: e.target.value as UserAccount['accountType'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                             <option value="Free">Gratis</option>
                             <option value="Paid">Berbayar</option>
                             <option value="Scholarship">Beasiswa</option>
                           </select>
                         </div>
                         <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Paket Belajar</label>
                           <input value={editingUser.packageName || ''} onChange={(e) => setEditingUser({ ...editingUser, packageName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" placeholder="Gratis / Premium / Beasiswa" />
                         </div>
                         <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status Pembayaran</label>
                           <input value={editingUser.paymentStatus || ''} onChange={(e) => setEditingUser({ ...editingUser, paymentStatus: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" placeholder="Free Active / Approved" />
                         </div>
                       </div>
                     )}

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Avatar URL</label>
                       <input value={editingUser.avatar} onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm" />
                     </div>
                   </div>

                   <div className="space-y-5">
                     <div className="card-premium p-5 bg-slate-50">
                       <div className="flex items-center gap-3 mb-4">
                         <img src={editingUser.avatar} className="w-12 h-12 rounded-xl object-cover bg-white" alt="" />
                         <div>
                           <p className="text-sm font-black text-brand-navy">{editingUser.name || 'Nama User'}</p>
                           <p className="text-[10px] text-slate-400 font-bold">{editingUser.email || 'email belum diisi'}</p>
                         </div>
                       </div>
                       <span className="inline-flex px-2 py-1 rounded-lg bg-blue-50 text-brand-blue text-[10px] font-black uppercase">{editingUser.role}</span>
                     </div>

                     <div className="card-premium p-5 bg-white">
                       <h4 className="font-black text-brand-navy mb-3">Rincian Akses Role</h4>
                       <div className="flex flex-wrap gap-2">
                         {(rolePermissions[(editingUser.role as any) === 'Admin' ? 'Super Admin' : (editingUser.role as any) as AdminRole] || ['overview']).map((tab) => (
                           <span key={tab} className="px-2 py-1 rounded-lg bg-slate-50 text-slate-500 text-[9px] font-black uppercase">{tab}</span>
                         ))}
                         {editingUser.role === 'Student' && <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase">student dashboard</span>}
                         {editingUser.role === 'Tutor' && <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-black uppercase">kelas & materi</span>}
                       </div>
                       <p className="text-[10px] text-slate-400 leading-relaxed mt-4">
                         Admin dan Content Manager mendapat akses panel demo sesuai role. Student/Tutor tersimpan sebagai akun operasional dan dapat difilter di tabel user.
                       </p>
                     </div>
                   </div>
                 </div>

                 <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                   <button onClick={() => setEditingUser(null)} className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100">
                     Batal
                   </button>
                   <button onClick={() => saveUser(editingUser)} className="btn-primary py-2.5 px-8">
                     <Save size={18} /> Simpan User
                   </button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {editingBlogPost && (
             <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <FileText size={22} className="text-brand-orange" />
                     <div>
                       <h3 className="font-bold">Editor Info Menarik & Literasi</h3>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest">Tersinkron ke menu Info Menarik</p>
                       <p className="text-xs text-white/70 mt-1 max-w-2xl">
                         Form ini mengatur kartu blog, halaman detail artikel, gambar tengah, bacaan lainnya, metadata author, tag, dan isi Markdown yang tampil di website publik.
                       </p>
                     </div>
                   </div>
                   <button onClick={() => setEditingBlogPost(null)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="px-8 py-5 bg-slate-50 border-b border-slate-100">
                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                     <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Template Cepat</p>
                       <p className="text-xs text-slate-500">Gunakan struktur artikel panjang tanpa mengubah desain halaman Info Menarik.</p>
                     </div>
                     <div className="flex flex-wrap gap-2">
                       {BLOG_EDITOR_TEMPLATES.map((template) => (
                         <button
                           key={template.label}
                           onClick={() => setEditingBlogPost({
                             ...editingBlogPost,
                             title: template.title,
                             excerpt: template.excerpt,
                             category: template.category,
                             content: template.content,
                             tags: template.tags
                           })}
                           className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-brand-blue hover:border-brand-blue"
                         >
                           {template.label}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>

                 <div className="p-8 overflow-y-auto grid lg:grid-cols-2 gap-8">
                   <div className="space-y-5">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul</label>
                       <input value={editingBlogPost.title} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, title: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Ringkasan Kartu</label>
                       <textarea value={editingBlogPost.excerpt} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, excerpt: e.target.value })} className="w-full h-24 px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm" />
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kategori</label>
                         <select value={editingBlogPost.category} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, category: e.target.value as BlogPost['category'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold">
                           <option>Tips & Trik</option>
                           <option>Info PTN</option>
                           <option>Materi</option>
                           <option>Inspirasi</option>
                           <option>Literasi</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Read Time</label>
                         <input value={editingBlogPost.readTime} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, readTime: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tanggal Publish</label>
                       <input value={editingBlogPost.date} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, date: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" placeholder="30 April 2026" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">URL Gambar Utama</label>
                       <input value={editingBlogPost.image} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, image: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                     </div>
                     <div className="grid md:grid-cols-[140px_1fr] gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <div className="aspect-video rounded-xl overflow-hidden bg-white border border-slate-100">
                         <img src={editingBlogPost.image || BLOG_POSTS[0].image} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div>
                         <p className="text-sm font-black text-brand-navy mb-1">Rincian Gambar</p>
                         <p className="text-xs text-slate-500 leading-relaxed">
                           Gambar utama dipakai untuk kartu di menu Info Menarik, hero gambar di detail artikel, dan default gambar tengah jika artikel belum punya gambar sisipan. Untuk gambar di tengah bacaan, gunakan tombol Tambah Gambar Tengah.
                         </p>
                       </div>
                     </div>
                     <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                       <p className="text-sm font-black text-brand-navy mb-2">Sisipan Tengah Artikel</p>
                       <p className="text-xs text-slate-500 leading-relaxed mb-4">Kelola gambar tengah dan bacaan lainnya lewat jendela khusus: pilih aset yang perlu disisipkan, hapus aset yang tidak perlu, dan preview sebelum masuk artikel.</p>
                       <div className="grid md:grid-cols-3 gap-2">
                         <button
                           onClick={() => setIsMiddleInsertOpen(true)}
                           className="px-4 py-3 rounded-xl bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue flex items-center justify-center gap-2"
                         >
                           <Layout size={15} /> Buka Jendela Sisipan
                         </button>
                         <button
                           onClick={() => insertBlogContentBlock(`![Gambar pendukung: ${editingBlogPost.title}](${editingBlogPost.image || BLOG_POSTS[0].image})`)}
                           className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:border-brand-blue flex items-center justify-center gap-2"
                         >
                           <ImageIcon size={15} /> Tambah Gambar Tengah
                         </button>
                         <button
                           onClick={() => insertBlogContentBlock(`{{related:${blogPostDrafts.find((item) => item.id !== editingBlogPost.id)?.id || blogPostDrafts[0]?.id || 'artikel-terkait'}}}`)}
                           className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:border-brand-blue flex items-center justify-center gap-2"
                         >
                           <BookOpen size={15} /> Tambah Bacaan Lainnya
                         </button>
                       </div>
                     </div>
                     <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                       <div className="flex items-start justify-between gap-4 mb-4">
                         <div>
                           <p className="text-sm font-black text-brand-navy">Database Gambar & Dokumen</p>
                           <p className="text-xs text-slate-500 leading-relaxed mt-1">Impor dari PC atau simpan URL internet, lalu pilih aset untuk disisipkan ke artikel.</p>
                         </div>
                         <ImageIcon size={18} className="text-brand-blue shrink-0" />
                       </div>
                       <div className="grid md:grid-cols-[1fr_auto] gap-2 mb-3">
                         <label className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:border-brand-blue flex items-center justify-center gap-2 cursor-pointer">
                           <Upload size={15} /> Import dari PC
                           <input
                             type="file"
                             accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                             className="hidden"
                             onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) importBlogAssetFromPc(file);
                               e.currentTarget.value = '';
                             }}
                           />
                         </label>
                         <button
                           onClick={() => window.open('https://unsplash.com/s/photos/education-learning', '_blank', 'noopener,noreferrer')}
                           className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-brand-blue hover:border-brand-blue flex items-center justify-center gap-2"
                         >
                           <Search size={15} /> Cari Internet
                         </button>
                       </div>
                       <div className="grid md:grid-cols-[1fr_1fr_auto] gap-2 mb-4">
                         <input value={internetAssetName} onChange={(e) => setInternetAssetName(e.target.value)} className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs outline-none" placeholder="Nama aset" />
                         <input value={internetAssetUrl} onChange={(e) => setInternetAssetUrl(e.target.value)} className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs outline-none" placeholder="Paste URL gambar/dokumen" />
                         <button onClick={addInternetBlogAsset} className="px-4 py-3 rounded-xl bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 justify-center">
                           <Link size={14} /> Simpan
                         </button>
                       </div>
                       {blogEditorAssets.length === 0 ? (
                         <p className="text-xs text-slate-400">Belum ada aset tersimpan.</p>
                       ) : (
                         <div className="grid md:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                           {blogEditorAssets.map((asset) => (
                             <div key={asset.id} className="rounded-xl bg-white border border-slate-200 p-3">
                               <div className="flex gap-3">
                                 <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                                   {asset.type === 'image' ? <img src={asset.url} className="w-full h-full object-cover" alt="" /> : <FileText size={20} className="text-slate-400" />}
                                 </div>
                                 <div className="min-w-0 flex-1">
                                   <p className="text-xs font-black text-brand-navy truncate">{asset.name}</p>
                                   <p className="text-[10px] text-slate-400 uppercase font-bold">{asset.source} - {asset.type}</p>
                                   <input value={asset.note} onChange={(e) => saveBlogEditorAssets(blogEditorAssets.map((item) => item.id === asset.id ? { ...item, note: e.target.value } : item))} className="mt-1 w-full text-[10px] bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 outline-none" />
                                 </div>
                               </div>
                               <div className="flex gap-2 mt-3">
                                 <button onClick={() => insertBlogAsset(asset)} className="flex-1 py-2 rounded-lg bg-blue-50 text-brand-blue text-[10px] font-black uppercase">Sisipkan</button>
                                 <button onClick={() => setEditingBlogAsset(asset)} className="px-3 py-2 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-black uppercase">Edit</button>
                                 <button onClick={() => deleteBlogAsset(asset.id)} className="px-3 py-2 rounded-lg bg-slate-50 text-red-400"><Trash2 size={13} /></button>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>
                     <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800">
                       <div className="flex items-center gap-2 mb-3">
                         <Bot size={18} className="text-brand-orange" />
                         <div>
                           <p className="text-sm font-black">AI Chat Agent Artikel</p>
                           <p className="text-xs text-white/50">Bantu buat draft heading, paragraf, checklist, atau CTA lalu sisipkan ke konten.</p>
                         </div>
                       </div>
                       <textarea value={aiChatPrompt} onChange={(e) => setAiChatPrompt(e.target.value)} className="w-full h-20 rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-xs outline-none" placeholder="Contoh: buatkan bagian bacaan literasi tentang cara mencari ide pokok..." />
                       <div className="flex gap-2 mt-3">
                         <button onClick={generateAiBlogDraft} className="px-4 py-2 rounded-xl bg-brand-orange text-brand-navy text-[10px] font-black uppercase">Buat Draft</button>
                         {aiChatDraft && <button onClick={() => insertBlogContentBlock(aiChatDraft)} className="px-4 py-2 rounded-xl bg-white text-brand-navy text-[10px] font-black uppercase">Sisipkan Draft</button>}
                       </div>
                       {aiChatDraft && (
                         <pre className="mt-3 max-h-40 overflow-auto rounded-xl bg-black/30 p-3 text-[10px] leading-relaxed whitespace-pre-wrap text-white/80">{aiChatDraft}</pre>
                       )}
                     </div>
                     <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <p className="text-sm font-black text-brand-navy mb-2">Rincian Bacaan Lainnya</p>
                       <p className="text-xs text-slate-500 leading-relaxed mb-3">
                         Bacaan lainnya tampil sebagai 3 opsi horizontal di tengah artikel. Jika admin memilih satu artikel melalui blok Bacaan Lainnya, artikel itu menjadi opsi pertama dan dua sisanya diambil otomatis dari daftar Info Menarik.
                       </p>
                       <div className="grid grid-cols-3 gap-2">
                         {getBlogRelatedOptions(editingBlogPost).map((item) => (
                           <div key={item.id} className="rounded-lg bg-white border border-slate-200 px-2 py-2">
                             <p className="text-[10px] font-black text-brand-navy leading-snug line-clamp-2">{item.title}</p>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Author</label>
                         <input value={editingBlogPost.author} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, author: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" placeholder="Author" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Role Author</label>
                         <input value={editingBlogPost.authorRole} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, authorRole: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" placeholder="Author role" />
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">URL Avatar Author</label>
                       <input value={editingBlogPost.authorAvatar} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, authorAvatar: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tags (pisahkan koma)</label>
                       <input value={editingBlogPost.tags.join(', ')} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, tags: e.target.value.split(',') })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                     </div>
                     <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                       <p className="text-sm font-black text-brand-navy mb-2">Panduan isi artikel</p>
                       <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
                         <span>Minimal 4 heading</span>
                         <span>1 checklist praktis</span>
                         <span>Contoh penerapan</span>
                         <span>CTA lembut ke program</span>
                       </div>
                     </div>
                   </div>

                   <div className="space-y-5">
                     <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                       <div className="flex items-center justify-between mb-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview Kartu Info Menarik</p>
                         <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase">Live</span>
                       </div>
                       <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-4">
                         <img src={editingBlogPost.image || BLOG_POSTS[0].image} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 rounded-lg bg-blue-50 text-brand-blue text-[9px] font-black uppercase">{editingBlogPost.category}</span>
                         <span className="text-[9px] text-slate-400 font-bold">{editingBlogPost.readTime || '5 min read'}</span>
                       </div>
                       <h4 className="text-lg font-black text-brand-navy leading-tight">{editingBlogPost.title || 'Judul Artikel'}</h4>
                       <p className="text-sm text-slate-500 mt-2 line-clamp-3">{editingBlogPost.excerpt || 'Ringkasan artikel akan tampil di sini.'}</p>
                       <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                         <img src={editingBlogPost.authorAvatar || 'https://i.pravatar.cc/150?u=admin'} className="w-9 h-9 rounded-full" alt="" />
                         <div>
                           <p className="text-xs font-black text-brand-navy">{editingBlogPost.author || 'Admin The Prams'}</p>
                           <p className="text-[10px] text-slate-400">{editingBlogPost.date || 'Tanggal publish'}</p>
                         </div>
                       </div>
                     </div>
                     <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                       <div className="flex items-start justify-between gap-4 mb-4">
                         <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blok Layout Artikel</p>
                           <p className="text-xs text-slate-500 mt-1">Sisipkan elemen seperti editor slide: gambar tengah, bacaan lainnya, quote, highlight, atau CTA.</p>
                         </div>
                         <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[9px] font-black text-slate-400 uppercase">Flexible</span>
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                         {[
                           {
                             label: 'Heading',
                             icon: FileText,
                             block: '## Subjudul Baru\n\nTulis paragraf pembuka untuk bagian ini.'
                           },
                           {
                             label: 'Gambar Tengah',
                             icon: ImageIcon,
                             block: `![Tulis caption gambar di sini](${editingBlogPost.image || BLOG_POSTS[0].image})`
                           },
                           {
                             label: 'Bacaan Lainnya',
                             icon: BookOpen,
                             block: `{{related:${blogPostDrafts.find((item) => item.id !== editingBlogPost.id)?.id || blogPostDrafts[0]?.id || 'artikel-terkait'}}}`
                           },
                           {
                             label: 'Quote',
                             icon: Quote,
                             block: '> Tulis kutipan penting atau insight utama di sini.'
                           },
                           {
                             label: 'Highlight',
                             icon: Info,
                             block: '> **Catatan penting:** Tulis ringkasan poin kunci yang perlu diperhatikan pembaca.'
                           },
                           {
                             label: 'CTA',
                             icon: Target,
                             block: '## Siap Latihan Lebih Terarah?\n\nIkuti tryout gratis The Prams untuk melihat analisis kemampuan dan rekomendasi belajar yang sesuai targetmu.'
                           }
                         ].map((item) => (
                           <button
                             key={item.label}
                             onClick={() => insertBlogContentBlock(item.block)}
                             className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-brand-blue hover:border-brand-blue transition-colors"
                           >
                             <item.icon size={14} />
                             {item.label}
                           </button>
                         ))}
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Konten Markdown</label>
                       <textarea value={editingBlogPost.content} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, content: e.target.value })} className="w-full h-[360px] px-5 py-4 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 outline-none font-mono text-xs leading-relaxed" />
                     </div>
                     <div className="grid grid-cols-3 gap-3">
                       {[
                         { label: 'Kata', value: editingBlogPost.content.trim().split(/\s+/).filter(Boolean).length },
                         { label: 'Heading', value: (editingBlogPost.content.match(/^##?\s/gm) || []).length },
                         { label: 'Tags', value: editingBlogPost.tags.filter(Boolean).length }
                       ].map((stat) => (
                         <div key={stat.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase">{stat.label}</p>
                           <p className="text-lg font-black text-brand-navy">{stat.value}</p>
                         </div>
                       ))}
                     </div>
                     <div className="p-5 rounded-2xl bg-white border border-slate-200 max-h-[420px] overflow-y-auto">
                       <div className="flex items-center justify-between mb-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview Isi Artikel</p>
                         <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest">Markdown</span>
                       </div>
                       <div className="blog-article text-sm leading-6">
                         <Markdown
                           components={{
                             p: ({ children }) => {
                               const text = React.Children.toArray(children).join('').trim();
                               const relatedId = text.match(/^\{\{related:(.+)\}\}$/)?.[1];
                               const related = relatedId ? blogPostDrafts.find((item) => item.id === relatedId) : null;
                               const relatedOptions = getBlogRelatedOptions(editingBlogPost, related?.id);
                               if (relatedId && relatedOptions.length) {
                                 return (
                                   <div className="my-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                     <div className="flex items-center gap-2 mb-2">
                                       <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue whitespace-nowrap">Bacaan lainnya</p>
                                       <span className="h-px flex-1 bg-slate-200" />
                                     </div>
                                     <div className="grid grid-cols-3 gap-2">
                                       {relatedOptions.map((item) => (
                                         <div key={item.id} className="min-h-[48px] rounded-md bg-white border border-slate-200 px-2 py-1.5">
                                           <p className="text-[10px] font-black text-brand-navy leading-snug mb-0 line-clamp-2">{item.title}</p>
                                         </div>
                                       ))}
                                     </div>
                                   </div>
                                 );
                               }
                               return <p>{children}</p>;
                             }
                           }}
                         >
                           {editingBlogPost.content}
                         </Markdown>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                   <button onClick={() => setPreviewBlogPost(editingBlogPost)} className="btn-secondary py-2.5 px-6">Preview Draft</button>
                   <div className="flex gap-3">
                     <button onClick={() => setEditingBlogPost(null)} className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100">Batal</button>
                     <button onClick={() => saveBlogPost(editingBlogPost)} className="btn-primary py-2.5 px-8">
                       <Save size={18} /> Simpan & Publish
                     </button>
                   </div>
                 </div>
                 <button
                   onClick={() => setIsBlogAiChatOpen((value) => !value)}
                   className="absolute right-6 bottom-24 w-14 h-14 rounded-full bg-brand-blue text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
                   title="AI Chat Agent"
                 >
                   <Bot size={24} />
                 </button>
                 {isBlogAiChatOpen && (
                   <div className="absolute right-6 bottom-40 w-[320px] rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-2xl p-4">
                     <div className="flex items-center justify-between mb-3">
                       <div>
                         <p className="text-sm font-black">AI Chat Agent</p>
                         <p className="text-[10px] text-white/50">Bantu pilih sisipan atau buat draft.</p>
                       </div>
                       <button onClick={() => setIsBlogAiChatOpen(false)} className="p-1 hover:bg-white/10 rounded-lg"><X size={14} /></button>
                     </div>
                     <textarea value={aiChatPrompt} onChange={(e) => setAiChatPrompt(e.target.value)} className="w-full h-20 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-xs outline-none" placeholder="Contoh: gambar apa yang cocok untuk artikel ini?" />
                     <div className="flex gap-2 mt-3">
                       <button onClick={generateAiBlogDraft} className="px-3 py-2 rounded-xl bg-brand-orange text-brand-navy text-[10px] font-black uppercase">Buat</button>
                       {aiChatDraft && <button onClick={() => insertBlogContentBlock(aiChatDraft)} className="px-3 py-2 rounded-xl bg-white text-brand-navy text-[10px] font-black uppercase">Sisipkan</button>}
                       <button onClick={() => setIsMiddleInsertOpen(true)} className="ml-auto px-3 py-2 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase">Sisipan</button>
                     </div>
                     {aiChatDraft && <pre className="mt-3 max-h-32 overflow-auto rounded-xl bg-black/30 p-3 text-[10px] whitespace-pre-wrap text-white/80">{aiChatDraft}</pre>}
                   </div>
                 )}
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {editingBlogPost && isMiddleInsertOpen && (
             <div className="fixed inset-0 z-[135] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div>
                     <h3 className="font-bold">Jendela Sisipan Tengah Artikel</h3>
                     <p className="text-xs text-white/60 mt-1">Pilih gambar dan bacaan lainnya yang perlu disisipkan. Aset yang tidak perlu bisa dihapus dari database editor.</p>
                   </div>
                   <button onClick={() => setIsMiddleInsertOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
                 </div>
                 <div className="p-6 overflow-y-auto grid lg:grid-cols-3 gap-6">
                   <div className="lg:col-span-2 space-y-6">
                     <div className="rounded-2xl border border-slate-200 p-5">
                       <div className="flex items-center justify-between gap-3 mb-4">
                         <div>
                           <p className="font-black text-brand-navy">Pilih Gambar Tengah</p>
                           <p className="text-xs text-slate-500">Gunakan gambar dari database. Jika belum ada, import dari PC atau simpan URL internet di panel Database Gambar & Dokumen.</p>
                         </div>
                         <button onClick={() => setIsBlogAiChatOpen(true)} className="px-3 py-2 rounded-xl bg-blue-50 text-brand-blue text-[10px] font-black uppercase flex items-center gap-2"><Bot size={14} /> Bingung?</button>
                       </div>
                       {blogEditorAssets.filter((asset) => asset.type === 'image').length === 0 ? (
                         <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center">
                           <p className="text-sm font-black text-brand-navy">Belum ada gambar di database.</p>
                           <p className="text-xs text-slate-500 mt-1">Tutup jendela ini, lalu import dari PC atau simpan URL internet.</p>
                         </div>
                       ) : (
                         <div className="grid md:grid-cols-3 gap-3">
                           {blogEditorAssets.filter((asset) => asset.type === 'image').map((asset) => (
                             <div key={asset.id} className={`rounded-xl border p-3 ${middlePreviewAsset?.id === asset.id ? 'border-brand-blue bg-blue-50' : 'border-slate-200 bg-white'}`}>
                               <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 mb-3">
                                 <img src={asset.url} className="w-full h-full object-cover" alt="" />
                               </div>
                               <p className="text-xs font-black text-brand-navy truncate">{asset.name}</p>
                               <p className="text-[10px] text-slate-400 uppercase font-bold">{asset.source}</p>
                               <div className="grid grid-cols-3 gap-1 mt-3">
                                 <button onClick={() => setMiddlePreviewAsset(asset)} className="py-2 rounded-lg bg-slate-50 text-slate-500 text-[9px] font-black uppercase">Preview</button>
                                 <button onClick={() => insertBlogAsset(asset)} className="py-2 rounded-lg bg-brand-blue text-white text-[9px] font-black uppercase">Pakai</button>
                                 <button onClick={() => deleteBlogAsset(asset.id)} className="py-2 rounded-lg bg-red-50 text-red-500 text-[9px] font-black uppercase">Hapus</button>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                     </div>

                     <div className="rounded-2xl border border-slate-200 p-5">
                       <p className="font-black text-brand-navy mb-1">Pilih Bacaan Lainnya</p>
                       <p className="text-xs text-slate-500 mb-4">Pilih artikel utama untuk rekomendasi. Sistem tetap menampilkan 3 opsi horizontal.</p>
                       <div className="grid md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                         {blogPostDrafts.filter((post) => post.id !== editingBlogPost.id).map((post) => (
                           <button
                             key={post.id}
                             onClick={() => setMiddlePreviewRelatedId(post.id)}
                             className={`text-left rounded-xl border p-3 ${middlePreviewRelatedId === post.id ? 'border-brand-blue bg-blue-50' : 'border-slate-200 bg-white hover:border-brand-blue/40'}`}
                           >
                             <p className="text-[10px] font-black text-brand-blue uppercase mb-1">{post.category}</p>
                             <p className="text-xs font-black text-brand-navy line-clamp-2">{post.title}</p>
                           </button>
                         ))}
                       </div>
                       <div className="flex justify-end mt-4">
                         <button
                           onClick={() => insertBlogContentBlock(`{{related:${middlePreviewRelatedId || blogPostDrafts.find((post) => post.id !== editingBlogPost.id)?.id || 'artikel-terkait'}}}`)}
                           className="btn-primary py-2 px-5 text-xs"
                         >
                           <BookOpen size={16} /> Sisipkan Bacaan
                         </button>
                       </div>
                     </div>
                   </div>

                   <div className="space-y-4">
                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                       <p className="font-black text-brand-navy mb-3">Preview Sisipan</p>
                       <div className="rounded-xl bg-white border border-slate-200 p-3 mb-4">
                         <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Gambar</p>
                         {middlePreviewAsset ? (
                           <>
                             <img src={middlePreviewAsset.url} className="w-full rounded-lg border border-slate-100" alt="" />
                             <p className="text-xs font-black text-brand-navy mt-2">{middlePreviewAsset.name}</p>
                           </>
                         ) : (
                           <p className="text-xs text-slate-400">Pilih gambar untuk preview.</p>
                         )}
                       </div>
                       <div className="rounded-xl bg-white border border-slate-200 p-3">
                         <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Bacaan lainnya</p>
                         <div className="grid grid-cols-3 gap-2">
                           {getBlogRelatedOptions(editingBlogPost, middlePreviewRelatedId).map((post) => (
                             <div key={post.id} className="min-h-[54px] rounded-md bg-slate-50 border border-slate-200 px-2 py-2">
                               <p className="text-[10px] font-black text-brand-navy line-clamp-2">{post.title}</p>
                             </div>
                           ))}
                         </div>
                       </div>
                       <div className="grid grid-cols-2 gap-2 mt-4">
                         <button onClick={() => middlePreviewAsset && insertBlogAsset(middlePreviewAsset)} disabled={!middlePreviewAsset} className="py-2.5 rounded-xl bg-brand-blue text-white text-[10px] font-black uppercase disabled:opacity-40">Sisipkan Gambar</button>
                         <button onClick={() => setIsMiddleInsertOpen(false)} className="py-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase">Selesai</button>
                       </div>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {editingBlogAsset && (
             <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
               >
                 <div className="p-5 bg-brand-navy text-white flex items-center justify-between">
                   <div>
                     <h3 className="font-bold">Edit Aset Editor Blog</h3>
                     <p className="text-xs text-white/60">Ubah nama, URL, tipe, dan catatan aset database.</p>
                   </div>
                   <button onClick={() => setEditingBlogAsset(null)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={18} />
                   </button>
                 </div>
                 <div className="p-6 space-y-4">
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Aset</label>
                     <input value={editingBlogAsset.name} onChange={(e) => setEditingBlogAsset({ ...editingBlogAsset, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tipe</label>
                       <select value={editingBlogAsset.type} onChange={(e) => setEditingBlogAsset({ ...editingBlogAsset, type: e.target.value as BlogEditorAsset['type'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                         <option value="image">Image</option>
                         <option value="document">Document</option>
                       </select>
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Sumber</label>
                       <select value={editingBlogAsset.source} onChange={(e) => setEditingBlogAsset({ ...editingBlogAsset, source: e.target.value as BlogEditorAsset['source'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                         <option value="pc">PC</option>
                         <option value="internet">Internet</option>
                       </select>
                     </div>
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">URL / Data File</label>
                     <textarea value={editingBlogAsset.url} onChange={(e) => setEditingBlogAsset({ ...editingBlogAsset, url: e.target.value })} className="w-full h-24 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs outline-none" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan</label>
                     <input value={editingBlogAsset.note} onChange={(e) => setEditingBlogAsset({ ...editingBlogAsset, note: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                   </div>
                 </div>
                 <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                   <button onClick={() => setEditingBlogAsset(null)} className="px-5 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase">Batal</button>
                   <button
                     onClick={() => {
                       saveBlogEditorAssets(blogEditorAssets.map((asset) => asset.id === editingBlogAsset.id ? editingBlogAsset : asset));
                       setEditingBlogAsset(null);
                       notify('Aset editor berhasil diperbarui.');
                     }}
                     className="btn-primary py-2.5 px-6"
                   >
                     <Save size={16} /> Simpan Aset
                   </button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {previewBlogPost && (
             <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div>
                     <h3 className="font-bold">Preview Draft Info Menarik</h3>
                     <p className="text-xs text-white/60 mt-1">Preview ini hanya simulasi admin. Tidak membuka halaman publik dan tidak mempublish artikel.</p>
                   </div>
                   <button onClick={() => setPreviewBlogPost(null)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="overflow-y-auto p-8">
                   <div className="max-w-3xl mx-auto">
                     <div className="mb-6">
                       <span className="inline-flex px-3 py-1.5 rounded-md bg-brand-blue/10 text-brand-blue text-xs font-black uppercase tracking-widest mb-4">
                         {previewBlogPost.category}
                       </span>
                       <h1 className="text-4xl font-black text-brand-navy leading-tight">{previewBlogPost.title}</h1>
                       <p className="mt-3 text-lg text-slate-600 leading-relaxed">{previewBlogPost.excerpt}</p>
                       <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-bold">
                         <span>{previewBlogPost.author}</span>
                         <span>{previewBlogPost.date}</span>
                         <span>{previewBlogPost.readTime}</span>
                       </div>
                     </div>

                     <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-8">
                       <img src={previewBlogPost.image || BLOG_POSTS[0].image} className="w-full aspect-video object-cover" alt="" />
                     </div>

                     <div className="blog-article text-base leading-7">
                       <Markdown
                         components={{
                           p: ({ children }) => {
                             const text = React.Children.toArray(children).join('').trim();
                             const relatedId = text.match(/^\{\{related:(.+)\}\}$/)?.[1];
                             if (relatedId) {
                               const relatedOptions = getBlogRelatedOptions(previewBlogPost, relatedId);
                               return (
                                 <div className="my-7 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                                   <div className="flex items-center gap-2 mb-2">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue whitespace-nowrap">Bacaan lainnya</span>
                                     <span className="h-px flex-1 bg-slate-200" />
                                   </div>
                                   <div className="grid gap-2 sm:grid-cols-3">
                                     {relatedOptions.map((item) => (
                                       <div key={item.id} className="min-h-[54px] rounded-md bg-white border border-slate-200 px-3 py-2">
                                         <p className="text-xs font-black text-brand-navy leading-snug line-clamp-2 mb-0">{item.title}</p>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               );
                             }
                             return <p>{children}</p>;
                           }
                         }}
                       >
                         {previewBlogPost.content}
                       </Markdown>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         {/* Program Editor Modal */}
         <AnimatePresence>
           {editingProgram && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
                >
                   <div className="p-6 bg-brand-navy text-white flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white/10 rounded-xl">
                            <Award size={20} className="text-brand-blue" />
                         </div>
                         <h3 className="font-bold">Edit Program: {editingProgram.title}</h3>
                      </div>
                      <button onClick={() => { setEditingProgram(null); setProgramPendingSave(null); }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                         <X size={20} />
                      </button>
                   </div>

                   <div className="p-8 overflow-y-auto">
                      <div className="grid md:grid-cols-2 gap-10">
                         {/* Basic Info */}
                         <div className="space-y-6">
                            <h4 className="text-xs font-black text-brand-blue uppercase tracking-widest border-b pb-2">Program Details</h4>
                            
                            <div className="grid grid-cols-2 gap-4">
                               <div className="col-span-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program Title</label>
                                  <input 
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                                    value={editingProgram.title}
                                    onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                                  />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                                  <input 
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                                    value={editingProgram.category}
                                    onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value })}
                                  />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Base Price Display</label>
                                  <input 
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                                    value={editingProgram.price}
                                    onChange={(e) => setEditingProgram({ ...editingProgram, price: e.target.value })}
                                  />
                               </div>
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Short Description</label>
                               <textarea 
                                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm h-20 resize-none"
                                  value={editingProgram.description}
                                  onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                               />
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Long Description / Detail Program</label>
                               <textarea 
                                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm h-28 resize-none"
                                  value={editingProgram.longDescription || ''}
                                  onChange={(e) => setEditingProgram({ ...editingProgram, longDescription: e.target.value })}
                                  placeholder="Deskripsi panjang yang muncul di halaman detail program."
                               />
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Target Audience</label>
                               <input 
                                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-medium"
                                  value={editingProgram.target}
                                  onChange={(e) => setEditingProgram({ ...editingProgram, target: e.target.value })}
                               />
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Schedule Text</label>
                               <input 
                                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-medium"
                                  value={editingProgram.schedule}
                                  onChange={(e) => setEditingProgram({ ...editingProgram, schedule: e.target.value })}
                                  placeholder="e.g. Sen & Rab, 19:00"
                               />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Image URL</label>
                                  <input 
                                     className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs"
                                     value={editingProgram.image}
                                     onChange={(e) => setEditingProgram({ ...editingProgram, image: e.target.value })}
                                  />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Theme Color (Tailwind Class)</label>
                                  <input 
                                     className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs"
                                     value={editingProgram.color}
                                     onChange={(e) => setEditingProgram({ ...editingProgram, color: e.target.value })}
                                     placeholder="bg-blue-600"
                                  />
                               </div>
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Facilities (Comma separated)</label>
                               <textarea 
                                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs h-20"
                                  value={editingProgram.facilities?.join(', ')}
                                  onChange={(e) => setEditingProgram({ ...editingProgram, facilities: e.target.value.split(',').map(f => f.trim()) })}
                               />
                            </div>

                            <div>
                               <div className="flex items-center justify-between mb-3">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Curriculum</label>
                                  <button
                                    type="button"
                                    onClick={() => setEditingProgram({
                                      ...editingProgram,
                                      curriculum: [
                                        ...(editingProgram.curriculum || []),
                                        { week: (editingProgram.curriculum?.length || 0) + 1, topic: 'Topik Baru', description: 'Deskripsi materi.' }
                                      ]
                                    })}
                                    className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline"
                                  >
                                    + Add Week
                                  </button>
                               </div>
                               <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                  {(editingProgram.curriculum || []).map((item, index) => (
                                    <div key={`${item.week}-${index}`} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                      <div className="grid grid-cols-12 gap-2 mb-2">
                                        <input
                                          type="number"
                                          value={item.week}
                                          onChange={(event) => {
                                            const next = [...(editingProgram.curriculum || [])];
                                            next[index] = { ...item, week: Number(event.target.value) || index + 1 };
                                            setEditingProgram({ ...editingProgram, curriculum: next });
                                          }}
                                          className="col-span-2 px-3 py-2 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold"
                                        />
                                        <input
                                          value={item.topic}
                                          onChange={(event) => {
                                            const next = [...(editingProgram.curriculum || [])];
                                            next[index] = { ...item, topic: event.target.value };
                                            setEditingProgram({ ...editingProgram, curriculum: next });
                                          }}
                                          className="col-span-9 px-3 py-2 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold"
                                          placeholder="Topik"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setEditingProgram({ ...editingProgram, curriculum: editingProgram.curriculum?.filter((_, i) => i !== index) || [] })}
                                          className="col-span-1 text-slate-300 hover:text-red-500"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                      <textarea
                                        value={item.description}
                                        onChange={(event) => {
                                          const next = [...(editingProgram.curriculum || [])];
                                          next[index] = { ...item, description: event.target.value };
                                          setEditingProgram({ ...editingProgram, curriculum: next });
                                        }}
                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 outline-none text-xs h-16 resize-none"
                                        placeholder="Deskripsi minggu ini"
                                      />
                                    </div>
                                  ))}
                               </div>
                            </div>
                         </div>

                         {/* Packages Info */}
                         <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-2">
                               <h4 className="text-xs font-black text-brand-orange uppercase tracking-widest">Program Packages</h4>
                               <button 
                                  onClick={() => {
                                     const newPackage: ProgramPackage = {
                                        id: `pkg-${Date.now()}`,
                                        name: 'New Package',
                                        price: 'Rp 0',
                                        duration: '1 Bulan',
                                        features: []
                                     };
                                     setEditingProgram({
                                        ...editingProgram,
                                        packages: [...(editingProgram.packages || []), newPackage]
                                     });
                                  }}
                                  className="flex items-center gap-1 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline"
                               >
                                  <Plus size={14} /> Add Package
                               </button>
                            </div>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                               {editingProgram.packages?.map((pkg, pIdx) => (
                                  <div key={pkg.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 relative group">
                                     <button 
                                        onClick={() => {
                                           const newPkgs = editingProgram.packages?.filter((_, i) => i !== pIdx);
                                           setEditingProgram({ ...editingProgram, packages: newPkgs });
                                        }}
                                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                     >
                                        <Trash2 size={14} />
                                     </button>
                                     
                                     <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div>
                                           <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Package Name</label>
                                           <input 
                                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[11px] font-bold"
                                              value={pkg.name}
                                              onChange={(e) => {
                                                 const newPkgs = [...(editingProgram.packages || [])];
                                                 newPkgs[pIdx] = { ...pkg, name: e.target.value };
                                                 setEditingProgram({ ...editingProgram, packages: newPkgs });
                                              }}
                                           />
                                        </div>
                                        <div>
                                           <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Price</label>
                                           <input 
                                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[11px] font-bold"
                                              value={pkg.price}
                                              onChange={(e) => {
                                                 const newPkgs = [...(editingProgram.packages || [])];
                                                 newPkgs[pIdx] = { ...pkg, price: e.target.value };
                                                 setEditingProgram({ ...editingProgram, packages: newPkgs });
                                              }}
                                           />
                                        </div>
                                        <div>
                                           <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Duration</label>
                                           <input 
                                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[11px] font-bold"
                                              value={pkg.duration}
                                              onChange={(e) => {
                                                 const newPkgs = [...(editingProgram.packages || [])];
                                                 newPkgs[pIdx] = { ...pkg, duration: e.target.value };
                                                 setEditingProgram({ ...editingProgram, packages: newPkgs });
                                              }}
                                           />
                                        </div>
                                        <label className="flex items-center gap-2 mt-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                           <input
                                             type="checkbox"
                                             checked={Boolean(pkg.isPopular)}
                                             onChange={(e) => {
                                                const newPkgs = [...(editingProgram.packages || [])].map((item, index) => (
                                                  index === pIdx ? { ...item, isPopular: e.target.checked } : { ...item, isPopular: false }
                                                ));
                                                setEditingProgram({ ...editingProgram, packages: newPkgs });
                                             }}
                                             className="rounded border-slate-300"
                                           />
                                           Popular
                                        </label>
                                     </div>

                                     <div>
                                        <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Features (Line separated)</label>
                                        <textarea 
                                           className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[10px] h-20"
                                           value={pkg.features.join('\n')}
                                           onChange={(e) => {
                                              const newPkgs = [...(editingProgram.packages || [])];
                                              newPkgs[pIdx] = { ...pkg, features: e.target.value.split('\n').filter(f => f.trim()) };
                                              setEditingProgram({ ...editingProgram, packages: newPkgs });
                                           }}
                                        />
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                      <button 
                         onClick={() => { setEditingProgram(null); setProgramPendingSave(null); }}
                         className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-colors"
                      >
                         Discard
                      </button>
                      <button 
                         onClick={() => setProgramPendingSave(editingProgram)}
                         className="btn-primary py-2.5 px-8 shadow-xl shadow-blue-500/20"
                      >
                         <Save size={18} />
                         Update Program
                      </button>
                   </div>
                </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {programPendingSave && (
             <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
               >
                 <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
                   <Save size={26} />
                 </div>
                 <h3 className="text-xl font-black text-brand-navy mb-2">Simpan Perubahan Program?</h3>
                 <p className="text-sm text-slate-500 leading-relaxed mb-8">
                   Perubahan pada <span className="font-bold text-brand-blue">{programPendingSave.title}</span> akan tersinkron ke menu program, detail program, form pendaftaran, dan pembayaran.
                 </p>
                 <div className="grid grid-cols-2 gap-3">
                   <button
                     type="button"
                     onClick={() => setProgramPendingSave(null)}
                     className="px-6 py-3 rounded-xl border-2 border-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-50"
                   >
                     Tidak
                   </button>
                   <button
                     type="button"
                     onClick={() => saveProgram(programPendingSave)}
                     className="btn-primary py-3 text-xs uppercase tracking-widest font-black"
                   >
                     Ya, Update
                   </button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {financeMetricDetail && (
             <div className="fixed inset-0 z-[135] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Detail Metrik</p>
                     <h3 className="text-xl font-black">{financeMetricDetail.title}</h3>
                     <p className="text-xs text-white/60 mt-1">{financeMetricDetail.description}</p>
                   </div>
                   <button onClick={() => setFinanceMetricDetail(null)} className="p-2 rounded-full hover:bg-white/10">
                     <X size={20} />
                   </button>
                 </div>
                 <div className="overflow-y-auto">
                   <table className="w-full text-left">
                     <thead className="bg-slate-50 sticky top-0">
                       <tr>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama / Item</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program / Kategori</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {financeMetricDetail.rows.map((row, index) => (
                         <tr key={row.id || `${row.student}-${index}`} className="hover:bg-slate-50">
                           <td className="px-6 py-4">
                             <p className="text-sm font-bold text-brand-navy">{row.student || row.name || '-'}</p>
                             <p className="text-[10px] text-slate-400">{row.email || row.invoiceNumber || row.id || ''}</p>
                           </td>
                           <td className="px-6 py-4 text-xs font-bold text-slate-600">{row.program || row.category || '-'}</td>
                           <td className="px-6 py-4 text-sm font-mono font-black text-brand-navy">{typeof row.amount === 'number' ? formatRupiah(row.amount) : row.amount || 'Rp 0'}</td>
                           <td className="px-6 py-4">
                             <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">{row.status || '-'}</span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                   {financeMetricDetail.rows.length === 0 && (
                     <div className="p-10 text-center text-sm font-bold text-slate-400">
                       Belum ada data untuk metrik ini.
                     </div>
                   )}
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {selectedFinanceRecord && (
             <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Detail Calon Siswa</p>
                     <h3 className="text-xl font-black">{selectedFinanceRecord.tx.student}</h3>
                   </div>
                   <button onClick={() => setSelectedFinanceRecord(null)} className="p-2 rounded-full hover:bg-white/10">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="p-8 overflow-y-auto grid lg:grid-cols-2 gap-6">
                   <div className="space-y-5">
                     <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                       <h4 className="font-black text-brand-navy mb-4">Informasi Pendaftaran</h4>
                       {[
                         ['Nama', selectedFinanceRecord.tx.registrationData?.name || selectedFinanceRecord.tx.student],
                         ['Email', selectedFinanceRecord.tx.registrationData?.email || selectedFinanceRecord.tx.email],
                         ['WhatsApp', selectedFinanceRecord.tx.registrationData?.phone || selectedFinanceRecord.tx.phone],
                         ['Sekolah', selectedFinanceRecord.tx.registrationData?.school || '-'],
                         ['Alamat', selectedFinanceRecord.tx.registrationData?.address || '-'],
                         ['Target', selectedFinanceRecord.tx.registrationData?.targetPTN || '-'],
                         ['Alasan Bergabung', selectedFinanceRecord.tx.registrationData?.joinReason || '-']
                       ].map(([label, value]) => (
                         <div key={label} className="flex justify-between gap-4 py-2 border-b border-slate-200/70 last:border-b-0">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                           <span className="text-xs font-bold text-brand-navy text-right">{value || '-'}</span>
                         </div>
                       ))}
                     </div>

                     <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                       <h4 className="font-black text-brand-navy mb-4">Program & Pembayaran</h4>
                       {[
                         ['Program', selectedFinanceRecord.tx.program],
                         ['Paket', selectedFinanceRecord.tx.packageName],
                         ['Nominal', selectedFinanceRecord.tx.amount],
                         ['Metode', selectedFinanceRecord.tx.method || '-'],
                         ['Status', selectedFinanceRecord.tx.status],
                         ['Invoice', selectedFinanceRecord.tx.invoiceNumber || selectedFinanceRecord.tx.id],
                         ['Tanggal', selectedFinanceRecord.tx.date || '-']
                       ].map(([label, value]) => (
                         <div key={label} className="flex justify-between gap-4 py-2 border-b border-blue-100 last:border-b-0">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
                           <span className="text-xs font-bold text-brand-navy text-right">{value || '-'}</span>
                         </div>
                       ))}
                       <button onClick={() => openStoredInvoice(selectedFinanceRecord.tx)} className="w-full mt-4 btn-secondary py-3">
                         <FileText size={18} /> Buka Invoice
                       </button>
                     </div>
                   </div>

                   <div className="space-y-5">
                     <div className="p-5 rounded-2xl bg-white border border-slate-200">
                       <h4 className="font-black text-brand-navy mb-4">Dokumen Lampiran</h4>
                       {selectedFinanceRecord.proof ? (
                         <div className="space-y-4">
                           <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                             <p className="text-sm font-black text-brand-navy">{selectedFinanceRecord.proof.fileName}</p>
                             <p className="text-[10px] text-slate-400 mt-1">{selectedFinanceRecord.proof.type || 'Payment Proof'} - {Math.ceil((selectedFinanceRecord.proof.fileSize || 0) / 1024)} KB</p>
                             <p className="text-[10px] font-bold text-slate-500 mt-2">Status: {selectedFinanceRecord.proof.status || '-'}</p>
                           </div>
                           <button onClick={() => openStoredProof(selectedFinanceRecord.proof)} className="w-full btn-secondary py-3">
                             <Upload size={18} /> Buka Lampiran
                           </button>
                         </div>
                       ) : (String(selectedFinanceRecord.tx.status || '').toLowerCase().includes('scholarship') || String(selectedFinanceRecord.tx.status || '').toLowerCase().includes('free') || String(selectedFinanceRecord.tx.type || '').toLowerCase() === 'free') ? (
                         <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-800">
                           Paket gratis/beasiswa tidak memerlukan upload bukti pembayaran. Review dilakukan dari data pendaftaran.
                         </div>
                       ) : (
                         <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-xs font-bold text-amber-800">
                           Calon siswa belum melampirkan bukti pembayaran/dokumen beasiswa.
                         </div>
                       )}
                     </div>

                     <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                       <h4 className="font-black text-brand-navy mb-4">Aksi Admin</h4>
                       {(selectedFinanceRecord.proof || String(selectedFinanceRecord.tx.status || '').toLowerCase().includes('scholarship') || String(selectedFinanceRecord.tx.status || '').toLowerCase().includes('free') || String(selectedFinanceRecord.tx.type || '').toLowerCase() === 'free') ? (
                         <div className="grid grid-cols-2 gap-3">
                           <button
                             onClick={() => updateFinanceRecordStatus(selectedFinanceRecord.tx.invoiceNumber || selectedFinanceRecord.tx.id, String(selectedFinanceRecord.tx.status).toLowerCase().includes('scholarship') ? 'Scholarship Approved' : 'Payment Approved')}
                             className="py-3 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600"
                           >
                             Approve
                           </button>
                           <button
                             onClick={() => updateFinanceRecordStatus(selectedFinanceRecord.tx.invoiceNumber || selectedFinanceRecord.tx.id, 'Needs Revision')}
                             className="py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600"
                           >
                             Tidak
                           </button>
                         </div>
                       ) : (
                         <p className="text-xs text-slate-500 font-bold leading-relaxed">Approve/tolak tersedia setelah lampiran diterima.</p>
                       )}

                       <div className="grid grid-cols-2 gap-3 mt-4">
                         <button onClick={() => openReviewEmail(selectedFinanceRecord.tx)} className="py-3 rounded-xl bg-white border border-slate-200 text-brand-blue text-xs font-black uppercase tracking-widest">
                           Email Review
                         </button>
                         <button onClick={() => openReviewWhatsapp(selectedFinanceRecord.tx)} className="py-3 rounded-xl bg-white border border-slate-200 text-emerald-600 text-xs font-black uppercase tracking-widest">
                           WhatsApp Review
                         </button>
                       </div>
                       <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                         Gunakan tombol review jika data ditolak atau lampiran belum sesuai. Pesan akan mengarahkan calon siswa untuk memverifikasi ulang data/dokumen.
                       </p>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

          {/* Video Upload Modal */}
          <AnimatePresence>
            {isUploadVideoModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => uploadStatus === 'idle' && setIsUploadVideoModalOpen(false)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
                />
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 pointer-events-auto flex flex-col max-h-[90vh]"
                >
                  <div className="p-8 bg-brand-navy text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                        <Video size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-none mb-1">Upload Video Materi</h3>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">Content Library Management</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => uploadStatus === 'idle' && setIsUploadVideoModalOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-10 overflow-y-auto space-y-8">
                    {uploadStatus === 'idle' ? (
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Video Title</label>
                             <input 
                               value={videoForm.title}
                               onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                               placeholder="e.g. Strategi IRT SNBT 2024"
                               className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all font-medium"
                             />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Associated Program</label>
                             <select 
                               value={videoForm.program}
                               onChange={(e) => setVideoForm({...videoForm, program: e.target.value})}
                               className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all font-bold text-sm"
                             >
                               {PROGRAMS.map(p => <option key={p.id}>{p.title}</option>)}
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Duration (Min:Sec)</label>
                             <input 
                               value={videoForm.duration}
                               onChange={(e) => setVideoForm({...videoForm, duration: e.target.value})}
                               placeholder="e.g. 45:20"
                               className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all font-mono"
                             />
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Video Description</label>
                             <textarea 
                               value={videoForm.description}
                               onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                               placeholder="Jelaskan detail materi pembahasan video ini..."
                               className="w-full h-44 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm font-medium resize-none"
                             />
                           </div>
                        </div>
                        
                        <div className="md:col-span-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Video File</label>
                           <label className="w-full p-10 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-slate-50 hover:border-brand-blue transition-all cursor-pointer group">
                              <div className="p-4 bg-blue-50 text-brand-blue rounded-2xl group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                 <Plus size={32} />
                              </div>
                              <div className="text-center">
                                 <p className="text-sm font-bold text-brand-navy">Choose video or drag and drop</p>
                                 <p className="text-xs text-slate-400 mt-1">MP4, MOV up to 500MB</p>
                              </div>
                              <input type="file" className="hidden" accept="video/*" onChange={simulateVideoUpload} />
                           </label>
                        </div>
                      </div>
                    ) : uploadStatus === 'uploading' ? (
                      <div className="py-20 flex flex-col items-center justify-center text-center gap-8">
                         <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                              <circle 
                                cx="64" cy="64" r="60" 
                                stroke="currentColor" 
                                strokeWidth="8" 
                                fill="transparent" 
                                className="text-slate-100"
                              />
                              <circle 
                                cx="64" cy="64" r="60" 
                                stroke="currentColor" 
                                strokeWidth="8" 
                                fill="transparent" 
                                strokeDasharray={377}
                                strokeDashoffset={377 - (377 * uploadProgress) / 100}
                                className="text-brand-blue transition-all duration-300"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-brand-navy">
                               {uploadProgress}%
                            </div>
                         </div>
                         <div>
                            <h4 className="text-xl font-bold text-brand-navy mb-2">Mengupload Video...</h4>
                            <p className="text-slate-500 font-medium">Harap jangan menutup jendela ini hingga proses selesai.</p>
                         </div>
                      </div>
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-center gap-8 animate-in zoom-in-95 duration-500">
                         <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                            <Check size={48} strokeWidth={4} />
                         </div>
                         <div>
                            <h4 className="text-2xl font-bold text-brand-navy mb-2">Video Berhasil Diupload!</h4>
                            <p className="text-slate-500 font-medium">Materi "{videoForm.title}" telah ditambahkan ke database.</p>
                         </div>
                      </div>
                    )}
                  </div>

                  {uploadStatus === 'idle' && (
                    <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4 shrink-0">
                       <button 
                          onClick={() => setIsUploadVideoModalOpen(false)}
                          className="px-6 py-3 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                       >
                          Cancel
                       </button>
                       <button 
                          disabled={!videoForm.title}
                          onClick={simulateVideoUpload}
                          className="btn-primary py-3 px-10 shadow-xl shadow-blue-500/20 disabled:opacity-50"
                       >
                          Start Upload
                       </button>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
      </main>
    </div>
  );
};
