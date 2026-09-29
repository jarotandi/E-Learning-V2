# B0 Baseline Contract

## Canonical starting point

| Field | Value |
|---|---|
| Repository | `jarotandi/E-Learning-V2` |
| Default branch | `main` |
| Canonical SHA | `a470402ac7263c439061c646250fbd4dade1c607` |
| Commit message | `UPDATE TOTAL: Masukin kode yang beneran baru` |
| B0 branch | `aksa/b0-foundation-audit` |
| B0 scope | Audit and architecture contracts only |

The branch must remain based on the exact canonical SHA above unless an explicit re-baseline is approved.

## Freshly observed repository shape

Root contains:
- `.env.example`
- `README.md`
- `index.html`
- `metadata.json`
- `package.json`
- `package-lock.json`
- `src/**`
- `tsconfig.json`
- `vercel.json`
- `vite.config.ts`

Current application stack from `package.json`:
- React 19
- Vite 6
- TypeScript 5.8
- Tailwind CSS 4
- Motion
- Recharts
- Lucide React
- Google GenAI SDK
- Express dependency

## B0 hard safety rules

1. No production feature implementation.
2. No OpenMAIC import.
3. No Supabase migration.
4. No routing rewrite.
5. No UI redesign.
6. No data deletion or legacy-name bulk replacement.
7. No secret/key migration yet; only document the risk and target.
8. If baseline SHA changes unexpectedly, stop.
9. If a later local fresh build/lint fails, B0 cannot be sealed.
10. B0 seal requires explicit evidence in the execution checklist.

## Seal condition

B0 may be tagged/declared `AKSA-B0-SEALED` only after:
- local checkout matches this branch,
- working tree is clean,
- `npm install` succeeds,
- `npm run lint` succeeds,
- `npm run build` succeeds,
- the audit documents are reviewed,
- no runtime files changed in B0.
