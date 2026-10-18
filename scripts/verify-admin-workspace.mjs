/**
 * B1.4D admin workspace verification script (T1 + T2 + T3).
 *
 * Usage:
 *   node scripts/verify-admin-workspace.mjs
 *
 * WHAT THIS PROVES
 * ----------------
 * This is a DETERMINISTIC CONTRACT CHECK, not a browser test. It exercises the
 * REAL pure model (`src/features/admin/shell/adminWorkspaceModel.ts`) and the
 * REAL route tree, and asserts the contract B1.4D-T1/T2/T3 is required to
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

import { readFileSync, readdirSync } from 'node:fs';
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

// B1.4D-T3 sources: the extracted Platform + Users modules under features/admin.
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

const overviewPageCode = stripComments(overviewPageSrc);
const usersPageCode = stripComments(usersPageSrc);
const usersHookCode = stripComments(usersHookSrc);
const usersRecordsCode = stripComments(usersRecordsSrc);
const userDialogCode = stripComments(userDialogSrc);

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
check('Lead conversion persists through the shared store',
  /persistUsers\(/.test(componentFunctionBody(adminDashCode, 'convertLeadToStudent')));
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
console.log('B1.4D-T3 admin workspace contract: PASS');
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
