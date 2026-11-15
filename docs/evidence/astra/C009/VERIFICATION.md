# C009 Verification — Accessibility, visual, performance, and recovery regression

- Date: 2026-11-15
- Branch: `codex/astra-final-ai-sku-20261115`
- Latest exact feature/test SHA: `d0701f007c58bf53a452297a45cb81574a6ae039` (C009 product sources unchanged; this revision adds C010 package-byte comparison tests)
- Earlier passing PR merge SHA: `9444e8e` (merge of feature SHA `a9d7ba4f1fb6b5d7b0e2e09309ebbe634b2db031` into integration base `02f9481e441d20927d9f54a275717c7db33efa20`)
- Result: hosted Chrome and Edge technical regressions PASS; score change +0

## Exact-SHA hosted evidence

## Latest exact-SHA rerun

- C009 passed at exact code/test SHA `d0701f007c58bf53a452297a45cb81574a6ae039` in both [push run 43720322613](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720322613) and [PR run 43720328240](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720328240). Push run `npm test`: 307 passed, 0 failed, 0 skipped; production build PASS.
- Chrome and Edge passed the accessibility tree and keyboard checks, 8 base themes + 22 advanced layouts (30 unique first-page rasters), 28-page synthetic print, and close/reopen recovery with IndexedDB V2 restored and localStorage preserved. Keyboard focus was made stable by bringing the page forward and allowing a short interval for each Tab transition.
- Chrome print: 777 ms; 7,426,764-byte JS heap / 1,371 DOM nodes. Recovery print: 839 ms; 5,938,768-byte heap / 1,368 nodes. Edge print: 824 ms; 7,217,892-byte heap / 1,361 nodes. Recovery print: 834 ms; 5,881,016-byte heap / 1,358 nodes.
- [Artifact 14163937633](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720322613/artifacts/14163937633): 4,026,775 bytes, ZIP SHA-256 `76cf1e90f776c0e1e6c73d7a868e3d52260e75cb63d87466d247c7db0e44039c`.
- The preceding docs-only-head run [43719930375](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43719930375) still exposed a keyboard timing failure. After adding the focus-settle and per-Tab wait, both exact-SHA d0701f00 runs passed; no product behavior or persistence format changed.


### Resource observations

| Browser | First print | After first print | Reopen/recovery print | After recovery |
|---|---:|---:|---:|---:|
| Chrome | 1,296 ms | 7,169,016-byte JS heap; 1,371 DOM nodes | 1,256 ms | 5,935,564-byte JS heap; 1,368 DOM nodes |
| Edge | 1,379 ms | 7,167,604-byte JS heap; 1,361 DOM nodes | 1,451 ms | 5,908,572-byte JS heap; 1,358 DOM nodes |

These are hosted Linux browser measurements with CDP CPU throttling; they are not physical low-memory Windows measurements.

## Failure history and correction

- The first layout-matrix run at feature SHA `c21c898e5eb4aa0a2a384fb20b93603f45276785` failed because PDF text extraction inserted whitespace in the Editorial title marker. The assertion normalized extracted text and punctuation; all 30 layouts then passed in Chrome and Edge in [run 43714391627](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43714391627).
- The first combined workflow at feature SHA `93cf443b97d970b7e56c7df39083ea6f8f7c13c4`, [run 43715431237](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43715431237), failed before the new resource tests because the existing accessibility smoke's keyboard sequence did not reach the print action. A later run still showed a timing race on documentation-only SHA `f63f4e13d9713aad89a1848f55f13a981591e915`; the test now brings the page forward and waits for keyboard transitions. Both exact-SHA d0701f00 runs passed.
- Changes are test/workflow-only; product source, V1/V2 data formats, and release settings were not changed.

## Scope, score, and remaining acceptance

The hosted matrix establishes synthetic React rendering, browser PDF output, a 4× CPU-throttled large-document case, JS heap/DOM observations, and close/reopen persistence on Linux Chrome and Edge. It does not establish a real screen-reader/assistive-technology session, WCAG conformance, total process or OS memory under an 8-GiB Windows limit, physical-device behavior, interruption during an in-progress write/print, or buyer visual acceptance. No manual visual approval is claimed. C009 adds **+0**; worker evidence ceiling remains conditional **67/100**, central ledger remains **64/100**, buyer acceptance remains **UNASSESSED**, and RELEASE HOLD remains.

## Next

The remaining C009 acceptance requires assistive-technology and buyer visual review on an owner-controlled device. Continue with other C tasks only when their OCR-supply, source-rights, low-memory Windows, or operational-owner prerequisites become available; do not increase score from this hosted synthetic run.
