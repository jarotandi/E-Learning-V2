/**
 * Admin Navigation Registry
 * =========================
 * B1.4D-T2 — Admin shell ownership migration
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/11-b1.4d-t2-admin-shell.md
 *
 * Navigation metadata is kept SEPARATE from the pure routing model
 * (`adminWorkspaceModel.ts`) so the routing contract stays a small, pure
 * tab/path/domain/role module and the UI-facing labels/icons live here.
 *
 * The visible order and labels are preserved EXACTLY from the legacy
 * `AdminDashboard` sidebar. There is no 14th capability and no removed
 * capability. Icons remain Lucide icons, as in the legacy sidebar.
 */

import {
  Award,
  Banknote,
  BookOpen,
  Globe,
  LineChart,
  Megaphone,
  MessageSquare,
  PieChart,
  Settings,
  Users,
  UserPlus,
  Video,
  type LucideIcon,
} from 'lucide-react';

import type { AdminTab } from './adminWorkspaceModel';

export interface AdminNavItem {
  tab: AdminTab;
  label: string;
  icon: LucideIcon;
}

/**
 * The 13 admin navigation items, in the legacy visible order.
 *
 * Order preserved from `AdminDashboard.tsx` sidebar:
 *   overview, leads, inquiries, users, programs, content, marketing,
 *   website, finance, questions, testimonials, reports, settings
 */
export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { tab: 'overview', label: 'Dashboard', icon: PieChart },
  { tab: 'leads', label: 'Manage Leads', icon: UserPlus },
  { tab: 'inquiries', label: 'Pertanyaan Website', icon: MessageSquare },
  { tab: 'users', label: 'User & Roles', icon: Users },
  { tab: 'programs', label: 'Programs', icon: Award },
  { tab: 'content', label: 'Content Library', icon: Video },
  { tab: 'marketing', label: 'Digital Marketing', icon: Megaphone },
  { tab: 'website', label: 'Website Editor', icon: Globe },
  { tab: 'finance', label: 'Financial Center', icon: Banknote },
  { tab: 'questions', label: 'Question Bank', icon: BookOpen },
  { tab: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { tab: 'reports', label: 'Deep Analytics', icon: LineChart },
  { tab: 'settings', label: 'Settings', icon: Settings },
] as const;

/** Total legacy navigation capability count. */
export const ADMIN_NAV_COUNT = ADMIN_NAV_ITEMS.length;

/**
 * Label for a given tab, or a fallback. Used for the shell header section
 * title and mobile drawer.
 */
export function adminTabLabel(tab: AdminTab): string {
  return ADMIN_NAV_ITEMS.find((item) => item.tab === tab)?.label ?? tab;
}
