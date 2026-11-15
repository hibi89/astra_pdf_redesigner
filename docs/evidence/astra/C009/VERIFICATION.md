# C009 Verification — Accessibility, visual, performance, and recovery regression

- Date: 2026-11-15
- Branch: `codex/astra-final-ai-sku-20261115`
- Latest exact feature/test SHA: `2384a8287a7d5a196596acb4cf351ff61d7a7f34` (C009 product sources unchanged; this revision adds C010 package-byte comparison tests)
- Earlier passing PR merge SHA: `9444e8e` (merge of feature SHA `a9d7ba4f1fb6b5d7b0e2e09309ebbe634b2db031` into integration base `02f9481e441d20927d9f54a275717c7db33efa20`)
- Result: hosted Chrome and Edge technical regressions PASS; score change +0

## Exact-SHA hosted evidence

## Latest exact-SHA rerun

- [C009 run 43718318286](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43718318286), attempt 2, passed at feature/test SHA `2384a8287a7d5a196596acb4cf351ff61d7a7f34`. `npm test` reported 307 passed and 0 failed; production build passed.
- Chrome and Edge each passed the accessibility tree/keyboard check, all 8 base themes and 22 advanced layouts with 30 unique first-page rasters, 28-page synthetic PDF printing, and close/reopen recovery with IndexedDB V2 restored and localStorage preserved.
- Chrome print: 1,052 ms; 7,195,344-byte JS heap / 1,371 DOM nodes. Recovery print: 1,057 ms; 5,943,520-byte heap / 1,368 nodes. Edge print: 1,152 ms; 7,246,604-byte heap / 1,361 nodes. Recovery print: 1,247 ms; 5,939,164-byte heap / 1,358 nodes.
- [Retry artifact 14163129064](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43718318286/artifacts/14163129064): 4,026,774 bytes, ZIP SHA-256 `5a3cf17c888b4c04d03ec049f8661e83809f749a3e7b936d53b6adfbb7669318`.
- Attempt 1 at the same SHA failed when keyboard navigation observed only the import control; attempt 2 passed in both browsers without product-source changes. The retry is recorded because this check has shown a focus-timing race.


- [C009 accessibility, print, resource, and recovery run 43715685926](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43715685926) — PASS. Actions checked out PR merge SHA `9444e8e`, which contains feature/test SHA `a9d7ba4f1fb6b5d7b0e2e09309ebbe634b2db031`.
- `npm test` and `npm run build` — PASS.
- Chrome and Edge accessibility tree and keyboard checks — PASS: 14 button nodes, four named stage controls, keyboard reachability for PDF import/design navigation and print, with visible focus.
- The real React Workspace printed all eight base themes and 22 advanced PRO/BUSINESS layouts to one-page A4 PDFs. Both browsers produced 30 unique first-page raster hashes; synthetic title/body/amount/negation text was present, no studio UI leaked into PDFs, and previewing did not mutate the saved design.
- A second real-Workspace test created a synthetic 180-paragraph document and ran Chrome DevTools CPU throttling at 4×. Each browser generated a 28-page A4 PDF and preserved first/middle/last paragraph markers, `230,000원`, and the negative statement.
- The test then closed the rendered tab and opened a fresh Workspace in the same isolated browser profile. STEP2 V2 restored the exact saved document and legacy localStorage bytes; the recovered document printed again as 28 pages.
- Browser output and machine-readable reports: [artifact 14162766746](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43715685926/artifacts/14162766746), 128 synthetic files, ZIP SHA-256 `ba85b4cd2c82ab4c67ec4548a5e59d2b7da429355315fcfe781022d3dae98673`.

### Resource observations

| Browser | First print | After first print | Reopen/recovery print | After recovery |
|---|---:|---:|---:|---:|
| Chrome | 1,296 ms | 7,169,016-byte JS heap; 1,371 DOM nodes | 1,256 ms | 5,935,564-byte JS heap; 1,368 DOM nodes |
| Edge | 1,379 ms | 7,167,604-byte JS heap; 1,361 DOM nodes | 1,451 ms | 5,908,572-byte JS heap; 1,358 DOM nodes |

These are hosted Linux browser measurements with CDP CPU throttling; they are not physical low-memory Windows measurements.

## Failure history and correction

- The first layout-matrix run at feature SHA `c21c898e5eb4aa0a2a384fb20b93603f45276785` failed because PDF text extraction inserted whitespace in the Editorial title marker. The assertion normalized extracted text and punctuation; all 30 layouts then passed in Chrome and Edge in [run 43714391627](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43714391627).
- The first combined workflow at feature SHA `93cf443b97d970b7e56c7df39083ea6f8f7c13c4`, [run 43715431237](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43715431237), failed before the new resource tests because the existing accessibility smoke's keyboard sequence did not reach the print action. The test now explicitly brings its tab to the foreground with CDP before keyboard input. [Corrected run 43715685926](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43715685926) passed in both browsers.
- Changes are test/workflow-only; product source, V1/V2 data formats, and release settings were not changed.

## Scope, score, and remaining acceptance

The hosted matrix establishes synthetic React rendering, browser PDF output, a 4× CPU-throttled large-document case, JS heap/DOM observations, and close/reopen persistence on Linux Chrome and Edge. It does not establish a real screen-reader/assistive-technology session, WCAG conformance, total process or OS memory under an 8-GiB Windows limit, physical-device behavior, interruption during an in-progress write/print, or buyer visual acceptance. No manual visual approval is claimed. C009 adds **+0**; worker evidence ceiling remains conditional **67/100**, central ledger remains **64/100**, buyer acceptance remains **UNASSESSED**, and RELEASE HOLD remains.

## Next

The remaining C009 acceptance requires assistive-technology and buyer visual review on an owner-controlled device. Continue with other C tasks only when their OCR-supply, source-rights, low-memory Windows, or operational-owner prerequisites become available; do not increase score from this hosted synthetic run.
