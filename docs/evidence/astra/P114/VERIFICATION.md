# P114 verification — PDF layout risk and review gate

**Status:** VERIFIED · **Credit:** +2/2 (A03: 8→10/14) · **Provisional total:** 52/100  
**Feature SHA:** [`9c3c506ecae49b68f207e6022c6b136da515b7e5`](https://github.com/hibi89/astra_pdf_redesigner/commit/9c3c506ecae49b68f207e6022c6b136da515b7e5)  
**Branch:** `feature/astra-p71-pdf-source-parity-20261112`  
**Date:** 2026-11-15 KST

## Implementation

- Preserved PDF.js source order for pages whose text geometry indicates uncertain reading order, columns, rotation, tables/vector content, clipped or incomplete text. These pages require explicit source review; the app does not silently reorder their text.
- Kept whitespace from fragmented PDF.js items attached to source text rather than creating blank editable blocks.
- Added a per-page layout confirmation and a separate overall review confirmation before import can save a V2 document. Draft edits revoke both confirmations.
- Added a synthetic 12-PDF browser matrix and extended source-order, persistence, consent, and Windows acceptance regressions.

Changed implementation and test paths: `.github/workflows/ci.yml`, `desktop/step3-project-acceptance.cjs`, `src/step3/ImportPanel.tsx`, `src/step3/pdf.ts`, `src/step3/structure.ts`, `tests/fixtures/step3-layout-risk-matrix.mjs`, `tests/step3-browser.mjs`, `tests/step3-consent-browser.mjs`, `tests/step3-layout-review-browser.mjs`, and `tests/step3-structure.test.ts`.

## Exact-SHA GitHub Actions

| Workflow | Result | Evidence |
|---|---|---|
| Linux Node, build, Chrome and Edge | SUCCESS; Node **266 passed, 0 failed, 0 skipped**; build passed; Chrome and Edge each reviewed **12/12** generated PDFs and verified the save gate; A4/IndexedDB browser regressions passed. | [Run #43607945345](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43607945345) |
| Windows Electron and NSIS | SUCCESS; Node **265 passed, 0 failed, 1 OS-specific skip**; desktop **73 passed, 0 failed**; installed app, NSIS install/uninstall and 0.1.0→0.1.1 upgrade preserved STEP2 IndexedDB data and PNG. | [Run #43607945351](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43607945351) |
| Final blueprint evidence policy | SUCCESS. The policy report is a structural evidence check; it explicitly does not independently accept the feature or assign an official score. | [Run #43607945617](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43607945617) |

The browser matrix covers single-column, two-column, grid-table, rotated text, mixed image/columns, numeric-negation, interleaved columns, three columns, rotated grid, sparse wide text, out-of-page text, and numeric-negation grid. All markers were retained; uncertain layouts kept source order and could not be saved before page-level confirmation.

The prior candidate `9afe0b0ec1f8a4fe321328f42d8f8065cb41dedd` had a Linux regression failure in M09-A because the legacy test asserted save was enabled after only overall consent. The app now also requires per-page layout consent. The test was corrected to confirm each risky page and verify that text/role/order edits revoke both confirmations. Earlier synthetic fixture revisions also exposed clipped markers and ambiguous geometry; the final 12/12 matrix passes on both browsers. Only the exact SHA above is credited.

## Scope limits and state

These are generated synthetic PDFs and GitHub-hosted browser/Windows runners. No customer originals, physical customer Windows PCs, real Tesseract Windows OCR, or Qwen3 CPU inference were used or accepted as evidence. Complex table/vector reconstruction and semantic equivalence are not claimed; uncertain material remains for human comparison.

The provisional score changes from **50 to 52/100**. User/buyer final acceptance remains **UNASSESSED**, and release remains **RELEASE HOLD**. STEP1 V1, STEP2 V2, BASIC8/PRO20/BUSINESS30, keys, and release-blocking policy remain intact.
