/**
 * Admin Question Bank Page
 * =========================
 * B1.4D-T4 — Academic / Question Bank extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/13-b1.4d-t4-academic.md
 *
 * The complete `activeTab === 'questions'` business surface, extracted out of
 * `AdminDashboard`. This page is pure presentation over the questions-domain
 * surface passed in as props:
 *
 *   - it owns NO question state (the hook in `AdminDashboard` does), so a
 *     transient draft survives tab navigation;
 *   - the "Add / Edit Question" editor, the "Manage Question Categories" dialog
 *     and the "Batch Question Import" dialog are extracted dialogs.
 *
 * ## Search / subject filter are presentational (demo) — preserved as-is
 *
 * The legacy toolbar had an uncontrolled search box and an uncontrolled subject
 * `<select>`, and neither filtered the table. T4 preserves that exactly: B1.4D
 * is decomposition, not feature expansion. No filtering logic was invented.
 *
 * ## Route
 *
 * Still `/admin/academic/questions`. No new route.
 */

import { Copy, Edit2, FileUp, Filter, Plus, Search, Tags, Trash2 } from 'lucide-react';

import { Button, IconButton } from '../../../design-system/components';
import { AdminQuestionEditorDialog } from './AdminQuestionEditorDialog';
import { AdminQuestionImportDialog } from './AdminQuestionImportDialog';
import { AdminQuestionTagsDialog } from './AdminQuestionTagsDialog';
import type { UseAdminQuestionsDomainResult } from './useAdminQuestionsDomain';

export interface AdminQuestionBankPageProps {
  /** The canonical Question Bank domain surface owned by `AdminDashboard`. */
  domain: UseAdminQuestionsDomainResult;
  /** Download the CSV import template via the business helper. */
  onDownloadTemplate: () => void;
}

export function AdminQuestionBankPage({ domain, onDownloadTemplate }: AdminQuestionBankPageProps) {
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Question Bank Central</h2>
          <p className="text-sm text-slate-500">Manage {domain.questions.length} indexed questions for all tryouts</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Search size={18} className="text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Filter questions..."
              className="text-sm bg-transparent border-none focus:ring-0 font-medium text-slate-600 w-32 md:w-auto"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Filter size={18} className="text-slate-400" aria-hidden="true" />
            <select className="text-sm bg-transparent border-none focus:ring-0 font-medium text-slate-600">
              <option>All Subjects</option>
              <option>Penalaran Umum</option>
              <option>Penalaran Matematika</option>
            </select>
          </div>
          <Button variant="primary" onClick={domain.openNewQuestion}>
            <Plus size={18} aria-hidden="true" />
            Add Question
          </Button>
          <Button variant="secondary" onClick={() => domain.setIsImportModalOpen(true)}>
            <FileUp size={18} aria-hidden="true" />
            Batch Import
          </Button>
          <Button variant="secondary" onClick={() => domain.setIsManageTagsModalOpen(true)}>
            <Tags size={18} aria-hidden="true" />
            Manage Tags
          </Button>
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Question Preview</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Metadata</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Tags</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Difficulty</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {domain.questions.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-5 px-6">
                  <p className="text-sm font-medium text-brand-navy line-clamp-1 max-w-lg">{q.text || <span className="italic text-slate-300">(No text)</span>}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">Ans: {q.correctOptionId}</span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{q.program}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-slate-600 tracking-tight">{q.subject}</p>
                  <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">ID: {q.id}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 justify-center max-w-[150px]">
                    {q.tags?.map((tag, i) => (
                      <span key={i} className="text-[8px] font-black text-emerald-700 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                        {tag}
                      </span>
                    )) || <span className="text-[8px] text-slate-400 font-bold uppercase">-</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                    q.difficulty === 'Hard' ? 'bg-red-50 text-red-700' :
                    q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {q.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <IconButton
                      variant="ghost"
                      aria-label={`Duplikasi soal ${q.id}`}
                      icon={<Copy size={16} />}
                      onClick={() => domain.duplicateQuestion(q)}
                    />
                    <IconButton
                      variant="ghost"
                      aria-label={`Edit soal ${q.id}`}
                      icon={<Edit2 size={16} />}
                      onClick={() => domain.setEditingQuestion(q)}
                    />
                    <IconButton
                      variant="danger"
                      aria-label={`Hapus soal ${q.id}`}
                      icon={<Trash2 size={16} />}
                      onClick={() => domain.deleteQuestion(q.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminQuestionEditorDialog
        question={domain.editingQuestion}
        availableTags={domain.availableTags}
        onChange={domain.setEditingQuestion}
        onToggleTag={domain.toggleQuestionTag}
        onAddAndToggleTag={domain.addAndToggleTag}
        onClose={() => domain.setEditingQuestion(null)}
        onSave={domain.saveQuestion}
      />

      <AdminQuestionTagsDialog
        isOpen={domain.isManageTagsModalOpen}
        newTagInput={domain.newTagInput}
        availableTags={domain.availableTags}
        onNewTagInputChange={domain.setNewTagInput}
        onAddTag={domain.addTag}
        onRemoveTag={domain.removeTag}
        onClose={() => domain.setIsManageTagsModalOpen(false)}
      />

      <AdminQuestionImportDialog
        isOpen={domain.isImportModalOpen}
        importStatus={domain.importStatus}
        onFileChange={domain.handleCsvImport}
        onDownloadTemplate={onDownloadTemplate}
        onClose={() => domain.setIsImportModalOpen(false)}
      />
    </div>
  );
}

export default AdminQuestionBankPage;
