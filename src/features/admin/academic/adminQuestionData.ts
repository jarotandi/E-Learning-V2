/**
 * Admin Question Bank data
 * =========================
 * B1.4D-T4 — Academic / Question Bank extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/13-b1.4d-t4-academic.md
 *
 * Question Bank seed data and the two blank-draft factories, lifted out of
 * `AdminDashboard`.
 *
 * ## In-memory demo only — NO persistence
 *
 * The Question Bank has never been persisted: `MOCK_QUESTIONS` seeds a plain
 * `useState` and nothing writes it to browser storage. T4 does NOT invent a
 * question storage key; the 13 existing admin keys are unchanged.
 *
 * ## Two create paths are DIFFERENT and both preserved
 *
 *  - the "Add Question" button seeds a FIVE-option draft (A–E);
 *  - the legacy contextual add (`runContextualAdd`) seeds a TWO-option draft
 *    (A–B).
 *
 * They are kept as two explicit factories. T4 must not silently normalise one
 * into the other.
 */

import type { Question } from '../../../types';

/** The five-option subject used by the primary "Add Question" button. */
export const MOCK_QUESTIONS: Question[] = [
  { id: '1', subject: 'Penalaran Umum', difficulty: 'Hard', text: 'Semua X adalah Y...', options: [], correctOptionId: 'A', explanation: '...', program: 'SNBT' },
  { id: '2', subject: 'Penalaran Matematika', difficulty: 'Medium', text: 'Hasil dari 2x + 5...', options: [], correctOptionId: 'B', explanation: '...', program: 'SNBT' },
];

/** Initial tag registry for the Manage Question Categories dialog. */
export const INITIAL_QUESTION_TAGS: string[] = ['IRT', 'SNBT', 'CPNS', 'Kedokteran', 'Matematika'];

/** Draft created by the "Add Question" button (five options A–E). */
export const createBlankQuestionDraft = (): Question => ({
  id: Date.now().toString(),
  subject: 'Penalaran Umum',
  difficulty: 'Medium',
  text: '',
  options: [
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' },
    { id: 'E', text: '' },
  ],
  correctOptionId: 'A',
  explanation: '',
  program: 'SNBT',
  tags: [],
});

/**
 * Draft created by the legacy contextual add (two options A–B).
 *
 * This is intentionally a separate factory: the legacy path really did create a
 * shorter draft, and T4 preserves that difference rather than normalising it.
 */
export const createContextualQuestionDraft = (): Question => ({
  id: Date.now().toString(),
  subject: 'Penalaran Umum',
  difficulty: 'Medium',
  text: '',
  options: [{ id: 'A', text: '' }, { id: 'B', text: '' }],
  correctOptionId: 'A',
  explanation: '',
  program: 'SNBT',
  tags: [],
});

/**
 * The two demo questions the simulated CSV import appends.
 *
 * The import is a demo simulation — there is no CSV parser in the source and
 * T4 does not add one.
 */
export const buildSimulatedImportQuestions = (): Question[] => [
  {
    id: (Date.now() + 1).toString(),
    subject: 'Penalaran Umum',
    difficulty: 'Medium',
    text: 'Hasil import CSV 1...',
    options: [{ id: 'A', text: 'Option A' }, { id: 'B', text: 'Option B' }],
    correctOptionId: 'A',
    explanation: 'Imported explanation',
    program: 'SNBT',
    tags: ['CSV Import'],
  },
  {
    id: (Date.now() + 2).toString(),
    subject: 'Penalaran Matematika',
    difficulty: 'Hard',
    text: 'Hasil import CSV 2...',
    options: [{ id: 'A', text: 'Option A' }, { id: 'B', text: 'Option B' }],
    correctOptionId: 'B',
    explanation: 'Imported explanation 2',
    program: 'SKD',
    tags: ['CSV Import'],
  },
];
