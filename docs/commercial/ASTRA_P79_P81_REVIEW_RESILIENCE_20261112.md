# ASTRA P79–P81 — Local PDF review resilience and signed numbers

**Date:** 2026-11-12 KST  
**Target:** 95% internal engineering / sale readiness still subject to explicit owner and customer acceptance gates.  
**Verified engineering estimate:** **85% provisional, 95% NOT ACHIEVED.** **RELEASE HOLD** and hub **[작업중]** unchanged.

## Actual defects

1. **P79 stale browser review lock:** selecting a replacement PDF incremented a review epoch but left `busy=true`. The earlier async review returned and its `finally` refused to reset `busy` because the epoch was stale; the primary review button remained disabled indefinitely.
2. **P80 numeric sign lost:** old selected-text lexical regex discarded leading +, - or U+2212 before numerals. `-100` vs `100` could appear as the same source/output token count even though this is a financially meaningful change.
3. **P81 large-token spread overflow:** `tokens.push(...matches.map(...))` could throw JavaScript `RangeError: Maximum call stack size exceeded` with 300001 tokens **before** the intended 300000-token limit. Also existed in GUI page append and CLI page append.

## Evaluated designs and chosen resolutions

| Choice | Cost and performance | Fidelity / safety | Decision |
|---|---|---|---|
| P79 A: only reset UI busy flag | Minimal | Orphan analysis continues in background | Rejected |
| **P79 B: AbortController + PDF.js loading task destruction + epoch guard** | Small integration change; avoids redundant parsing | Old task cancelled, no stale report or stuck button | **Chosen** |
| P80 A: only count digits | Cheapest | Misses negative/positive drift | Rejected |
| **P80 B: preserve leading signs before number, normalize U+2212** | Regex O(N); no API costs | Warns on sign-only changes; no claim of semantic fidelity | **Chosen** |
| P81 A: catch RangeError | Minimal patch | May have already exhausted call stack / memory | Rejected |
| **P81 B: precheck bounds, append with bounded loop** | O(N), controlled error | Preserves configured 300k limit | **Chosen** |

## Code and regression scope

- P79 source `3739ede47ce9361073ac1939e44599fa7d734a52`: `src/step7/OfflinePdfReview.tsx` and synthetic Chrome/Edge regression in `tests/step7-pdf-review-browser.mjs`. Cancellation applies on either file change and unmount; old epoch cannot overwrite new UI results. Files remain local.
- P80 source `c2003ced478a379360e4ed9ec38982c9a650d49c`: `src/step7/tokenParity.ts`, `scripts/owner-pdf-source-output-review.mjs`, and TypeScript/real-PDF fixture/browser tests. Signs recognized only when directly before numeric characters; split text runs, accounting parentheses and visually flattened scans remain outside this signal.
- P81 source `d417eb91e31f5781fded65120bcfc363a4ea97c2`: token accumulation on CLI/GUI and core helper now uses prechecked length + bounded loops, plus 300001-token regression.

## Verified versus not verified

- Exact source blob `src/step7/tokenParity.ts@4513d7608d5cb5f836b8b87cb69e1fc2d1f81973` independently reconstructed and Git blob SHA matched in Linux Node22.16.
- **11/11 PASS, 0 FAIL** for local isolated signed-number, old page-order, 1000-case fuzz, numeric limit, and overload tests. Previous P80 unpatched source yielded 10 PASS/1 FAIL with actual `RangeError`; P81 fixed that failure. Standalone source TypeScript `tsc --noEmit --skipLibCheck --target ES2022 --module ESNext` **PASS**.
- GitHub source commit comparisons confirm only scoped source/test files, not owner data/main. GitHub workflow configured on feature branch push, but connector only surfaces PR-triggered workflow runs; returned zero and combined statuses empty. **Do not claim full CI success or failure.**
- **NOT VERIFIED:** exact new-SHA `npm test`, full React TypeScript/Vite build, actual PDF.js in Chrome/Edge, Windows Electron NSIS/upgrade/installed app, owner-consented 5–10 actual customer PDFs, physical buyer Win10/11, 20 PRO + 30 BUSINESS original design acceptance, approved Korean local LLM/redistribution/license, legal sales go-live.

## Boundaries and next actions

Continue via latest feature branch with `HANDOFF.md` → `STATUS.md` → `AGENTS.md` → `REQUIREMENTS.md`. Finish exact-SHA full regression and browser/Windows checks as runtime permits; run actual customer PDF visual/structural acceptance only with explicit owner consent. Keep PDF source, V2 IndexedDB, fonts/models/licenses and original other branches unchanged. No OCR, API costs, upload, license assumption, PR merge, production release or sales authorization. **Keep central ASTRA [작업중] until verified P95; do not remove on pause/chat switch.**
