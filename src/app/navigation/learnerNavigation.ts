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
 * B1.1 scope note:
 * - Every entry below is `status: 'planned'`. The production router does
 *   not exist yet (B1.2), so these paths are contract targets, not live
 *   routes.
 * - Nothing here is imported by a rendered component in B1.1.
 * - Capability values reference the B0 role-permission vocabulary and are
 *   NOT evaluated until identity exists (B2).
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
          status: 'planned',
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
          status: 'planned',
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
          status: 'planned',
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
          status: 'planned',
        },
        {
          id: 'utilities.wallet',
          label: 'Wallet & Payments',
          path: '/app/wallet',
          icon: 'Wallet',
          status: 'planned',
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
      status: 'planned',
    },
  ],

  mobileBottomNav: [
    {
      id: 'home',
      label: 'Home',
      path: '/app',
      icon: 'House',
      mobilePriority: 0,
      status: 'planned',
    },
    {
      id: 'learn.classes',
      label: 'Learn',
      path: '/app/learn',
      icon: 'BookOpen',
      mobilePriority: 1,
      status: 'planned',
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
      status: 'planned',
    },
  ],
};

export default learnerNavigation;