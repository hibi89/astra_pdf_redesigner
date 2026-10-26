# ASTRA M09-C — read-only PDF import cancel and recovery (2026-10-27 KST)

**Current verdict: IMPLEMENTED / EXACT CI PENDING** at application/test SHA `c780e007b92028fb380e3b721ed060e9ce3cd1e0`.

## Why this matters
The file input and drag/drop were disabled while `extractLocalPdf` ran, but so was **가져오기 취소**, preventing users from canceling a long-running read-only import. M09-B already guarded delayed results on unmount; the same invalidation guard permits user-initiated cancel while keeping actual `onImport` / IndexedDB writes protected from interruption.

## Decision
- **A — minimal React state + M09-B generation invalidation (chosen):** parsing phase tracked separately, cancel allowed while parsing and `forget()` invalidates pending continuation. Busy state clears to allow immediate replacement. Late parser may finish internally but cannot take ownership of Blob URLs or change UI. No external API or new dependency.
- **B — abort PDF.js worker/read at every stage (deferred):** can save CPU but requires invasive cooperative cancellation through pages/image recovery, higher regression/maintenance risk. Not needed to fix inability to cancel safely.

## Code / evidence scope
- Only app code `src/step3/ImportPanel.tsx`: new `parsing` state, cancel handler only permitted when not saving, early busy reset on cancel, existing M09-B request generation suppresses stale finally/catch/publication.
- `tests/step3-cancel-browser.mjs`: real Chrome+Edge synthetic end-to-end: malformed %PDF signature rejects; second real mixed-layout PDF blocked in `File.arrayBuffer`; cancel is enabled and clears busy; new actual PDF imports unapproved; old async read releases late and must not replace newer draft or allocate orphan source URL; cancel new source revokes original Blob URL; entire previous IDB V2 contents/active ID unchanged.
- CI `.github/workflows/ci.yml` runs new test after M09-B in both browsers. Windows installed installer regression unchanged. Real customer PDF or any source document is never uploaded.

## Required validation
- [Chrome+Edge #40374128104](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40374128104): needs both jobs SUCCESS, exact `PASS M09-C CHROME/EDGE CANCEL/RETRY`, full existing M09-A/B and M08-B/C/D markers, Node tests and build.
- [Windows x64 NSIS #40374128200](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40374128200): needs SUCCESS with existing native A4 8/8, STEP2 persistence/install-upgrade. It does NOT directly manipulate the M09-C cancel button on Windows.
- Any failing actual assertion remains FAIL until diagnosed; no paper PASS from documentation or code review. Physical Windows end-user GUI/real PDFs, licensed actual Korean offline model, 20/30 layouts, code signing and commercialization **NOT VERIFIED; sale NO-GO**.
