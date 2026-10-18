/**
 * Admin Questions domain hook
 * ============================
 * B1.4D-T4 — Academic / Question Bank extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/13-b1.4d-t4-academic.md
 *
 * ## Why a hook, not a route-mounted page
 *
 * The legacy `AdminDashboard` kept the Question Bank state ABOVE the
 * conditional `activeTab === 'questions'` JSX, so a transient draft survived
 * tab changes. Moving the state into a page that only mounts for
 * `/admin/academic/questions` would silently lose that behaviour. The hook is
 * therefore invoked ONCE by the PERSISTENT `AdminDashboard`, and
 * `AdminQuestionBankPage` + the dialogs receive the surface as props.
 *
 * ## Inject, do not import
 *
 * The only external dependency is `notify` (the toast adapter, which stays
 * owned by `AdminDashboard`). The Question Bank does not touch finance, users,
 * programs or the Studio (T5) video state.
 *
 * ## In-memory demo only
 *
 * No persistence is invented. No new storage key.
 */

import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';

import type { Question } from '../../../types';
import {
  INITIAL_QUESTION_TAGS,
  MOCK_QUESTIONS,
  buildSimulatedImportQuestions,
  createBlankQuestionDraft,
  createContextualQuestionDraft,
} from './adminQuestionData';

export type QuestionImportStatus = 'idle' | 'processing' | 'done';

/* ------------------------------------------------------------------ */
/* Injection contract                                                  */
/* ------------------------------------------------------------------ */

export interface UseAdminQuestionsDomainOptions {
  /** Toast adapter (stays owned by AdminDashboard). */
  notify: (message: string) => void;
}

/* ------------------------------------------------------------------ */
/* Public surface                                                      */
/* ------------------------------------------------------------------ */

export interface UseAdminQuestionsDomainResult {
  questions: Question[];
  editingQuestion: Question | null;
  availableTags: string[];
  isImportModalOpen: boolean;
  isManageTagsModalOpen: boolean;
  newTagInput: string;
  importStatus: QuestionImportStatus;

  setEditingQuestion: Dispatch<SetStateAction<Question | null>>;
  setNewTagInput: Dispatch<SetStateAction<string>>;
  setIsImportModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsManageTagsModalOpen: Dispatch<SetStateAction<boolean>>;

  /** "Add Question" button — five-option draft (A–E). */
  openNewQuestion: () => void;
  /** Legacy contextual add — two-option draft (A–B). */
  openContextualQuestionDraft: () => void;
  duplicateQuestion: (question: Question) => void;
  saveQuestion: (question: Question) => void;
  deleteQuestion: (id: string) => void;
  handleCsvImport: (event: ChangeEvent<HTMLInputElement>) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  toggleQuestionTag: (tag: string) => void;
  /** Editor "new tag" Enter: register the tag if absent, then toggle it on. */
  addAndToggleTag: (tag: string) => void;
}

export function useAdminQuestionsDomain({
  notify,
}: UseAdminQuestionsDomainOptions): UseAdminQuestionsDomainResult {
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>(INITIAL_QUESTION_TAGS);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isManageTagsModalOpen, setIsManageTagsModalOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [importStatus, setImportStatus] = useState<QuestionImportStatus>('idle');

  const openNewQuestion = () => {
    setEditingQuestion(createBlankQuestionDraft());
  };

  const openContextualQuestionDraft = () => {
    setEditingQuestion(createContextualQuestionDraft());
  };

  const duplicateQuestion = (q: Question) => {
    const newQuestion: Question = {
      ...q,
      id: Date.now().toString(),
      text: `${q.text} (Copy)`,
    };
    setQuestions([newQuestion, ...questions]);
    notify('Soal berhasil diduplikasi.');
  };

  const saveQuestion = (updatedQ: Question) => {
    if (questions.find((q) => q.id === updatedQ.id)) {
      setQuestions(questions.map((q) => (q.id === updatedQ.id ? updatedQ : q)));
    } else {
      setQuestions([updatedQ, ...questions]);
    }
    setEditingQuestion(null);
    notify('Soal berhasil disimpan.');
  };

  const deleteQuestion = (id: string) => {
    if (confirm('Delete this question?')) {
      setQuestions(questions.filter((q) => q.id !== id));
      notify('Soal berhasil dihapus.');
    }
  };

  const handleCsvImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('processing');

    // Simulate parsing — the source has no CSV parser; T4 preserves the demo.
    setTimeout(() => {
      const newQuestions: Question[] = buildSimulatedImportQuestions();

      setQuestions([...newQuestions, ...questions]);
      setImportStatus('done');
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStatus('idle');
      }, 1500);
    }, 2000);
  };

  const addTag = (tag: string) => {
    if (!availableTags.includes(tag)) {
      setAvailableTags([...availableTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setAvailableTags(availableTags.filter((t) => t !== tag));
  };

  const toggleQuestionTag = (tag: string) => {
    if (!editingQuestion) return;
    const currentTags = editingQuestion.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    setEditingQuestion({ ...editingQuestion, tags: newTags });
  };

  const addAndToggleTag = (tag: string) => {
    addTag(tag);
    toggleQuestionTag(tag);
  };

  return {
    questions,
    editingQuestion,
    availableTags,
    isImportModalOpen,
    isManageTagsModalOpen,
    newTagInput,
    importStatus,
    setEditingQuestion,
    setNewTagInput,
    setIsImportModalOpen,
    setIsManageTagsModalOpen,
    openNewQuestion,
    openContextualQuestionDraft,
    duplicateQuestion,
    saveQuestion,
    deleteQuestion,
    handleCsvImport,
    addTag,
    removeTag,
    toggleQuestionTag,
    addAndToggleTag,
  };
}

export default useAdminQuestionsDomain;
