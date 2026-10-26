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
