# ASTRA P84 — PDF.js vector-stroke integration recovery and exact-source CI

**As of:** 2026-11-12 KST. **Product engineering:** 85% provisional / target P95 unmet; BASIC, PRO, BUSINESS RELEASE HOLD. **Keep hub ASTRA [작업중] until P95 verified.**

## Actual discovered problem
The earlier P82/P83 PDF vector-stroke checker counted only top-level `OPS.stroke` etc. PDF.js 6.4.299 instead combines paint operations inside `OPS.constructPath`, with the paint opcode at `operatorList.argsArray[index][0]`. This made real PDF.js counters zero, despite passing isolated artificial unit tests. A two-page swapped PDF incorrectly yielded per-page vector drift 0 instead of 2, and a removed table border was not detected.

The owner-requested full CI check was possible using read-only connected GitHub Actions REST GET, including push events; the earlier narrow PR-only workflow query returned empty and was **not** an indication of CI absence.

### Red-to-green evidence
- Pre-fix P83 source `36bc458da322ebb77b9b48190857112b637ea7bf`:
  - [Linux/Chrome/Edge #43233430431](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43233430431) **FAILURE**: npm test 146 PASS/2 FAIL, actual Edge STEP7 page-vector test 0 versus expected 2. Chrome browser job blocked at failed npm test.
  - [Windows #43233430460](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43233430460) **FAILURE**: 145 PASS/2 FAIL/1 SKIP. Two failed assertions were page-vector movement and removed-border check.
- P84 synthetic-only diagnostic commit `2bbadf4116a2763da7549ea1def0869fcc26a3ee`: actual GitHub CI PDF.js operator introspection proved page 1 had three `constructPath` operators, zero top-level stroke operators; page 2 none; swapped-pages moved those three to page 2. The diagnostic test was removed after root cause identification. No real customer PDF data logged.
- **Corrected code SHA `ceef31d121d3d2a89448220326c89ecb1bc6066a`**: browser `src/step7/pdfPaintSignals.ts` now examines `OPS.constructPath` first argument as the drawing action and keeps support for top-level paint. CLI `scripts/owner-pdf-source-output-review.mjs` uses the equivalent operator decoding; `src/step7/OfflinePdfReview.tsx` now passes both `fnArray` and `argsArray`; core unit test covers embedded `constructPath`; one-off diagnostic removed. Exactly five files modified. No schema, owner PDF, external API, main or PR merge changes.

### Exact-source CI successes
- [Linux Chrome + Microsoft Edge #43235958596](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43235958596): **COMPLETED SUCCESS, 2/2 jobs**, Linux Node22 **148 PASS/0 FAIL/0 SKIP**, React TypeScript/Vite production build PASS, real Chrome and Edge `PASS STEP7 PDF PAIR`. Browser proof covers source/output selectable-text parity, page and vector warnings, numbers, JSON metadata only, preserved IndexedDB V2, no outbound requests. Other STEP1–5 regressions also pass.
- [Windows Electron / NSIS #43235958651](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43235958651): **COMPLETED SUCCESS, 1/1 job**, Windows Node22 **147 PASS/0 FAIL/1 SKIP**, desktop tests **16 PASS/0 FAIL**, Windows installed Electron PDF, native STEP3, eight distinct A4 layouts **8/8 PASS**, NSIS install/uninstall, 0.1.0→0.1.1 in-place upgrade preserving existing document and PNG **PASS**. `0.1.1` was an ephemeral CI fixture, **not** a production release.
- Historical P81 code `d417eb91` also had exact-source [Linux #43228896996](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43228896996) and [Windows #43228897262](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43228897262) SUCCESS; prior "not verified" was caused by the limited PR-only workflow query.

### Decision and fidelity limitations
Alternative A: rasterize and compare all pages for visual matching — higher time, CPU and false positives because redesign intentionally changes geometry. Alternative B (chosen): cheap read-only PDF.js drawing-op counts across entire document and per page. These are **advisory changes**, not proof a table is present, that content is correct or that source/output is pixel-identical. User PDFs are never sent out or stored by new feature.

**Still NOT VERIFIED / approval-gated**: actual owner-approved customer PDF samples 5–10, buyer-owned physical Windows10/11, fully distinct PRO20 / BUSINESS30 designs, locally licensed Korean model and redistribution rights, fonts / signed installer / support / customer-facing legal and sales policies. STEP6 search and OCR remain explicitly unapproved/excluded. Commercial release remains **NO-GO**, final target P95 not met; no arbitrary increase from 85%.

## Resume gate
Read newest `HANDOFF.md`, `STATUS.md`, `AGENTS.md`, `REQUIREMENTS.md`; check product branch and hub latest HEAD. Source SHA is `ceef31d1...` on `feature/astra-p71-pdf-source-parity-20261112`, Draft PR #10, not merged. Maintain **[작업중]** in central Kmong score until objective P95 is truly verified, even on pause or chat transfer.
