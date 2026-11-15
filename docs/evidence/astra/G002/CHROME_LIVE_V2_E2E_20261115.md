# G002 — actual Chromium STEP3 source → V2 IndexedDB → export → A4 PDF.js E2E

**Independent functionality SHA:** `0432f1513cce957524f2d5e69a35c993a90cfa3b` (2026-11-15 KST). **Status:** `SYNTHETIC_BROWSER_E2E_PASS_WITH_CONTENT_RISKS`. Buyer acceptance **UNASSESSED**; provisional score **64/100 (+0)**; **RELEASE HOLD**.

## Completed genuine-browser evidence

- [GitHub Actions #43688818553](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43688818553) — **all four jobs SUCCESS**:
  - G001/G002/G003/G004 prior provenance and no-release tests: **52 PASS / 0 FAIL / 0 SKIP**.
  - Actual PDF.js/source-output + product V2 exported project/receipt bridge: **32 PASS / 0 FAIL / 0 SKIP**, including new zero-glyph guard; total 84 Node tests.
  - Dedicated **real Chromium**: production app build, isolated Chrome CDP, two-page synthetic vector-table/raster PDF upload via STEP3, PDF.js reading, explicit page-specific `data-step3-layout-review-confirm` checkboxes, final global source consent, actual STEP2 V2 save, browser IndexedDB document/content SHA, real PRODUCT `프로젝트 내보내기` JSON, SHA equality to actual saved V2 document, retained original Blob PDF SHA, actual `Page.printToPDF`, PDF.js independent structure/number/negation audit and STEP1 V1 unchanged.
  - G003 read-only pinned Codex P124 risk reviewer success; OCR supplier remains BLOCKED.
- [Final blueprint policy #43688818722](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43688818722) SUCCESS at exact code SHA.

**Observed real PDF output risks (not hidden):** synthetic source PDF.js 2 pages / 29 items / 302 text characters / **0** NUL; actual printed output 2 pages / 56 items / 369 characters / **10** NUL (synthetic test-only counts, not customer text). Risk codes from the actual test:
`SOURCE_OUTPUT_TEXT_DIFFERENCE`,
`SOURCE_OUTPUT_NUMERIC_DIFFERENCE`,
`PDFJS_OUTPUT_NUL_GLYPH_REVIEW_REQUIRED`,
`VECTOR_PATH_OPERATOR_COUNT_CHANGED`,
`PAGE_LEVEL_TEXT_REVIEW_REQUIRED`.
The independent `tools/gpt-final-qa-real-pdfjs-parity.mjs` now flags U+0000 as a critical output risk and substitutes U+FFFD **only in the in-memory comparison**, never in original/project/output PDF bytes. This is **not parity certified**. Such output requires owner review; it must **never** be auto-accepted.

## Why earlier attempts failed, and exact pivot

Older experimental browser run [#43687234735](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43687234735) cleanup masked a failure. [#43687324164](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43687324164) used immediate same-task disabled read after React state click; [#43687445890](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43687445890) waited but still could not enable global save. These are historical **FAIL**, not false PASS. The root cause became clear from `src/step3/ImportPanel.tsx`: on multi-column/table PDFs `layoutReviewPending` blocks save until **each flagged page** gets its own explicit manual reading-order confirmation; a global checkbox alone is insufficient. New `tests/gpt-final-qa-live-v2-checked-browser.mjs` follows the legitimate gate and observed real saved V2 content. It does not patch the disabled attribute or bypass manual review. It uses only a public synthetic deterministic fixture.

The first corrected trial [#43688388262](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43688388262) reached V2 save/output but failed conservative text snapshot for NUL; next diagnostic [#43688517264](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43688517264) pinned the issue to **OUTPUT**, not the original/import; fixed code reports an explicit never-green glyph risk. The new E2E is a **material redesign** of the old failing shortcut, not an unchanged rerun.

## Scope limitations / release decision

- Input is synthetic, all work is on temporary CI profile. The manual page checkboxes are **test harness actions on known synthetic content**, not proof a real owner reviewed a real customer PDF.
- It verifies exported document content SHA against actual browser IndexedDB V2, but not full crash recovery across installed Windows, OS encryption, visual pixel parity, OCR on scan, source/print numeric semantic preservation, or legally authorized customer files.
- PDF source vs redesigned output differ; some are legitimate redesign/layout changes. Their risk codes require human comparison. PDF.js output NUL is an independently observed extraction anomaly: no false silent success; further product investigation belongs to Codex after independent reproduction, not a GPT reviewer patch to production code.
- This QA-only change neither adds automatic correction/acceptance nor changes STEP1 V1, STEP2 V2 schema, real customer files, local model/OCR assets, issuer credentials, payment, release flags or the production user interface.
- Real owner 5–10 permissioned PDFs / physical Windows 10/11 / signing / ASAR isolation / C001 actual production entitlements remain UNVERIFIED; OCR supply P119 BLOCKED; `RELEASE HOLD` persists.

**Next:** G003 Codex latest C006 lifecycle exact SHA and CI (Windows upgrade/Chrome/Edge), C005 8-GiB model block, current P124 one-distinct-input scope; separately investigate synthetic 10 NUL output glyphs and number-risk before any A03/A08 score increase.
