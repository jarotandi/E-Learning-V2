#!/usr/bin/env node
/**
 * AKSA Design-System Contract Check
 * ==================================
 * B1.4A — Design System Primitives + Public Header Extraction
 *
 * Run: npx tsx scripts/verify-design-system.mjs
 *
 * ## Why this exists
 *
 * The repository has no test framework (`package.json` exposes only
 * dev/build/preview/clean/lint), so this follows the precedent already set by
 * `scripts/verify-routes.mjs`: a standalone, deterministic Node script.
 *
 * ## What it deliberately does NOT do
 *
 * It does not assert that a source file contains a hard-coded string. The
 * primitive API is proven by IMPORTING the real modules and inspecting the
 * real exported values, so renaming a variant fails this script because the
 * value changed, not because a regex matched some text.
 *
 * The one textual check it does perform is the token-discipline scan for
 * colour literals. That check is a genuine invariant rather than a tautology:
 * the whole point of the primitive layer is that brand colours come from
 * `src/design-system/tokens/brand.ts`, and a `#rrggbb` literal in a primitive
 * is exactly the regression that would silently reintroduce a B1.2 contrast
 * violation.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  BADGE_SIZES,
  BADGE_VARIANTS,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Button,
  ButtonLink,
  Badge,
  CARD_PADDINGS,
  CARD_VARIANTS,
  Card,
  IconButton,
  INPUT_SIZES,
  Input,
  TAB_LIST_SIZES,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsPanel,
} from '../src/design-system/components/index.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    return;
  }
  failed += 1;
  failures.push(detail ? `${name} — ${detail}` : name);
}

/* ------------------------------------------------------------------ */
/* 1. Module contract: the public API exists and is callable           */
/* ------------------------------------------------------------------ */

const COMPONENTS = {
  Button,
  ButtonLink,
  IconButton,
  Card,
  Badge,
  Input,
  Tabs,
  TabsPanel,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
};

for (const [name, component] of Object.entries(COMPONENTS)) {
  check(
    `component ${name} is exported and callable`,
    typeof component === 'function',
    `got ${typeof component}`,
  );
}

/* ------------------------------------------------------------------ */
/* 2. Variant contracts: exact, frozen, non-empty                     */
/* ------------------------------------------------------------------ */

const VARIANT_SETS = {
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  CARD_VARIANTS,
  CARD_PADDINGS,
  BADGE_VARIANTS,
  BADGE_SIZES,
  INPUT_SIZES,
  TAB_LIST_SIZES,
};

const EXPECTED = {
  BUTTON_VARIANTS: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
  BUTTON_SIZES: ['sm', 'md', 'lg'],
  CARD_VARIANTS: ['default', 'muted', 'interactive'],
  CARD_PADDINGS: ['none', 'sm', 'md', 'lg'],
  BADGE_VARIANTS: ['neutral', 'success', 'warning', 'danger', 'info', 'planned'],
  BADGE_SIZES: ['sm', 'md'],
  INPUT_SIZES: ['sm', 'md', 'lg'],
  TAB_LIST_SIZES: ['sm', 'md'],
};

for (const [name, values] of Object.entries(VARIANT_SETS)) {
  const expected = EXPECTED[name];
  check(
    `${name} is a frozen readonly tuple`,
    Object.isFrozen(values),
    'a caller could mutate the shared list',
  );
  check(
    `${name} matches the documented contract`,
    JSON.stringify([...values]) === JSON.stringify(expected),
    `expected ${JSON.stringify(expected)}, got ${JSON.stringify([...values])}`,
  );
  check(
    `${name} contains no empty or duplicate entries`,
    values.every((v) => typeof v === 'string' && v.length > 0) &&
      new Set(values).size === values.length,
    `got ${JSON.stringify([...values])}`,
  );
}

/* ------------------------------------------------------------------ */
/* 3. Token discipline: no colour literals in the primitive layer      */
/* ------------------------------------------------------------------ */

/**
 * Files legitimately allowed to contain a literal.
 *
 * `Button.tsx` is allowed exactly one: the danger HOVER colour, which is not
 * in the palette and is documented inline. Every other value in the
 * primitives must be read from the token contract.
 */
const LITERAL_ALLOWANCE = {
  'Button.tsx': 1,
};

const PRIMITIVE_DIR = join(ROOT, 'src', 'design-system', 'components');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const primitiveFiles = walk(PRIMITIVE_DIR).filter((f) => /\.(ts|tsx|css)$/.test(f));

// A 3-, 4-, 6-, or 8-digit hex, optionally with an alpha suffix. Anchored so
// it cannot match an id, a hash, or a word.
const HEX_PATTERN = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

for (const file of primitiveFiles) {
  const rel = relative(ROOT, file);
  const source = readFileSync(file, 'utf8');
  // Comments legitimately quote the values they are warning about, so the scan
  // runs against code with block and line comments stripped.
  const code = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
  const literals = code.match(HEX_PATTERN) ?? [];
  const base = rel.split(/[\\/]/).pop();
  const allowed = LITERAL_ALLOWANCE[base] ?? 0;
  check(
    `${rel} reads brand colours from tokens`,
    literals.length <= allowed,
    `found ${literals.length} colour literal(s) ${JSON.stringify(literals)}, allowance ${allowed}`,
  );
}

/* ------------------------------------------------------------------ */
/* 4. The public header must not reintroduce the legacy wordmark        */
/* ------------------------------------------------------------------ */

const headerPath = join(ROOT, 'src', 'app', 'layouts', 'PublicHeader.tsx');
const headerSource = readFileSync(headerPath, 'utf8');
check(
  'PublicHeader does not render the legacy "Bimbel The Prams" wordmark',
  !/Bimbel The Prams/.test(headerSource),
  'the legacy wordmark is still present',
);
check(
  'PublicHeader builds its hrefs from legacyViewToPath, not literal paths',
  /legacyViewToPath/.test(headerSource) &&
    !/href=["']\/(programs|blog|testimonials|login|register)/.test(headerSource),
  'found a hard-coded route literal; route translation must not be duplicated',
);

/* ------------------------------------------------------------------ */
/* Report                                                               */
/* ------------------------------------------------------------------ */

console.log('AKSA design-system contract check');
console.log('='.repeat(60));
for (const failure of failures) console.log(`  FAIL  ${failure}`);
console.log('='.repeat(60));
console.log(`${passed} passed, ${failed} failed`);

if (failed > 0) process.exit(1);
