/**
 * AKSA Learner Navigation Contract
 * ================================
 * B1.1 — App Foundation Structure + Design Contract
 *
 * Authority: docs/aksa/design/02-navigation-information-architecture.md
 *            docs/aksa/design/03-learner-shell.md
 *            docs/aksa/04-route-map.md
 *
 * IA rule: learner navigation groups CAPABILITIES, not individual pages.
 * A capability group (LEARN, PRACTICE, SUPPORT, GROWTH, COMMUNITY) is a
 * first-class entry; its members are nested. This keeps the sidebar
 * scannable as the platform grows.
 *
 * B1.3 status update (routing exists; implementation still does not):
 * - This contract IS now bound to the real router in `src/app/router/` and
 *   rendered by `src/app/layouts/LearnerLayout.tsx`.
 * - `status: 'available'` is therefore used, but ONLY for entries whose path
 *   resolves to a route backed by a real legacy capability that renders today.
 * - `status: 'planned'` is retained for every entry that renders the neutral
 *   `PlannedRoutePage` foundation placeholder. A reserved URL is not a
 *   shipped feature, and marking one 'available' would be a false claim.
 * - Capability values reference the B0 role-permission vocabulary and are
 *   NOT evaluated until identity exists (B2).
 *
 * Route -> status evidence, per entry:
 *   available : /app, /app/learn, /app/assessment, /app/calendar,
 *               /app/profile, /app/wallet  (real legacy surface)
 *   planned   : /app/path, /app/library, /app/labs, /app/projects,
 *               /app/partner-practice, /app/ai, /app/mentors, /app/live,
 *               /app/progress, /app/portfolio, /app/passport, /app/career,
 *               /app/community, /app/rewards, /app/downloads, /app/settings,
 *               /app/help  (placeholder only)
 *   planned   : /app/search, /app/inbox  (header slots, no route in B1.3)
 *
 * `/app/ai` is NOT 'available' even though the path resolves: there is no AI
 * runtime. SEC-P1-01 is open and `src/integrations/ai/` must stay empty until B5.
 */

import type { NavigationConfig } from './navigation.types';

export const learnerNavigation: NavigationConfig = {
  id: 'learner',
  label: 'Learner App',
  basePath: '/app',

  sections: [
    {
      id: 'home',
      label: 'Beranda',
      icon: 'House',
      items: [
        {
          id: 'home',
          label: 'Beranda',
          path: '/app',
          icon: 'House',
          status: 'available',
        },
      ],
    },
    {
      id: 'learn',
      label: 'Learn',
      icon: 'BookOpen',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          id: 'learn.overview',
          label: 'My Path / Skill Map',
          path: '/app/path',
          icon: 'Route',
          status: 'planned',
        },
        {
          id: 'learn.classes',
          label: 'Kelas Saya',
          path: '/app/learn',
          icon: 'GraduationCap',
          status: 'available',
        },
        {
          id: 'learn.library',
          label: 'Library',
          path: '/app/library',
          icon: 'Library',
          status: 'planned',
        },
        {
          id: 'learn.labs',
          label: 'Skills Labs',
          path: '/app/labs',
          icon: 'FlaskConical',
          mobilePriority: 2,
          status: 'planned',
        },
      ],
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: 'Target',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          id: 'practice.projects',
          label: 'Projects',
          path: '/app/projects',
          icon: 'FolderKanban',
          status: 'planned',
        },
        {
          id: 'practice.assessment',
          label: 'Assessment Center',
          path: '/app/assessment',
          icon: 'ClipboardCheck',
          status: 'available',
        },
        {
          id: 'practice.partner',
          label: 'Partner Practice',
          path: '/app/partner-practice',
          icon: 'Users',
          status: 'planned',
        },
      ],
    },
    {
      id: 'support',
      label: 'Support',
      icon: 'LifeBuoy',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          id: 'support.ai-tutor',
          label: 'AI Tutor',
          path: '/app/ai',
          icon: 'Bot',
          mobilePriority: 3,
          status: 'planned',
        },
        {
          id: 'support.mentors',
          label: 'Guru & Mentor',
          path: '/app/mentors',
          icon: 'MessagesSquare',
          status: 'planned',
        },
        {
          id: 'support.live',
          label: 'AKSA Live',
          path: '/app/live',
          icon: 'Video',
          status: 'planned',
        },
      ],
    },
    {
      id: 'growth',
      label: 'Growth',
      icon: 'TrendingUp',
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          id: 'growth.progress',
          label: 'Progress',
          path: '/app/progress',
          icon: 'BarChart3',
          status: 'planned',
        },
        {
          id: 'growth.portfolio',
          label: 'Portfolio',
          path: '/app/portfolio',
          icon: 'Briefcase',
          status: 'planned',
        },
        {
          id: 'growth.passport',
          label: 'Skills Passport',
          path: '/app/passport',
          icon: 'Award',
          status: 'planned',
        },
        {
          id: 'growth.career',
          label: 'Career',
          path: '/app/career',
          icon: 'Compass',
          status: 'planned',
        },
      ],
    },
    {
      id: 'community',
      label: 'Community',
      icon: 'Users',
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          id: 'community.feed',
          label: 'Community',
          path: '/app/community',
          icon: 'Users',
          status: 'planned',
        },
        {
          id: 'community.rewards',
          label: 'Rewards',
          path: '/app/rewards',
          icon: 'Trophy',
          status: 'planned',
        },
      ],
    },
    {
      id: 'utilities',
      label: 'Utilities',
      icon: 'Settings',
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          id: 'utilities.calendar',
          label: 'Calendar',
          path: '/app/calendar',
          icon: 'CalendarDays',
          status: 'available',
        },
        {
          id: 'utilities.wallet',
          label: 'Wallet & Payments',
          path: '/app/wallet',
          icon: 'Wallet',
          status: 'available',
        },
        {
          id: 'utilities.downloads',
          label: 'Downloads',
          path: '/app/downloads',
          icon: 'Download',
          status: 'planned',
        },
        {
          id: 'utilities.settings',
          label: 'Settings',
          path: '/app/settings',
          icon: 'Settings',
          status: 'planned',
        },
        {
          id: 'utilities.help',
          label: 'Help Center',
          path: '/app/help',
          icon: 'CircleHelp',
          status: 'planned',
        },
      ],
    },
  ],

  headerActions: [
    {
      id: 'header.search',
      label: 'Search',
      path: '/app/search',
      icon: 'Search',
      status: 'planned',
    },
    {
      id: 'header.notifications',
      label: 'Notifications',
      path: '/app/inbox',
      icon: 'Bell',
      badge: 0,
      status: 'planned',
    },
    {
      id: 'header.profile',
      label: 'Profile',
      path: '/app/profile',
      icon: 'User',
      mobilePriority: 4,
      status: 'available',
    },
  ],

  mobileBottomNav: [
    {
      id: 'home',
      label: 'Home',
      path: '/app',
      icon: 'House',
      mobilePriority: 0,
      status: 'available',
    },
    {
      id: 'learn.classes',
      label: 'Learn',
      path: '/app/learn',
      icon: 'BookOpen',
      mobilePriority: 1,
      status: 'available',
    },
    {
      id: 'learn.labs',
      label: 'Labs',
      path: '/app/labs',
      icon: 'FlaskConical',
      mobilePriority: 2,
      status: 'planned',
    },
    {
      id: 'support.ai-tutor',
      label: 'AI',
      path: '/app/ai',
      icon: 'Bot',
      mobilePriority: 3,
      status: 'planned',
    },
    {
      id: 'header.profile',
      label: 'Profile',
      path: '/app/profile',
      icon: 'User',
      mobilePriority: 4,
      status: 'available',
    },
  ],
};

export default learnerNavigation;
