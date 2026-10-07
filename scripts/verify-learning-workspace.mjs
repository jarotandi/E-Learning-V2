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
  'useLegacyLearnerAccess',
  'LessonAccessResult',
  'DirectoryUser',
];

for (const fn of requiredFunctions) {
  const hasFn = modelContent.includes(fn);
  check(`learningWorkspaceModel.ts exports ${fn}`, hasFn);
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

console.log('\n============================================================');
console.log(`passed: ${passed}`);
console.log(`failed: ${failed}`);
console.log(failed === 0 ? 'B1.4C learning workspace contract: PASS' : 'B1.4C learning workspace contract: FAIL');

if (failed > 0) {
  process.exit(1);
}