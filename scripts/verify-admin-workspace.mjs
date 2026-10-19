/**
 * B1.4D admin workspace verification script
 * (T1 + T2 + T3 + T4 + T5A + T5B + T6).
 *
 * Usage:
 *   node scripts/verify-admin-workspace.mjs
 *
 * WHAT THIS PROVES
 * ----------------
 * This is a DETERMINISTIC CONTRACT CHECK, not a browser test. It exercises the
 * REAL pure model (`src/features/admin/shell/adminWorkspaceModel.ts`) and the
 * REAL route tree, and asserts the contract B1.4D-T1/T2/T3/T4 is required to
 * satisfy:
 *
 *   A. Tab registry:  exactly 13 unique tabs.
 *   B. Domain registry: exactly 8 domains, every tab owned exactly once.
 *   C. Route mapping: all 13 tabs <-> canonical paths, round-trip stable.
 *   D. Role parity: Super Admin / Content Manager / Support exact.
 *   E. Router: ONE persistent `/admin/*` wildcard branch, not 13 routes.
 *   F. Legacy view: all canonical admin paths derive view `admin`, 21 Views.
 *   G. Invalid paths are NOT known admin paths.
 *   H. Legacy AdminDashboard still receives its exact six props.
 *   I. Transient-state SOURCE CONTRACT: no `key={pathname}` on the admin path.
 *   J. localStorage key registry: all 13 keys discoverable across the admin tree.
 *   K. Security deferrals: SEC-P1-03 remains OPEN (B2).
 *   L. (T2) AdminLayout owns the admin shell chrome.
 *   M. (T2) AdminDashboard is business content only (shell removed).
 *   N. (T2) AdminShellContext owns adminRole (no local role state).
 *   O. (T2) Disallowed direct URL -> UI presentation redirect (replace).
 *   P. (T2) Mobile navigation source contract (SOURCE CONTRACT only).
 *   Q. (T2) Migrated shell contrast (no white on brand-blue/orange).
 *   R. (T2) Legacy contract preservation.
 *   S. (T3) Platform/Overview extracted to AdminOverviewPage + data module.
 *   T. (T3) Users extracted to AdminUsersPage + domain hook + dialog.
 *   U. (T3) Single users store (no duplicate state in the monolith).
 *   V. (T3) Cross-domain consumers (Finance / Leads / contextual add) share it.
 *   W. (T3) Search relocated from the shared toolbar into the Users page.
 *   X. (T3) Accessibility SOURCE CONTRACT for the migrated Users surface.
 *   Y. (T3) Security deferrals + routing no-regression.
 *   Z. (T4) Academic/Question Bank modules + composition wiring.
 *  AA. (T4) Single question store (no duplicate state in the monolith).
 *  AB. (T4) Composition + old Question Bank JSX removed from the monolith.
 *  AC. (T4) Contextual add uses the canonical questions domain.
 *  AD. (T5A) Content Library state moved out of the monolith (supersedes the
 *      T4 Studio guard, which was the pre-T5A freeze).
 *  AE. (T4) Question behaviour: source contract + EXECUTED draft factories.
 *  AF. (T4) Accessibility SOURCE CONTRACT for the migrated Academic surface.
 *  AG. (T4) Security + storage: no new question key.
 *  AH. (T5A) Content Library modules + composition wiring.
 *  AI. (T5A) Single content authority (no duplicate state in the monolith).
 *  AJ. (T5A) Video storage ownership (canonical key, one owner, 13 keys).
 *  AK. (T5A) Content behaviour: save/delete/upload parity + EXECUTED seed.
 *  AL. (T5A) Composition + old Content Library JSX removed from the monolith.
 *  AM. (T5A) Website / Blog freeze — RETIRED by T5B. It now asserts the
 *      INVERSE (the Website surface has LEFT the monolith; T5A's T5B guard is
 *      superseded by its own stage).
 *  AN. (T5A) Accessibility SOURCE CONTRACT for the migrated Content surface.
 *  AO. (T5A) Security deferrals (no auth/Supabase/AI added).
 *  AP. (T5B) Website Editor + Blog/Literasi modules + composition wiring.
 *  AQ. (T5B) Single Website authority (one hook, no duplicate state).
 *  AR. (T5B) Blog prop bridge (`blogPosts` / `onBlogPostsChange`) preserved.
 *  AS. (T5B) Blog-asset storage ownership (canonical key, one owner, no new).
 *  AT. (T5B) Blog behaviour: source contract + EXECUTED data/template module.
 *  AU. (T5B) Pseudo "AI" helper stays LOCAL + deterministic (no API client).
 *  AV. (T5B) Composition + old Website JSX removed from the monolith.
 *  AW. (T5B) Review / Inquiries boundary — RETIRED by T6. It used to prove the
 *      Review surface had NOT been taken. It now asserts the INVERSE: the
 *      Review / Inquiries (`websiteQuestions`) surface has LEFT the monolith
 *      and is owned by `features/admin/review/inquiries`. Not deleted.
 *  AX. (T5B) T5A Content Library non-regression.
 *  AY. (T5B) Accessibility SOURCE CONTRACT for the migrated Website surface.
 *  AZ. (T5B) Security + storage (13 keys, no new key, SEC-P1-03 open).
 *  BA. (T6) Review modules present (two focused domains, no combined store).
 *  BB. (T6) Single Inquiries authority (one hook, no duplicate state).
 *  BC. (T6) Inquiries storage ownership (canonical key, one owner, 13 keys).
 *  BD. (T6) Inquiries behaviour: sync / answer / queue / audit / WhatsApp.
 *  BE. (T6) Inquiries composition + old Review JSX removed from the monolith.
 *  BF. (T6) Single Testimonials authority (one hook, in-memory only).
 *  BG. (T6) Testimonial behaviour: seed / filter contract / status / delete
 *      (source contract + EXECUTED seed and filter predicate).
 *  BH. (T6) Testimonials composition + old moderation JSX removed.
 *  BI. (T6) Accessibility SOURCE CONTRACT for the migrated Review surfaces.
 *  BJ. (T6) T5 non-regression (Content + Website still owned by their modules).
 *  BK. (T6) T7 / T8 boundary (programs / leads / marketing / finance kept).
 *  BL. (T6) Security + storage (no backend, no new key, SEC-P1-03 open).
 *
 * WHAT THIS DOES NOT PROVE
 * ------------------------
 * It does NOT prove runtime browser behaviour. Section I is a SOURCE-STRUCTURE
 * assertion only: it proves no code keys the admin subtree by pathname, which
 * is a necessary condition for state persistence but not a sufficient one.
 * Section P is likewise a SOURCE CONTRACT for mobile affordances, not a WCAG
 * or visual/browser acceptance test. Real transient-state survival and
 * accessibility acceptance require a browser and are marked NOT VERIFIED
 * until then (B1.5/T10).
 *
 * No test framework is added. This is one plain Node script.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const srcDir = join(repoRoot, 'src');

/* ------------------------------------------------------------------ */
/* Load the real pure model + route modules                            */
/* ------------------------------------------------------------------ */

const model = await compileAndImport(
  join(srcDir, 'features', 'admin', 'shell', 'adminWorkspaceModel.ts'),
);
const {
  ADMIN_ROLE_PERMISSIONS,
  ADMIN_TAB_DOMAIN,
  ADMIN_TAB_PATH,
  ADMIN_GROUP_REDIRECTS,
  adminTabToPath,
  adminPathToTab,
  isKnownAdminPath,
  normaliseAdminPath,
  adminDomainForTab,
  isAdminTabAllowed,
  allowedAdminTabs,
  isAdminGroupIndex,
  adminGroupRedirectTarget,
  allAdminPaths,
  allAdminTabs,
  allAdminDomains,
  tabsForDomain,
} = model;

const { pathToLegacyView, legacyViewToPath, LEGACY_VIEW_ROUTES } =
  await compileAndImport(join(srcDir, 'app', 'router', 'legacyViewRoutes.ts'));

/* ------------------------------------------------------------------ */
/* Tiny assertion harness                                             */
/* ------------------------------------------------------------------ */

let passed = 0;
const failures = [];

function check(label, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${label}`);
  } else {
    failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

/* ------------------------------------------------------------------ */
/* A. Tab registry                                                    */
/* ------------------------------------------------------------------ */

section('A. Tab registry (exactly 13 unique tabs)');

const EXPECTED_TABS = [
  'overview', 'users', 'leads', 'inquiries', 'marketing', 'website',
  'finance', 'programs', 'content', 'questions', 'testimonials',
  'reports', 'settings',
];

const tabs = allAdminTabs();
check('exactly 13 tabs', tabs.length === 13, `found ${tabs.length}`);
check('tabs are unique', new Set(tabs).size === tabs.length);
check(
  'tab set matches the architect-approved registry exactly',
  JSON.stringify([...tabs].sort()) === JSON.stringify([...EXPECTED_TABS].sort()),
  `got ${JSON.stringify(tabs)}`,
);

/* ------------------------------------------------------------------ */
/* B. Domain registry                                                 */
/* ------------------------------------------------------------------ */

section('B. Domain registry (exactly 8 domains, one owner per tab)');

const EXPECTED_DOMAINS = [
  'platform', 'users', 'academic', 'studio', 'review',
  'commerce', 'analytics', 'configuration',
];

const domains = allAdminDomains();
check('exactly 8 domains', domains.length === 8, `found ${domains.length}`);
check(
  'domain set matches the architect-approved 8 domains exactly',
  JSON.stringify([...domains].sort()) === JSON.stringify([...EXPECTED_DOMAINS].sort()),
  `got ${JSON.stringify(domains)}`,
);

// Every tab maps to a domain, and every domain owns at least one tab.
let unowned = [];
for (const tab of tabs) {
  const d = adminDomainForTab(tab);
  if (!EXPECTED_DOMAINS.includes(d)) unowned.push(`${tab}->${String(d)}`);
}
check('every tab belongs to a known domain', unowned.length === 0,
  unowned.length ? `unowned: ${unowned.join(', ')}` : '');

const orphanDomains = domains.filter((d) => tabsForDomain(d).length === 0);
check('no domain is empty', orphanDomains.length === 0,
  orphanDomains.length ? `empty: ${orphanDomains.join(', ')}` : '');

// The 8-domain grouping the architect approved, asserted explicitly.
const EXPECTED_GROUPING = {
  platform: ['overview'],
  users: ['users'],
  academic: ['questions'],
  studio: ['content', 'website'],
  review: ['inquiries', 'testimonials'],
  commerce: ['programs', 'leads', 'marketing', 'finance'],
  analytics: ['reports'],
  configuration: ['settings'],
};
for (const [domain, expected] of Object.entries(EXPECTED_GROUPING)) {
  const actual = tabsForDomain(domain);
  check(
    `domain "${domain}" owns exactly [${expected.join(', ')}]`,
    JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort()),
    `got [${actual.join(', ')}]`,
  );
}

// ADMIN_TAB_DOMAIN must be internally consistent with the helper.
const inconsistent = tabs.filter(
  (tab) => ADMIN_TAB_DOMAIN[tab] !== adminDomainForTab(tab),
);
check('ADMIN_TAB_DOMAIN agrees with adminDomainForTab', inconsistent.length === 0,
  inconsistent.length ? `mismatch: ${inconsistent.join(', ')}` : '');

/* ------------------------------------------------------------------ */
/* C. Route mapping                                                   */
/* ------------------------------------------------------------------ */

section('C. Route mapping (tab -> path -> tab round-trip)');

const EXPECTED_PATHS = {
  overview: '/admin',
  users: '/admin/users',
  questions: '/admin/academic/questions',
  content: '/admin/studio/content',
  website: '/admin/studio/website',
  inquiries: '/admin/review/inquiries',
  testimonials: '/admin/review/testimonials',
  programs: '/admin/commerce/programs',
  leads: '/admin/commerce/leads',
  marketing: '/admin/commerce/marketing',
  finance: '/admin/commerce/finance',
  reports: '/admin/analytics',
  settings: '/admin/settings',
};

for (const tab of tabs) {
  const path = adminTabToPath(tab);
  check(`tab "${tab}" -> ${EXPECTED_PATHS[tab]}`, path === EXPECTED_PATHS[tab],
    `got ${path}`);
}

// Round-trip: path -> tab -> path, and tab -> path -> tab.
for (const tab of tabs) {
  const path = adminTabToPath(tab);
  const backTab = adminPathToTab(path);
  check(`round-trip tab "${tab}" -> ${path} -> ${String(backTab)}`,
    backTab === tab, `got ${String(backTab)}`);

  const backPath = adminTabToPath(backTab ?? tab);
  check(`round-trip path "${path}" -> ${String(backTab)} -> ${backPath}`,
    backPath === path, `got ${backPath}`);
}

check('/admin maps to overview',
  adminPathToTab('/admin') === 'overview',
  `got ${String(adminPathToTab('/admin'))}`);
check('/admin/ maps to overview (trailing slash normalised)',
  adminPathToTab('/admin/') === 'overview',
  `got ${String(adminPathToTab('/admin/'))}`);
check('/admin/users/ maps to users (trailing slash normalised)',
  adminPathToTab('/admin/users/') === 'users',
  `got ${String(adminPathToTab('/admin/users/'))}`);
check('normaliseAdminPath strips trailing slash',
  normaliseAdminPath('/admin/users/') === '/admin/users');
check('normaliseAdminPath keeps bare /admin',
  normaliseAdminPath('/admin') === '/admin');

// All 13 canonical paths are known admin paths.
for (const tab of tabs) {
  const path = adminTabToPath(tab);
  check(`isKnownAdminPath(${path}) === true`, isKnownAdminPath(path) === true);
}

/* ------------------------------------------------------------------ */
/* D. Role parity                                                     */
/* ------------------------------------------------------------------ */

section('D. Role permission parity (UI filtering only, NOT auth)');

const EXPECTED_ROLE_MATRIX = {
  'Super Admin': [
    'overview', 'users', 'leads', 'inquiries', 'marketing', 'website',
    'finance', 'programs', 'content', 'questions', 'testimonials',
    'reports', 'settings',
  ],
  'Content Manager': ['overview', 'programs', 'content', 'questions', 'testimonials', 'website'],
  'Support': ['overview', 'users', 'leads', 'inquiries', 'settings', 'finance'],
};

const roles = Object.keys(ADMIN_ROLE_PERMISSIONS);
check('exactly 3 roles', roles.length === 3, `found ${roles.length}`);
check(
  'role set is exactly Super Admin / Content Manager / Support',
  JSON.stringify([...roles].sort()) ===
    JSON.stringify(['Content Manager', 'Support', 'Super Admin'].sort()),
  `got ${JSON.stringify(roles)}`,
);

for (const [role, expected] of Object.entries(EXPECTED_ROLE_MATRIX)) {
  const allowed = allowedAdminTabs(role);
  check(
    `role "${role}" has exactly [${expected.join(', ')}]`,
    JSON.stringify([...allowed].sort()) === JSON.stringify([...expected].sort()),
    `got [${allowed.join(', ')}]`,
  );
  check(`role "${role}" count = ${expected.length}`,
    allowed.length === expected.length, `got ${allowed.length}`);
}

// isAdminTabAllowed must agree with the registry for every role/tab pair.
let matrixMismatch = [];
for (const [role, expected] of Object.entries(EXPECTED_ROLE_MATRIX)) {
  for (const tab of tabs) {
    const shouldBeAllowed = expected.includes(tab);
    if (isAdminTabAllowed(role, tab) !== shouldBeAllowed) {
      matrixMismatch.push(`${role}/${tab}`);
    }
  }
}
check('isAdminTabAllowed agrees with the expected matrix for all 39 pairs',
  matrixMismatch.length === 0,
  matrixMismatch.length ? `mismatch: ${matrixMismatch.join(', ')}` : '');

check('Super Admin may access all 13 tabs',
  allowedAdminTabs('Super Admin').length === 13);
check('Content Manager may access 6 tabs',
  allowedAdminTabs('Content Manager').length === 6);
check('Support may access 6 tabs',
  allowedAdminTabs('Support').length === 6);

/* ------------------------------------------------------------------ */
/* E. Router: ONE persistent admin wildcard branch                    */
/* ------------------------------------------------------------------ */

section('E. Router contract (single persistent /admin/* branch)');

const appRouterSrc = readFileSync(
  join(srcDir, 'app', 'router', 'AppRouter.tsx'), 'utf8');

check('AppRouter declares a single /admin/* wildcard branch',
  /path=["']\/admin\/\*["']/.test(appRouterSrc));

// Count how many times an admin path is registered as a <Route path=...>.
// We must see exactly ONE admin route declaration (the wildcard).
const adminRouteDecls = appRouterSrc.match(/<Route\s+path=["'][^"']*\/admin[^"']*["']/g) || [];
check('exactly ONE admin <Route path=...> declaration (not 13)',
  adminRouteDecls.length === 1,
  `found ${adminRouteDecls.length}: ${JSON.stringify(adminRouteDecls)}`);

check('AdminRouteBoundary is used as the admin route element',
  /AdminRouteBoundary/.test(appRouterSrc));
check('AdminRouteBoundary is imported',
  /import\s*{[^}]*AdminRouteBoundary[^}]*}\s*from/.test(appRouterSrc));

/* ------------------------------------------------------------------ */
/* F. Legacy view contract                                            */
/* ------------------------------------------------------------------ */

section('F. Legacy view contract (all admin paths -> view "admin")');

check('legacy View count remains 21', LEGACY_VIEW_ROUTES.length === 21,
  `found ${LEGACY_VIEW_ROUTES.length}`);

for (const tab of tabs) {
  const path = adminTabToPath(tab);
  const view = pathToLegacyView(path);
  check(`pathToLegacyView(${path}) === 'admin'`, view === 'admin',
    `got ${String(view)}`);
}

check('legacyViewToPath("admin") returns canonical /admin',
  legacyViewToPath('admin') === '/admin',
  `got ${legacyViewToPath('admin')}`);

// Trailing-slash variants also resolve to admin.
check('pathToLegacyView("/admin/users/") === "admin"',
  pathToLegacyView('/admin/users/') === 'admin');

// A non-admin legacy path must NOT be swallowed by the admin check.
check('pathToLegacyView("/app") === "dashboard" (unaffected)',
  pathToLegacyView('/app') === 'dashboard');
check('pathToLegacyView("/") === "landing" (unaffected)',
  pathToLegacyView('/') === 'landing');
check('pathToLegacyView("/programs") === "programs" (unaffected)',
  pathToLegacyView('/programs') === 'programs');

/* ------------------------------------------------------------------ */
/* G. Group index redirects                                           */
/* ------------------------------------------------------------------ */

section('G. Group index redirects (convenience only, replace navigation)');

const EXPECTED_REDIRECTS = {
  '/admin/academic': '/admin/academic/questions',
  '/admin/studio': '/admin/studio/content',
  '/admin/review': '/admin/review/inquiries',
  '/admin/commerce': '/admin/commerce/programs',
};

const groupIndexes = Object.keys(ADMIN_GROUP_REDIRECTS);
check('exactly 4 group indexes', groupIndexes.length === 4,
  `found ${groupIndexes.length}`);

for (const [index, target] of Object.entries(EXPECTED_REDIRECTS)) {
  check(`isAdminGroupIndex(${index}) === true`, isAdminGroupIndex(index) === true);
  check(`${index} redirects to ${target}`,
    adminGroupRedirectTarget(index) === target,
    `got ${String(adminGroupRedirectTarget(index))}`);
  check(`${target} is a real tab path`, isKnownAdminPath(target) === true);
}

check('a real tab path is NOT a group index',
  isAdminGroupIndex('/admin/users') === false);
check('unknown path is NOT a group index',
  isAdminGroupIndex('/admin/nope') === false);
check('adminGroupRedirectTarget returns null for a tab path',
  adminGroupRedirectTarget('/admin/users') === null);

// The boundary file must use replace navigation for the redirect.
const boundarySrc = readFileSync(
  join(srcDir, 'app', 'router', 'AdminRouteBoundary.tsx'), 'utf8');
check('AdminRouteBoundary redirects group indexes with replace',
  /<Navigate\s+[^>]*replace/.test(boundarySrc));

/* ------------------------------------------------------------------ */
/* G2. Invalid admin paths are NOT known admin paths                  */
/* ------------------------------------------------------------------ */

section('G2. Invalid /admin/* paths are rejected');

// Paths that are neither a canonical tab path NOR a group index.
const INVALID_PATHS = [
  '/admin/not-a-real-section',
  '/admin/foo',
  '/admin/commerce/finance/extra',
  '/admin/academic/questions/extra',
  '/admin/users/extra',
  '/adminx',
];

for (const path of INVALID_PATHS) {
  check(`isKnownAdminPath(${path}) === false`, isKnownAdminPath(path) === false);
  check(`adminPathToTab(${path}) === null`, adminPathToTab(path) === null);
}

// `/admin/commerce` and siblings ARE known paths (group indexes) but must NOT
// resolve to a tab — they resolve via redirect, so the tab must be null.
for (const index of Object.keys(ADMIN_GROUP_REDIRECTS)) {
  check(`isKnownAdminPath(${index}) === true (it is a group index)`,
    isKnownAdminPath(index) === true);
  check(`adminPathToTab(${index}) === null (redirect, not a tab)`,
    adminPathToTab(index) === null);
}

check('/admin/not-a-real-section is not an admin path',
  isKnownAdminPath('/admin/not-a-real-section') === false);
check('/admin/not-a-real-section does not derive a tab',
  adminPathToTab('/admin/not-a-real-section') === null);

// The boundary must render Not Found, never fall back to the bridge.
check('AdminRouteBoundary falls through to NotFoundPage for unknown paths',
  /NotFoundPage/.test(boundarySrc));

/* ------------------------------------------------------------------ */
/* H. Legacy AdminDashboard prop contract                             */
/* ------------------------------------------------------------------ */

section('H. Legacy AdminDashboard six-prop contract preserved');

const adminDashSrc = readFileSync(
  join(srcDir, 'components', 'AdminDashboard.tsx'), 'utf8');

// B1.4D-T2 sources: the shell owner (AdminLayout) + the shell context.
const adminLayoutSrc = readFileSync(
  join(srcDir, 'app', 'layouts', 'AdminLayout.tsx'), 'utf8');
const shellCtxSrc = readFileSync(
  join(srcDir, 'features', 'admin', 'shell', 'AdminShellContext.tsx'), 'utf8');
const navRegistrySrc = readFileSync(
  join(srcDir, 'features', 'admin', 'shell', 'adminNavigation.ts'), 'utf8');
// Comment-stripped variants for CODE-only assertions.
const adminLayoutCode = stripComments(adminLayoutSrc);
const shellCtxCode = stripComments(shellCtxSrc);
const adminDashCode = stripComments(adminDashSrc);

// B1.4D-T3/T4 sources: the extracted Platform + Users + Academic modules under
// features/admin.
// The whole tree is concatenated for storage-key discovery (section J); the
// individual modules are read for the T3 source contracts (sections S–Y).
const adminFeatureDir = join(srcDir, 'features', 'admin');
const adminFeatureEntries = readdirSync(adminFeatureDir, { recursive: true })
  .map((entry) => String(entry).replace(/\\/g, '/'))
  .filter((entry) => /\.(?:ts|tsx)$/.test(entry));
const readAdminFeature = (relative) =>
  readFileSync(join(adminFeatureDir, relative), 'utf8');
const adminFeatureSrc = adminFeatureEntries
  .map((entry) => readFileSync(join(adminFeatureDir, entry), 'utf8'))
  .join('\n');

const overviewPageSrc = readAdminFeature('platform/AdminOverviewPage.tsx');
const overviewDataSrc = readAdminFeature('platform/adminPlatformData.ts');
const overviewBarrelSrc = readAdminFeature('platform/index.ts');
const usersPageSrc = readAdminFeature('users/AdminUsersPage.tsx');
const usersHookSrc = readAdminFeature('users/useAdminUsersDomain.ts');
const usersRecordsSrc = readAdminFeature('users/adminUserRecords.ts');
const userDialogSrc = readAdminFeature('users/AdminUserEditorDialog.tsx');
const usersBarrelSrc = readAdminFeature('users/index.ts');

// B1.4D-T4 — academic (Question Bank) domain.
const academicPageSrc = readAdminFeature('academic/AdminQuestionBankPage.tsx');
const academicHookSrc = readAdminFeature('academic/useAdminQuestionsDomain.ts');
const academicEditorSrc = readAdminFeature('academic/AdminQuestionEditorDialog.tsx');
const academicTagsSrc = readAdminFeature('academic/AdminQuestionTagsDialog.tsx');
const academicImportSrc = readAdminFeature('academic/AdminQuestionImportDialog.tsx');
const academicDataSrc = readAdminFeature('academic/adminQuestionData.ts');
const academicBarrelSrc = readAdminFeature('academic/index.ts');

const overviewPageCode = stripComments(overviewPageSrc);
const usersPageCode = stripComments(usersPageSrc);
const usersHookCode = stripComments(usersHookSrc);
const usersRecordsCode = stripComments(usersRecordsSrc);
const userDialogCode = stripComments(userDialogSrc);

const academicPageCode = stripComments(academicPageSrc);
const academicHookCode = stripComments(academicHookSrc);
const academicEditorCode = stripComments(academicEditorSrc);
const academicTagsCode = stripComments(academicTagsSrc);
const academicImportCode = stripComments(academicImportSrc);
const academicDataCode = stripComments(academicDataSrc);

// B1.4D-T5A — Studio / Content Library domain.
const contentPageSrc = readAdminFeature('studio/content/AdminContentLibraryPage.tsx');
const contentHookSrc = readAdminFeature('studio/content/useAdminContentDomain.ts');
const contentEditorSrc = readAdminFeature('studio/content/AdminVideoEditorDialog.tsx');
const contentUploadSrc = readAdminFeature('studio/content/AdminVideoUploadDialog.tsx');
const contentDataSrc = readAdminFeature('studio/content/adminContentData.ts');
const contentBarrelSrc = readAdminFeature('studio/content/index.ts');

const contentPageCode = stripComments(contentPageSrc);
const contentHookCode = stripComments(contentHookSrc);
const contentEditorCode = stripComments(contentEditorSrc);
const contentUploadCode = stripComments(contentUploadSrc);
const contentDataCode = stripComments(contentDataSrc);
const contentBarrelCode = stripComments(contentBarrelSrc);
// Comment-stripped view of the whole feature tree (for CODE-only key counting).
const adminFeatureCode = stripComments(adminFeatureSrc);

// B1.4D-T5B — Studio / Website Editor + Blog/Literasi domain.
// Read defensively so a missing module is a FAILED CHECK, not a crashed script.
const safeReadAdminFeature = (relative) => {
  const target = join(adminFeatureDir, relative);
  return existsSync(target) ? readFileSync(target, 'utf8') : '';
};
const websiteFeatureDir = join(adminFeatureDir, 'studio', 'website');
const websitePageSrc = safeReadAdminFeature('studio/website/AdminWebsiteEditorPage.tsx');
const websiteHookSrc = safeReadAdminFeature('studio/website/useAdminWebsiteDomain.ts');
const websiteDataSrc = safeReadAdminFeature('studio/website/adminWebsiteData.ts');
const websiteBarrelSrc = safeReadAdminFeature('studio/website/index.ts');
const blogEditorSrc = safeReadAdminFeature('studio/website/AdminBlogEditorDialog.tsx');
const blogMiddleInsertSrc = safeReadAdminFeature('studio/website/AdminBlogMiddleInsertDialog.tsx');
const blogAssetEditorSrc = safeReadAdminFeature('studio/website/AdminBlogAssetEditorDialog.tsx');
const blogPreviewSrc = safeReadAdminFeature('studio/website/AdminBlogPreviewDialog.tsx');
const websiteSaveConfirmSrc = safeReadAdminFeature('studio/website/AdminWebsiteSaveConfirmDialog.tsx');

const websitePageCode = stripComments(websitePageSrc);
const websiteHookCode = stripComments(websiteHookSrc);
const websiteDataCode = stripComments(websiteDataSrc);
const websiteBarrelCode = stripComments(websiteBarrelSrc);
const blogEditorCode = stripComments(blogEditorSrc);
const blogMiddleInsertCode = stripComments(blogMiddleInsertSrc);
const blogAssetEditorCode = stripComments(blogAssetEditorSrc);
const blogPreviewCode = stripComments(blogPreviewSrc);
const websiteSaveConfirmCode = stripComments(websiteSaveConfirmSrc);
// Whole-domain concatenations (raw + comment-stripped) for cross-file assertions.
const websiteDomainSrc = [
  websitePageSrc, websiteHookSrc, websiteDataSrc, websiteBarrelSrc,
  blogEditorSrc, blogMiddleInsertSrc, blogAssetEditorSrc, blogPreviewSrc,
  websiteSaveConfirmSrc,
].join('\n');
const websiteDomainCode = stripComments(websiteDomainSrc);

// B1.4D-T6 — Review domain: TWO focused domains, not one combined Review store.
// Read defensively so a missing module is a FAILED CHECK, not a crashed script.
const reviewFeatureDir = join(adminFeatureDir, 'review');
const inquiriesPageSrc = safeReadAdminFeature('review/inquiries/AdminInquiriesPage.tsx');
const inquiriesHookSrc = safeReadAdminFeature('review/inquiries/useAdminInquiriesDomain.ts');
const inquiriesBarrelSrc = safeReadAdminFeature('review/inquiries/index.ts');
const testimonialsPageSrc = safeReadAdminFeature('review/testimonials/AdminTestimonialsPage.tsx');
const testimonialsHookSrc = safeReadAdminFeature('review/testimonials/useAdminTestimonialsDomain.ts');
const testimonialsBarrelSrc = safeReadAdminFeature('review/testimonials/index.ts');
const reviewBarrelSrc = safeReadAdminFeature('review/index.ts');

const inquiriesPageCode = stripComments(inquiriesPageSrc);
const inquiriesHookCode = stripComments(inquiriesHookSrc);
const inquiriesBarrelCode = stripComments(inquiriesBarrelSrc);
const testimonialsPageCode = stripComments(testimonialsPageSrc);
const testimonialsHookCode = stripComments(testimonialsHookSrc);
const testimonialsBarrelCode = stripComments(testimonialsBarrelSrc);
const reviewBarrelCode = stripComments(reviewBarrelSrc);

// Whole-domain concatenations (raw + comment-stripped) for cross-file assertions.
const inquiriesDomainSrc = [inquiriesPageSrc, inquiriesHookSrc, inquiriesBarrelSrc].join('\n');
const inquiriesDomainCode = stripComments(inquiriesDomainSrc);
const testimonialsDomainSrc =
  [testimonialsPageSrc, testimonialsHookSrc, testimonialsBarrelSrc].join('\n');
const testimonialsDomainCode = stripComments(testimonialsDomainSrc);
const reviewDomainSrc = [inquiriesDomainSrc, testimonialsDomainSrc, reviewBarrelSrc].join('\n');
const reviewDomainCode = stripComments(reviewDomainSrc);

// B1.4D-T7A — Commerce / Programs + Leads domain.
// Read defensively so a missing module is a FAILED CHECK, not a crashed script.
const commerceFeatureDir = join(adminFeatureDir, 'commerce');
const programsPageSrc = safeReadAdminFeature('commerce/programs/AdminProgramsPage.tsx');
const programsHookSrc = safeReadAdminFeature('commerce/programs/useAdminProgramsDomain.ts');
const programsEditorSrc = safeReadAdminFeature('commerce/programs/AdminProgramEditorDialog.tsx');
const programsConfirmSrc = safeReadAdminFeature('commerce/programs/AdminProgramSaveConfirmDialog.tsx');
const programsBarrelSrc = safeReadAdminFeature('commerce/programs/index.ts');
const leadsPageSrc = safeReadAdminFeature('commerce/leads/AdminLeadsPage.tsx');
const leadsHookSrc = safeReadAdminFeature('commerce/leads/useAdminLeadsDomain.ts');
const leadsEditorSrc = safeReadAdminFeature('commerce/leads/AdminLeadEditorDialog.tsx');
const leadsConvertSrc = safeReadAdminFeature('commerce/leads/AdminLeadConvertDialog.tsx');
const leadsDetailSrc = safeReadAdminFeature('commerce/leads/AdminLeadDetailDialog.tsx');
const leadsDataSrc = safeReadAdminFeature('commerce/leads/adminLeadsData.ts');
const leadsBarrelSrc = safeReadAdminFeature('commerce/leads/index.ts');
const commerceBarrelSrc = safeReadAdminFeature('commerce/index.ts');

const programsPageCode = stripComments(programsPageSrc);
const programsHookCode = stripComments(programsHookSrc);
const programsEditorCode = stripComments(programsEditorSrc);
const programsConfirmCode = stripComments(programsConfirmSrc);
const programsBarrelCode = stripComments(programsBarrelSrc);
const leadsPageCode = stripComments(leadsPageSrc);
const leadsHookCode = stripComments(leadsHookSrc);
const leadsEditorCode = stripComments(leadsEditorSrc);
const leadsConvertCode = stripComments(leadsConvertSrc);
const leadsDetailCode = stripComments(leadsDetailSrc);
const leadsDataCode = stripComments(leadsDataSrc);
const leadsBarrelCode = stripComments(leadsBarrelSrc);
const commerceBarrelCode = stripComments(commerceBarrelSrc);

// Whole-domain concatenations (raw + comment-stripped) for cross-file assertions.
const programsDomainSrc = [programsPageSrc, programsHookSrc, programsEditorSrc, programsConfirmSrc, programsBarrelSrc].join('\n');
const programsDomainCode = stripComments(programsDomainSrc);
const leadsDomainSrc = [leadsPageSrc, leadsHookSrc, leadsEditorSrc, leadsConvertSrc, leadsDetailSrc, leadsDataSrc, leadsBarrelSrc].join('\n');
const leadsDomainCode = stripComments(leadsDomainSrc);
const commerceDomainSrc = [programsDomainSrc, leadsDomainSrc, commerceBarrelSrc].join('\n');
const commerceDomainCode = stripComments(commerceDomainSrc);

/**
 * Returns the body of a top-level (2-space indented) component function, e.g.
 * `const convertLeadToStudent = (...) => { ... };`. Used to prove that a
 * cross-domain consumer persists through the shared users store.
 */
function componentFunctionBody(src, name) {
  const start = src.indexOf(`const ${name} = `);
  if (start === -1) return '';
  const end = src.indexOf('\n  };', start);
  return end === -1 ? src.slice(start) : src.slice(start, end);
}

const LEGACY_PROPS = [
  'logout', 'setView', 'programs', 'onProgramsChange',
  'blogPosts', 'onBlogPostsChange',
];
for (const prop of LEGACY_PROPS) {
  check(`AdminDashboard prop "${prop}" present in source`,
    new RegExp(`\\b${prop}\\b`).test(adminDashSrc));
}

// LegacyRouteBridge must still pass exactly those six props.
const bridgeSrc = readFileSync(
  join(srcDir, 'app', 'router', 'LegacyRouteBridge.tsx'), 'utf8');
const adminDashBlock = /<AdminDashboard[\s\S]*?\/>/.exec(bridgeSrc);
check('LegacyRouteBridge renders AdminDashboard', adminDashBlock !== null);
if (adminDashBlock) {
  for (const prop of LEGACY_PROPS) {
    check(`LegacyRouteBridge passes "${prop}" to AdminDashboard`,
      new RegExp(`\\b${prop}\\b`).test(adminDashBlock[0]));
  }
}

/**
 * Strips comments from TypeScript source so source-structure assertions do
 * not trip over doc comments.
 *
 * WHY THIS EXISTS: `AdminRouteBoundary.tsx` documents the forbidden pattern
 * `key={location.pathname}` in its header comment. A regex over raw text
 * cannot tell a doc comment from real JSX, so it reported a violation that
 * did not exist. Stripping comments makes these assertions check CODE.
 */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '$1');
}

/* ------------------------------------------------------------------ */
/* I. Transient-state SOURCE CONTRACT                                 */
/* ------------------------------------------------------------------ */

section('I. Transient-state source contract (no pathname key)');

// This is a SOURCE-STRUCTURE assertion, NOT proof of runtime persistence.
// It proves no code keys the admin subtree by pathname, which is a
// necessary (not sufficient) condition for state survival.
const KEYED_BY_PATHNAME = /\bkey=\{\s*(?:location|props\.location|pathname)[^}]*\}/;
check('AdminDashboard has no key={location.pathname}',
  !KEYED_BY_PATHNAME.test(stripComments(adminDashSrc)));
check('LegacyRouteBridge has no key={location.pathname}',
  !KEYED_BY_PATHNAME.test(stripComments(bridgeSrc)));
check('AdminRouteBoundary has no key={location.pathname}',
  !KEYED_BY_PATHNAME.test(stripComments(boundarySrc)));
check('AppRouter has no key={location.pathname} on the admin branch',
  !KEYED_BY_PATHNAME.test(stripComments(appRouterSrc)));

// The bridge must remain keyed on currentView, NOT on pathname.
const bridgeCode = stripComments(bridgeSrc);
check('LegacyRouteBridge motion key is currentView (not pathname)',
  /\bkey=\{\s*currentView/.test(bridgeCode) &&
    !KEYED_BY_PATHNAME.test(bridgeCode));

// B1.4D-T2: URL -> activeTab derivation moved from AdminDashboard into
// AdminShellContext (mounted in AdminLayout). The URL remains the single
// source of truth; there is still no local activeTab useState anywhere.
check('AdminShellContext derives activeTab from the URL',
  /adminPathToTab\(\s*location\.pathname\s*\)/.test(shellCtxCode));
check('AdminShellContext navigateToTab navigates to the canonical path',
  /navigate\(\s*adminTabToPath\(/.test(shellCtxCode));
check('AdminDashboard keeps an setActiveTab compatibility shim',
  /const\s+setActiveTab\s*=/.test(adminDashSrc));
check('AdminDashboard no longer declares activeTab via useState',
  !/useState<AdminTab>/.test(adminDashSrc));
check('AdminShellContext has no pathname key introduced',
  !KEYED_BY_PATHNAME.test(shellCtxCode));

// ROLE MATRIX is imported from the pure model (single source of truth).
check('AdminDashboard imports ADMIN_ROLE_PERMISSIONS from the pure model',
  /ADMIN_ROLE_PERMISSIONS/.test(adminDashSrc));
check('AdminDashboard no longer hand-writes the role matrix literal',
  !/'Super Admin':\s*\[\s*'overview'/.test(adminDashSrc));

/* ------------------------------------------------------------------ */
/* J. localStorage key registry (13 keys, discoverable, not renamed)  */
/* ------------------------------------------------------------------ */

section('J. localStorage key registry (all 13 discoverable in source)');

const EXPECTED_STORAGE_KEYS = [
  'theprams_demo_users',
  'theprams_demo_leads',
  'theprams_demo_transactions',
  'theprams_demo_payment_proofs',
  'theprams_demo_finance_entries',
  'theprams_demo_finance_realizations',
  'theprams_demo_assets',
  'theprams_demo_audit_events',
  'theprams_demo_notifications',
  'theprams_demo_registrations',
  'theprams_demo_blog_assets',
  'theprams_demo_video_lessons',
  'theprams_demo_website_questions',
];

const discovered = new Set(
  [adminDashSrc, adminFeatureSrc].join('\n')
    .match(/theprams_demo_[a-zA-Z_]+/g) || [],
);
check('exactly 13 theprams_demo_* keys discovered across the admin tree',
  discovered.size === 13, `found ${discovered.size}: ${[...discovered].sort().join(', ')}`);

for (const key of EXPECTED_STORAGE_KEYS) {
  check(`storage key "${key}" still present across the admin tree`,
    discovered.has(key));
}

// No key was renamed: every discovered key must be in the expected registry.
const unexpectedKeys = [...discovered].filter(
  (k) => !EXPECTED_STORAGE_KEYS.includes(k),
);
check('no unexpected/renamed storage key introduced',
  unexpectedKeys.length === 0,
  unexpectedKeys.length ? `unexpected: ${unexpectedKeys.join(', ')}` : '');

// T3 single-store rule: the users key left AdminDashboard for the users domain
// module and no second users store may exist in the monolith.
check('AdminDashboard no longer owns the users storage key',
  !/theprams_demo_users\b/.test(adminDashCode));
check('AdminDashboard does not write a second users store',
  !/localStorage\.setItem\(\s*['"]theprams_demo_users['"]/.test(adminDashCode));
check('the users storage key constant is defined in the users domain module',
  /['"]theprams_demo_users['"]/.test(usersRecordsCode));

/* ------------------------------------------------------------------ */
/* K. Security deferrals                                              */
/* ------------------------------------------------------------------ */

section('K. Security deferrals (SEC-P1-03 remains OPEN, B2)');

// The pure model must import nothing at all. Strip comments first, then look
// for a real import/require/access — the header doc legitimately mentions
// "react-router" and "localStorage" as things the module must NOT use.
const modelSrc = readFileSync(
  join(srcDir, 'features', 'admin', 'shell', 'adminWorkspaceModel.ts'),
  'utf8',
);
const modelCode = stripComments(modelSrc);
check('pure model has no import statements',
  !/\bimport\s+(?:[\s\S]*?\s+from\s+)?['"]/.test(modelCode) &&
    !/\bimport\s*\(/.test(modelCode) &&
    !/\brequire\s*\(/.test(modelCode));
check('pure model has no react / router / localStorage / window access',
  !/\breact-router\b/.test(modelCode) &&
    !/\blocalStorage\b/.test(modelCode) &&
    !/\bwindow\s*\./.test(modelCode) &&
    !/\bdocument\s*\./.test(modelCode) &&
    !/\bfrom\s+['"]react/.test(modelCode));
check('pure model defines no React hook calls',
  !/\buse(?:State|Effect|Memo|Context|Ref|Callback)\s*\(/.test(modelCode));

// B1.4D-T1 is UI presentation filtering ONLY. Assert no auth guard was
// silently introduced on the admin path.
check('no auth guard wrapped around the admin branch in AppRouter',
  !/<Guarded>[\s\S]{0,200}AdminRouteBoundary/.test(appRouterSrc));
check('AdminRouteBoundary imports no auth/Supabase/AI module',
  !/@supabase|GoogleGenAI|@google\/genai|openmaic/i.test(boundarySrc));

/* ================================================================== */
/* B1.4D-T2 ADDITIONS                                                 */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* L. Shell owner (AdminLayout)                                        */
/* ------------------------------------------------------------------ */

section('L. T2 shell owner — AdminLayout owns the admin chrome');

// AdminLayout must compose the shell provider, the navigation registry, the
// role switcher, logout, the mobile navigation contract and the Outlet.
check('AdminLayout mounts AdminShellProvider',
  /AdminShellProvider/.test(adminLayoutCode));
check('AdminLayout renders the AKSA admin navigation items',
  /ADMIN_NAV_ITEMS/.test(adminLayoutCode));
check('AdminLayout renders the Outlet for business content',
  /<Outlet\s*\/?>/.test(adminLayoutCode));
check('AdminLayout owns the role switcher (Role Switcher (Debug) block)',
  /Role Switcher \(Debug\)/.test(adminLayoutCode));
check('AdminLayout owns admin identity (dr. Pramono semantics)',
  /dr\. Pramono/.test(adminLayoutCode));
check('AdminLayout wires logout via requestLogout adapter',
  /requestLogout/.test(adminLayoutCode));
check('AdminLayout does not call setUser(null) directly',
  !/setUser\(\s*null\s*\)/.test(adminLayoutCode));
check('AdminLayout derives navigation with the pure model permission check',
  /isAdminTabAllowed/.test(adminLayoutCode));

/* ------------------------------------------------------------------ */
/* M. AdminDashboard content-only                                      */
/* ------------------------------------------------------------------ */

section('M. T2 AdminDashboard is business content only (shell removed)');

// The legacy application shell must be gone from AdminDashboard. These are
// CODE assertions over comment-stripped source, so doc mentions of the
// patterns do not trip them.
check('AdminDashboard no longer renders an <aside> sidebar',
  !/<aside\b/.test(adminDashCode));
check('AdminDashboard has no w-64 shell sidebar',
  !/w-64\b/.test(adminDashCode));
check('AdminDashboard has no h-screen application root',
  !/\bh-screen\b/.test(adminDashCode));
check('AdminDashboard has no "Role Switcher (Debug)" block',
  !/Role Switcher \(Debug\)/.test(adminDashCode));
check('AdminDashboard has no "The Prams" shell branding',
  !/>The Prams</.test(adminDashCode));
check('AdminDashboard has no sidebar logout button',
  !/LogOut\b/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* N. Role state owner                                                 */
/* ------------------------------------------------------------------ */

section('N. T2 role state — AdminShellContext owns adminRole');

check('AdminDashboard no longer declares useState<AdminRole>',
  !/useState<\s*AdminRole\s*>/.test(adminDashCode));
check('AdminShellContext owns the adminRole state',
  /useState<\s*AdminRole\s*>/.test(shellCtxCode));
check('AdminDashboard consumes the shell via useAdminShell',
  /useAdminShell\(\)/.test(adminDashCode));
check('AdminShellContext role change navigates to overview (/admin)',
  /navigate\(\s*adminTabToPath\(\s*'overview'\s*\)\s*\)/.test(shellCtxCode));
check('shell context state limited to adminRole (no business state slices)',
  !/\b(?:leads?|finance|programs?|questions?|blogPosts?|searchTerm|actionMessage|toast|modal|notification|auditRecords?)\b\s*[,:]/.test(
    /const\s+\[\s*adminRole[\s\S]*?\]\s*=\s*useState[\s\S]*?\);/.exec(shellCtxCode)?.[0] ?? '',
  ));

/* ------------------------------------------------------------------ */
/* O. UI presentation redirect (NOT authorization)                     */
/* ------------------------------------------------------------------ */

section('O. T2 disallowed direct URL — UI presentation redirect');

// A non-Super-Admin hitting a disallowed tab URL must be redirected back to
// /admin (presentation only, replace). This is NOT access control.
check('shell redirects disallowed direct URL back to /admin (replace)',
  /replace/.test(shellCtxCode) &&
    /isTabAllowed/.test(shellCtxCode));
check('no 403 / access-control language introduced in the shell',
  !/\b(?:403|Forbidden|access control|unauthorized)\b/i.test(shellCtxCode));
check('SEC-P1-03 still open: no auth/Supabase import in shell context',
  !/@supabase|GoogleGenAI|@google\/genai/i.test(shellCtxCode));

/* ------------------------------------------------------------------ */
/* P. Mobile navigation source contract                                */
/* ------------------------------------------------------------------ */

section('P. T2 mobile navigation source contract (SOURCE CONTRACT only)');

// Source-level checks for the mobile drawer affordances. This does NOT prove
// runtime/browser accessibility acceptance (that is B1.5/T10).
check('mobile menu button has aria-expanded',
  /aria-expanded=\{/.test(adminLayoutCode));
check('mobile menu button has aria-controls',
  /aria-controls=/.test(adminLayoutCode));
check('mobile drawer has an Escape handler',
  /'Escape'/.test(adminLayoutCode));
check('mobile menu button declares min 44px target',
  /min-w-\[44px\]/.test(adminLayoutCode) &&
    /min-h-\[44px\]/.test(adminLayoutCode));
check('mobile drawer close button declares min 44px target',
  /Tutup menu admin/.test(adminLayoutCode) &&
    /min-w-\[44px\]/.test(adminLayoutCode));
check('drawer close via backdrop present',
  /closeMobileNav/.test(adminLayoutCode));

/* ------------------------------------------------------------------ */
/* Q. Shell contrast / accessibility (migrated shell only)             */
/* ------------------------------------------------------------------ */

section('Q. T2 migrated shell contrast (normal-size actions)');

// The migrated shell must not use white text on brand-blue / brand-orange
// for normal-size shell actions. Only AdminLayout (the migrated shell) is
// scanned — untouched business content is out of T2 scope.
check('no bg-brand-blue + text-white in migrated shell',
  !/bg-brand-blue[^"']*text-white|text-white[^"']*bg-brand-blue/.test(adminLayoutCode));
check('no bg-brand-orange + text-white in migrated shell',
  !/bg-brand-orange[^"']*text-white|text-white[^"']*bg-brand-orange/.test(adminLayoutCode));

/* ------------------------------------------------------------------ */
/* R. Legacy contract preservation                                     */
/* ------------------------------------------------------------------ */

section('R. T2 legacy contract preservation');

// The six AdminDashboard props remain exact (asserted in H), and the
// routing/storage/persistence contracts must not regress (sections E, I, J).
check('LegacyRouteBridge still keyed by currentView (no pathname key)',
  /\bkey=\{\s*currentView/.test(bridgeCode));

/* ------------------------------------------------------------------ */
/* S. T3 Platform (Overview) extraction                                */
/* ------------------------------------------------------------------ */

section('S. T3 platform/overview extraction');

check('AdminOverviewPage module exists', overviewPageSrc.length > 0);
check('platform barrel exists', /AdminOverviewPage/.test(overviewBarrelSrc));
check('AdminDashboard renders <AdminOverviewPage /> for the overview tab',
  /\{activeTab === 'overview' && <AdminOverviewPage \/>\}/.test(adminDashCode));
check('legacy overview JSX removed from AdminDashboard (Growth Analytics)',
  !/Growth Analytics/.test(adminDashCode));
check('legacy overview JSX removed from AdminDashboard (Program Popularity)',
  !/Program Popularity/.test(adminDashCode));
check('overview page owns the four summary-card metrics',
  /'Total Siswa Aktif'/.test(overviewPageCode) &&
    /'Active Leads'/.test(overviewPageCode) &&
    /'Tryout Offline Boyolali'/.test(overviewPageCode) &&
    /'Revenue \(MTD\)'/.test(overviewPageCode));
check('AdminOverviewPage is prop-less today',
  /export function AdminOverviewPage\(\)/.test(overviewPageCode));
check('overview chart data moved to the platform data module',
  /export const programData/.test(overviewDataSrc) &&
    !/const programData = \[/.test(adminDashCode));
check('shared chart palette moved to the platform data module',
  /export const COLORS/.test(overviewDataSrc) &&
    !/const COLORS = \[/.test(adminDashCode));
check('AdminDashboard still imports the shared palette for Reports',
  /COLORS/.test(adminDashCode) &&
    /from '\.\.\/features\/admin\/platform'/.test(adminDashSrc));
check('overview legend labels use accessible tokens (no raw brand text)',
  !/text-brand-blue\s+uppercase/.test(overviewPageCode) &&
    !/text-brand-orange\s+uppercase/.test(overviewPageCode));
check('overview trend badge no longer uses emerald-600 on emerald-50',
  !/bg-emerald-50 text-emerald-600/.test(overviewPageCode));

/* ------------------------------------------------------------------ */
/* T. T3 Users extraction — module presence + wiring                   */
/* ------------------------------------------------------------------ */

section('T. T3 users extraction — modules + wiring');

check('AdminUsersPage module exists', usersPageSrc.length > 0);
check('useAdminUsersDomain module exists', usersHookSrc.length > 0);
check('adminUserRecords module exists', usersRecordsSrc.length > 0);
check('AdminUserEditorDialog module exists', userDialogSrc.length > 0);
check('users barrel exists', /AdminUsersPage/.test(usersBarrelSrc));
check('AdminDashboard renders AdminUsersPage for the users tab',
  /\{activeTab === 'users' && \([\s\S]{0,200}<AdminUsersPage/.test(adminDashCode));
check('AdminUsersPage receives the canonical domain surface',
  /domain=\{usersDomain\}/.test(adminDashCode));
check('legacy users JSX removed from AdminDashboard (heading)',
  !/User Management & Permissions/.test(adminDashCode));
check('legacy users table removed from AdminDashboard (System Role column)',
  !/System Role/.test(adminDashCode));
check('legacy users editor modal removed from AdminDashboard',
  !/Add \/ Edit User/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* U. T3 single users store                                            */
/* ------------------------------------------------------------------ */

section('U. T3 single users store (no duplicate state)');

check('AdminDashboard no longer declares useState<UserAccount[]>',
  !/useState<\s*UserAccount\[\]\s*>/.test(adminDashCode));
check('AdminDashboard no longer declares a local editingUser state',
  !/useState<\s*UserAccount \| null\s*>/.test(adminDashCode));
check('AdminDashboard no longer declares a local userDirectoryView state',
  !/useState<\s*'students' \| 'staff'\s*>/.test(adminDashCode));
check('AdminDashboard no longer declares a local roleFilter state',
  !/const \[\s*roleFilter/.test(adminDashCode));
check('AdminDashboard no longer declares a generic searchTerm state',
  !/const \[\s*searchTerm\s*,\s*setSearchTerm\s*\]/.test(adminDashCode));
check('AdminDashboard invokes the users domain hook exactly once',
  (adminDashCode.match(/useAdminUsersDomain\(/g) || []).length === 1);
check('AdminDashboard destructures users/persistUsers from the domain',
  /const\s*\{\s*users\s*,\s*persistUsers\s*\}\s*=\s*usersDomain/.test(adminDashCode));
check('the route-mounted page does NOT own users state',
  !/useAdminUsersDomain\(/.test(usersPageCode) &&
    !/useState<\s*UserAccount\[\]\s*>/.test(usersPageCode));
check('the shell/layout layers do NOT own users state',
  !/useAdminUsersDomain\(/.test(adminLayoutCode) &&
    !/useAdminUsersDomain\(/.test(shellCtxCode));
check('the users domain module does not import AdminDashboard (no cycle)',
  !/from '[^']*AdminDashboard'/.test(usersHookCode) &&
    !/from '[^']*AdminDashboard'/.test(usersPageCode) &&
    !/from '[^']*AdminDashboard'/.test(userDialogCode));
check('the record-adapter module owns no React state',
  !/useState/.test(usersRecordsCode));

/* ------------------------------------------------------------------ */
/* V. T3 cross-domain consumers                                        */
/* ------------------------------------------------------------------ */

section('V. T3 cross-domain consumers still share the one store');

check('Finance approval flow persists through the shared store',
  /persistUsers\(/.test(componentFunctionBody(adminDashCode, 'updateFinanceRecordStatus')));
check('Lead conversion persists through the shared store (in Leads domain)',
  /persistUsers\(/.test(componentFunctionBody(leadsHookCode, 'convertLeadToStudent')));
check('contextual add persists through the shared store',
  /persistUsers\(\s*\[/.test(adminDashCode));
check('record adapters are imported, not re-declared in the monolith',
  /isApprovedStudentRecord/.test(adminDashCode) &&
    !/const isApprovedStudentRecord = /.test(adminDashCode) &&
    !/const userFromStudentRecord = /.test(adminDashCode));
check('the users domain module owns the record adapters',
  /export const isApprovedStudentRecord = /.test(usersRecordsCode) &&
    /export const userFromStudentRecord = /.test(usersRecordsCode));
check('approved-student sync reads registrations + transactions',
  /theprams_demo_registrations/.test(usersHookCode) &&
    /theprams_demo_transactions/.test(usersHookCode));
check('approved-student sync dedupes by id and composite key',
  /existingIds/.test(usersHookCode) && /existingEmails/.test(usersHookCode));
check('approved-student mount-time sync effect preserved',
  /useEffect\(\(\)\s*=>\s*\{[\s\S]{0,80}syncApprovedStudentsToUsers\(\);/.test(usersHookCode));

/* ------------------------------------------------------------------ */
/* W. T3 search relocation                                             */
/* ------------------------------------------------------------------ */

section('W. T3 search relocated from the shared toolbar to Users');

check('AdminUsersPage owns a users-local search term',
  /usersSearchTerm/.test(usersPageCode));
check('AdminUsersPage search input has an accessible name',
  /aria-label="Cari pengguna"/.test(usersPageCode));
check('the users hook filters by name + email (legacy semantics)',
  /name\.toLowerCase\(\)\.includes/.test(usersHookCode) &&
    /email\.toLowerCase\(\)\.includes/.test(usersHookCode));
check('the shared toolbar no longer carries users search',
  !/Search dashboard/.test(adminDashCode) && !/Cari dashboard/.test(adminDashCode));
check('the shared toolbar keeps the notification bell',
  /aria-label="Lihat notifikasi admin"/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* X. T3 accessibility source contract (Users)                         */
/* ------------------------------------------------------------------ */

section('X. T3 accessibility source contract (Users domain)');

check('Users page uses design-system Button/IconButton',
  /design-system\/components/.test(usersPageCode) &&
    /\bButton\b/.test(usersPageCode) && /\bIconButton\b/.test(usersPageCode));
check('directory toggles declare a 44px min target (both)',
  (usersPageCode.match(/min-h-\[44px\]/g) || []).length >= 2);
check('access icon control has an aria-label',
  /aria-label=\{`Lihat hak akses \$\{/.test(usersPageCode));
check('edit icon control has an aria-label',
  /aria-label=\{`Edit user \$\{/.test(usersPageCode));
check('delete icon control has an aria-label',
  /aria-label=\{`Hapus user \$\{/.test(usersPageCode));
check('editor dialog close control has an aria-label',
  /aria-label="Tutup editor pengguna"/.test(userDialogCode));
check('editor dialog close declares a 44px min target',
  /min-w-\[44px\]/.test(userDialogCode) && /min-h-\[44px\]/.test(userDialogCode));
check('extracted users surface has no raw brand text utilities',
  !/text-brand-blue|text-brand-orange/.test(usersPageCode) &&
    !/text-brand-blue|text-brand-orange/.test(userDialogCode));

/* ------------------------------------------------------------------ */
/* Y. T3 security + routing no-regression                              */
/* ------------------------------------------------------------------ */

section('Y. T3 security deferrals + routing no-regression');

check('SEC-P1-03 still open: no Supabase/GenAI in extracted admin features',
  !/@supabase|supabase|GoogleGenAI|@google\/genai/i.test(stripComments(adminFeatureSrc)));
check('the navigation registry still declares exactly 13 tabs',
  (navRegistrySrc.match(/tab:\s*'[a-z]+'/g) || []).length === 13);
check('no fake global search introduced into the shell',
  !/Search dashboard/.test(adminLayoutCode) &&
    !/Cari dashboard/.test(shellCtxCode));
check('notify/actionMessage stay owned by AdminDashboard (not the layout)',
  /const notify = \(/.test(adminDashCode) &&
    /actionMessage/.test(adminDashCode) &&
    !/actionMessage/.test(adminLayoutCode));

/* ================================================================== */
/* B1.4D-T4 ADDITIONS                                                 */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* Z. Academic module presence                                         */
/* ------------------------------------------------------------------ */

section('Z. T4 academic extraction — modules + wiring');

check('AdminQuestionBankPage module exists', academicPageSrc.length > 0);
check('useAdminQuestionsDomain module exists', academicHookSrc.length > 0);
check('AdminQuestionEditorDialog module exists', academicEditorSrc.length > 0);
check('AdminQuestionTagsDialog module exists', academicTagsSrc.length > 0);
check('AdminQuestionImportDialog module exists', academicImportSrc.length > 0);
check('adminQuestionData module exists', academicDataSrc.length > 0);
check('academic barrel exists',
  /AdminQuestionBankPage/.test(academicBarrelSrc) &&
    /useAdminQuestionsDomain/.test(academicBarrelSrc));
check('AdminDashboard renders AdminQuestionBankPage for the questions tab',
  /\{activeTab === 'questions' && \([\s\S]{0,400}<AdminQuestionBankPage/.test(adminDashCode));
check('AdminQuestionBankPage receives the canonical domain surface',
  /domain=\{questionsDomain\}/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* AA. Single Question Bank authority                                  */
/* ------------------------------------------------------------------ */

section('AA. T4 single Question Bank store (no duplicate state)');

check('AdminDashboard invokes useAdminQuestionsDomain exactly once',
  (adminDashCode.match(/useAdminQuestionsDomain\(/g) || []).length === 1);
check('AdminDashboard no longer declares useState<Question[]>',
  !/useState<\s*Question\[\]\s*>/.test(adminDashCode));
check('AdminDashboard no longer declares a local editingQuestion state',
  !/useState<\s*Question \| null\s*>/.test(adminDashCode));
check('AdminDashboard no longer declares a local availableTags state',
  !/const \[\s*availableTags\s*,\s*setAvailableTags\s*\]/.test(adminDashCode));
check('AdminDashboard no longer declares import/tag-modal state duplicates',
  !/const \[\s*isImportModalOpen\s*,/.test(adminDashCode) &&
    !/const \[\s*isManageTagsModalOpen\s*,/.test(adminDashCode) &&
    !/const \[\s*newTagInput\s*,/.test(adminDashCode) &&
    !/const \[\s*importStatus\s*,/.test(adminDashCode));
check('AdminDashboard no longer holds a local questions/tags setter',
  !/setQuestions\(/.test(adminDashCode) && !/setAvailableTags\(/.test(adminDashCode));
check('AdminDashboard no longer imports the Question type',
  !/import\s*\{[^}]*\bQuestion\b[^}]*\}\s*from\s*'\.\.\/types'/.test(adminDashSrc));
check('AdminDashboard no longer references the Question type',
  !/\bQuestion\[\]/.test(adminDashCode) &&
    !/:\s*Question\b/.test(adminDashCode) &&
    !/<Question\b/.test(adminDashCode) &&
    !/\bQuestion\s*\|/.test(adminDashCode));
check('the route-mounted page does NOT invoke its own questions hook',
  !/useAdminQuestionsDomain\(/.test(academicPageCode) &&
    !/useState<\s*Question\[\]\s*>/.test(academicPageCode));
check('the questions domain modules do not import AdminDashboard (no cycle)',
  !/from '[^']*AdminDashboard'/.test(academicHookCode) &&
    !/from '[^']*AdminDashboard'/.test(academicPageCode) &&
    !/from '[^']*AdminDashboard'/.test(academicEditorCode));

/* ------------------------------------------------------------------ */
/* AB. Composition + old JSX removal                                   */
/* ------------------------------------------------------------------ */

section('AB. T4 composition + old Question Bank JSX removal');

check('the canonical domain surface is passed',
  /domain=\{questionsDomain\}/.test(adminDashCode));
check('old Question Bank heading absent from AdminDashboard',
  !/Question Bank Central/.test(adminDashCode));
check('old editor/tags/import modal JSX absent from AdminDashboard',
  !/Question Editor Modal/.test(adminDashCode) &&
    !/Manage Question Categories/.test(adminDashCode) &&
    !/Batch Question Import/.test(adminDashCode));
check('old question table headers absent from AdminDashboard',
  !/Question Preview/.test(adminDashCode));
check('the extracted page owns the Question Bank heading',
  /Question Bank Central/.test(academicPageCode));
check('the extracted page composes the three dialogs',
  /AdminQuestionEditorDialog/.test(academicPageCode) &&
    /AdminQuestionTagsDialog/.test(academicPageCode) &&
    /AdminQuestionImportDialog/.test(academicPageCode));
check('AdminDashboard no longer renders the old Add Question draft inline',
  !/options:\s*\[\s*\{\s*id:\s*'A'/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* AC. Contextual add uses the canonical domain                        */
/* ------------------------------------------------------------------ */

section('AC. T4 contextual add uses the canonical questions domain');

check('runContextualAdd question branch uses the canonical questions domain',
  /questionsDomain\.openContextualQuestionDraft\(\)/.test(
    componentFunctionBody(adminDashCode, 'runContextualAdd')));
check('no direct duplicate questions store in the monolith',
  !/setQuestions\(/.test(adminDashCode) && !/const \[\s*questions\s*,/.test(adminDashCode));
check('runContextualAdd other branches preserved',
  /activeTab === 'leads'/.test(componentFunctionBody(adminDashCode, 'runContextualAdd')) &&
    /activeTab === 'users'/.test(componentFunctionBody(adminDashCode, 'runContextualAdd')) &&
    /activeTab === 'content'/.test(componentFunctionBody(adminDashCode, 'runContextualAdd')));

/* ------------------------------------------------------------------ */
/* AD. Content Library state moved out of the monolith (T5A)           */
/* ------------------------------------------------------------------ */

section('AD. T5A Content Library moved out of AdminDashboard (supersedes the T4 Studio guard)');

// The T4 guard previously FROZE the Studio/video state inside AdminDashboard so
// the T4 academic extraction could not disturb it. T5A is the task that
// legitimately moves that state, so the guard is retired and replaced with the
// post-T5A contract: the state must now live in the content domain ONLY.
for (const name of ['isUploadVideoModalOpen', 'videoLessons', 'editingVideo', 'uploadStatus', 'uploadProgress', 'videoForm']) {
  check(`Studio state "${name}" has LEFT AdminDashboard`,
    !new RegExp(`\\b${name}\\b`).test(adminDashCode));
}
check('Studio video helpers have LEFT AdminDashboard',
  !/const simulateVideoUpload = /.test(adminDashCode) &&
    !/const saveVideoLessons = /.test(adminDashCode) &&
    !/const saveVideoEditor = /.test(adminDashCode));
check('AdminDashboard no longer owns the video storage key',
  !/theprams_demo_video_lessons/.test(adminDashCode));
check('AdminDashboard no longer declares the VideoLessonRecord type or seed',
  !/\bVideoLessonRecord\b/.test(adminDashCode) &&
    !/\bdefaultVideoLessons\b/.test(adminDashCode));
check('the academic extract still did NOT take the video storage key',
  !/theprams_demo_video_lessons/.test(academicHookCode) &&
    !/theprams_demo_video_lessons/.test(academicPageCode));
check('the academic domain imports no Studio/video symbol',
  !/videoLessons|editingVideo|uploadProgress|simulateVideoUpload/.test(academicHookCode) &&
    !/videoLessons|editingVideo|uploadProgress|simulateVideoUpload/.test(academicPageCode));

/* ------------------------------------------------------------------ */
/* AE. Question behaviour (source + executed draft factories)          */
/* ------------------------------------------------------------------ */

section('AE. T4 question behaviour (source + executed draft factories)');

check('duplicate clones, Date.now id, appends "(Copy)" and prepends',
  /id:\s*Date\.now\(\)\.toString\(\)/.test(academicHookCode) &&
    /\(Copy\)/.test(academicHookCode) &&
    /setQuestions\(\[\s*newQuestion\s*,\s*\.\.\.questions\s*\]\)/.test(academicHookCode) &&
    /Soal berhasil diduplikasi\./.test(academicHookCode));
check('save replaces by id or prepends, closes editor and toasts',
  /questions\.find\(\(q\)\s*=>\s*q\.id === updatedQ\.id\)/.test(academicHookCode) &&
    /setEditingQuestion\(null\)/.test(academicHookCode) &&
    /Soal berhasil disimpan\./.test(academicHookCode));
check('delete uses confirm and toasts',
  /confirm\('Delete this question\?'\)/.test(academicHookCode) &&
    /Soal berhasil dihapus\./.test(academicHookCode));
check('addTag only adds when absent',
  /if \(!availableTags\.includes\(tag\)\)/.test(academicHookCode));
check('toggleQuestionTag adds/removes on the editing record',
  /currentTags\.includes\(tag\)/.test(academicHookCode) &&
    /currentTags\.filter\(\(t\)\s*=>\s*t !== tag\)/.test(academicHookCode));
check('CSV import keeps idle/processing/done + 2000/1500 delays',
  /'idle' \| 'processing' \| 'done'/.test(academicHookSrc) &&
    /setImportStatus\('processing'\)/.test(academicHookCode) &&
    /setImportStatus\('done'\)/.test(academicHookCode) &&
    /2000/.test(academicHookCode) && /1500/.test(academicHookCode));
check('CSV import remains a simulation (no parser dependency)',
  !/papaparse|Papa\.parse|parseCsv|csv-parse/i.test(academicImportCode) &&
    /Simulate parsing/.test(academicHookSrc));
check('the import dialog keeps no video-upload state',
  !/uploadStatus|uploadProgress|videoForm/.test(academicImportCode));

// Executed: the two create paths and the seed data (pure data module).
const questionData = await compileAndImport(
  join(srcDir, 'features', 'admin', 'academic', 'adminQuestionData.ts'),
);
const blankDraft = questionData.createBlankQuestionDraft();
const contextualDraft = questionData.createContextualQuestionDraft();
check('executed: "Add Question" draft has five options A-E',
  blankDraft.options.map((o) => o.id).join(',') === 'A,B,C,D,E');
check('executed: contextual draft has two options A-B',
  contextualDraft.options.map((o) => o.id).join(',') === 'A,B');
check('executed: the two create paths stay DIFFERENT (not normalised)',
  blankDraft.options.length !== contextualDraft.options.length);
check('executed: seed data holds the two legacy demo questions',
  questionData.MOCK_QUESTIONS.length === 2);
check('executed: initial tag registry matches legacy list',
  questionData.INITIAL_QUESTION_TAGS.join(',') === 'IRT,SNBT,CPNS,Kedokteran,Matematika');
check('executed: simulated import yields two demo questions',
  questionData.buildSimulatedImportQuestions().length === 2);

/* ------------------------------------------------------------------ */
/* AF. Accessibility source contract (Academic)                        */
/* ------------------------------------------------------------------ */

section('AF. T4 academic accessibility source contract');

check('row duplicate control has an aria-label',
  /aria-label=\{`Duplikasi soal \$\{/.test(academicPageCode));
check('row edit control has an aria-label',
  /aria-label=\{`Edit soal \$\{/.test(academicPageCode));
check('row delete control has an aria-label',
  /aria-label=\{`Hapus soal \$\{/.test(academicPageCode));
check('row actions area is revealed on focus-within',
  /focus-within:opacity-100/.test(academicPageCode));
check('row actions use the design-system IconButton',
  /IconButton/.test(academicPageCode));
check('editor dialog close has an aria-label',
  /aria-label="Tutup editor soal"/.test(academicEditorCode));
check('tags dialog close has an aria-label',
  /aria-label="Tutup kategori soal"/.test(academicTagsCode));
check('import dialog close has an aria-label',
  /aria-label="Tutup import soal"/.test(academicImportCode));
check('all three dialog closes declare a 44px min target',
  /min-w-\[44px\]/.test(academicEditorCode) && /min-h-\[44px\]/.test(academicEditorCode) &&
    /min-w-\[44px\]/.test(academicTagsCode) && /min-h-\[44px\]/.test(academicTagsCode) &&
    /min-w-\[44px\]/.test(academicImportCode) && /min-h-\[44px\]/.test(academicImportCode));
check('correct-answer controls are 44x44',
  /w-11 h-11/.test(academicEditorCode));
check('correct-answer controls expose aria-pressed',
  /aria-pressed=\{question\.correctOptionId === opt\.id\}/.test(academicEditorCode));
check('tag delete control has an aria-label',
  /aria-label=\{`Hapus tag \$\{tag\}`\}/.test(academicTagsCode));
check('selected tags do NOT use bg-brand-blue + text-white',
  !/bg-brand-blue[^"'`]*text-white|text-white[^"'`]*bg-brand-blue/.test(academicEditorCode));
check('extracted academic surface has no raw brand text utilities',
  !/text-brand-blue|text-brand-orange/.test(academicPageCode) &&
    !/text-brand-blue|text-brand-orange/.test(academicEditorCode) &&
    !/text-brand-blue|text-brand-orange/.test(academicTagsCode) &&
    !/text-brand-blue|text-brand-orange/.test(academicImportCode));
check('academic difficulty badges avoid emerald-600',
  !/text-emerald-600/.test(academicPageCode));

/* ------------------------------------------------------------------ */
/* AG. Security / storage                                              */
/* ------------------------------------------------------------------ */

section('AG. T4 security + storage (no new question key)');

check('no new question storage key introduced',
  !/theprams_demo_questions\b/.test(adminDashSrc) &&
    !/theprams_demo_questions\b/.test(adminFeatureSrc));
check('the question domain introduces no localStorage usage',
  !/localStorage/.test(academicHookCode) &&
    !/localStorage/.test(academicPageCode) &&
    !/localStorage/.test(academicDataCode));
check('SEC-P1-03 still open: no Supabase/auth/AI in the academic domain',
  !/@supabase|supabase|GoogleGenAI|@google\/genai|openmaic/i.test(
    [academicPageSrc, academicHookSrc, academicEditorSrc, academicTagsSrc, academicImportSrc, academicDataSrc].join('\n')));
check('academic domain adds no access-control language',
  !/\b(?:403|Forbidden|unauthorized|access control)\b/i.test(academicPageCode));

/* ================================================================== */
/* B1.4D-T5A ADDITIONS                                                */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* AH. Content Library module presence                                 */
/* ------------------------------------------------------------------ */

section('AH. T5A Content Library extraction — modules + wiring');

check('AdminContentLibraryPage module exists', contentPageSrc.length > 0);
check('useAdminContentDomain module exists', contentHookSrc.length > 0);
check('AdminVideoEditorDialog module exists', contentEditorSrc.length > 0);
check('AdminVideoUploadDialog module exists', contentUploadSrc.length > 0);
check('adminContentData module exists', contentDataSrc.length > 0);
check('studio/content barrel exists',
  /AdminContentLibraryPage/.test(contentBarrelSrc) &&
    /useAdminContentDomain/.test(contentBarrelSrc) &&
    /AdminVideoEditorDialog/.test(contentBarrelSrc) &&
    /AdminVideoUploadDialog/.test(contentBarrelSrc));
check('barrel exposes the content surface only (no Website/Blog file)',
  !/Website|Blog/i.test(contentBarrelCode));
check('AdminDashboard renders AdminContentLibraryPage for the content tab',
  /\{activeTab === 'content' && \([\s\S]{0,200}<AdminContentLibraryPage/.test(adminDashCode));
check('AdminContentLibraryPage receives the canonical domain surface',
  /domain=\{contentDomain\}/.test(adminDashCode));
check('AdminContentLibraryPage receives the editable program list (editor select)',
  /<AdminContentLibraryPage[\s\S]{0,200}programs=\{programsDomain\.programsList\}/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* AI. Single Content authority                                        */
/* ------------------------------------------------------------------ */

section('AI. T5A single content store (no duplicate state)');

check('AdminDashboard invokes useAdminContentDomain exactly once',
  (adminDashCode.match(/useAdminContentDomain\(/g) || []).length === 1);
check('AdminDashboard no longer declares local video state',
  !/const \[\s*videoLessons\s*,/.test(adminDashCode) &&
    !/const \[\s*editingVideo\s*,/.test(adminDashCode) &&
    !/const \[\s*uploadStatus\s*,/.test(adminDashCode) &&
    !/const \[\s*uploadProgress\s*,/.test(adminDashCode) &&
    !/const \[\s*videoForm\s*,/.test(adminDashCode) &&
    !/const \[\s*isUploadVideoModalOpen\s*,/.test(adminDashCode));
check('AdminDashboard no longer holds local video setters',
  !/setVideoLessons\(/.test(adminDashCode) &&
    !/setEditingVideo\(/.test(adminDashCode) &&
    !/setUploadStatus\(/.test(adminDashCode) &&
    !/setUploadProgress\(/.test(adminDashCode) &&
    !/setVideoForm\(/.test(adminDashCode));
check('the route-mounted page does NOT invoke its own content hook',
  !/useAdminContentDomain\(/.test(contentPageCode) &&
    !/useState<[^>]*VideoLessonRecord[^>]*>/.test(contentPageCode));
check('the content domain modules do not import AdminDashboard (no cycle)',
  !/from '[^']*AdminDashboard'/.test(contentHookCode) &&
    !/from '[^']*AdminDashboard'/.test(contentPageCode) &&
    !/from '[^']*AdminDashboard'/.test(contentEditorCode) &&
    !/from '[^']*AdminDashboard'/.test(contentUploadCode));
check('contextual add content branch uses the canonical content domain',
  /contentDomain\.openUpload\(\)/.test(
    componentFunctionBody(adminDashCode, 'runContextualAdd')));
check('runContextualAdd other branches preserved',
  /activeTab === 'questions'/.test(componentFunctionBody(adminDashCode, 'runContextualAdd')) &&
    /activeTab === 'marketing'/.test(componentFunctionBody(adminDashCode, 'runContextualAdd')));

/* ------------------------------------------------------------------ */
/* AJ. Video storage ownership                                         */
/* ------------------------------------------------------------------ */

section('AJ. T5A video storage (canonical key, one owner, 13 keys)');

check('the content data module owns the canonical key constant',
  /VIDEO_LESSONS_STORAGE_KEY\s*=\s*'theprams_demo_video_lessons'/.test(contentDataCode));
check('the content hook reads the key with the legacy fallback',
  /readStorageArray\(\s*VIDEO_LESSONS_STORAGE_KEY\s*,\s*defaultVideoLessons\s*\)/.test(contentHookCode));
check('the content hook writes the key with the legacy semantics',
  /localStorage\.setItem\(\s*VIDEO_LESSONS_STORAGE_KEY\s*,\s*JSON\.stringify\(/.test(contentHookCode));
const videoKeyOccurrences =
  ([adminDashCode, adminFeatureCode].join('\n').match(/theprams_demo_video_lessons/g) || []).length;
check('exactly one logical owner of the video key literal across the admin tree',
  videoKeyOccurrences === 1, `found ${videoKeyOccurrences}`);
check('the storage registry is still exactly 13 keys',
  discovered.size === 13, `found ${discovered.size}`);
check('no extra content storage key introduced',
  !/theprams_demo_(?!video_lessons|users|leads|transactions|payment_proofs|finance_entries|finance_realizations|assets|audit_events|notifications|registrations|blog_assets|website_questions)/.test(
    [contentPageSrc, contentHookSrc, contentEditorSrc, contentUploadSrc, contentDataSrc].join('\n')));

/* ------------------------------------------------------------------ */
/* AK. Content behaviour (source contract + executed seed)             */
/* ------------------------------------------------------------------ */

section('AK. T5A content behaviour (save/delete/upload parity + executed seed)');

check('save: empty title notifies and bails',
  /if \(!video\.title\.trim\(\)\)[\s\S]{0,80}Judul video wajib diisi\./.test(contentHookCode));
check('save: trims title / program / duration / thumbnail / tags',
  /title:\s*video\.title\.trim\(\)/.test(contentHookCode) &&
    /program:\s*video\.program\.trim\(\)\s*\|\|\s*PROGRAMS\[0\]\.title/.test(contentHookCode) &&
    /duration:\s*video\.duration\.trim\(\)\s*\|\|\s*'00:00'/.test(contentHookCode) &&
    /thumbnail:\s*video\.thumbnail\.trim\(\)\s*\|\|\s*defaultVideoLessons\[0\]\.thumbnail/.test(contentHookCode) &&
    /tags:\s*video\.tags\.map\(\(tag\)\s*=>\s*tag\.trim\(\)\)\.filter\(Boolean\)/.test(contentHookCode));
check('save: replaces by id OR prepends',
  /videoLessons\.some\(\(item\)\s*=>\s*item\.id === sanitized\.id\)/.test(contentHookCode) &&
    /\[\s*sanitized\s*,\s*\.\.\.videoLessons\s*\]/.test(contentHookCode));
check('save: persists, closes editor, audits and toasts',
  /saveVideoLessons\(nextVideos\)/.test(contentHookCode) &&
    /setEditingVideo\(null\)/.test(contentHookCode) &&
    /recordAudit\('Content Library',\s*'Save Video Lesson',\s*sanitized\.title\)/.test(contentHookCode) &&
    /Detail video berhasil disimpan\./.test(contentHookCode));
check('delete: filters the demo list and toasts (no confirm invented)',
  /videoLessons\.filter\(\(item\)\s*=>\s*item\.id !== video\.id\)/.test(contentHookCode) &&
    /dihapus dari daftar demo\./.test(contentHookCode) &&
    !/confirm\(/.test(contentHookCode));
check('upload: idle -> uploading, progress restarts at 0',
  /setUploadStatus\('uploading'\)/.test(contentHookCode) &&
    /setUploadProgress\(0\)/.test(contentHookCode));
check('upload: increments by 5 every 100ms',
  /return prev \+ 5;/.test(contentHookCode) && /},\s*100\);/.test(contentHookCode));
check('upload: completes, then after 1500ms closes and resets',
  /setUploadStatus\('completed'\)/.test(contentHookCode) &&
    /},\s*1500\);/.test(contentHookCode) &&
    /setIsUploadModalOpen\(false\)/.test(contentHookCode) &&
    /setUploadStatus\('idle'\)/.test(contentHookCode) &&
    /setVideoForm\(createInitialVideoForm\(\)\)/.test(contentHookCode));
check('upload: blank title is a no-op guard',
  /if \(!videoForm\.title\) return;/.test(contentHookCode));
check('upload form program falls back to the first canonical program',
  /program:\s*PROGRAMS\[0\]\.title/.test(contentHookCode));
check('upload is a demo: no File API / no real upload dependency',
  !/FileReader|\.arrayBuffer\(|XMLHttpRequest|fetch\(/.test(contentHookCode) &&
    !/FileReader|\.arrayBuffer\(/.test(contentUploadCode));
check('the content domain imports no AdminDashboard-owned symbol',
  !/notify\('Notifikasi/.test(contentHookCode) &&
    !/BlogPost|WebsiteQuestion/.test(contentHookCode));

// Executed: the seed list (pure data module).
const contentData = await compileAndImport(
  join(srcDir, 'features', 'admin', 'studio', 'content', 'adminContentData.ts'),
);
check('executed: canonical video storage key is unchanged',
  contentData.VIDEO_LESSONS_STORAGE_KEY === 'theprams_demo_video_lessons');
check('executed: seed holds the four legacy demo lessons',
  contentData.defaultVideoLessons.length === 4);
check('executed: seed ids are video-1..video-4',
  contentData.defaultVideoLessons.map((v) => v.id).join(',') ===
    'video-1,video-2,video-3,video-4');
check('executed: seed statuses are Published/Published/Draft/Published',
  contentData.defaultVideoLessons.map((v) => v.status).join(',') ===
    'Published,Published,Draft,Published');
check('executed: seed accesses are Premium/Free/Premium/Scholarship',
  contentData.defaultVideoLessons.map((v) => v.access).join(',') ===
    'Premium,Free,Premium,Scholarship');
check('executed: seed tags preserved (first lesson)',
  contentData.defaultVideoLessons[0].tags.join(',') === 'Kedokteran,Anatomi');
check('executed: every seed record keeps all 13 fields',
  contentData.defaultVideoLessons.every((v) =>
    ['id', 'title', 'program', 'duration', 'views', 'date', 'status', 'access',
      'thumbnail', 'description', 'mentor', 'module', 'tags', 'notes']
      .every((k) => Object.prototype.hasOwnProperty.call(v, k))));

/* ------------------------------------------------------------------ */
/* AL. Composition + old Content Library JSX removal                    */
/* ------------------------------------------------------------------ */

section('AL. T5A composition + old Content Library JSX removal');

check('the canonical domain surface is passed',
  /domain=\{contentDomain\}/.test(adminDashCode));
check('old Content Library heading absent from AdminDashboard',
  !/Content Management/.test(adminDashCode));
check('old Recent Lessons JSX absent from AdminDashboard',
  !/Recent Lessons/.test(adminDashCode) &&
    !/Manage video lessons and learning materials/.test(adminDashCode));
check('old video editor / upload modal JSX absent from AdminDashboard',
  !/Video Lesson Editor/.test(adminDashCode) &&
    !/Upload Video Materi/.test(adminDashCode) &&
    !/Start Upload/.test(adminDashCode));
check('old content metric labels absent from AdminDashboard',
  !/Watch Time/.test(adminDashCode) &&
    !/Active Viewers/.test(adminDashCode));
check('the extracted page owns the Content Library heading',
  /Content Management/.test(contentPageCode));
check('the extracted page composes both dialogs',
  /AdminVideoEditorDialog/.test(contentPageCode) &&
    /AdminVideoUploadDialog/.test(contentPageCode));
check('the extracted page keeps the static demo metrics',
  /8\.5k hrs/.test(contentPageCode) && /842/.test(contentPageCode));
check('the extracted page keeps the derived completion metric',
  /Math\.round\([\s\S]{0,200}Math\.max\(domain\.videoLessons\.length,\s*1\)/.test(contentPageCode));

/* ------------------------------------------------------------------ */
/* AM. Website / Blog (T5B) non-regression                             */
/* ------------------------------------------------------------------ */

section('AM. T5B Website / Blog state has LEFT AdminDashboard (supersedes the T5A freeze)');

// This section WAS the T5A non-regression guard that FROZE the Website/Blog
// state inside AdminDashboard while T5A extracted the Content Library. T5B is
// the stage that legitimately moves that surface, so the guard is RETIRED and
// replaced with the post-T5B contract: the state must now live in the Website
// domain ONLY and the monolith must keep ZERO Website/Blog atoms.
check('activeTab === "website" still lives in AdminDashboard (route render)',
  /activeTab === 'website'/.test(adminDashCode));
for (const name of [
  'isSaveWebsiteConfirmOpen', 'editingBlogPost', 'previewBlogPost',
  'blogEditorAssets', 'editingBlogAsset', 'isMiddleInsertOpen',
  'isBlogAiChatOpen', 'middlePreviewAsset', 'middlePreviewRelatedId',
  'internetAssetUrl', 'internetAssetName', 'aiChatPrompt', 'aiChatDraft',
  'blogPostDrafts', 'blogEditorSearchTerm', 'blogEditorCategory',
]) {
  check(`T5B state "${name}" has LEFT AdminDashboard`,
    !new RegExp(`\\b${name}\\b`).test(adminDashCode));
}
check('the Website/Blog helpers have LEFT AdminDashboard',
  !/const createBlogPostDraft = /.test(adminDashCode) &&
    !/const saveBlogPost = /.test(adminDashCode) &&
    !/const syncBlogPostsToWebsite = /.test(adminDashCode) &&
    !/const generateAiBlogDraft = /.test(adminDashCode) &&
    !/const saveBlogEditorAssets = /.test(adminDashCode));
check('the content extract did NOT take any Website/Blog symbol',
  !/blogPost|website|Blog|Website/i.test(contentHookCode) &&
    !/blogPost|website|Blog|Website/i.test(contentPageCode));
check('the Website/Blog feature directory now exists',
  existsSync(websiteFeatureDir));

/* ------------------------------------------------------------------ */
/* AN. Accessibility source contract (Content)                         */
/* ------------------------------------------------------------------ */

section('AN. T5A content accessibility source contract');

check('row edit control has an aria-label',
  /aria-label=\{`Edit video \$\{/.test(contentPageCode));
check('row delete control has an aria-label',
  /aria-label=\{`Hapus video \$\{/.test(contentPageCode));
check('row actions use the design-system IconButton (≥44px target)',
  /IconButton/.test(contentPageCode));
check('editor dialog close has an aria-label',
  /aria-label="Tutup editor video"/.test(contentEditorCode));
check('upload dialog close has an aria-label',
  /aria-label="Tutup upload video"/.test(contentUploadCode));
check('both dialog closes declare a 44px min target',
  /min-w-\[44px\]/.test(contentEditorCode) && /min-h-\[44px\]/.test(contentEditorCode) &&
    /min-w-\[44px\]/.test(contentUploadCode) && /min-h-\[44px\]/.test(contentUploadCode));
check('editor fields carry accessible names',
  /aria-label="Judul Video"/.test(contentEditorCode) &&
    /aria-label="Program"/.test(contentEditorCode) &&
    /aria-label="Deskripsi Video"/.test(contentEditorCode) &&
    /aria-label="Thumbnail URL"/.test(contentEditorCode) &&
    /aria-label="Tags \(pisahkan koma\)"/.test(contentEditorCode));
check('upload fields carry accessible names',
  /aria-label="Video Title"/.test(contentUploadCode) &&
    /aria-label="Associated Program"/.test(contentUploadCode) &&
    /aria-label="Video Description"/.test(contentUploadCode));
check('the file input is sr-only (keyboard reachable), not hidden',
  /type="file"[\s\S]{0,60}className="sr-only"/.test(contentUploadCode) &&
    !/type="file"[\s\S]{0,60}className="hidden"/.test(contentUploadCode));
check('selected tags do NOT use bg-brand-blue + text-white',
  !/bg-brand-blue[^"'`]*text-white|text-white[^"'`]*bg-brand-blue/.test(contentEditorCode) &&
    !/bg-brand-blue[^"'`]*text-white|text-white[^"'`]*bg-brand-blue/.test(contentUploadCode) &&
    !/bg-brand-blue[^"'`]*text-white|text-white[^"'`]*bg-brand-blue/.test(contentPageCode));
check('extracted content surface has no raw brand text utilities',
  !/text-brand-blue|text-brand-orange/.test(contentPageCode) &&
    !/text-brand-blue|text-brand-orange/.test(contentEditorCode) &&
    !/text-brand-blue|text-brand-orange/.test(contentUploadCode));
check('content status badges avoid emerald-600',
  !/text-emerald-600/.test(contentPageCode));

/* ------------------------------------------------------------------ */
/* AO. Security / storage                                              */
/* ------------------------------------------------------------------ */

section('AO. T5A security deferrals (no auth/Supabase/AI added)');

check('SEC-P1-03 still open: no Supabase/auth/AI in the content domain',
  !/@supabase|supabase|GoogleGenAI|@google\/genai|openmaic/i.test(
    [contentPageSrc, contentHookSrc, contentEditorSrc, contentUploadSrc, contentDataSrc].join('\n')));
check('the content page/dialogs introduce no localStorage usage',
  !/localStorage/.test(contentPageCode) &&
    !/localStorage/.test(contentEditorCode) &&
    !/localStorage/.test(contentUploadCode));
check('the content data module introduces no localStorage usage',
  !/localStorage/.test(contentDataCode));
check('the content domain adds no access-control language',
  !/\b(?:403|Forbidden|unauthorized|access control)\b/i.test(contentPageCode));
check('no router change: content path is still /admin/studio/content',
  allAdminPaths().includes('/admin/studio/content'));

/* ------------------------------------------------------------------ */
/* AP. Website modules + composition wiring                            */
/* ------------------------------------------------------------------ */

section('AP. T5B Website Editor + Blog/Literasi modules + wiring');

const WEBSITE_MODULES = [
  'AdminWebsiteEditorPage.tsx',
  'AdminWebsiteSaveConfirmDialog.tsx',
  'AdminBlogEditorDialog.tsx',
  'AdminBlogMiddleInsertDialog.tsx',
  'AdminBlogAssetEditorDialog.tsx',
  'AdminBlogPreviewDialog.tsx',
  'useAdminWebsiteDomain.ts',
  'adminWebsiteData.ts',
  'index.ts',
];
for (const file of WEBSITE_MODULES) {
  check(`website module "${file}" exists`,
    existsSync(join(websiteFeatureDir, file)));
}
check('AdminDashboard imports the Website barrel',
  /from '\.\.\/features\/admin\/studio\/website'/.test(adminDashCode));
check('AdminDashboard invokes useAdminWebsiteDomain exactly once',
  (adminDashCode.match(/useAdminWebsiteDomain\(/g) || []).length === 1);
check('the hook exports useAdminWebsiteDomain',
  /export function useAdminWebsiteDomain\(/.test(websiteHookCode));
check('the page exports AdminWebsiteEditorPage',
  /export function AdminWebsiteEditorPage\(/.test(websitePageCode));
check('the barrel re-exports the page, hook and dialogs',
  /AdminWebsiteEditorPage/.test(websiteBarrelCode) &&
    /useAdminWebsiteDomain/.test(websiteBarrelCode) &&
    /AdminBlogEditorDialog/.test(websiteBarrelCode) &&
    /AdminBlogPreviewDialog/.test(websiteBarrelCode));
check('the data module owns the templates + canonical asset key',
  /BLOG_EDITOR_TEMPLATES/.test(websiteDataCode) &&
    /BLOG_ASSETS_STORAGE_KEY/.test(websiteDataCode));

/* ------------------------------------------------------------------ */
/* AQ. Single Website authority                                        */
/* ------------------------------------------------------------------ */

section('AQ. T5B single Website authority (no duplicate state)');

check('the hook is invoked ONCE, never by the page/dialogs',
  (adminDashCode.match(/useAdminWebsiteDomain\(/g) || []).length === 1 &&
    !/useAdminWebsiteDomain\(/.test(websiteDomainCode.replace(websiteHookCode, '')));
check('only the hook declares the Website state atoms',
  /const \[isSaveWebsiteConfirmOpen, setIsSaveWebsiteConfirmOpen\] = useState\(false\)/.test(websiteHookCode) &&
    /const \[blogPostDrafts, setBlogPostDrafts\] = useState<BlogPost\[\]>\(blogPosts\)/.test(websiteHookCode));
check('the extracted page/dialogs are stateless (no local useState)',
  !/useState/.test(websitePageCode) &&
    !/useState/.test(blogEditorCode) &&
    !/useState/.test(blogMiddleInsertCode) &&
    !/useState/.test(blogAssetEditorCode) &&
    !/useState/.test(blogPreviewCode) &&
    !/useState/.test(websiteSaveConfirmCode));
check('no import cycle: the Website domain never imports AdminDashboard',
  !/AdminDashboard/.test(websiteDomainCode));
check('the Website domain never imports the legacy state provider',
  !/LegacyAppStateProvider/.test(websiteDomainCode));
check('AdminDashboard passes blogPosts + onBlogPostsChange into the hook',
  /useAdminWebsiteDomain\(\{\s*blogPosts,\s*onBlogPostsChange,\s*notify,\s*recordAudit\s*\}\)/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* AR. Blog prop bridge                                                */
/* ------------------------------------------------------------------ */

section('AR. T5B blog prop bridge (blogPosts / onBlogPostsChange)');

check('the hook seeds blogPostDrafts from the blogPosts prop',
  /useState<BlogPost\[\]>\(blogPosts\)/.test(websiteHookCode));
check('the prop re-sync effect is preserved',
  /useEffect\(\(\) => \{\s*setBlogPostDrafts\(blogPosts\);\s*\}, \[blogPosts\]\)/.test(websiteHookCode));
check('save + sync still publish through onBlogPostsChange',
  (websiteHookCode.match(/onBlogPostsChange\?\.\(/g) || []).length >= 2);
check('no localStorage persistence is invented for BlogPost records',
  !/theprams_demo_blog_posts/.test(websiteDomainCode) &&
    !/localStorage[\s\S]{0,60}blogPostDrafts/i.test(websiteHookCode));
check('AdminDashboard still declares the six-prop signature',
  /blogPosts\?: BlogPost\[\]/.test(adminDashSrc) &&
    /onBlogPostsChange\?: \(posts: BlogPost\[\]\) => void/.test(adminDashSrc));

/* ------------------------------------------------------------------ */
/* AS. Blog-asset storage                                              */
/* ------------------------------------------------------------------ */

section('AS. T5B blog-asset storage (canonical key, one owner, no new key)');

check('the canonical blog-asset key is declared exactly once in the domain',
  (websiteDomainCode.match(/theprams_demo_blog_assets/g) || []).length === 1);
check('the key literal lives in the data module',
  /BLOG_ASSETS_STORAGE_KEY = 'theprams_demo_blog_assets'/.test(websiteDataCode));
check('the hook reads the assets through the same helper',
  /readStorageArray\(BLOG_ASSETS_STORAGE_KEY\)/.test(websiteHookCode));
check('the hook writes with the same setItem/JSON.stringify semantics',
  /localStorage\.setItem\(BLOG_ASSETS_STORAGE_KEY, JSON\.stringify\(nextAssets\)\)/.test(websiteHookCode));
check('AdminDashboard no longer owns the blog-asset key',
  !/theprams_demo_blog_assets/.test(adminDashCode));
check('the website domain introduces exactly ONE theprams_demo_ key',
  (websiteDomainCode.match(/theprams_demo_[a-zA-Z_]+/g) || []).length === 1);

/* ------------------------------------------------------------------ */
/* AT. Blog behaviour (source + executed data module)                  */
/* ------------------------------------------------------------------ */

section('AT. T5B blog behaviour (source contract + EXECUTED data module)');

check('create draft: template match, Date.now id, legacy fallbacks',
  /BLOG_EDITOR_TEMPLATES\.find\(\(item\) => item\.category === category\)\s*\|\|\s*BLOG_EDITOR_TEMPLATES\[0\]/.test(websiteHookCode) &&
    /id: `blog-\$\{Date\.now\(\)\}`/.test(websiteHookCode) &&
    /author: 'Admin The Prams'/.test(websiteHookCode) &&
    /authorRole: 'Content Specialist'/.test(websiteHookCode) &&
    /readTime: '5 min read'/.test(websiteHookCode) &&
    /tags: template\?\.tags \|\| \[category\]/.test(websiteHookCode));
check('save blog: sanitises tags, replaces by id OR prepends, closes + audits + toasts',
  /tags: post\.tags\.map\(\(tag\) => tag\.trim\(\)\)\.filter\(Boolean\)/.test(websiteHookCode) &&
    /blogPostDrafts\.find\(\(item\) => item\.id === sanitized\.id\)/.test(websiteHookCode) &&
    /\[sanitized, \.\.\.blogPostDrafts\]/.test(websiteHookCode) &&
    /setEditingBlogPost\(null\)/.test(websiteHookCode) &&
    /recordAudit\('Website Editor', 'Save Blog\/Literasi', sanitized\.title\)/.test(websiteHookCode) &&
    /Konten Info Menarik tersimpan dan tampil di website\./.test(websiteHookCode));
check('publish/sync: set drafts, publish prop, audit count, toast',
  /const syncBlogPostsToWebsite = \(posts = blogPostDrafts\)/.test(websiteHookCode) &&
    /recordAudit\('Website Editor', 'Publish Info Menarik', `\$\{posts\.length\} artikel`\)/.test(websiteHookCode) &&
    /Info Menarik & Literasi sudah disinkronkan ke website publik\./.test(websiteHookCode));
check('delete filters by id then re-syncs',
  /blogPostDrafts\.filter\(\(item\) => item\.id !== id\)/.test(websiteHookCode) &&
    /Artikel dihapus dari Info Menarik\./.test(websiteHookCode));
check('duplicate clones, Date.now id, " - Copy", prepends and opens the copy',
  /`\$\{post\.title\} - Copy`/.test(websiteHookCode) &&
    /const nextPosts = \[copy, \.\.\.blogPostDrafts\]/.test(websiteHookCode) &&
    /setEditingBlogPost\(copy\)/.test(websiteHookCode));
check('insert content block appends after trimmed content (no-op without a draft)',
  /if \(!editingBlogPost\) return;/.test(websiteHookCode) &&
    /content: `\$\{editingBlogPost\.content\.trim\(\)\}\\n\\n\$\{block\}`\.trim\(\)/.test(websiteHookCode));
check('related options: selected first, excluding the current post, sliced to 3',
  /\.slice\(0, 3\)/.test(websiteHookCode) &&
    /item\.id !== post\.id && item\.id !== selected\?\.id/.test(websiteHookCode));
check('internet asset: URL required + image-extension detection incl. unsplash',
  /if \(!url\) \{/.test(websiteHookCode) &&
    /\.\(png\|jpe\?g\|webp\|gif\|svg\)/.test(websiteHookCode) &&
    /images\.unsplash\.com/.test(websiteHookCode) &&
    /source\.unsplash\.com/.test(websiteHookCode) &&
    /name: internetAssetName\.trim\(\) \|\| \(isImage \? 'Gambar Internet' : 'Dokumen Internet'\)/.test(websiteHookCode));
check('PC asset import uses a real FileReader readAsDataURL (local demo)',
  /new FileReader\(\)/.test(websiteHookCode) &&
    /reader\.readAsDataURL\(file\)/.test(websiteHookCode) &&
    /file\.type\.startsWith\('image\/'\)/.test(websiteHookCode) &&
    /KB dari PC/.test(websiteHookCode));
check('asset insert branches image vs document markdown; delete persists',
  /if \(asset\.type === 'image'\) \{[\s\S]*?\} else \{/.test(websiteHookCode) &&
    /!\[\$\{asset\.name\}\]\(\$\{asset\.url\}\)/.test(websiteHookCode) &&
    /saveBlogEditorAssets\(blogEditorAssets\.filter\(\(asset\) => asset\.id !== id\)\)/.test(websiteHookCode));

// Executed: the preserved data module (pure, no runtime deps).
const websiteData = await compileAndImport(
  join(srcDir, 'features', 'admin', 'studio', 'website', 'adminWebsiteData.ts'),
);
check('executed: canonical blog-asset key is EXACT',
  websiteData.BLOG_ASSETS_STORAGE_KEY === 'theprams_demo_blog_assets');
check('executed: category filter list preserved exactly',
  websiteData.BLOG_CATEGORY_OPTIONS.join(',') ===
    'Semua,Tips & Trik,Info PTN,Materi,Inspirasi,Literasi');
check('executed: exactly four article templates are preserved',
  websiteData.BLOG_EDITOR_TEMPLATES.length === 4);
check('executed: template labels + categories preserved',
  websiteData.BLOG_EDITOR_TEMPLATES.map((t) => `${t.label}:${t.category}`).join('|') ===
    'Template Tips Belajar:Tips & Trik|Template Literasi:Literasi|Template Info Seleksi:Info PTN|Template CPNS/SKD:Materi');
check('executed: template tag lists preserved',
  websiteData.BLOG_EDITOR_TEMPLATES.map((t) => t.tags.join(',')).join('|') ===
    'Tips Belajar,Strategi,Tryout|Literasi,SNBT,Membaca|Info Seleksi,Pendaftaran,Persiapan|CPNS,SKD,Strategi');
check('executed: template bodies are non-trivial markdown',
  websiteData.BLOG_EDITOR_TEMPLATES.every(
    (t) => t.content.includes('## ') && t.content.length > 200));

/* ------------------------------------------------------------------ */
/* AU. Pseudo "AI" helper stays local + deterministic                  */
/* ------------------------------------------------------------------ */

section('AU. T5B pseudo "AI" helper stays LOCAL + deterministic');

check('the helper exists and derives a topic with the legacy fallback chain',
  /const generateAiBlogDraft = \(\) => \{/.test(websiteHookCode) &&
    /aiChatPrompt\.trim\(\) \|\| editingBlogPost\?\.title \|\| 'topik artikel'/.test(websiteHookCode));
check('the local draft copy + notification are preserved',
  /cek kembali akurasi data sebelum publish\./.test(websiteHookCode) &&
    /AI chat agent membuat draft blok artikel\./.test(websiteHookCode));
check('no external AI / network client anywhere in the Website domain',
  !/fetch\(|axios|\bopenai\b|@google\/genai|GoogleGenAI|generativelanguage|anthropic|huggingface/i.test(websiteDomainCode));

/* ------------------------------------------------------------------ */
/* AV. Composition + old Website JSX removal                           */
/* ------------------------------------------------------------------ */

section('AV. T5B composition + old Website JSX removed from the monolith');

const websiteTabStart = adminDashCode.indexOf("{activeTab === 'website' && (");
const financeTabStart = adminDashCode.indexOf("{activeTab === 'finance' && (");
const websiteTabBlock = websiteTabStart !== -1 && financeTabStart > websiteTabStart
  ? adminDashCode.slice(websiteTabStart, financeTabStart)
  : '';
check('the website tab renders AdminWebsiteEditorPage with the domain',
  websiteTabBlock.length > 0 &&
    /<AdminWebsiteEditorPage/.test(websiteTabBlock) &&
    /domain=\{websiteDomain\}/.test(websiteTabBlock));
check('the page receives the narrow onPreviewWebsite callback (legacy landing nav)',
  /onPreviewWebsite=\{\(\) => setView\?\.\('landing'\)\}/.test(websiteTabBlock));
check('the five Website dialogs render OUTSIDE the tab conditional (state survives tab switch)',
  !/AdminBlogEditorDialog|AdminBlogMiddleInsertDialog|AdminBlogAssetEditorDialog|AdminBlogPreviewDialog|AdminWebsiteSaveConfirmDialog/.test(websiteTabBlock) &&
    /<AdminWebsiteSaveConfirmDialog/.test(adminDashCode) &&
    /<AdminBlogEditorDialog/.test(adminDashCode) &&
    /<AdminBlogMiddleInsertDialog/.test(adminDashCode) &&
    /<AdminBlogAssetEditorDialog/.test(adminDashCode) &&
    /<AdminBlogPreviewDialog/.test(adminDashCode));
check('the old Website panel + editor JSX has LEFT AdminDashboard',
  !/Website Editor Panel/.test(adminDashCode) &&
    !/Editor Info Menarik & Literasi/.test(adminDashCode) &&
    !/Jendela Sisipan Tengah Artikel/.test(adminDashCode));
check('the old Website dialogs have LEFT AdminDashboard',
  !/Edit Aset Editor Blog/.test(adminDashCode) &&
    !/Preview Draft Info Menarik/.test(adminDashCode) &&
    !/Simpan perubahan website\?/.test(adminDashCode));
check('the article templates + BlogEditorAsset interface have LEFT AdminDashboard',
  !/BLOG_EDITOR_TEMPLATES/.test(adminDashCode) &&
    !/interface BlogEditorAsset/.test(adminDashCode));
check('the Website feature renders the legacy panel heading + controls',
  /Website Editor Panel/.test(websitePageCode) &&
    /Preview Changes/.test(websitePageCode) &&
    /Save Changes/.test(websitePageCode) &&
    /Publish Updates/.test(websitePageCode) &&
    /Rincian Menu Website Editor/.test(websitePageCode) &&
    /Editor Info Menarik & Literasi/.test(websitePageCode));

/* ------------------------------------------------------------------ */
/* AW. Review / Inquiries boundary — RETIRED by T6 (asserts the inverse) */
/* ------------------------------------------------------------------ */

section('AW. T5B Review / Inquiries boundary — RETIRED by T6 (inverse)');

// At T5B this section proved the Review / Inquiries surface had NOT been taken.
// T6 deliberately supersedes that freeze: the surface is now extracted into
// `features/admin/review/inquiries`. These checks assert the INVERSE, so the
// T5B claim cannot silently come back.
check('websiteQuestions state has LEFT AdminDashboard (T6 inverse)',
  !/const \[websiteQuestions, setWebsiteQuestions\]/.test(adminDashCode));
check('the Review/Inquiries key has LEFT AdminDashboard (T6 inverse)',
  !/theprams_demo_website_questions/.test(adminDashCode));
check('saveWebsiteQuestions / saveWebsiteQuestionAnswer have LEFT AdminDashboard',
  !/const saveWebsiteQuestions = /.test(adminDashCode) &&
    !/const saveWebsiteQuestionAnswer = /.test(adminDashCode));
check('openQuestionWhatsapp has LEFT AdminDashboard',
  !/const openQuestionWhatsapp = /.test(adminDashCode));
check('the Website extraction STILL did not absorb the Inquiries concern',
  !/theprams_demo_website_questions/.test(websiteDomainCode) &&
    !/websiteQuestions/.test(websiteDomainCode) &&
    !/WebsiteQuestion/.test(websiteDomainCode) &&
    !/saveWebsiteQuestionAnswer|openQuestionWhatsapp/.test(websiteDomainCode));
check('the Inquiries concern landed in the Review/Inquiries domain instead',
  /theprams_demo_website_questions/.test(inquiriesHookCode) &&
    /websiteQuestions/.test(inquiriesHookCode));

/* ------------------------------------------------------------------ */
/* AX. T5A Content Library non-regression                              */
/* ------------------------------------------------------------------ */

section('AX. T5B T5A Content Library non-regression');

check('the content domain files are still present',
  [contentPageSrc, contentHookSrc, contentEditorSrc, contentUploadSrc, contentDataSrc, contentBarrelSrc]
    .every((s) => s.length > 0));
check('AdminDashboard still imports + invokes the content domain ONCE',
  /from '\.\.\/features\/admin\/studio\/content'/.test(adminDashCode) &&
    (adminDashCode.match(/useAdminContentDomain\(/g) || []).length === 1);
check('AdminDashboard still renders AdminContentLibraryPage',
  /<AdminContentLibraryPage/.test(adminDashCode));
check('the content page still renders Content Management',
  /Content Management/.test(contentPageCode));
check('the video storage key is still owned by the content data module',
  /theprams_demo_video_lessons/.test(contentDataCode) &&
    !/theprams_demo_video_lessons/.test(adminDashCode));
check('the Website domain imports no content/video symbol',
  !/videoLessons|VideoLessonRecord|useAdminContentDomain|AdminContentLibraryPage/.test(websiteDomainCode));

/* ------------------------------------------------------------------ */
/* AY. Website accessibility source contract                           */
/* ------------------------------------------------------------------ */

section('AY. T5B website accessibility source contract');

check('blog article actions carry aria-labels',
  /aria-label=\{`Edit artikel \$\{/.test(websitePageCode) &&
    /aria-label=\{`Duplikasi artikel \$\{/.test(websitePageCode) &&
    /aria-label=\{`Hapus artikel \$\{/.test(websitePageCode));
check('blog article actions declare a 44px min target',
  /min-h-\[44px\]/.test(websitePageCode) &&
    (websitePageCode.match(/min-w-\[44px\]/g) || []).length >= 2);
check('every Website dialog close has an aria-label',
  /aria-label="Tutup editor Info Menarik"/.test(blogEditorCode) &&
    /aria-label="Tutup jendela sisipan"/.test(blogMiddleInsertCode) &&
    /aria-label="Tutup aset editor"/.test(blogAssetEditorCode) &&
    /aria-label="Tutup preview artikel"/.test(blogPreviewCode));
check('every Website dialog close declares a 44px target',
  /min-w-\[44px\]/.test(blogEditorCode) && /min-h-\[44px\]/.test(blogEditorCode) &&
    /min-w-\[44px\]/.test(blogMiddleInsertCode) && /min-h-\[44px\]/.test(blogMiddleInsertCode) &&
    /min-w-\[44px\]/.test(blogAssetEditorCode) && /min-h-\[44px\]/.test(blogAssetEditorCode) &&
    /min-w-\[44px\]/.test(blogPreviewCode) && /min-h-\[44px\]/.test(blogPreviewCode));
check('the floating AI toggle + AI panel close are labelled',
  /aria-label="AI Chat Agent"/.test(blogEditorCode) &&
    /aria-label="Tutup AI chat"/.test(blogEditorCode));
check('the PC file input is sr-only (keyboard reachable), not hidden',
  /type="file"[\s\S]{0,160}aria-label="Import aset dari PC"[\s\S]{0,60}className="sr-only"/.test(blogEditorCode) &&
    !/type="file"[\s\S]{0,160}className="hidden"/.test(blogEditorCode));
check('blog editor fields carry accessible names',
  /aria-label="Judul artikel"/.test(blogEditorCode) &&
    /aria-label="Ringkasan kartu"/.test(blogEditorCode) &&
    /aria-label="Kategori"/.test(blogEditorCode) &&
    /aria-label="Tags \(pisahkan koma\)"/.test(blogEditorCode) &&
    /aria-label="Konten Markdown"/.test(blogEditorCode));
check('asset editor fields carry accessible names',
  /aria-label="Nama aset"/.test(blogAssetEditorCode) &&
    /aria-label="Tipe aset"/.test(blogAssetEditorCode) &&
    /aria-label="Sumber aset"/.test(blogAssetEditorCode) &&
    /aria-label="URL atau data file"/.test(blogAssetEditorCode) &&
    /aria-label="Catatan aset"/.test(blogAssetEditorCode));
check('no Website file uses bg-brand-blue + text-white',
  !/bg-brand-blue[^"'`]*text-white|text-white[^"'`]*bg-brand-blue/.test(websiteDomainCode));
check('no Website file uses raw brand text utilities',
  !/text-brand-blue|text-brand-orange/.test(websiteDomainCode));
check('the Website surface avoids emerald-600',
  !/text-emerald-600/.test(websiteDomainCode));

/* ------------------------------------------------------------------ */
/* AZ. Website security + storage                                      */
/* ------------------------------------------------------------------ */

section('AZ. T5B security + storage (13 keys, no new key, SEC-P1-03 open)');

check('the Website domain owns exactly ONE storage key (the blog-asset key)',
  [...new Set(websiteDomainCode.match(/theprams_demo_[a-zA-Z_]+/g) || [])].join(',') ===
    'theprams_demo_blog_assets');
check('the page + dialogs introduce no localStorage usage',
  !/localStorage/.test(websitePageCode) &&
    !/localStorage/.test(blogEditorCode) &&
    !/localStorage/.test(blogMiddleInsertCode) &&
    !/localStorage/.test(blogAssetEditorCode) &&
    !/localStorage/.test(blogPreviewCode) &&
    !/localStorage/.test(websiteSaveConfirmCode));
check('the hook uses localStorage ONLY for the blog-asset key',
  (websiteHookCode.match(/localStorage\./g) || []).length === 1 &&
    /localStorage\.setItem\(BLOG_ASSETS_STORAGE_KEY/.test(websiteHookCode));
check('SEC-P1-03 still open: no Supabase/auth/AI/backend in the Website domain',
  !/@supabase|supabase|GoogleGenAI|@google\/genai|createClient|\bopenai\b|authorization/i.test(websiteDomainCode));
check('the Website domain adds no access-control language',
  !/\b(?:403|Forbidden|unauthorized|access control)\b/i.test(websiteDomainCode));
check('no router change: the website path is still /admin/studio/website',
  allAdminPaths().includes('/admin/studio/website'));

/* ------------------------------------------------------------------ */
/* BA. T6 Review modules + composition wiring                          */
/* ------------------------------------------------------------------ */

section('BA. T6 Review modules (two focused domains, no combined store)');

check('the Inquiries page + domain hook are present',
  inquiriesPageSrc.length > 0 && inquiriesHookSrc.length > 0);
check('the Testimonials page + domain hook are present',
  testimonialsPageSrc.length > 0 && testimonialsHookSrc.length > 0);
check('each Review domain has a barrel and the Review barrel exists',
  inquiriesBarrelSrc.length > 0 &&
    testimonialsBarrelSrc.length > 0 &&
    reviewBarrelSrc.length > 0);
check('the Review barrel re-exports BOTH focused domains',
  /export \* from '\.\/inquiries'/.test(reviewBarrelCode) &&
    /export \* from '\.\/testimonials'/.test(reviewBarrelCode));
check('there is NO combined AdminReviewWorkspacePage (two focused domains)',
  !existsSync(join(reviewFeatureDir, 'AdminReviewWorkspacePage.tsx')));
check('AdminDashboard imports the Review domain barrel',
  /from '\.\.\/features\/admin\/review'/.test(adminDashCode));
check('AdminDashboard invokes each canonical Review hook EXACTLY once',
  (adminDashCode.match(/useAdminInquiriesDomain\(/g) || []).length === 1 &&
    (adminDashCode.match(/useAdminTestimonialsDomain\(/g) || []).length === 1);
check('AdminDashboard renders both extracted Review pages',
  /<AdminInquiriesPage/.test(adminDashCode) &&
    /<AdminTestimonialsPage/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* BB. T6 single Inquiries authority                                   */
/* ------------------------------------------------------------------ */

section('BB. T6 single Inquiries authority (one hook, no duplicate state)');

check('AdminDashboard no longer declares the websiteQuestions state',
  !/websiteQuestions/.test(adminDashCode));
check('AdminDashboard no longer implements the Inquiries helpers',
  !/saveWebsiteQuestions|saveWebsiteQuestionAnswer|openQuestionWhatsapp/.test(adminDashCode));
check('the Inquiries state is declared exactly once (in the domain hook)',
  (inquiriesHookCode.match(/useState<WebsiteQuestion\[\]>/g) || []).length === 1);
check('the Inquiries PAGE does not invoke the hook (view only)',
  !/useAdminInquiriesDomain\(/.test(inquiriesPageCode));
check('the Inquiries page owns no canonical useState',
  !/useState/.test(inquiriesPageCode));
check('no import cycle: the Inquiries domain never imports AdminDashboard',
  !/AdminDashboard/.test(inquiriesDomainCode) &&
    !/LegacyAppStateProvider/.test(inquiriesDomainCode));
check('the Inquiries domain injects notify / recordAudit / queueNotification only',
  /notify: \(message: string\) => void/.test(inquiriesHookCode) &&
    /recordAudit: \(module: string, action: string, detail: string\) => void/.test(inquiriesHookCode) &&
    /queueNotification: \(/.test(inquiriesHookCode));

/* ------------------------------------------------------------------ */
/* BC. T6 inquiries storage ownership                                  */
/* ------------------------------------------------------------------ */

section('BC. T6 inquiries storage ownership (canonical key, one owner, 13 keys)');

check('the canonical Inquiries key is declared in the Inquiries domain',
  /INQUIRIES_STORAGE_KEY = 'theprams_demo_website_questions'/.test(inquiriesHookCode));
check('the canonical Inquiries key has exactly ONE owner across admin source',
  (adminFeatureCode.match(/theprams_demo_website_questions/g) || []).length === 1 &&
    /theprams_demo_website_questions/.test(inquiriesHookCode));
check('the monolith no longer mentions the Inquiries key',
  !/theprams_demo_website_questions/.test(adminDashCode));
check('the initial read keeps the legacy readStorageArray semantics',
  /useState<WebsiteQuestion\[\]>\(\s*\(\) => readStorageArray\(INQUIRIES_STORAGE_KEY\)/.test(inquiriesHookCode));
check('the write keeps legacy localStorage.setItem(key, JSON.stringify(...))',
  /localStorage\.setItem\(INQUIRIES_STORAGE_KEY, JSON\.stringify\(nextQuestions\)\)/.test(inquiriesHookCode),
  'no rename / no migration / no second key');
check('the sync path re-reads the SAME canonical key',
  /readStorageArray<WebsiteQuestion>\(INQUIRIES_STORAGE_KEY\)/.test(inquiriesHookCode));
const t6KeyRegistry = [...new Set(
  `${adminFeatureCode}\n${adminDashCode}`.match(/theprams_demo_[a-z_]+/g) || [])];
check('the admin localStorage key registry is still exactly 13 keys',
  t6KeyRegistry.length === 13, `found ${t6KeyRegistry.length}: ${t6KeyRegistry.join(', ')}`);
check('the Inquiries domain owns exactly ONE storage key',
  [...new Set(inquiriesDomainCode.match(/theprams_demo_[a-z_]+/g) || [])].join(',') ===
    'theprams_demo_website_questions');

/* ------------------------------------------------------------------ */
/* BD. T6 inquiries behaviour                                          */
/* ------------------------------------------------------------------ */

section('BD. T6 inquiries behaviour (sync / answer / queue / audit / WhatsApp)');

check('Sync Data is a LOCAL storage refresh (no backend sync invented)',
  /const syncQuestionsFromStorage = \(\) => \{/.test(inquiriesHookCode) &&
    /setWebsiteQuestions\(latest\)/.test(inquiriesHookCode) &&
    /notify\('Data pertanyaan website disinkronkan\.'\)/.test(inquiriesHookCode));
check('the three metrics preserve the legacy status filters',
  /total: websiteQuestions\.length/.test(inquiriesHookCode) &&
    /unanswered: websiteQuestions\.filter\(\(q\) => q\.status === 'Baru'\)\.length/.test(inquiriesHookCode) &&
    /answered: websiteQuestions\.filter\(\(q\) => q\.status === 'Dibalas'\)\.length/.test(inquiriesHookCode));
check('save answer preserves adminAnswer / Dibalas / answeredAt locale',
  /adminAnswer: answer/.test(inquiriesHookCode) &&
    /status: 'Dibalas' as const/.test(inquiriesHookCode) &&
    /answeredAt: new Date\(\)\.toLocaleString\('id-ID'\)/.test(inquiriesHookCode));
check('save answer persists the WHOLE list through saveWebsiteQuestions',
  /saveWebsiteQuestions\(nextQuestions\)/.test(inquiriesHookCode));
check('save answer queues the WhatsApp outbox notification verbatim',
  /queueNotification\('WhatsApp', question\.phone \|\| '-', 'Jawaban pertanyaan The Prams', answer\)/.test(inquiriesHookCode));
check('save answer records the Website Questions audit entry verbatim',
  /recordAudit\('Website Questions', 'Answer Question', `\$\{question\.name\} - \$\{question\.phone\}`\)/.test(inquiriesHookCode));
check('save answer shows the legacy toast',
  /notify\('Jawaban tersimpan dan masuk outbox WhatsApp\.'\)/.test(inquiriesHookCode));
check('WhatsApp phone normalization preserves digits + the 62 prefix rule',
  /String\(question\.phone \|\| ''\)\.replace\(\/\\D\/g, ''\)\.replace\(\/\^0\/, '62'\)/.test(inquiriesHookCode));
check('WhatsApp navigation preserves the fallback number + window.open + _blank',
  /6281234567890/.test(inquiriesHookCode) &&
    /window\.open\(`https:\/\/wa\.me\/\$\{phone \|\| '6281234567890'\}\?text=\$\{encodeURIComponent\(message\)\}`/.test(inquiriesHookCode) &&
    /'_blank'/.test(inquiriesHookCode));
check('the WhatsApp message prefers adminAnswer over the greeting fallback',
  /question\.adminAnswer \|\| `Halo \$\{question\.name\}/.test(inquiriesHookCode));
check('the answer textarea keeps the legacy DOM-read save path',
  /document\.getElementById\(`answer-\$\{question\.id\}`\)/.test(inquiriesPageCode));

/* ------------------------------------------------------------------ */
/* BE. T6 inquiries composition + old JSX removal                      */
/* ------------------------------------------------------------------ */

section('BE. T6 inquiries composition + old Review JSX removed');

check('AdminDashboard renders AdminInquiriesPage from the domain',
  /<AdminInquiriesPage domain=\{inquiriesDomain\}/.test(adminDashCode));
check('the old Inquiries JSX has LEFT the monolith',
  !/Pertanyaan dari Website/.test(adminDashCode) &&
    !/Total Pertanyaan/.test(adminDashCode) &&
    !/Belum Dibalas/.test(adminDashCode) &&
    !/Sudah Dibalas/.test(adminDashCode) &&
    !/Simpan Jawaban/.test(adminDashCode) &&
    !/answer-\$\{question\.id\}/.test(adminDashCode));
check('the Inquiries page renders the legacy surface',
  /Pertanyaan dari Website/.test(inquiriesPageCode) &&
    /Total Pertanyaan/.test(inquiriesPageCode) &&
    /Belum Dibalas/.test(inquiriesPageCode) &&
    /Sudah Dibalas/.test(inquiriesPageCode) &&
    /Sync Data/.test(inquiriesPageCode) &&
    /Simpan Jawaban/.test(inquiriesPageCode) &&
    /Belum ada pertanyaan masuk/.test(inquiriesPageCode));
check('the Inquiries page keeps the WhatsApp action wired to the domain',
  /onClick=\{\(\) => openQuestionWhatsapp\(question\)\}/.test(inquiriesPageCode));

/* ------------------------------------------------------------------ */
/* BF. T6 single Testimonials authority                                */
/* ------------------------------------------------------------------ */

section('BF. T6 single Testimonials authority (one hook, in-memory only)');

check('AdminDashboard no longer declares the testimonials / filter state',
  !/setTestimonials/.test(adminDashCode) && !/testimonialFilter/.test(adminDashCode));
check('AdminDashboard no longer implements updateTestimonialStatus',
  !/const updateTestimonialStatus = /.test(adminDashCode));
check('the Testimonials state is declared exactly once (in the domain hook)',
  (testimonialsHookCode.match(/useState<Testimonial\[\]>\(TESTIMONIALS\)/g) || []).length === 1 &&
    (testimonialsHookCode.match(/useState<TestimonialFilter>\('All'\)/g) || []).length === 1);
check('the Testimonials PAGE does not invoke the hook (view only)',
  !/useAdminTestimonialsDomain\(/.test(testimonialsPageCode));
check('the Testimonials page owns no canonical useState',
  !/useState/.test(testimonialsPageCode));
check('no import cycle: the Testimonials domain never imports AdminDashboard',
  !/AdminDashboard/.test(testimonialsDomainCode) &&
    !/LegacyAppStateProvider/.test(testimonialsDomainCode));
check('the Testimonials domain injects notify only',
  /notify: \(message: string\) => void;/.test(testimonialsHookCode) &&
    !/recordAudit|queueNotification/.test(testimonialsHookCode));

/* ------------------------------------------------------------------ */
/* BG. T6 testimonial behaviour + EXECUTED seed                        */
/* ------------------------------------------------------------------ */

section('BG. T6 testimonial behaviour (seed / filter / status / delete + EXECUTED)');

check('the seed is preserved verbatim from the TESTIMONIALS constant',
  /import \{ TESTIMONIALS \} from '\.\.\/\.\.\/\.\.\/\.\.\/constants'/.test(testimonialsHookCode) &&
    /useState<Testimonial\[\]>\(TESTIMONIALS\)/.test(testimonialsHookCode));
check('the filter union is the legacy All | Pending | Approved',
  /type TestimonialFilter = 'All' \| 'Pending' \| 'Approved'/.test(testimonialsHookCode));
check('the page exposes NO Rejected filter tab (contract preserved)',
  !/Rejected \(/.test(testimonialsPageCode));
check('the derived pending / approved / rejected lists are preserved',
  /pendingTestimonials = useMemo\(\(\) => testimonials\.filter\(t => t\.status === 'Pending'\)/.test(testimonialsHookCode) &&
    /approvedTestimonials = useMemo\(\(\) => testimonials\.filter\(t => t\.status === 'Approved'\)/.test(testimonialsHookCode) &&
    /rejectedTestimonials = useMemo\(\(\) => testimonials\.filter\(t => t\.status === 'Rejected'\)/.test(testimonialsHookCode));
check('visibleTestimonials keeps the legacy All-else-status semantics',
  /if \(testimonialFilter === 'All'\) return testimonials;/.test(testimonialsHookCode) &&
    /return testimonials\.filter\(\(item\) => item\.status === testimonialFilter\);/.test(testimonialsHookCode));
check('approve / reject preserve the legacy status updater + toast',
  /setTestimonials\(prev => prev\.map\(t => t\.id === id \? \{ \.\.\.t, status \} : t\)\)/.test(testimonialsHookCode) &&
    /notify\(`Testimoni ditandai \$\{status\}\.`\)/.test(testimonialsHookCode));
check('delete preserves the legacy inline mutation + toast',
  /setTestimonials\(\(prev\) => prev\.filter\(\(item\) => item\.id !== id\)\)/.test(testimonialsHookCode) &&
    /notify\('Testimoni dihapus\.'\)/.test(testimonialsHookCode));
check('Testimonials add NO persistence, NO key and NO audit',
  !/localStorage/.test(testimonialsDomainCode) &&
    !/theprams_demo_/.test(testimonialsDomainCode) &&
    !/recordAudit|queueNotification/.test(testimonialsDomainCode));

// EXECUTED: load the REAL seed and run the REAL `visibleTestimonials` predicate.
let testimonialSeed = null;
let testimonialSeedError = '';
try {
  const constantsModule = await compileAndImport(join(srcDir, 'constants.ts'));
  testimonialSeed = constantsModule.TESTIMONIALS;
} catch (error) {
  testimonialSeedError = error instanceof Error ? error.message : String(error);
}
check('EXECUTED: the real TESTIMONIALS seed loads from src/constants.ts',
  Array.isArray(testimonialSeed) && testimonialSeed.length > 0,
  testimonialSeedError || (Array.isArray(testimonialSeed) ? `len ${testimonialSeed.length}` : 'empty'));
check('EXECUTED: every seed status is inside the Approved/Pending/Rejected contract',
  Array.isArray(testimonialSeed) &&
    testimonialSeed.every((t) => ['Pending', 'Approved', 'Rejected'].includes(t.status)));
check('EXECUTED: seed ids are unique (stable React keys)',
  Array.isArray(testimonialSeed) &&
    new Set(testimonialSeed.map((t) => t.id)).size === testimonialSeed.length);
const visibleFor = (filter) =>
  !Array.isArray(testimonialSeed) ? []
    : filter === 'All' ? testimonialSeed
      : testimonialSeed.filter((item) => item.status === filter);
check('EXECUTED: All shows everything; Pending/Approved are exact partitions',
  Array.isArray(testimonialSeed) &&
    visibleFor('All').length === testimonialSeed.length &&
    visibleFor('Pending').every((t) => t.status === 'Pending') &&
    visibleFor('Approved').every((t) => t.status === 'Approved') &&
    visibleFor('Pending').length === testimonialSeed.filter((t) => t.status === 'Pending').length &&
    visibleFor('Approved').length === testimonialSeed.filter((t) => t.status === 'Approved').length);

/* ------------------------------------------------------------------ */
/* BH. T6 testimonials composition + old JSX removal                   */
/* ------------------------------------------------------------------ */

section('BH. T6 testimonials composition + old moderation JSX removed');

check('AdminDashboard renders AdminTestimonialsPage from the domain',
  /<AdminTestimonialsPage domain=\{testimonialsDomain\}/.test(adminDashCode));
check('the old Testimonials Moderation JSX has LEFT the monolith',
  !/Testimonials Moderation/.test(adminDashCode) &&
    !/Manage student feedback/.test(adminDashCode));
check('the Testimonials page renders the legacy surface + counts',
  /Testimonials Moderation/.test(testimonialsPageCode) &&
    /Manage student feedback and public testimonials/.test(testimonialsPageCode) &&
    /All \(\{testimonials\.length\}\)/.test(testimonialsPageCode) &&
    /Pending \(\{pendingTestimonials\.length\}\)/.test(testimonialsPageCode) &&
    /Approved \(\{approvedTestimonials\.length\}\)/.test(testimonialsPageCode));
check('the Approve / Reject / Delete actions are still wired',
  /updateTestimonialStatus\(t\.id, 'Approved'\)/.test(testimonialsPageCode) &&
    /updateTestimonialStatus\(t\.id, 'Rejected'\)/.test(testimonialsPageCode) &&
    /deleteTestimonial\(t\.id\)/.test(testimonialsPageCode));
check('the motion card interaction is preserved (not rewritten)',
  /<motion\.div\s+layout/.test(testimonialsPageCode) &&
    /from 'motion\/react'/.test(testimonialsPageCode));

/* ------------------------------------------------------------------ */
/* BI. T6 accessibility source contract                                */
/* ------------------------------------------------------------------ */

section('BI. T6 accessibility source contract for the Review surfaces');

check('inquiry primary actions declare a practical >=44px target',
  (inquiriesPageCode.match(/min-h-\[44px\]/g) || []).length >= 3);
check('the answer textarea has an explicit accessible name',
  /aria-label=\{`Jawaban admin untuk \$\{question\.name\}`\}/.test(inquiriesPageCode) &&
    /htmlFor=\{`answer-\$\{question\.id\}`\}/.test(inquiriesPageCode));
check('the testimonial actions carry aria-labels (not title alone)',
  /aria-label=\{`Setujui testimoni \$\{t\.studentName\}`\}/.test(testimonialsPageCode) &&
    /aria-label=\{`Tolak testimoni \$\{t\.studentName\}`\}/.test(testimonialsPageCode) &&
    /aria-label=\{`Hapus testimoni \$\{t\.studentName\}`\}/.test(testimonialsPageCode));
check('the testimonial action targets declare a practical >=44x44 box',
  (testimonialsPageCode.match(/min-w-\[44px\]/g) || []).length >= 3 &&
    (testimonialsPageCode.match(/min-h-\[44px\]/g) || []).length >= 6);
check('the rating exposes an accessible summary and hides decorative stars',
  /role="img" aria-label=\{`\$\{t\.rating\} dari 5 bintang`\}/.test(testimonialsPageCode) &&
    /<Star key=\{s\} size=\{14\} aria-hidden="true"/.test(testimonialsPageCode));
check('the migrated Review surfaces avoid raw brand / weak contrast tokens',
  !/text-brand-blue|text-brand-orange|text-emerald-600|text-amber-600|text-red-600/.test(reviewDomainCode));

/* ------------------------------------------------------------------ */
/* BJ. T6 T5 non-regression                                            */
/* ------------------------------------------------------------------ */

section('BJ. T6 T5 non-regression (Content + Website untouched)');

check('the T5 domains are still present and invoked once each',
  (adminDashCode.match(/useAdminContentDomain\(/g) || []).length === 1 &&
    (adminDashCode.match(/useAdminWebsiteDomain\(/g) || []).length === 1 &&
    /<AdminContentLibraryPage/.test(adminDashCode) &&
    /<AdminWebsiteEditorPage/.test(adminDashCode));
check('the T5 Studio paths are unchanged',
  allAdminPaths().includes('/admin/studio/content') &&
    allAdminPaths().includes('/admin/studio/website'));
check('the Review domain imports no Studio content/website symbol',
  !/useAdminContentDomain|AdminContentLibraryPage|useAdminWebsiteDomain|AdminWebsiteEditorPage|BLOG_EDITOR_TEMPLATES|videoLessons/.test(reviewDomainCode));
check('the Website extraction still owns the blog-asset key alone',
  [...new Set(websiteDomainCode.match(/theprams_demo_[a-zA-Z_]+/g) || [])].join(',') ===
    'theprams_demo_blog_assets');

/* ------------------------------------------------------------------ */
/* BK. T6 T7 / T8 boundary                                             */
/* ------------------------------------------------------------------ */

section('BK. T6 T7 / T8 boundary (no over-extraction)');

check('T7B marketing state still lives in AdminDashboard (T7A extracted programs/leads)',
  /\bcampaignForm\b/.test(adminDashCode));
check('T8 finance state still lives in AdminDashboard',
  /\bfinanceTransactions\b/.test(adminDashCode) &&
    /\bfinanceEntries\b/.test(adminDashCode));
check('the Review domain does NOT define T7 / T8 state',
  !/programsList|leadsList|campaignForm|financeTransactions|financeEntries/.test(reviewDomainCode));

/* ------------------------------------------------------------------ */
/* BL. T6 security + storage                                           */
/* ------------------------------------------------------------------ */

section('BL. T6 security + storage (no backend, no new key, SEC-P1-03 open)');

check('SEC-P1-03 still open: no Supabase/auth/AI/backend in the Review domain',
  !/@supabase|supabase|GoogleGenAI|@google\/genai|createClient|\bopenai\b|authorization/i.test(reviewDomainCode));
check('no WhatsApp SDK / API call: browser navigation only',
  /window\.open\(/.test(inquiriesHookCode) &&
    !/api\.whatsapp|\bfetch\(|XMLHttpRequest|navigator\.sendBeacon/i.test(reviewDomainCode));
check('the Review domain adds no access-control language',
  !/\b(?:403|Forbidden|unauthorized|access control)\b/i.test(reviewDomainCode));
check('no new storage key: Inquiries own one, Testimonials own none',
  [...new Set(inquiriesDomainCode.match(/theprams_demo_[a-z_]+/g) || [])].length === 1 &&
    !/theprams_demo_/.test(testimonialsDomainCode));
check('routing frozen: exactly the two canonical Review paths, no detail route',
  allAdminPaths().includes('/admin/review/inquiries') &&
    allAdminPaths().includes('/admin/review/testimonials') &&
    allAdminPaths().filter((p) => p.startsWith('/admin/review/')).length === 2);

/* ------------------------------------------------------------------ */
/* BM. T7A Commerce Programs modules + composition wiring               */
/* ------------------------------------------------------------------ */

section('BM. T7A Commerce Programs modules + composition wiring');

check('the Programs page + domain hook + editor + confirm + barrel are present',
  programsPageSrc.length > 0 && programsHookSrc.length > 0 &&
  programsEditorSrc.length > 0 && programsConfirmSrc.length > 0 && programsBarrelSrc.length > 0);
check('the Commerce barrel re-exports BOTH focused domains (programs + leads)',
  /export \* from '\.\/programs'/.test(commerceBarrelCode) &&
    /export \* from '\.\/leads'/.test(commerceBarrelCode));
check('there is NO combined AdminCommerceWorkspacePage (two focused domains)',
  !existsSync(join(commerceFeatureDir, 'AdminCommerceWorkspacePage.tsx')));
check('AdminDashboard imports the Commerce domain barrel',
  /from '\.\.\/features\/admin\/commerce'/.test(adminDashCode));
check('AdminDashboard invokes the canonical Programs hook EXACTLY once',
  (adminDashCode.match(/useAdminProgramsDomain\(/g) || []).length === 1);
check('AdminDashboard renders the extracted Programs page',
  /<AdminProgramsPage/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* BN. T7A single Programs authority                                    */
/* ------------------------------------------------------------------ */

section('BN. T7A single Programs authority (one hook, no duplicate state)');

check('AdminDashboard no longer declares the programsList state',
  !/const \[programsList, setProgramsList\]/.test(adminDashCode));
check('AdminDashboard no longer declares editingProgram / programPendingSave / search / filter',
  !/const \[editingProgram, setEditingProgram\]/.test(adminDashCode) &&
    !/const \[programPendingSave, setProgramPendingSave\]/.test(adminDashCode) &&
    !/const \[programSearchTerm, setProgramSearchTerm\]/.test(adminDashCode) &&
    !/const \[programCategoryFilter, setProgramCategoryFilter\]/.test(adminDashCode));
check('AdminDashboard no longer implements the Programs helpers',
  !/const saveProgram = /.test(adminDashCode) &&
    !/const deleteProgram = /.test(adminDashCode) &&
    !/const resetProgramsToDefault = /.test(adminDashCode) &&
    !/const programCategories = /.test(adminDashCode) &&
    !/const filteredProgramsList = /.test(adminDashCode));
check('the Programs state is declared exactly once (in the domain hook)',
  (programsHookCode.match(/useState<Program\[\]>\(programs\)/g) || []).length === 1 &&
    (programsHookCode.match(/useState<Program \| null>\(null\)/g) || []).length === 2 &&
    (programsHookCode.match(/useState\(''\)/g) || []).length === 1 &&
    (programsHookCode.match(/useState\('All'\)/g) || []).length === 1);
check('the Programs PAGE does not invoke the hook (view only)',
  !/useAdminProgramsDomain\(/.test(programsPageCode));
check('the Programs page owns no canonical useState',
  !/useState/.test(programsPageCode));
check('no import cycle: the Programs domain never imports AdminDashboard',
  !/AdminDashboard/.test(programsDomainCode) &&
    !/LegacyAppStateProvider/.test(programsDomainCode));
check('the Programs domain injects only programs / onProgramsChange / notify / recordAudit',
  /programs: Program\[\];/.test(programsHookCode) &&
    /onProgramsChange\?: \(programs: Program\[\]\) => void/.test(programsHookCode) &&
    /notify: \(message: string\) => void/.test(programsHookCode) &&
    /recordAudit: \(module: string, action: string, detail: string\) => void/.test(programsHookCode));

/* ------------------------------------------------------------------ */
/* BO. T7A program prop bridge                                          */
/* ------------------------------------------------------------------ */

section('BO. T7A program prop bridge (initial list + re-sync + onProgramsChange)');

check('the hook initializes from the legacy programs prop',
  /useState<Program\[\]>\(programs\)/.test(programsHookCode));
check('the prop re-sync useEffect is preserved',
  /useEffect\(\(\) => \{\s*setProgramsList\(programs\);/.test(programsHookCode) &&
    /\[\s*programs\s*\]/.test(programsHookCode));
check('onProgramsChange is invoked on save',
  /onProgramsChange\?\.\(nextPrograms\)/.test(programsHookCode));
check('onProgramsChange is invoked on delete',
  /onProgramsChange\?\.\(nextPrograms\)/.test(programsHookCode));
check('onProgramsChange is invoked on reset',
  /onProgramsChange\?\.\(PROGRAMS\)/.test(programsHookCode));
check('the six AdminDashboard props are unchanged',
  /logout.*setView.*programs.*onProgramsChange.*blogPosts.*onBlogPostsChange/.test(adminDashSrc));

/* ------------------------------------------------------------------ */
/* BP. T7A program behaviour                                            */
/* ------------------------------------------------------------------ */

section('BP. T7A program behaviour (sanitization + confirm + search + contextual draft)');

check('saveProgram preserves id/title/category/description/target/price/image/color/facilities/curriculum/packages sanitization',
  /id: updatedProg\.id\.trim\(\) \|\| `program-\$\{Date\.now\(\)\}`/.test(programsHookCode) &&
    /title: updatedProg\.title\.trim\(\) \|\| 'Program Tanpa Nama'/.test(programsHookCode) &&
    /category: updatedProg\.category\.trim\(\) \|\| 'General'/.test(programsHookCode) &&
    /description: updatedProg\.description\.trim\(\) \|\| 'Deskripsi program belum diisi\.'/.test(programsHookCode) &&
    /target: updatedProg\.target\.trim\(\) \|\| 'Siswa umum'/.test(programsHookCode) &&
    /price: updatedProg\.price\.trim\(\) \|\| 'Rp 0'/.test(programsHookCode) &&
    /image: updatedProg\.image\.trim\(\) \|\| PROGRAMS\[0\]\.image/.test(programsHookCode) &&
    /color: updatedProg\.color\.trim\(\) \|\| 'bg-brand-blue'/.test(programsHookCode) &&
    /facilities: \(updatedProg\.facilities \|\| \[\]\)\.map\(\(item\) => item\.trim\(\)\)\.filter\(Boolean\)/.test(programsHookCode) &&
    /curriculum: \(updatedProg\.curriculum \|\| \[\]\)\.filter\(\(item\) => item\.topic\.trim\(\) \|\| item\.description\.trim\(\)\)/.test(programsHookCode) &&
    /packages: \(updatedProg\.packages \|\| \[\]\)\.map\(\(pkg, index\) => \(\{/.test(programsHookCode));
check('package sanitization: id fallback / name fallback / price / duration / features filter',
  /id: pkg\.id \|\| `pkg-\$\{Date\.now\(\)\}-\$\{index\}`/.test(programsHookCode) &&
    /name: pkg\.name\.trim\(\) \|\| `Paket \$\{index \+ 1\}`/.test(programsHookCode) &&
    /price: pkg\.price\.trim\(\) \|\| 'Rp 0'/.test(programsHookCode) &&
    /duration: pkg\.duration\.trim\(\) \|\| '-'/.test(programsHookCode) &&
    /features: pkg\.features\.map\(\(feature\) => feature\.trim\(\)\)\.filter\(Boolean\)/.test(programsHookCode));
check('deleteProgram preserves browser confirm + filter + audit + toast',
  /confirm\('Apakah Anda yakin ingin menghapus program ini\?'\)/.test(programsHookCode) &&
    /nextPrograms = programsList\.filter\(p => p\.id !== id\)/.test(programsHookCode) &&
    /recordAudit\('Program Inventory', 'Delete Program', id\)/.test(programsHookCode) &&
    /notify\('Program berhasil dihapus\.'\)/.test(programsHookCode));
check('resetProgramsToDefault preserves browser confirm + PROGRAMS + audit + toast',
  /confirm\('Reset semua program demo ke data awal\?'\)/.test(programsHookCode) &&
    /setProgramsList\(PROGRAMS\)/.test(programsHookCode) &&
    /notify\('Program demo dikembalikan ke data awal\.'\)/.test(programsHookCode));
check('search/filter preserves title/category/description/schedule keywords + category exact match',
  /programSearchTerm\.toLowerCase\(\)/.test(programsHookCode) &&
    /\$\{program\.title\} \$\{program\.category\} \$\{program\.description\} \$\{program\.schedule \|\| ''\}/.test(programsHookCode) &&
    /programCategoryFilter === 'All' \|\| program\.category === programCategoryFilter/.test(programsHookCode));
check('contextual draft openContextualProgramDraft preserves all fields verbatim',
  /id: `program-\$\{Date\.now\(\)\}`/.test(programsHookCode) &&
    /title: 'Program Baru'/.test(programsHookCode) &&
    /category: 'Persiapan Akademik'/.test(programsHookCode) &&
    /description: 'Deskripsi singkat program baru\.'/.test(programsHookCode) &&
    /target: 'Siswa umum'/.test(programsHookCode) &&
    /price: 'Rp 0'/.test(programsHookCode) &&
    /facilities: \['Tryout', 'Modul Digital'\]/.test(programsHookCode) &&
    /image: PROGRAMS\[0\]\.image/.test(programsHookCode) &&
    /color: 'bg-brand-blue'/.test(programsHookCode) &&
    /packages: \[\]/.test(programsHookCode));

/* ------------------------------------------------------------------ */
/* BQ. T7A program cross-domain                                         */
/* ------------------------------------------------------------------ */

section('BQ. T7A program cross-domain (SAME programsList feeds Users + Content + Leads)');

check('Users domain receives programsDomain.programsList',
  /programs: programsDomain\.programsList/.test(adminDashCode));
check('Content Library editor receives programsDomain.programsList',
  /<AdminContentLibraryPage[\s\S]{0,200}programs=\{programsDomain\.programsList\}/.test(adminDashCode));
check('Leads domain receives programsDomain.programsList',
  /programs: programsDomain\.programsList/.test(adminDashCode));
check('Programs page receives the Programs domain (provides programsList)',
  /<AdminProgramsPage[\s\S]{0,100}domain=\{programsDomain\}/.test(adminDashCode));
check('NO second programsList useState exists anywhere in admin source',
  (adminDashCode.match(/useState<Program\[\]>/g) || []).length === 0);

/* ------------------------------------------------------------------ */
/* BR. T7A Leads modules + composition wiring                           */
/* ------------------------------------------------------------------ */

section('BR. T7A Leads modules + composition wiring');

check('the Leads page + domain hook + data + editor/convert/detail dialogs + barrel are present',
  leadsPageSrc.length > 0 && leadsHookSrc.length > 0 && leadsDataSrc.length > 0 &&
  leadsEditorSrc.length > 0 && leadsConvertSrc.length > 0 && leadsDetailSrc.length > 0 && leadsBarrelSrc.length > 0);
check('AdminDashboard invokes the canonical Leads hook EXACTLY once',
  (adminDashCode.match(/useAdminLeadsDomain\(/g) || []).length === 1);
check('AdminDashboard renders the extracted Leads page',
  /<AdminLeadsPage/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* BS. T7A single Leads authority                                       */
/* ------------------------------------------------------------------ */

section('BS. T7A single Leads authority (one hook, no duplicate state)');

check('AdminDashboard no longer declares the Leads state',
  !/const \[leadsList, setLeadsList\]/.test(adminDashCode) &&
    !/const \[selectedLead, setSelectedLead\]/.test(adminDashCode) &&
    !/const \[leadPendingConvert, setLeadPendingConvert\]/.test(adminDashCode) &&
    !/const \[isLeadFormOpen, setIsLeadFormOpen\]/.test(adminDashCode) &&
    !/const \[leadForm, setLeadForm\]/.test(adminDashCode) &&
    !/const \[leadNoteDraft, setLeadNoteDraft\]/.test(adminDashCode));
check('AdminDashboard no longer implements the Leads helpers',
  !/const addDemoLead = /.test(adminDashCode) &&
    !/const openNewLeadForm = /.test(adminDashCode) &&
    !/const saveLeadForm = /.test(adminDashCode) &&
    !/const convertLeadToStudent = /.test(adminDashCode) &&
    !/const updateLeadStatus = /.test(adminDashCode) &&
    !/const openLeadWhatsapp = /.test(adminDashCode) &&
    !/const allLeads = /.test(adminDashCode));
check('the Leads state is declared exactly once (in the domain hook)',
  (leadsHookCode.match(/useState<Lead\[\]>\(MOCK_LEADS\)/g) || []).length === 1 &&
    (leadsHookCode.match(/useState<Lead \| null>\(null\)/g) || []).length === 2 &&
    (leadsHookCode.match(/useState\(false\)/g) || []).length >= 1 &&
    (leadsHookCode.match(/useState\(''/g) || []).length >= 1);
check('the Leads PAGE does not invoke the hook (view only)',
  !/useAdminLeadsDomain\(/.test(leadsPageCode));
check('the Leads page owns no canonical useState',
  !/useState/.test(leadsPageCode));
check('no import cycle: the Leads domain never imports AdminDashboard',
  !/AdminDashboard/.test(leadsDomainCode) &&
    !/LegacyAppStateProvider/.test(leadsDomainCode));
check('the Leads domain injects programs / users / persistUsers / notify / recordAudit only',
  /programs: Program\[\];/.test(leadsHookCode) &&
    /users: UserAccount\[\];/.test(leadsHookCode) &&
    /persistUsers: \(users: UserAccount\[\]\) => void/.test(leadsHookCode) &&
    /notify: \(message: string\) => void/.test(leadsHookCode) &&
    /recordAudit: \(module: string, action: string, detail: string\) => void/.test(leadsHookCode));

/* ------------------------------------------------------------------ */
/* BT. T7A lead storage                                                 */
/* ------------------------------------------------------------------ */

section('BT. T7A lead storage (exact theprams_demo_leads, old semantics, 13 keys)');

check('the canonical Leads key is declared in the Leads data module',
  /LEAD_STORAGE_KEY = 'theprams_demo_leads'/.test(leadsDataCode));
check('the canonical Leads key is owned by the Leads domain (single logical owner)',
  /theprams_demo_leads/.test(leadsDomainCode) &&
    !/theprams_demo_leads/.test(programsDomainCode) &&
    !/theprams_demo_leads/.test(inquiriesDomainCode) &&
    !/theprams_demo_leads/.test(testimonialsDomainCode) &&
    !/theprams_demo_leads/.test(websiteDomainCode) &&
    !/theprams_demo_leads/.test(contentHookCode) &&
    !/theprams_demo_leads/.test(usersHookCode) &&
    !/theprams_demo_leads/.test(adminDashCode));
check('the monolith no longer mentions the Leads key',
  !/theprams_demo_leads/.test(adminDashCode));
check('the local read keeps legacy JSON.parse(getItem || \'[]\') + catch [] semantics',
  /JSON\.parse\(localStorage\.getItem\(LEAD_STORAGE_KEY\) \|\| '\[\]'\)/.test(leadsHookCode) &&
    /catch \{[\s\S]{0,80}return \[\]/.test(leadsHookCode));
check('the write keeps legacy localStorage.setItem(key, JSON.stringify(...))',
  /localStorage\.setItem\(LEAD_STORAGE_KEY, JSON\.stringify\(nextLocalLeads\)\)/.test(leadsHookCode),
  'no rename / no migration / no second key');
const t7aKeyRegistry = [...new Set(
  `${adminFeatureCode}\n${adminDashCode}`.match(/theprams_demo_[a-z_]+/g) || [])];
check('the admin localStorage key registry is still exactly 13 keys',
  t7aKeyRegistry.length === 13, `found ${t7aKeyRegistry.length}: ${t7aKeyRegistry.join(', ')}`);
check('the Leads domain owns exactly ONE storage key',
  [...new Set(leadsDomainCode.match(/theprams_demo_[a-z_]+/g) || [])].join(',') ===
    'theprams_demo_leads');

/* ------------------------------------------------------------------ */
/* BU. T7A lead behaviour                                               */
/* ------------------------------------------------------------------ */

section('BU. T7A lead behaviour (addDemoLead / form / save / update / convert / WhatsApp)');

check('addDemoLead is IN-MEMORY only (no localStorage write)',
  /setLeadsList\(\[newLead, \.\.\.leadsList\]\)/.test(leadsHookCode) &&
    !/localStorage\.setItem/.test(componentFunctionBody(leadsHookCode, 'addDemoLead')));
check('openNewLeadForm resets name/email/phone + programOfInterest from first program + source Admin Input + status New',
  /name: ''/.test(leadsHookCode) &&
    /email: ''/.test(leadsHookCode) &&
    /phone: ''/.test(leadsHookCode) &&
    /programOfInterest: programs\[0\]\?\.title \|\| 'SNBT Kedokteran'/.test(leadsHookCode) &&
    /source: 'Admin Input'/.test(leadsHookCode) &&
    /status: 'New'/.test(leadsHookCode));
check('saveLeadForm validates name + phone required + writes to localLeads + audit + toast',
  /!leadForm\.name\.trim\(\) \|\| !leadForm\.phone\.trim\(\)/.test(leadsHookCode) &&
    /id: `lead-\$\{Date\.now\(\)\}`/.test(leadsHookCode) &&
    /email: leadForm\.email\.trim\(\) \|\| '-'/.test(leadsHookCode) &&
    /nextLocalLeads = \[newLead, \.\.\.localLeads\]/.test(leadsHookCode) &&
    /localStorage\.setItem\(LEAD_STORAGE_KEY, JSON\.stringify\(nextLocalLeads\)\)/.test(leadsHookCode) &&
    /recordAudit\('Lead Management', 'Create Lead'/.test(leadsHookCode) &&
    /notify\('Lead baru berhasil ditambahkan\.'\)/.test(leadsHookCode));
check('updateLeadStatus preserves dual-store semantics + lastContactedAt for Contacted/Qualified/Converted + selectedLead + noteDraft',
  /const localLeadExists = localLeads\.some\(\(item\) => item\.id === lead\.id\)/.test(leadsHookCode) &&
    /localStorage\.setItem\(LEAD_STORAGE_KEY, JSON\.stringify\(nextLocalLeads\)\)/.test(leadsHookCode) &&
    /setLeadsList\(\(prev\) => prev\.map\(\(item\) => item\.id === lead\.id \? nextLead : item\)\)/.test(leadsHookCode) &&
    /lastContactedAt: \['Contacted', 'Qualified', 'Converted'\].includes\(status\)/.test(leadsHookCode) &&
    /setSelectedLead\(nextLead\)/.test(leadsHookCode) &&
    /setLeadNoteDraft\(nextLead\.note \|\| ''\)/.test(leadsHookCode));
check('convertLeadToStudent uses canonical Users persistUsers (same email + role Student) + exact UserAccount fields',
  /persistUsers\(\[/.test(leadsHookCode) &&
    /id: `student-\$\{lead\.id\}`/.test(leadsHookCode) &&
    /name: lead\.name/.test(leadsHookCode) &&
    /email: lead\.email/.test(leadsHookCode) &&
    /role: 'Student'/.test(leadsHookCode) &&
    /program: lead\.programOfInterest/.test(leadsHookCode) &&
    /status: 'Active'/.test(leadsHookCode) &&
    /avatar: `https:\/\/i\.pravatar\.cc\/150\?u=\$\{lead\.id\}`/.test(leadsHookCode) &&
    /accountType: 'Free'/.test(leadsHookCode) &&
    /packageName: 'Trial \/ Lead'/.test(leadsHookCode) &&
    /paymentStatus: 'Converted'/.test(leadsHookCode) &&
    /source: 'Konversi Lead'/.test(leadsHookCode));
check('WhatsApp phone normalization + fallback + greeting + New->Contacted transition',
  /String\(lead\.phone \|\| ''\)\.replace\(\/\\D\/g, ''\)\.replace\(\/\^0\/, '62'\)/.test(leadsHookCode) &&
    /6281234567890/.test(leadsHookCode) &&
    /Halo \$\{lead\.name\}, saya admin The Prams/.test(leadsHookCode) &&
    /lead\.status === 'New' \? 'Contacted' : lead\.status/.test(leadsHookCode) &&
    /window\.open\(`https:\/\/wa\.me\//.test(leadsHookCode) &&
    /'_blank'/.test(leadsHookCode));

/* ------------------------------------------------------------------ */
/* BV. T7A Users cross-domain                                           */
/* ------------------------------------------------------------------ */

section('BV. T7A Users cross-domain (Leads receives usersDomain.users + persistUsers)');

check('Leads receives usersDomain.users + usersDomain.persistUsers',
  /users: usersDomain\.users/.test(adminDashCode) &&
    /persistUsers: usersDomain\.persistUsers/.test(adminDashCode));
check('NO second UserAccount persistence implementation in Leads',
  !/const persistUsers = /.test(leadsHookCode) &&
    !/localStorage\.setItem.*user/.test(leadsHookCode));

/* ------------------------------------------------------------------ */
/* BW. T7A composition                                                  */
/* ------------------------------------------------------------------ */

section('BW. T7A composition (Programs + Leads tabs render extracted pages)');

check('Programs tab renders AdminProgramsPage from programsDomain',
  /<AdminProgramsPage domain=\{programsDomain\}/.test(adminDashCode));
check('Leads tab renders AdminLeadsPage from leadsDomain',
  /<AdminLeadsPage domain=\{leadsDomain\}/.test(adminDashCode));
check('Old Programs JSX absent from AdminDashboard',
  !/Program Inventory & Curriculum/.test(adminDashCode) &&
    !/Manage all educational offerings/.test(adminDashCode) &&
    !/onClick=\{\(\) => setEditingProgram\(item\)\}/.test(adminDashCode));
check('Old Leads JSX absent from AdminDashboard',
  !/Lead Management/.test(adminDashCode) &&
    !/Capture and convert potential students/.test(adminDashCode) &&
    !/onClick=\{openNewLeadForm\}/.test(adminDashCode) &&
    !/allLeads\.map\(\(lead\) =>/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* BX. T7A accessibility source contract                                */
/* ------------------------------------------------------------------ */

section('BX. T7A accessibility source contract for Programs + Leads surfaces');

check('Programs primary actions declare a practical >=44px target',
  (programsPageCode.match(/min-h-\[44px\]/g) || []).length >= 3);
check('Programs row Edit/Delete have aria-labels and >=44px targets',
  /aria-label=\{`Edit program \$\{item\.title\}`\}/.test(programsPageCode) &&
    /aria-label=\{`Hapus program \$\{item\.title\}`\}/.test(programsPageCode) &&
    (programsPageCode.match(/min-w-\[44px\]/g) || []).length >= 2 &&
    (programsPageCode.match(/min-h-\[44px\]/g) || []).length >= 2);
check('Programs editor close + footer actions have aria-labels + >=44px',
  /aria-label="Tutup editor program"/.test(programsEditorCode) &&
    /min-w-\[44px\] min-h-\[44px\]/.test(programsEditorCode) &&
    /min-h-\[44px\]/.test(programsConfirmCode) &&
    (programsConfirmCode.match(/min-h-\[44px\]/g) || []).length >= 2);
check('Leads row actions have aria-labels + >=44px + focus-within reveal',
  /aria-label=\{`Convert \$\{lead\.name\} menjadi siswa`\}/.test(leadsPageCode) &&
    /aria-label=\{`Lihat detail lead \$\{lead\.name\}`\}/.test(leadsPageCode) &&
    (leadsPageCode.match(/min-w-\[44px\]/g) || []).length >= 2 &&
    (leadsPageCode.match(/min-h-\[44px\]/g) || []).length >= 2 &&
    /group-focus-within:opacity-100/.test(leadsPageCode));
check('Leads dialog closes have aria-labels + >=44px targets',
  /aria-label="Tutup formulir lead"/.test(leadsEditorCode) &&
    /aria-label="Tutup detail lead"/.test(leadsDetailCode) &&
    (leadsEditorCode.match(/min-w-\[44px\] min-h-\[44px\]/g) || []).length >= 1 &&
    (leadsDetailCode.match(/min-w-\[44px\] min-h-\[44px\]/g) || []).length >= 1);
check('Leads form fields carry accessible names',
  /aria-label="Nama lead"/.test(leadsEditorCode) &&
    /aria-label="Nomor WhatsApp lead"/.test(leadsEditorCode) &&
    /aria-label="Email lead"/.test(leadsEditorCode) &&
    /aria-label="Status pipeline lead"/.test(leadsEditorCode) &&
    /aria-label="Minat program lead"/.test(leadsEditorCode) &&
    /aria-label="Sumber lead"/.test(leadsEditorCode) &&
    /aria-label="Catatan awal lead"/.test(leadsEditorCode) &&
    /aria-label="Catatan follow-up lead"/.test(leadsDetailCode));
check('Programs / Leads migrated surfaces avoid raw brand / weak contrast tokens',
  !/text-brand-blue|text-brand-orange|text-emerald-600|text-amber-600|text-red-600/.test(commerceDomainCode));

/* ------------------------------------------------------------------ */
/* BY. T7A T7B Marketing freeze                                         */
/* ------------------------------------------------------------------ */

section('BY. T7A T7B Marketing freeze (Marketing state/helpers/JSX/modal stay in AdminDashboard)');

check('Marketing state still lives in AdminDashboard',
  /\bisCampaignEditorOpen\b/.test(adminDashCode) &&
    /\bcampaignForm\b/.test(adminDashCode) &&
    /\bcampaignTotalBudget\b/.test(adminDashCode));
check('Marketing helpers still in AdminDashboard',
  /\bcurrencyOptions\b/.test(adminDashCode) &&
    /\bparseCurrencyAmount\b/.test(adminDashCode) &&
    /\bformatCurrencyAmount\b/.test(adminDashCode));
check('the Commerce domain does NOT define Marketing state',
  !/isCampaignEditorOpen|campaignForm|campaignTotalBudget|campaignDailyBudget|campaignEstimatedDays|currencyOptions|parseCurrencyAmount|formatCurrencyAmount/.test(commerceDomainCode));
check('AdminDashboard still renders Marketing & Campaigns JSX',
  /Marketing & Campaigns/.test(adminDashCode));

/* ------------------------------------------------------------------ */
/* BZ. T7A T8 / T9 boundary                                             */
/* ------------------------------------------------------------------ */

section('BZ. T7A T8 / T9 boundary (no over-extraction)');

check('T8 Finance state still lives in AdminDashboard',
  /\bfinanceTransactions\b/.test(adminDashCode) &&
    /\bfinanceEntries\b/.test(adminDashCode) &&
    /\bfinanceRealizations\b/.test(adminDashCode) &&
    /\bassetEntries\b/.test(adminDashCode));
check('T9 Admin Team state still lives in AdminDashboard',
  /\badminTeam\b/.test(adminDashCode));
check('the Commerce domain does NOT define T8 / T9 state',
  !/financeTransactions|financeEntries|financeRealizations|assetEntries|paymentProofs|adminTeam/.test(commerceDomainCode));

/* ------------------------------------------------------------------ */
/* CA. T7A security + storage                                           */
/* ------------------------------------------------------------------ */

section('CA. T7A security + storage (no backend, no new key, SEC-P1-03 open)');

check('SEC-P1-03 still open: no Supabase/auth/AI/backend in the Commerce domain',
  !/@supabase|supabase|GoogleGenAI|@google\/genai|createClient|\bopenai\b|authorization/i.test(commerceDomainCode));
check('no WhatsApp SDK / API call: browser navigation only',
  /window\.open\(/.test(leadsHookCode) &&
    !/api\.whatsapp|\bfetch\(|XMLHttpRequest|navigator\.sendBeacon/i.test(commerceDomainCode));
check('the Commerce domain adds no access-control language',
  !/\b(?:403|Forbidden|unauthorized|access control)\b/i.test(commerceDomainCode));
check('no new storage key: Programs own none, Leads own theprams_demo_leads',
  !/theprams_demo_/.test(programsDomainCode) &&
    [...new Set(leadsDomainCode.match(/theprams_demo_[a-z_]+/g) || [])].join(',') ===
    'theprams_demo_leads');
check('routing frozen: exactly the two canonical Commerce paths (programs + leads), marketing + finance stay in monolith',
  allAdminPaths().includes('/admin/commerce/programs') &&
    allAdminPaths().includes('/admin/commerce/leads') &&
    allAdminPaths().filter((p) => p.startsWith('/admin/commerce/')).length === 4);

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

console.log(`\n${'-'.repeat(64)}`);
console.log(`passed: ${passed}`);
console.log(`failed: ${failures.length}`);
if (failures.length) {
  console.log('\nFailures:');
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
console.log('B1.4D-T7A admin workspace contract: PASS');
process.exit(0);

/* ------------------------------------------------------------------ */
/* TS/TSX loader                                                     */
/* ------------------------------------------------------------------ */

/**
 * Bundles a TypeScript entry point to a temporary ESM file with esbuild
 * (already present as a Vite dependency) and imports it.
 */
async function compileAndImport(entry) {
  const { build } = await import('esbuild');
  const { unlinkSync } = await import('node:fs');

  const outFile = join(repoRoot, `.aksa-verify-${process.pid}-${Date.now()}.mjs`);

  await build({
    entryPoints: [entry],
    outfile: outFile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    jsx: 'automatic',
    target: 'node20',
    logLevel: 'silent',
  });

  try {
    return await import(pathToFileURL(outFile).href);
  } finally {
    try { unlinkSync(outFile); } catch { /* best effort */ }
  }
}
