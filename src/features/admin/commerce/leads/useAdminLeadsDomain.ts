/**
 * Admin Commerce / Leads domain hook
 * ==================================
 * B1.4D-T7A — Commerce Leads extraction (`/admin/commerce/leads`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * The Leads state used to live inline inside `AdminDashboard.tsx`. It now lives
 * here, and the hook is invoked ONCE by the PERSISTENT `AdminDashboard` — never
 * by the route-mounted `AdminLeadsPage` — so a selected lead, an open form and a
 * conversion dialog survive client-side tab changes exactly as the legacy inline
 * state did.
 *
 * Leads has a DUAL data source, preserved exactly:
 *   - `localLeads`  = persisted leads read from `theprams_demo_leads` each render
 *   - `leadsList`   = in-memory leads (seeded from MOCK_LEADS + demo adds)
 *   - `allLeads`    = `[...localLeads, ...leadsList]`
 *
 * Cross-domain dependencies (injected, never imported):
 *   - `programs` / `users` / `persistUsers` come from the canonical Programs and
 *     Users domains. Lead → Student conversion persists through
 *     `usersDomain.persistUsers` — there is NO second Users store and NO second
 *     UserAccount persistence implementation.
 *
 * Narrow injection contract: `programs`, `users`, `persistUsers`, `notify`,
 * `recordAudit`. `notify` is re-exposed on the result so the detail dialog can
 * keep its legacy toasts without importing this component.
 */

import { useMemo, useState } from 'react';
import type { Lead, Program, UserAccount } from '../../../../types';
import { LEAD_STORAGE_KEY, MOCK_LEADS } from './adminLeadsData';

export interface UseAdminLeadsDomainOptions {
  /** Canonical editable program list (from the Programs domain). */
  programs: Program[];
  /** Canonical users list (from the Users domain). */
  users: UserAccount[];
  /** Canonical users persistence adapter (from the Users domain). */
  persistUsers: (users: UserAccount[]) => void;
  notify: (message: string) => void;
  recordAudit: (module: string, action: string, detail: string) => void;
}

export interface UseAdminLeadsDomainResult {
  /** Toast adapter (re-exposed for the detail dialog's legacy toasts). */
  notify: (message: string) => void;
  /** Canonical editable program list (passthrough of the injected Programs domain list). */
  programsList: Program[];
  leadsList: Lead[];
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  leadPendingConvert: Lead | null;
  setLeadPendingConvert: (lead: Lead | null) => void;
  isLeadFormOpen: boolean;
  setIsLeadFormOpen: (open: boolean) => void;
  leadForm: Omit<Lead, 'id' | 'createdAt'>;
  setLeadForm: (form: Omit<Lead, 'id' | 'createdAt'>) => void;
  leadNoteDraft: string;
  setLeadNoteDraft: (note: string) => void;
  /** Persisted + in-memory leads (local persisted leads first). */
  allLeads: Lead[];
  addDemoLead: () => void;
  openNewLeadForm: () => void;
  saveLeadForm: () => void;
  convertLeadToStudent: (lead: Lead) => void;
  updateLeadStatus: (lead: Lead, status: Lead['status'], note?: string) => void;
  openLeadWhatsapp: (lead: Lead) => void;
}

export function useAdminLeadsDomain({
  programs,
  users,
  persistUsers,
  notify,
  recordAudit,
}: UseAdminLeadsDomainOptions): UseAdminLeadsDomainResult {
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

  // Preserved legacy local read semantics (recomputed every render, like the
  // legacy inline IIFE): `JSON.parse(getItem(KEY) || '[]')` with a `[]` catch.
  const localLeads: Lead[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(LEAD_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  })();

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
      programOfInterest: programs[0]?.title || 'SNBT Kedokteran',
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

  return {
    notify,
    programsList: programs,
    leadsList,
    selectedLead,
    setSelectedLead,
    leadPendingConvert,
    setLeadPendingConvert,
    isLeadFormOpen,
    setIsLeadFormOpen,
    leadForm,
    setLeadForm,
    leadNoteDraft,
    setLeadNoteDraft,
    allLeads,
    addDemoLead,
    openNewLeadForm,
    saveLeadForm,
    convertLeadToStudent,
    updateLeadStatus,
    openLeadWhatsapp,
  };
}
