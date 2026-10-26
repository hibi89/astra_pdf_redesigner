# ASTRA M09-B — delayed local PDF import after workspace unmount

**Checkpoint 2026-10-27 KST: BUG REPRODUCED / FIX IMPLEMENTED / CI PENDING.** This is a standalone scope, not commercial acceptance.

## Reproduction (actual Edge browser, synthetic-only)
1. Open STEP2 studio with an existing synthetic persisted document.
2. Select synthetic two-page multicolumn PDF; the test intercepts only that `File.arrayBuffer()` call and holds its resolution.
3. Click the application's real **기존 회고록 편집** button; STEP2 ImportPanel unmounts while analysis remains pending.
4. Release the held buffer. On original code, `choose()` runs after unmount and calls `URL.createObjectURL(file)`. Since cleanup already ran, the URL is orphaned.
5. `tests/step3-race-browser.mjs` observes exactly **one stale source URL**; baseline code `179a11b71625cfcbb337233df2b5f52374068e22`, [Edge in #40369980500](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40369980500) fails at `AssertionError ... 1 !== 0`. This is an intentionally red regression test, not evidence of persisted data mutation.

## Minimal fix and alternative comparison
| Option | Cost/impact | Decision |
|---|---|---|
| **A: generation + unmount guard** | Tiny React-only patch, no parser/schema change, guards delayed results/Blob URL allocation | **Chosen** |
| B: cancel PDF.js parser/worker/page operations | More invasive asynchronous cancellation, cross-API race/maintenance risk | Rejected for this reproduction |

- `src/step3/ImportPanel.tsx` holds `requestVersion` and `unmounted` refs; forgetting the review or unmounting invalidates old work. After awaited extraction, only the active version may allocate URLs or update state; stale failure/finally also cannot overwrite new UI.
- Synthetic test is included for Chrome and Edge after M09-A in `.github/workflows/ci.yml`. It checks held/released File bytes, navigation/unmount, no orphan original Blob URL, return to fresh studio, and untouched persisted V2.
- Implementation source SHA `fd5bbe077b84dd6422e20673e9a70efd9b0e076f`.

## Acceptance (pending)
- [Linux Chrome+Edge #40370194342](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40370194342): full 2/2 success, Node/build and actual **PASS M09-B CHROME/EDGE STALE UNMOUNT** in both job logs required.
- [Windows NSIS #40370193990](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40370193990): installed STEP3 native A4, eight layouts, STEP2 PNG retention and M08-C/D regressions required; this is NOT a direct M09-B Windows UI action test.
- No buyer PC/customer PDFs, genuine licensed Korean GGUF, PRO20/BUSINESS30 layouts, signed installer or entitlement gate tested. Draft PR9 remains open/draft, main and PR3/4 untouched. Commercial **NO-GO**.

When CI completes, append exact verdict/source/log evidence; document commits are not separately code-tested.


## M09-B first fix CI: confirmed URL guard, unrelated legacy-migration test assertion corrected (2026-10-27 KST)
- **First fix source `fd5bbe077b84dd6422e20673e9a70efd9b0e076f`:** [Linux Chrome+Edge #40370194342](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40370194342) **FAIL** both browsers **after stale source URL guard passed**. Test failed only at the final strict document count equality: expected 1, actual 2 with original active `새 문서` and `hasDraft:false`. The user deliberately navigated to STEP1; STEP1 localStorage auto-save then established V1→V2 migration on returning to STEP2 (see `src/step2/idb.ts initialize()`). This extra migration document is expected, not proof of unapproved PDF import.
- **Test-only correction:** `tests/step3-race-browser.mjs` now snapshots exact existing V2 ID and document content before the operation, checks byte-for-byte equivalent JS-serialized objects after; forbids source marker `STEP3_SOURCE_P1_BEGIN_901` in any saved document; allows 0 new docs OR exactly 1 from existing V1→V2 migration with explicit `v1MigrationFinished` change. Requires orphan source URL count 0, no draft, same active project. Product guard and database code unchanged.
- **Current exact corrected test commit `1abe28f6b7751ec6d0483d0b55095e006608ff93`**, [Chrome+Edge #40371859883](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859883), [Windows #40371859794](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859794) **QUEUED/RUNNING; final conclusion NOT VERIFIED**. Prior Windows app SHA `fd5bbe` [#40370193990](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40370193990) SUCCESS (Node 61, desktop12, eight A4); not same as final test-only SHA. Stop & Pivot if corrected test fails again without new evidence. M09-B **PARTIAL/VERIFICATION PENDING**, commercial **NO-GO**.


## M09-B FINAL VERIFIED — 2026-10-27 KST (supersedes prior pending and first-test failure)
- **Exact final tested source+test SHA `1abe28f6b7751ec6d0483d0b55095e006608ff93`** (app guard introduced at `fd5bbe077b84dd6422e20673e9a70efd9b0e076f`; final test-only correction changed no app runtime bytes).
- [Linux Chrome+Edge #40371859883](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859883) **completed/success 2/2**. Both actual job logs: `PASS M09-B CHROME/EDGE STALE UNMOUNT: delayed real PDF bytes ignored after navigation, no original URL allocated, original V2 unchanged (legacy migration allowed)`. Chrome Node **61/61 PASS/FAIL0**, TS/Vite build PASS; both browsers also passed M09-A and M08-C/D.
- [Windows installed NSIS #40371859794](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859794) **completed/success** at same SHA: Node **61/61 PASS**, desktop shell **12/12 PASS**, actual installed STEP3 source review→native A4 PDF output, **8/8** distinct Windows designs, corrupt/encrypted rejection and STEP2 document+PNG 0.1.0→0.1.1 upgrade preservation. **M09-B direct Windows GUI delayed-unmount interaction NOT tested**; Windows is a release-regression at exact source.
- Baseline synthetic reproduction: test-only `179a11b7...`, actual Edge #40369980500 **expected failure**: stale original Blob URL count **1 vs required 0** after navigating to STEP1 during held `File.arrayBuffer`. First guard CI #40370194342 failed a **test-only false assumption** that document count would stay identical despite legitimate STEP1 v1→STEP2 V2 automatic migration. Strict corrected test snapshots original V2 document ID and content, forbids unapproved PDF source marker and permits only migration-flagged extra document. **Both browsers green on corrected test**.
- **Scoped M09-B DONE**, code remains on `integration/astra-commercial-core` / [Draft PR9](https://github.com/hibi89/astra_pdf_redesigner/pull/9); **main, Draft PR3/PR4 unchanged and unmerged**. No external document/API/model transfer. Product not released, **Vercel/Production N/A**. **Commercial sale NO-GO** until authorized customer PDFs on real Windows hardware, genuine licensed Korean offline GGUF, PRO20/BUSINESS30, entitlements/signing/support gates.
- **Next owner-free candidate:** audit failure/cancellation recovery and fixture matrix without pretending it replaces customer acceptance; prioritize actual customer PC/PDF and approved offline model feasibility once owner enables those assets. No automatic model acquisition or paid service.
