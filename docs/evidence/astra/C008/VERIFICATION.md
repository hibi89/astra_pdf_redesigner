# C008 Verification — Synthetic PDF accuracy and fail-closed checks

- Date: 2026-11-15
- Branch: `codex/astra-final-ai-sku-20261115`
- Exact code/test SHA: `bd83ac2619a80f940dd628d513a760aee06f0ecb`
- Result: hosted synthetic PDF regression PASS; score change +0

## Exact-SHA hosted evidence

- [Full Linux Chrome/Edge regression, run 43689843103](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843103) — both `build-and-test` and `Microsoft Edge A4 PDF and IndexedDB` jobs PASS at the exact SHA.
  - `npm test`: 298 passed, 0 failed; `npm run build`: PASS.
  - Actual Chrome and Edge browser flows passed the 15/15 synthetic A4 PDF source/output corpus. It checks money, dates, numeric signs, symbols, negation, links, duplicates, page risk, and source SHA parity.
  - Invalid PDF output took the manual-review/error path while preserving original bytes and STEP1 localStorage V1 plus all STEP2 IndexedDB V2 stores.
  - P118 exercised eight synthetic raster/layout cases and two-page fail-closed analysis without claiming OCR.
  - STEP3 browser fixtures passed 12/12 layout-risk cases. The two-page mixed fixture retained 17 markers, preserved the synthetic raster, displayed multi-column/table/vector risk, and required page review before saving.
  - The M04 audit uses PDF.js text geometry/A4 bounds, marker sequence, and raster checks; rotated text is counted as skipped/unknown rather than certified.
- [Blueprint evidence policy, run 43689843486](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843486) — PASS.
- The separate C002 mobile run at the same source SHA is [43689843233](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843233) — PASS.

## Scope limits and score

All PDF inputs were synthetic. No customer or owner PDF was uploaded. The checks establish bounded lexical/geometry/risk behavior, not visual or semantic equivalence, lossless conversion, or customer acceptance. A 30 MB stress/performance run, real scanned-document OCR/CER, vector-table restoration, rotated-text fidelity, and owner-approved 5–10 PDF comparison remain unverified. OCR stays governed by the GPT-owned supply-chain prerequisite; this work does not enable OCR.

C008 adds **+0**. Technical candidate remains **67/100**, official buyer acceptance **UNASSESSED**, and commercial status **RELEASE HOLD**.

## Next

Proceed to C009 accessibility/performance evidence, then C010 package-candidate audit where prerequisites allow.
