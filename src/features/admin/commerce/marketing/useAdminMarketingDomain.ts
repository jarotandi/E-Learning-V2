/**
 * Admin Commerce / Marketing domain hook
 * =====================================
 * B1.4D-T7B — Commerce Marketing extraction (`/admin/commerce/marketing`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/18-b1.4d-t7b-commerce-marketing.md
 *
 * The Marketing state used to live inline inside `AdminDashboard.tsx`. It now
 * lives here, and the hook is invoked ONCE by the PERSISTENT `AdminDashboard`
 * — never by the route-mounted `AdminMarketingPage` — so an in-progress
 * campaign draft survives client-side tab changes exactly as the legacy inline
 * state did.
 *
 * Campaign state is IN-MEMORY ONLY (no localStorage, no storage key).
 *
 * Narrow injection contract: `notify` and `recordAudit` are passed in. This
 * module never imports `AdminDashboard` (no cycle) and owns no audit/
 * notification infrastructure.
 */

import { useMemo, useState } from 'react';
import {
  currencyOptions,
  defaultCampaignForm,
  parseCurrencyAmount,
  formatCurrencyAmount,
  demoLandingPages,
  objectiveOptions,
  channelOptions,
  type CurrencyOption,
  type CampaignForm,
} from './adminMarketingData';

export interface UseAdminMarketingDomainOptions {
  notify: (message: string) => void;
  recordAudit: (module: string, action: string, detail: string) => void;
}

export interface UseAdminMarketingDomainResult {
  /** Toast adapter (re-exposed for dialog toasts). */
  notify: (message: string) => void;
  /** Canonical campaign form state (single authority, in-memory). */
  campaignForm: CampaignForm;
  setCampaignForm: React.Dispatch<React.SetStateAction<CampaignForm>>;
  /** Campaign editor modal open state. */
  isCampaignEditorOpen: boolean;
  setIsCampaignEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** Currency helpers (exact legacy semantic). */
  currencyOptions: CurrencyOption[];
  parseCurrencyAmount: (value: string | number) => number;
  formatCurrencyAmount: (value: string | number, currencyCode?: string) => string;
  /** Derived budget metrics. */
  campaignTotalBudget: number;
  campaignDailyBudget: number;
  campaignEstimatedDays: number;
  /** Open the campaign editor modal (does NOT reset form). */
  openCampaignEditor: () => void;
  /** Close the campaign editor modal. */
  closeCampaignEditor: () => void;
  /** Save the current campaign draft (audit + toast + close). */
  saveCampaignDraft: () => void;
  /** Landing page "edit" action (legacy notify-only demo). */
  openLandingPageEditor: (name: string) => void;
  /** Demo landing page rows. */
  demoLandingPages: Array<{ name: string; url: string; status: 'Active' | 'Draft'; hits: string }>;
  /** Objective options (verbatim). */
  objectiveOptions: readonly ['Lead Generation', 'Traffic', 'Conversion', 'Brand Awareness', 'Retargeting'];
  /** Channel options (verbatim). */
  channelOptions: readonly ['Meta Ads', 'Google Ads', 'TikTok Ads', 'Instagram Organic', 'WhatsApp Broadcast', 'Email Campaign'];
}

export function useAdminMarketingDomain({
  notify,
  recordAudit,
}: UseAdminMarketingDomainOptions): UseAdminMarketingDomainResult {
  const [isCampaignEditorOpen, setIsCampaignEditorOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState<CampaignForm>(defaultCampaignForm);

  const campaignTotalBudget = useMemo(() => parseCurrencyAmount(campaignForm.totalBudget), [campaignForm.totalBudget]);
  const campaignDailyBudget = useMemo(() => parseCurrencyAmount(campaignForm.dailyBudget), [campaignForm.dailyBudget]);
  const campaignEstimatedDays = useMemo(() =>
    campaignDailyBudget > 0 ? Math.max(1, Math.floor(campaignTotalBudget / campaignDailyBudget)) : 0,
    [campaignTotalBudget, campaignDailyBudget],
  );

  // Opens the editor modal. Does NOT reset the form — preserving the legacy
  // behaviour where a draft survives closing/tab-switching.
  const openCampaignEditor = () => {
    setIsCampaignEditorOpen(true);
  };

  const closeCampaignEditor = () => {
    setIsCampaignEditorOpen(false);
  };

  const saveCampaignDraft = () => {
    recordAudit(
      'Digital Marketing',
      'Create Campaign Draft',
      `${campaignForm.name} - ${formatCurrencyAmount(campaignTotalBudget, campaignForm.currency)}`,
    );
    setIsCampaignEditorOpen(false);
    notify('Campaign baru tersimpan sebagai draft dengan budget fleksibel.');
  };

  const openLandingPageEditor = (name: string) => {
    notify(`Landing page ${name} dibuka di editor.`);
  };

  return {
    notify,
    campaignForm,
    setCampaignForm,
    isCampaignEditorOpen,
    setIsCampaignEditorOpen,
    currencyOptions,
    parseCurrencyAmount,
    formatCurrencyAmount,
    campaignTotalBudget,
    campaignDailyBudget,
    campaignEstimatedDays,
    openCampaignEditor,
    closeCampaignEditor,
    saveCampaignDraft,
    openLandingPageEditor,
    demoLandingPages,
    objectiveOptions,
    channelOptions,
  };
}