/**
 * Admin Commerce / Finance types
 * ==============================
 * B1.4D-T8 — Financial Center extraction (`/admin/commerce/finance`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/19-b1.4d-t8-finance.md
 *
 * Finance-owned types moved out of AdminDashboard.tsx. Types for shared
 * audit/notification events remain in AdminDashboard (state ownership stays there).
 */

export interface FinanceEntry {
  id: string;
  type: 'fixed' | 'variable' | 'budget';
  name: string;
  category: string;
  amount: number;
  period: string;
  note: string;
  createdAt: string;
}

export interface FinanceRealization {
  id: string;
  financeEntryId: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  note: string;
  createdAt: string;
}

export interface AssetEntry {
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

/**
 * Payment proof type (from transactions view).
 * Kept here for Finance domain cohesion.
 */
export interface PaymentProof {
  id: string;
  student: string;
  program: string;
  packageName?: string;
  fileName: string;
  fileSize?: number;
  type?: string;
  status?: string;
  invoiceId?: string;
  createdAt?: string;
  fileData?: string; // base64 data URL
}

/**
 * Transaction type (from payments view).
 * Kept here for Finance domain cohesion.
 */
export interface FinanceTransaction {
  id: string;
  student?: string;
  email?: string;
  phone?: string;
  program?: string;
  packageName?: string;
  amount?: number | string;
  status?: string;
  method?: string;
  date?: string;
  createdAt?: string;
  invoiceNumber?: string;
  type?: string;
  registrationData?: {
    school?: string;
  };
}