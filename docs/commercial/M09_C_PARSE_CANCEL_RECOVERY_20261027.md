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


## M09-C first browser failure isolated, single test-only correction — 2026-10-27 KST
- Exact first candidate app/test `c780e007b92028fb380e3b721ed060e9ce3cd1e0`: [Windows NSIS #40374128200](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40374128200) **SUCCESS**, Node **61/61**, desktop **12/12**, installed STEP3 PDF content and BASIC 8/8 native outputs, STEP2 image+document 0.1.0→0.1.1 persistence.
- [Linux #40374128104](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40374128104) Edge **FAILED at newly added test only** before exercising cancellation: `tests/step3-cancel-browser.mjs:49` `TypeError: Cannot read properties of undefined (reading 'length')`. Browser snapshot expression returned a function instead of its Promise because JS grouping used `})())` rather than `}))()`; verified syntax/evaluation root with Node before change. Prior M09-A/B and M08-C/D real Edge steps PASS; this is **not evidence product cancel failed**. Chrome job of original run still running at latest check.
- **One meaningful test-only correction** `tests/step3-cancel-browser.mjs`, exact corrected test commit **`02c9051ba93d81f3d6cac82d35ac067dffaa8617`**. `src/step3/ImportPanel.tsx` product code unchanged since `c780e007`. [Chrome+Edge #40375087842](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40375087842) and [Windows #40375087864](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40375087864) **QUEUED / NOT VERIFIED**. If same scenario fails without substantive new evidence, STOP & PIVOT rather than repeated test churn. M09-C **PARTIAL/VERIFICATION PENDING**; sale NO-GO.


## M09-C UI rendering bug verified; layout pivot implemented (2026-10-27 KST)
- First test-only correction code `02c9051ba93d81f3d6cac82d35ac067dffaa8617`: [Linux #40375087842](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40375087842) **FAIL**, actual Edge `tests/step3-cancel-browser.mjs:78`: `TypeError: Cannot read properties of undefined (reading 'disabled')`. The parser was busy but `cancelButton` did not exist. **Root cause in PRODUCT UI:** the review footer containing the cancel button is guarded by `{draft&&...}`, while PDF analysis begins after `forget()` sets `draft=null`. The initial parsing-state code changed button disabled logic but not its conditional rendering, so the end-user action remained inaccessible. All prior M09-A/B and M08-B/C/D Edge regressions succeeded. Not a data-loss claim.
- **Substantive Stop & Pivot:** show an independent `busy&&parsing` cancel control next to analysis progress, outside `draft&&`; preserve existing review footer cancel for loaded draft, keep saving in-progress non-cancellable. Existing M09-B token guard still discards late canceled result. Only `src/step3/ImportPanel.tsx` changed at exact code `2ba0b4e57f7d521ba9482a6d626411f10961f9b9`. No DB/PDF.js/source changes, no added test churn.
- [Latest Chrome+Edge #40376435854](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40376435854) and [Windows NSIS #40376435967](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40376435967) **RUNNING / NOT VERIFIED**. Earlier Windows exact test SHA `02c905` [#40375087864](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40375087864) SUCCESS for standard installed regressions, but NOT proof of fixed cancel interaction. If new UI path still fails, STOP AND PIVOT (do not repeatedly change CI without evidence). Commercial NO-GO, PR9 Draft, main/PR3/4 untouched.
