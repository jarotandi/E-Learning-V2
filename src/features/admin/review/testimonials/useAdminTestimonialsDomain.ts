/**
 * Admin Review / Testimonials domain hook
 * =======================================
 * B1.4D-T6 — Review / Testimonials extraction (`/admin/review/testimonials`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/16-b1.4d-t6-review.md
 *
 * The testimonials list + moderation filter used to live inline inside
 * `AdminDashboard.tsx`, ABOVE the conditional `{activeTab === 'testimonials' &&
 * (...)}` JSX. T6 moves the canonical store here, and the hook is invoked ONCE
 * by the PERSISTENT `AdminDashboard` — never by the route-mounted
 * `AdminTestimonialsPage` — so a filter selection survives client-side tab
 * changes, exactly as the legacy monolith behaved.
 *
 * Testimonials are IN-MEMORY ONLY (seeded from the `TESTIMONIALS` constant).
 * T6 deliberately adds NO persistence and NO storage key for them.
 *
 * Narrow injection contract: only `notify` is injected. The hook never imports
 * `AdminDashboard` (no cycle) and owns no audit/notification infrastructure.
 */

import { useMemo, useState } from 'react';
import type { Testimonial } from '../../../../types';
import { TESTIMONIALS } from '../../../../constants';

/**
 * The EXACT legacy moderation filter union. The UI exposes All / Pending /
 * Approved only — there is deliberately NO Rejected tab (do not add one).
 */
export type TestimonialFilter = 'All' | 'Pending' | 'Approved';

export interface UseAdminTestimonialsDomainOptions {
  notify: (message: string) => void;
}

export interface UseAdminTestimonialsDomainResult {
  /** Canonical testimonials list (single authority, in-memory). */
  testimonials: Testimonial[];
  testimonialFilter: TestimonialFilter;
  setTestimonialFilter: (filter: TestimonialFilter) => void;
  pendingTestimonials: Testimonial[];
  approvedTestimonials: Testimonial[];
  rejectedTestimonials: Testimonial[];
  /** Filtered list actually rendered (All => every testimonial). */
  visibleTestimonials: Testimonial[];
  updateTestimonialStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  deleteTestimonial: (id: string) => void;
}

export function useAdminTestimonialsDomain({
  notify,
}: UseAdminTestimonialsDomainOptions): UseAdminTestimonialsDomainResult {
  // Preserved legacy initial state: seeded EXACTLY from the TESTIMONIALS constant.
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [testimonialFilter, setTestimonialFilter] = useState<TestimonialFilter>('All');

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

  // T6: the legacy inline delete mutation, extracted verbatim (filter by id +
  // toast). No confirmation was invented and no persistence is added.
  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((item) => item.id !== id));
    notify('Testimoni dihapus.');
  };

  return {
    testimonials,
    testimonialFilter,
    setTestimonialFilter,
    pendingTestimonials,
    approvedTestimonials,
    rejectedTestimonials,
    visibleTestimonials,
    updateTestimonialStatus,
    deleteTestimonial,
  };
}
