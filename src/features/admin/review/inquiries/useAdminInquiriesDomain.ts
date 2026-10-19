/**
 * Admin Review / Inquiries domain hook
 * =====================================
 * B1.4D-T6 — Review / Inquiries extraction (`/admin/review/inquiries`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/16-b1.4d-t6-review.md
 *
 * The Inquiries state used to live inline inside `AdminDashboard.tsx`, ABOVE the
 * conditional `{activeTab === 'inquiries' && (...)}` JSX, so it survived
 * client-side tab changes. T6 moves the canonical store here, and the hook is
 * invoked ONCE by the PERSISTENT `AdminDashboard` — never by the route-mounted
 * `AdminInquiriesPage` — so that behaviour is preserved.
 *
 * Narrow injection contract: `notify`, `recordAudit` and `queueNotification`
 * are passed in. This module never imports `AdminDashboard` (no cycle) and owns
 * no audit/notification infrastructure.
 *
 * Canonical storage key (exact, unchanged): `theprams_demo_website_questions`.
 */

import { useMemo, useState } from 'react';
import type { WebsiteQuestion } from '../../../../types';
import { readStorageArray } from '../../adminStorage';

/** The canonical Review / Inquiries storage key (exact; NOT renamed). */
export const INQUIRIES_STORAGE_KEY = 'theprams_demo_website_questions';

/**
 * The channel union of the monolith's private `NotificationEvent` interface.
 * Re-declared here — structurally identical — so this hook can accept the
 * injected `queueNotification` adapter WITHOUT importing `AdminDashboard`
 * (which would create an import cycle).
 */
export type InquiriesNotificationChannel = 'Email' | 'WhatsApp' | 'System';

export interface UseAdminInquiriesDomainOptions {
  notify: (message: string) => void;
  recordAudit: (module: string, action: string, detail: string) => void;
  queueNotification: (
    channel: InquiriesNotificationChannel,
    recipient: string,
    subject: string,
    message: string,
  ) => void;
}

export interface UseAdminInquiriesDomainResult {
  /** Canonical question list (single authority). */
  websiteQuestions: WebsiteQuestion[];
  /** Derived dashboard metrics (Total / Belum Dibalas / Sudah Dibalas). */
  inquiryStats: {
    total: number;
    unanswered: number;
    answered: number;
  };
  /** Persist the whole list: set state + write the canonical key. */
  saveWebsiteQuestions: (nextQuestions: WebsiteQuestion[]) => void;
  /** Persist an admin answer, queue the WhatsApp outbox event, audit + toast. */
  saveWebsiteQuestionAnswer: (question: WebsiteQuestion, answer: string) => void;
  /** Browser navigation to `wa.me` (no API integration). */
  openQuestionWhatsapp: (question: WebsiteQuestion) => void;
  /** LOCAL storage refresh only — NOT a live backend sync. */
  syncQuestionsFromStorage: () => void;
}

export function useAdminInquiriesDomain({
  notify,
  recordAudit,
  queueNotification,
}: UseAdminInquiriesDomainOptions): UseAdminInquiriesDomainResult {
  // Preserved legacy initial read: an absent key yields [] via the shared reader.
  const [websiteQuestions, setWebsiteQuestions] = useState<WebsiteQuestion[]>(
    () => readStorageArray(INQUIRIES_STORAGE_KEY),
  );

  const saveWebsiteQuestions = (nextQuestions: WebsiteQuestion[]) => {
    setWebsiteQuestions(nextQuestions);
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(nextQuestions));
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

  // T6: the legacy inline "Sync Data" handler, extracted verbatim. It re-reads
  // the canonical localStorage key and re-seeds state. There is NO backend call.
  const syncQuestionsFromStorage = () => {
    const latest = readStorageArray<WebsiteQuestion>(INQUIRIES_STORAGE_KEY);
    setWebsiteQuestions(latest);
    notify('Data pertanyaan website disinkronkan.');
  };

  const inquiryStats = useMemo(() => ({
    total: websiteQuestions.length,
    unanswered: websiteQuestions.filter((q) => q.status === 'Baru').length,
    answered: websiteQuestions.filter((q) => q.status === 'Dibalas').length,
  }), [websiteQuestions]);

  return {
    websiteQuestions,
    inquiryStats,
    saveWebsiteQuestions,
    saveWebsiteQuestionAnswer,
    openQuestionWhatsapp,
    syncQuestionsFromStorage,
  };
}
