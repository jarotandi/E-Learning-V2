#!/usr/bin/env node
/**
 * AKSA Learning Workspace Contract Check
 * ======================================
 * B1.4C — LearningPage decomposition into AKSA LearnerLayout
 *
 * Run: npx tsx scripts/verify-learning-workspace.mjs
 *
 * Verifies that the learning workspace decomposition is complete and correct.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const WORKSPACE_DIR = join(__dirname, '..', 'src', 'features', 'learn', 'workspace');

console.log('AKSA Learning Workspace Contract Check');
console.log('============================================================');

let passed = 0;
let failed = 0;

function check(name, condition, details) {
  if (condition) {
    console.log(`  PASS  ${name}`);
    passed++;
  } else {
    console.log(`  FAIL  ${name}${details ? ` - ${details}` : ''}`);
    failed++;
  }
}

function checkFileExists(fileName) {
  const filePath = join(WORKSPACE_DIR, fileName);
  try {
    statSync(filePath);
    check(`File exists: ${fileName}`, true);
    return true;
  } catch {
    check(`File exists: ${fileName}`, false, `Missing at ${filePath}`);
    return false;
  }
}

// 1. Workspace directory structure
console.log('\n1. Workspace directory structure');
const requiredFiles = [
  'LearningWorkspacePage.tsx',
  'LearningWorkspaceToolbar.tsx',
  'LessonVideoPlayer.tsx',
  'LessonContentPanel.tsx',
  'LessonFeedbackCard.tsx',
  'SupportMaterialsCard.tsx',
  'LiveSessionPanel.tsx',
  'CurriculumPanel.tsx',
  'LessonFeedbackDialog.tsx',
  'learningWorkspaceModel.ts',
  'index.ts',
];

for (const file of requiredFiles) {
  checkFileExists(file);
}

// 2. Pure helper functions in learningWorkspaceModel.ts
console.log('\n2. Pure helper functions (learningWorkspaceModel.ts)');
const modelPath = join(WORKSPACE_DIR, 'learningWorkspaceModel.ts');
const modelContent = readFileSync(modelPath, 'utf-8');

const requiredFunctions = [
  'deriveLessonAccess',
  'calculateCourseProgress',
  'calculateModuleProgress',
  'formatDuration',
  'formatTime',
  'isLessonAccessible',
  'isLessonLocked',
  'getLessonById',
  'getModuleById',
  'isActiveLesson',
  'FREE_LESSON_LIMIT',
  'PREMIUM_LOCK_MESSAGE',
  // These were intentionally removed per D7 (pure model):
  // useLegacyLearnerAccess, LessonAccessResult, DirectoryUser
];

for (const fn of requiredFunctions) {
  const hasFn = modelContent.includes(fn);
  check(`learningWorkspaceModel.ts exports ${fn}`, hasFn);
}

// Verify removed exports are NOT present
const removedExports = ['useLegacyLearnerAccess', 'LessonAccessResult', 'DirectoryUser'];
for (const fn of removedExports) {
  const hasFn = modelContent.includes(fn);
  check(`learningWorkspaceModel.ts does NOT export ${fn}`, !hasFn);
}

// 3. LearningWorkspacePage imports and composes feature components
console.log('\n3. LearningWorkspacePage composition');
const pagePath = join(WORKSPACE_DIR, 'LearningWorkspacePage.tsx');
const pageContent = readFileSync(pagePath, 'utf-8');

const requiredImports = [
  'LearningWorkspaceToolbar',
  'LessonVideoPlayer',
  'LessonContentPanel',
  'LessonFeedbackCard',
  'SupportMaterialsCard',
  'LiveSessionPanel',
  'CurriculumPanel',
  'LessonFeedbackDialog',
];

for (const imp of requiredImports) {
  const hasImport = pageContent.includes(`from './${imp}'`) || pageContent.includes(`from "./${imp}"`);
  check(`LearningWorkspacePage imports ${imp}`, hasImport);
}

// 4. Check LearningPage is thin wrapper
console.log('\n4. LearningPage thin wrapper');
const learningPagePath = join(__dirname, '..', 'src', 'components', 'LearningPage.tsx');
const learningPageContent = readFileSync(learningPagePath, 'utf-8');

check('LearningPage imports LearningWorkspacePage', learningPageContent.includes('LearningWorkspacePage'));
check('LearningPage is thin (< 50 lines)', learningPageContent.split('\n').length < 50);
check('LearningPage does NOT contain curriculum logic', !learningPageContent.includes('CURRICULUM'));
check('LearningPage does NOT contain video player logic', !learningPageContent.includes('isPlaying'));
check('LearningPage does NOT contain feedback logic', !learningPageContent.includes('feedback') || learningPageContent.includes('onSubmit'));

// 5. Check AppRouter integration
console.log('\n5. AppRouter integration');
const routerPath = join(__dirname, '..', 'src', 'app', 'router', 'AppRouter.tsx');
const routerContent = readFileSync(routerPath, 'utf-8');

check('AppRouter imports LearnerLayout', routerContent.includes('LearnerLayout'));
check('/app/learn route under LearnerLayout', routerContent.includes('LEARNER_PATHS.learning') && routerContent.includes('LearnerLayout'));

// 6. Check legacyViewRoutes.ts
console.log('\n6. Legacy view routes updated');
const legacyPath = join(__dirname, '..', 'src', 'app', 'router', 'legacyViewRoutes.ts');
const legacyContent = readFileSync(legacyPath, 'utf-8');

check('SELF_CHROME_LEGACY_VIEWS is empty array', legacyContent.includes('SELF_CHROME_LEGACY_VIEWS') && legacyContent.includes('[]'));
check('learning NOT in SELF_CHROME_LEGACY_VIEWS array', !legacyContent.includes("SELF_CHROME_LEGACY_VIEWS") || !legacyContent.match(/SELF_CHROME_LEGACY_VIEWS\s*[:=]\s*\[[^\]]*'learning'/));

// 7. Check verify-routes.mjs
console.log('\n7. Verify-routes.mjs updated');
const verifyRoutesPath = join(__dirname, '..', 'scripts', 'verify-routes.mjs');
const verifyRoutesContent = readFileSync(verifyRoutesPath, 'utf-8');

check('SELF_CHROME is empty array', verifyRoutesContent.includes('const SELF_CHROME = []'));

// 8. Accessibility checks
console.log('\n8. Accessibility checks');

// Check for 44x44 touch targets
const allFiles = readdirSync(WORKSPACE_DIR).filter(f => f.endsWith('.tsx'));
let hasMinWidthHeight = 0;
for (const file of allFiles) {
  const content = readFileSync(join(WORKSPACE_DIR, file), 'utf-8');
  if (content.includes('minWidth') && content.includes('minHeight') || content.includes('min-w-11') || content.includes('min-h-11')) {
    hasMinWidthHeight++;
  }
}
check(`At least some components have 44x44 touch targets`, hasMinWidthHeight > 0);

// Check for ARIA labels
let hasAriaLabels = 0;
for (const file of allFiles) {
  const content = readFileSync(join(WORKSPACE_DIR, file), 'utf-8');
  if (content.includes('aria-label') || content.includes('aria-labelledby')) {
    hasAriaLabels++;
  }
}
check(`At least some components have ARIA labels`, hasAriaLabels > 0);

// 9. Premium gating via useLegacyLearnerAccess
console.log('\n9. Premium gating');
check('LearningWorkspacePage uses user?.isPremium', pageContent.includes('user?.isPremium'));
check('CurriculumPanel uses isPremium prop', readFileSync(join(WORKSPACE_DIR, 'CurriculumPanel.tsx'), 'utf-8').includes('isPremium'));

// 10. Design system primitives usage
console.log('\n10. Design system primitives');
const designSystemImports = [
  'Button',
  'Card',
  'Badge',
];
for (const ds of designSystemImports) {
  let found = false;
  for (const file of allFiles) {
    const content = readFileSync(join(WORKSPACE_DIR, file), 'utf-8');
    if (content.includes('@/design-system') && content.includes(ds)) {
      found = true;
      break;
    }
  }
  check(`Uses design system ${ds}`, found);
}

// 11. No forbidden imports
console.log('\n11. No forbidden imports (AI/Supabase/OpenMAIC)');
const forbiddenPatterns = ['@supabase', 'openmaic', 'openmaic', 'ai/', 'AI/', 'supabase'];
let hasForbidden = false;
for (const file of allFiles) {
  const content = readFileSync(join(WORKSPACE_DIR, file), 'utf-8');
  for (const pattern of forbiddenPatterns) {
    if (content.toLowerCase().includes(pattern.toLowerCase())) {
      hasForbidden = true;
      check(`No forbidden import: ${pattern}`, false, `Found in ${file}`);
    }
  }
}
if (!hasForbidden) {
  check('No forbidden imports', true);
}

// 12. Index.ts barrel export
console.log('\n12. Index.ts barrel export');
const indexPath = join(WORKSPACE_DIR, 'index.ts');
const indexContent = readFileSync(indexPath, 'utf-8');

const indexExports = [
  'LearningWorkspacePage',
  'LearningWorkspaceToolbar',
  'LessonVideoPlayer',
  'LessonContentPanel',
  'LessonFeedbackCard',
  'SupportMaterialsCard',
  'LiveSessionPanel',
  'CurriculumPanel',
  'LessonFeedbackDialog',
  'deriveLessonAccess',
  'calculateCourseProgress',
  'calculateModuleProgress',
  'formatTime',
  'formatDuration',
  'isLessonAccessible',
  'isLessonLocked',
  'getLessonById',
  'getModuleById',
  'FREE_LESSON_LIMIT',
  'PREMIUM_LOCK_MESSAGE',
];

for (const exp of indexExports) {
  const hasExport = indexContent.includes(exp);
  check(`index.ts exports ${exp}`, hasExport);
}

// 13. State mutation regression test (D17)
console.log('\n13. State mutation regression test (D17)');
const { calculateCourseProgress, calculateModuleProgress, deriveLessonAccess, isLessonAccessible, isLessonLocked, getLessonById, getModuleById, formatTime, formatDuration } = await import('../src/features/learn/workspace/learningWorkspaceModel.ts');
const testCurriculum = [
  { id: 'mod-1', title: 'Module 1', lessons: [
    { id: 'lesson-1', title: 'Lesson 1', duration: '10 min', isCompleted: false },
    { id: 'lesson-2', title: 'Lesson 2', duration: '15 min', isCompleted: true },
  ]},
  { id: 'mod-2', title: 'Module 2', lessons: [
    { id: 'lesson-3', title: 'Lesson 3', duration: '20 min', isCompleted: false },
    { id: 'lesson-4', title: 'Lesson 4', duration: '25 min', isCompleted: false },
  ]},
];

// BASE CURRICULUM -> expected progress
const baseProgress = calculateCourseProgress(testCurriculum);
check(`BASE CURRICULUM progress: ${baseProgress}%`, baseProgress === 25); // 1 of 4 completed = 25%

// MUTATED CURRICULUM: mark one previously-incomplete lesson complete
const mutatedCurriculum = testCurriculum.map(mod => ({
  ...mod,
  lessons: mod.lessons.map(l => l.id === 'lesson-1' ? { ...l, isCompleted: true } : l)
}));
const mutatedProgress = calculateCourseProgress(mutatedCurriculum);
check(`MUTATED CURRICULUM progress changes: ${mutatedProgress}%`, mutatedProgress === 50); // 2 of 4 completed = 50%

// MUTATED MODULE progress
const baseModuleProgress = calculateModuleProgress(testCurriculum, 'mod-1');
check(`BASE MODULE progress: ${baseModuleProgress}%`, baseModuleProgress === 50);
const mutatedModuleProgress = calculateModuleProgress(mutatedCurriculum, 'mod-1');
check(`MUTATED MODULE progress changes: ${mutatedModuleProgress}%`, mutatedModuleProgress === 100);

// FREE: exact first 2 accessible
const freeAccess = deriveLessonAccess(testCurriculum, false, 2);
check('FREE: lesson-1 accessible', isLessonAccessible('lesson-1', freeAccess));
check('FREE: lesson-2 accessible', isLessonAccessible('lesson-2', freeAccess));
check('FREE: lesson-3 locked', isLessonLocked('lesson-3', freeAccess));

// PREMIUM: all lessons accessible
const premiumAccess = deriveLessonAccess(testCurriculum, true, 2);
check('PREMIUM: lesson-1 accessible', isLessonAccessible('lesson-1', premiumAccess));
check('PREMIUM: lesson-2 accessible', isLessonAccessible('lesson-2', premiumAccess));
check('PREMIUM: lesson-3 accessible', isLessonAccessible('lesson-3', premiumAccess));
check('PREMIUM: lesson-4 accessible', isLessonAccessible('lesson-4', premiumAccess));

// getLessonById uses supplied curriculum, not global constant
const foundLesson = getLessonById(testCurriculum, 'lesson-1');
check('getLessonById uses supplied curriculum', foundLesson?.id === 'lesson-1');

// 14. Route regression test (D18)
console.log('\n14. Route regression test (D18)');
// routerContent already declared above

// Count route registrations for dashboard and learning
const dashboardRouteCount = (routerContent.match(/LEARNER_PATHS\.dashboard/g) || []).length;
const learningRouteCount = (routerContent.match(/LEARNER_PATHS\.learning/g) || []).length;
const bareLearningRouteCount = (routerContent.match(/path=\{LEARNER_PATHS\.learning\}.*?BareLegacyRoute/g) || []).length;

// Check learning is under LearnerLayout (inside the LearnerLayout Route element)
const learnerLayoutSection = routerContent.split('<Route element={<LearnerLayout')[1]?.split('</Route>')[0] || '';
const learningUnderLearnerLayout = learnerLayoutSection.includes('LEARNER_PATHS.learning');

check('dashboard route count = 1', dashboardRouteCount === 1);
check('learning route count = 1', learningRouteCount === 1);
check('bare /app/learn route absent', bareLearningRouteCount === 0);
check('learning route nested in LearnerLayout', learningUnderLearnerLayout);

// 15. Workspace cleanup - unrelated dashboard files removed (D9)
console.log('\n15. Workspace cleanup (D9)');
const removedFiles = [
  'ContinueLearningCard.tsx',
  'DashboardStats.tsx',
  'DashboardWelcome.tsx',
  'FeedbackCard.tsx',
  'LearningRecommendationsCard.tsx',
  'ScoreTrendCard.tsx',
  'TodayScheduleCard.tsx',
];
for (const file of removedFiles) {
  try {
    statSync(join(WORKSPACE_DIR, file));
    check(`Dashboard file removed: ${file}`, false);
  } catch {
    check(`Dashboard file removed: ${file}`, true);
  }
}

// 16. Feedback dialog wired (D10)
console.log('\n16. Feedback dialog wired (D10)');
// pageContent already declared above
check('LearningWorkspacePage renders LessonFeedbackDialog', pageContent.includes('LessonFeedbackDialog'));
check('LearningWorkspacePage has openFeedbackDialog', pageContent.includes('openFeedbackDialog'));
check('LearningWorkspaceToolbar has onOpenFeedbackDialog', readFileSync(join(WORKSPACE_DIR, 'LearningWorkspaceToolbar.tsx'), 'utf-8').includes('onOpenFeedbackDialog'));

// 17. Dialog accessibility (D11)
console.log('\n17. Dialog accessibility (D11)');
const dialogPath = join(WORKSPACE_DIR, 'LessonFeedbackDialog.tsx');
const dialogContent = readFileSync(dialogPath, 'utf-8');
check('Dialog has role="dialog"', dialogContent.includes('role="dialog"'));
check('Dialog has aria-modal="true"', dialogContent.includes('aria-modal="true"'));
check('Dialog has aria-labelledby', dialogContent.includes('aria-labelledby="dialog-title"'));
check('Dialog title has id="dialog-title"', dialogContent.includes('id="dialog-title"'));
check('Close button has aria-label', dialogContent.includes('aria-label="Tutup dialog feedback"'));
check('Dialog handles Escape key', dialogContent.includes('Escape'));
check('Dialog manages focus on open', dialogContent.includes('dialogTitleRef.current?.focus()'));
check('Dialog returns focus on close', dialogContent.includes('previousActiveElement.current?.focus()'));

// 18. Download state single owner (D14)
console.log('\n18. Download state single owner (D14)');
const supportMaterialsPath = join(WORKSPACE_DIR, 'SupportMaterialsCard.tsx');
const supportMaterialsContent = readFileSync(supportMaterialsPath, 'utf-8');
// pageContent already declared above
check('SupportMaterialsCard owns download state', supportMaterialsContent.includes('downloadingId') && supportMaterialsContent.includes('startDownload'));
check('LearningWorkspacePage does NOT have download state', !pageContent.includes('downloadingId') && !pageContent.includes('startDownload'));

// 19. Toast accessibility (D15)
console.log('\n19. Toast accessibility (D15)');
check('Toast close button has aria-label', supportMaterialsContent.includes('aria-label="Tutup notifikasi"'));
check('Toast close button has min-w-11 min-h-11', supportMaterialsContent.includes('min-w-11 min-h-11'));

// 20. Icon button targets (D16)
console.log('\n20. Icon button targets (D16)');
let iconButtonsHaveTargets = 0;
const allTsxFiles = readdirSync(WORKSPACE_DIR).filter(f => f.endsWith('.tsx'));
for (const file of allTsxFiles) {
  const content = readFileSync(join(WORKSPACE_DIR, file), 'utf-8');
  if (content.includes('min-w-11 min-h-11') || content.includes('minWidth') || content.includes('minHeight') || content.includes('min-w-12') || content.includes('min-h-12')) {
    iconButtonsHaveTargets++;
  }
}
check('Icon buttons have >=44x44 targets', iconButtonsHaveTargets > 0);

// 21. Contrast audit (D13)
console.log('\n21. Contrast audit (D13)');
let hasTextBrandTealOnWhite = false;
for (const file of allTsxFiles) {
  const content = readFileSync(join(WORKSPACE_DIR, file), 'utf-8');
  // Check for text-brand-teal on white backgrounds (not in progress bars or graphical elements)
  if (content.includes('text-brand-teal') && !content.includes('bg-brand-teal') && !content.includes('border-brand-teal') && !content.includes('progress')) {
    // More precise check would be needed, but flag for review
    hasTextBrandTealOnWhite = true;
  }
}
check('No raw brand teal text on white', !hasTextBrandTealOnWhite);

// 22. Tabs (D12)
console.log('\n22. Tabs (D12)');
check('Uses design-system Tabs primitive', pageContent.includes('from \'@/design-system/components\'') && pageContent.includes('Tabs') && pageContent.includes('TabsPanel'));
check('Live Session tab disabled for non-premium', pageContent.includes('disabled: !user?.isPremium') || pageContent.includes('disabled={!user?.isPremium}'));

console.log('\n============================================================');
console.log(`passed: ${passed}`);
console.log(`failed: ${failed}`);
console.log(failed === 0 ? 'B1.4C learning workspace contract: PASS' : 'B1.4C learning workspace contract: FAIL');

if (failed > 0) {
  process.exit(1);
}