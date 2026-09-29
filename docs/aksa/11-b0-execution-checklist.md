# B0 Execution Checklist

Status: **IN PROGRESS**

## Repository
- [x] Canonical repository identified: `jarotandi/E-Learning-V2`
- [x] Canonical `main` SHA verified: `a470402ac7263c439061c646250fbd4dade1c607`
- [x] B0 branch created: `aksa/b0-foundation-audit`
- [x] Architecture/audit documentation added
- [x] Runtime behavior intentionally unchanged

## Audit findings captured
- [x] Current navigation model documented
- [x] Current localStorage authority risk documented
- [x] Legacy brand coupling documented
- [x] large `AdminDashboard.tsx` decomposition need documented
- [x] client AI credential exposure path documented
- [x] AKSA target module boundaries documented
- [x] route contract documented
- [x] data authority contract documented
- [x] role/permission direction documented
- [x] AI boundary documented
- [x] Validation Center contract documented
- [x] reference-stack policy documented
- [x] B0-B13 roadmap documented

## Fresh execution gates — required before seal
These are deliberately **not marked complete** until executed on a real checkout.

- [ ] Checkout `aksa/b0-foundation-audit`
- [ ] Confirm `git status` clean
- [ ] Confirm branch ancestry from canonical baseline
- [ ] `npm install` PASS
- [ ] `npm run lint` PASS
- [ ] `npm run build` PASS
- [ ] Confirm no runtime/source files changed by B0
- [ ] Review docs for contradictions
- [ ] Record final B0 HEAD
- [ ] Declare/tag `AKSA-B0-SEALED`

## Stop conditions
Stop and report instead of adapting silently if:
- baseline mismatch is found,
- dependency install/build fails for reasons requiring code changes,
- B0 diff includes runtime behavior changes,
- requested work expands beyond audit/contracts.

## Next step after seal

Open **B1 — App Foundation** only after all gates above are evidenced.
