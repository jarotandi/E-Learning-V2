/**
 * AKSA Studio Navigation Contract
 * ===============================
 * B1.1 — App Foundation Structure + Design Contract
 *
 * Authority: docs/aksa/design/02-navigation-information-architecture.md
 *            docs/aksa/design/04-studio-shell.md
 *            docs/aksa/design/05-validation-ui.md
 *            docs/aksa/04-route-map.md
 *
 * IA rule: Creator AI is NOT a standalone primary navigation item.
 * Per docs/aksa/07-ai-integration-boundary.md, Creator AI is a copilot
 * that lives INSIDE Studio — reachable from the Editor right panel and
 * from Content Factory. This contract therefore has no top-level
 * "AI Creator" entry. Adding one later requires architect approval.
 *
 * B1.3 status update (routing exists; implementation still does not):
 * - This contract IS now bound to the real router in `src/app/router/` and
 *   rendered by `src/app/layouts/StudioLayout.tsx`.
 * - EVERY entry below remains `status: 'planned'` after B1.3, and that is the
 *   correct value. Each Studio route renders the neutral `PlannedRoutePage`
 *   foundation placeholder. Not one of them performs authoring, AI generation,
 *   validation, review, publishing, or analytics.
 * - A resolving URL is not a shipped feature, so none of these may be marked
 *   'available' before the corresponding B4/B5/B6 work lands.
 * - Capability values reference the B0 role-permission vocabulary and are
 *   NOT evaluated until identity exists (B2). The 'Izin' badge in the Studio
 *   sidebar displays declared metadata only; it enforces nothing.
 */

import type { NavigationConfig } from './navigation.types';

export const studioNavigation: NavigationConfig = {
  id: 'studio',
  label: 'AKSA Studio',
  basePath: '/studio',

  sections: [
    {
      id: 'studio-home',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      items: [
        {
          id: 'studio.dashboard',
          label: 'Dashboard',
          path: '/studio',
          icon: 'LayoutDashboard',
          status: 'planned',
        },
      ],
    },
    {
      id: 'studio-editor',
      label: 'Editor',
      icon: 'PenTool',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          id: 'studio.editor',
          label: 'Studio / Editor',
          path: '/studio/editor',
          icon: 'PenTool',
          requiredCapabilities: ['content.create_draft'],
          status: 'planned',
        },
        {
          id: 'studio.templates',
          label: 'Templates',
          path: '/studio/templates',
          icon: 'LayoutTemplate',
          status: 'planned',
        },
        {
          id: 'studio.media',
          label: 'Media Library',
          path: '/studio/media',
          icon: 'Image',
          status: 'planned',
        },
      ],
    },
    {
      id: 'studio-factory',
      label: 'Content Factory',
      icon: 'Factory',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          id: 'studio.factory',
          label: 'Content Factory',
          path: '/studio/factory',
          icon: 'Factory',
          requiredCapabilities: ['content.create_draft'],
          status: 'planned',
        },
      ],
    },
    {
      id: 'studio-governance',
      label: 'Validation & Review',
      icon: 'ShieldCheck',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          id: 'studio.validation',
          label: 'Validation Center',
          path: '/studio/validation',
          icon: 'ShieldCheck',
          requiredCapabilities: ['validation.view'],
          status: 'planned',
        },
        {
          id: 'studio.review',
          label: 'Review Queue',
          path: '/studio/review',
          icon: 'ListChecks',
          requiredCapabilities: ['review.claim'],
          status: 'planned',
        },
        {
          id: 'studio.published',
          label: 'Published Content',
          path: '/studio/published',
          icon: 'BadgeCheck',
          status: 'planned',
        },
      ],
    },
    {
      id: 'studio-insights',
      label: 'Insights',
      icon: 'BarChart3',
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          id: 'studio.analytics',
          label: 'Analytics',
          path: '/studio/analytics',
          icon: 'BarChart3',
          status: 'planned',
        },
      ],
    },
    {
      id: 'studio-settings',
      label: 'Settings',
      icon: 'Settings',
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          id: 'studio.settings',
          label: 'Settings',
          path: '/studio/settings',
          icon: 'Settings',
          status: 'planned',
        },
      ],
    },
  ],

  headerActions: [
    {
      id: 'studio-header.breadcrumbs',
      label: 'Breadcrumbs',
      icon: 'ChevronsRight',
      status: 'planned',
    },
    {
      id: 'studio-header.quick-actions',
      label: 'Quick Actions',
      icon: 'Plus',
      status: 'planned',
    },
    {
      id: 'studio-header.notifications',
      label: 'Notifications',
      path: '/studio/inbox',
      icon: 'Bell',
      badge: 0,
      status: 'planned',
    },
    {
      id: 'studio-header.profile',
      label: 'Profile',
      path: '/studio/profile',
      icon: 'User',
      status: 'planned',
    },
  ],

  /**
   * Studio has no mobile bottom bar in the approved design — it is a
   * desktop-first authoring surface. The field is present (empty) so the
   * shared `NavigationConfig` contract stays uniform across surfaces.
   */
  mobileBottomNav: [],
};

export default studioNavigation;