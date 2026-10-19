/**
 * Admin Commerce / Programs domain hook
 * =====================================
 * B1.4D-T7A — Commerce Programs extraction (`/admin/commerce/programs`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * The Programs state used to live inline inside `AdminDashboard.tsx`. It now
 * lives here, and the hook is invoked ONCE by the PERSISTENT `AdminDashboard`
 * — never by the route-mounted `AdminProgramsPage` — so an in-progress editor
 * draft survives client-side tab changes exactly as the legacy inline state did.
 *
 * Programs is the CANONICAL source for the editable program list: the same
 * `programsList` feeds the Users domain, the Content Library editor, the Leads
 * domain and the Programs page itself. There is deliberately NO second
 * `programsList` store.
 *
 * Legacy prop bridge preserved (no persistence):
 *   useState<Program[]>(programs) + useEffect(() => setProgramsList(programs), [programs])
 *
 * Narrow injection contract: `programs` / `onProgramsChange` (the legacy prop
 * bridge), `notify` and `recordAudit`. This module never imports
 * `AdminDashboard` (no cycle) and owns no audit/notification infrastructure.
 */

import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Program } from '../../../../types';
import { PROGRAMS } from '../../../../constants';

export interface UseAdminProgramsDomainOptions {
  /** Legacy incoming program list (prop bridge). */
  programs: Program[];
  /** Legacy change callback (prop bridge) — invoked on save/delete/reset. */
  onProgramsChange?: (programs: Program[]) => void;
  notify: (message: string) => void;
  recordAudit: (module: string, action: string, detail: string) => void;
}

export interface UseAdminProgramsDomainResult {
  programsList: Program[];
  programCategories: string[];
  filteredProgramsList: Program[];
  editingProgram: Program | null;
  setEditingProgram: Dispatch<SetStateAction<Program | null>>;
  programPendingSave: Program | null;
  setProgramPendingSave: Dispatch<SetStateAction<Program | null>>;
  programSearchTerm: string;
  programCategoryFilter: string;
  setProgramSearchTerm: (term: string) => void;
  setProgramCategoryFilter: (category: string) => void;
  saveProgram: (updatedProg: Program) => void;
  deleteProgram: (id: string) => void;
  resetProgramsToDefault: () => void;
  /** Contextual "New Program" draft (also used by the legacy contextual add). */
  openContextualProgramDraft: () => void;
}

export function useAdminProgramsDomain({
  programs,
  onProgramsChange,
  notify,
  recordAudit,
}: UseAdminProgramsDomainOptions): UseAdminProgramsDomainResult {
  const [programsList, setProgramsList] = useState<Program[]>(programs);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programPendingSave, setProgramPendingSave] = useState<Program | null>(null);
  const [programSearchTerm, setProgramSearchTerm] = useState('');
  const [programCategoryFilter, setProgramCategoryFilter] = useState('All');

  // Preserved legacy prop re-sync.
  useEffect(() => {
    setProgramsList(programs);
  }, [programs]);

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
    setProgramPendingSave(null);
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

  // T7A: the legacy `runContextualAdd` Programs branch, extracted verbatim.
  const openContextualProgramDraft = () => {
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

  return {
    programsList,
    programCategories,
    filteredProgramsList,
    editingProgram,
    setEditingProgram,
    programPendingSave,
    setProgramPendingSave,
    programSearchTerm,
    programCategoryFilter,
    setProgramSearchTerm,
    setProgramCategoryFilter,
    saveProgram,
    deleteProgram,
    resetProgramsToDefault,
    openContextualProgramDraft,
  };
}
