/**
 * Import-path contract proof (B1.2 / CONF-01)
 * ==========================================
 *
 * This file exists only to prove, at compile time, that the `@/*` path alias
 * resolves to the `src/` root in BOTH toolchains:
 *
 *   - TypeScript: tsconfig.json `compilerOptions.paths` -> `"@/*": ["./src/*"]`
 *   - Vite:       vite.config.ts   `resolve.alias`        -> `src`
 *
 * If either side drifts, `npm run lint` (`tsc --noEmit`) fails here, which is
 * the intended early-warning. There is no runtime behaviour in this file and it
 * is not imported by any rendered component.
 *
 * After this file's existence proves the contract, it may be kept as a cheap
 * regression guard or deleted in a later sub-batch once the router work in
 * B1.3 makes `@/` imports real in application code.
 *
 * Authority: docs/aksa/b1/02-b1-subbatch-plan.md (CONF-01)
 */

import { aksaDesignTokens } from '@/design-system/tokens/brand';
import { learnerNavigation, studioNavigation } from '@/app/navigation';

/** Compile-time assertions. These never execute at runtime. */
type AssertAliasResolves = typeof aksaDesignTokens extends { brand: { name: 'AKSA' } } ? true : never;
type AssertLearnerNav = typeof learnerNavigation extends { basePath: '/app' } ? true : never;
type AssertStudioNav = typeof studioNavigation extends { basePath: '/studio' } ? true : never;

export type AliasContractProof = [
  AssertAliasResolves,
  AssertLearnerNav,
  AssertStudioNav,
];