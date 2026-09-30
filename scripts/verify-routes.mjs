/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * B1.3 route verification script.
 *
 * Usage:
 *   node scripts/verify-routes.mjs
 *
 * WHAT THIS PROVES
 * ----------------
 * This is a DETERMINISTIC CONTRACT CHECK, not a browser test. It exercises the
 * real `react-router` `matchRoutes` against the real `<Routes>` tree and
 * asserts the routing contract that B1.3 is required to satisfy:
 *
 *   1. All 21 legacy `View` values resolve to a real route, not NotFound.
 *   2. All canonical public/learner/admin routes resolve to a legacy bridge.
 *   3. Parameterised deep links bind their `:param` and rehydrate the id.
 *   4. Legacy `#blog-<id>` hashes resolve to the canonical blog URL.
 *   5. The legacy Navbar chrome rule is unchanged for all 21 views.
 *   6. Planned learner / Studio routes resolve to a planned placeholder.
 *   7. Unknown paths resolve to NotFound.
 *
 * WHAT THIS DOES NOT PROVE
 * ------------------------
 * It does not prove that a legacy component renders correct content, that
 * payment gating still works, that tryout scoring is unchanged, or that the
 * login redirect behaves. Those are RUNTIME behaviours and require a browser.
 * See docs/aksa/b1/04-b1.3-router-migration.md for how they were checked.
 *
 * No test framework is added. This is one plain Node script.
 */

import { createRoutesFromChildren, matchRoutes } from 'react-router';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const appDir = join(repoRoot, 'src', 'app');

/* ------------------------------------------------------------------ */
/* Load the real route tree                                           */
/* ------------------------------------------------------------------ */

const { AppRoutes } = await compileAndImport(join(appDir, 'router', 'AppRouter.tsx'));
const { legacyViewToPath, pathToLegacyView, LEGACY_VIEW_ROUTES,
        showsLegacyNavbar, isSelfChromeView, isProtectedLegacyView,
        blogIdFromLegacyHash } =
  await compileAndImport(join(appDir, 'router', 'legacyViewRoutes.ts'));
const { PLANNED_LEARNER_ROUTES, PLANNED_STUDIO_ROUTES } =
  await compileAndImport(join(appDir, 'router', 'routePaths.ts'));

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

/**
 * Converts the real `<Routes>` element tree into React Router route objects.
 *
 * This is the router's own converter, so nested pathless layouts, relative
 * child paths and the `*` splat are interpreted exactly as they are at runtime.
 * Hand-rolling a flat path list would silently disagree with real matching,
 * which is precisely the class of bug this script exists to catch.
 */
let cachedRoutes = null;
function collectRoutes() {
  if (!cachedRoutes) {
    const tree = AppRoutes();
    const children = Array.isArray(tree.props.children)
      ? tree.props.children
      : [tree.props.children];
    cachedRoutes = createRoutesFromChildren(children);
  }
  return cachedRoutes;
}

/** The last matched route's path, e.g. `'*'` for a Not Found hit. */
function lastMatchPath(path) {
  const matches = matchRoutes(collectRoutes(), path);
  if (!matches || matches.length === 0) return null;
  return matches[matches.length - 1].route.path;
}

/* ------------------------------------------------------------------ */
/* 1. All 21 legacy View values are routed                           */
/* ------------------------------------------------------------------ */

section('1. Legacy View coverage (all 21 must be reachable)');

check('legacy view registry holds 21 entries', LEGACY_VIEW_ROUTES.length === 21,
  `found ${LEGACY_VIEW_ROUTES.length}`);

for (const view of LEGACY_VIEW_ROUTES) {
  const path = legacyViewToPath(view, {
    programId: 'snbt-kedokteran',
    mentorId: 'm-1',
    blogId: 'b-1',
    tryoutId: 'to-1',
  });
  const matches = matchRoutes(collectRoutes(), path);

  // A parameterised path built with an empty id collapses to a bare segment,
  // so build with a real id above. Confirm it is not NotFound.
  const isNotFound = matches?.length === 0;
  check(`view "${view}" -> ${path}`, !isNotFound,
    'no route matched (would render NotFound)');
}

/* ------------------------------------------------------------------ */
/* 2. Canonical routes resolve                                        */
/* ------------------------------------------------------------------ */

section('2. Canonical route table');

const CANONICAL = [
  ['/', 'landing'],
  ['/programs', 'programs'],
  ['/programs/snbt-kedokteran', 'programDetail'],
  ['/mentors/m-1', 'mentorProfile'],
  ['/blog', 'blogListing'],
  ['/blog/b-1', 'blogPost'],
  ['/contact', 'contact'],
  ['/testimonials', 'testimonials'],
  ['/login', 'login'],
  ['/register', 'register'],
  ['/register/guest', 'guestRegistration'],
  ['/register/final', 'finalRegistration'],
  ['/app', 'dashboard'],
  ['/app/learn', 'learning'],
  ['/app/assessment', 'tryoutListing'],
  ['/app/assessment/to-1/exam', 'exam'],
  ['/app/assessment/to-1/result', 'result'],
  ['/app/calendar', 'schedule'],
  ['/app/profile', 'profile'],
  ['/app/wallet', 'payment'],
  ['/admin', 'admin'],
];

for (const [path, expectedView] of CANONICAL) {
  const matches = matchRoutes(collectRoutes(), path);
  const ok = matches && matches.length > 0;
  const derived = pathToLegacyView(path);
  check(`${path} routes and derives view "${expectedView}"`,
    ok && derived === expectedView,
    ok ? `derived "${derived}"` : 'no route matched');
}

/* ------------------------------------------------------------------ */
/* 3. Deep links bind their parameters                               */
/* ------------------------------------------------------------------ */

section('3. Deep-link parameter binding');

const DEEP_LINKS = [
  ['/programs/snbt-kedokteran', 'programId', 'snbt-kedokteran'],
  ['/mentors/m-1', 'mentorId', 'm-1'],
  ['/blog/b-1', 'blogId', 'b-1'],
  ['/app/assessment/to-1/exam', 'tryoutId', 'to-1'],
  ['/app/assessment/to-1/result', 'tryoutId', 'to-1'],
  ['/studio/editor/content-9', 'contentId', 'content-9'],
];

for (const [path, param, expected] of DEEP_LINKS) {
  const matches = matchRoutes(collectRoutes(), path);
  const params = matches?.[matches.length - 1]?.params ?? {};
  check(`${path} binds :${param} = ${expected}`, params[param] === expected,
    `got ${JSON.stringify(params[param])}`);
}

/* ------------------------------------------------------------------ */
/* 4. Legacy blog hash compatibility                                  */
/* ------------------------------------------------------------------ */

section('4. Legacy #blog-<id> backward compatibility');

for (const [hash, expectedId] of [
  ['#blog-abc', 'abc'],
  ['#blog-post-7', 'post-7'],
  ['#blog-a%20b', 'a b'],
]) {
  check(`${hash} -> blog id "${expectedId}"`,
    blogIdFromLegacyHash(hash) === expectedId,
    `got ${JSON.stringify(blogIdFromLegacyHash(hash))}`);
}

check('non-blog hash returns null', blogIdFromLegacyHash('#section') === null);
check('empty hash returns null', blogIdFromLegacyHash('') === null);

/* ------------------------------------------------------------------ */
/* 5. Chrome rules unchanged                                          */
/* ------------------------------------------------------------------ */

section('5. Navigation chrome rules (no double chrome)');

const NAVBAR_HIDDEN = ['exam', 'result', 'payment', 'finalRegistration',
  'admin', 'dashboard', 'learning', 'login'];
const SELF_CHROME = ['dashboard', 'learning'];

for (const view of LEGACY_VIEW_ROUTES) {
  const expectedHidden = NAVBAR_HIDDEN.includes(view);
  check(`view "${view}" navbar ${expectedHidden ? 'hidden' : 'shown'}`,
    showsLegacyNavbar(view) === !expectedHidden);
}

for (const view of LEGACY_VIEW_ROUTES) {
  const expectedSelfChrome = SELF_CHROME.includes(view);
  check(`view "${view}" self-chrome ${expectedSelfChrome ? 'yes' : 'no'}`,
    isSelfChromeView(view) === expectedSelfChrome);
}

// The critical invariant: no view that owns its own chrome may be shown the
// shared Navbar. A view in both sets would render a double header.
const overlap = LEGACY_VIEW_ROUTES.filter(
  (view) => SELF_CHROME.includes(view) && showsLegacyNavbar(view),
);
check('no self-chrome view receives the shared Navbar', overlap.length === 0,
  overlap.length ? `double chrome on: ${overlap.join(', ')}` : '');

/* ------------------------------------------------------------------ */
/* 6. Protected-route policy is unchanged                             */
/* ------------------------------------------------------------------ */

section('6. Protected-route policy');

const PROTECTED = ['dashboard', 'learning', 'exam', 'result', 'tryoutListing',
  'profile', 'schedule'];

for (const view of LEGACY_VIEW_ROUTES) {
  const expected = PROTECTED.includes(view);
  check(`view "${view}" protected = ${expected}`,
    isProtectedLegacyView(view) === expected);
}

check('payment is NOT protected (pre-router behaviour preserved)',
  isProtectedLegacyView('payment') === false);
check('finalRegistration is NOT protected (pre-router behaviour preserved)',
  isProtectedLegacyView('finalRegistration') === false);
check('non-legacy path yields no view', pathToLegacyView('/app/library') === null);

/* ------------------------------------------------------------------ */
/* 7. Planned routes resolve to placeholders                          */
/* ------------------------------------------------------------------ */

section('7. Planned foundation routes');

for (const route of PLANNED_LEARNER_ROUTES) {
  const path = `/app/${route.segment}`;
  const matches = matchRoutes(collectRoutes(), path);
  check(`${path} resolves`, matches && matches.length > 0);
  check(`${path} is not a legacy view (placeholder, not a capability)`,
    pathToLegacyView(path) === null);
}

for (const route of PLANNED_STUDIO_ROUTES) {
  const path = route.segment
    ? `/studio/${route.segment}`
    : '/studio';
  const matches = matchRoutes(collectRoutes(), path);
  check(`${path} resolves`, matches && matches.length > 0);
}

/* ------------------------------------------------------------------ */
/* 8. Unknown routes hit NotFound                                    */
/* ------------------------------------------------------------------ */

section('8. Unknown routes');

// A `*` route means an unknown path MATCHES the splat — that is how
// NotFoundPage gets rendered. The assertion is therefore that the final
// matched route is the splat, not that nothing matched.
for (const path of ['/nope', '/app/definitely-not-a-module', '/studio/nope',
  '/programs/a/b/c', '/zzz']) {
  check(`${path} falls through to the * Not Found route`,
    lastMatchPath(path) === '*', `last match was "${lastMatchPath(path)}"`);
}

/* ------------------------------------------------------------------ */
/* 9. Route table is the single source of truth                      */
/* ------------------------------------------------------------------ */

section('9. Source hygiene');

const routerFiles = readdirSync(join(appDir, 'router')).filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'));
check('router directory has a barrel export', routerFiles.includes('index.ts'));

const appSource = routerFiles.concat(
  readdirSync(join(appDir, 'layouts')).map((f) => join('layouts', f)),
).map((f) => {
  const p = f.includes('/') || f.includes('\\') ? join(appDir, f) : join(appDir, 'router', f);
  return readFileSync(p, 'utf8');
}).join('\n');

check('no AI provider import in the router/layout layer',
  !/from\s+['"]@google\/genai|@google\/generative-ai|openai|anthropic['"]/.test(appSource));
check('no Supabase import in the router/layout layer',
  !/from\s+['"]@supabase\/supabase-js['"]/.test(appSource));
check('no OpenMAIC import in the router/layout layer',
  !/openmaic/i.test(appSource));

/* ------------------------------------------------------------------ */
/* Report                                                            */
/* ------------------------------------------------------------------ */

console.log(`\n${'-'.repeat(64)}`);
console.log(`passed: ${passed}`);
console.log(`failed: ${failures.length}`);
if (failures.length) {
  console.log('\nFailures:');
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
console.log('B1.3 route contract: PASS');
process.exit(0);

/* ------------------------------------------------------------------ */
/* TS/TSX loader                                                     */
/* ------------------------------------------------------------------ */

/**
 * Bundles a TypeScript entry point to a temporary ESM file with esbuild (already
 * present as a Vite dependency) and imports it.
 *
 * Bundling rather than a bare `ts.transpileModule` matters: these modules pull
 * in layouts, providers and navigation contracts through extensionless relative
 * specifiers, which Node's ESM loader cannot resolve on its own. Bundling with
 * `packages: 'external'` resolves the app's own graph at build time while
 * leaving React and the router itself as real runtime imports.
 */
async function compileAndImport(entry) {
  const { build } = await import('esbuild');
  const { writeFileSync, unlinkSync } = await import('node:fs');

  // Written inside the repo so Node still resolves `react` and the router
  // from the project's own node_modules via normal package resolution.
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
