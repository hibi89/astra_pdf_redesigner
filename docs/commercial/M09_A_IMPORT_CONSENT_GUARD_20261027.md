# ASTRA M09-A — PDF review approval invalidation (2026-10-27 KST)

**Current verdict: IMPLEMENTED / CI PENDING**. Previous task M08-D is **scoped DONE**, with exact-code Chrome/Edge/Windows green (see `M08_D_PASSWORD_PDF_ACCEPTANCE_20261027.md`). M09-A is **not verified** until its own workflows finish.

## Bug, user impact and minimal correction
Before M09-A, the import review checkbox was set once and **remained checked** after the user changed extracted paragraph text or role, or moved a block. Furthermore, dropping an invalid replacement file while a valid source was already approved set an error but **left the earlier approved draft and enabled save action accessible**. This may cause an unintended outdated document import, despite the user attempting to replace the source.

Only `src/step3/ImportPanel.tsx` changes:
- Any PDF block text/role change or move revokes the current `confirmed` state; user must compare and explicitly check again before clicking Save.
- A rejected drop (multiple files or extension other than `.pdf`) calls existing `forget()` first. Old temporary draft and original Blob URLs are discarded and previously checked approval revoked; an actionable error remains.
- Existing real PDF selection, 30MiB/50p limit, password/scan errors, image-include approval reset, document V2 schema and original file bytes unchanged. No server upload or product dependency.

## Added real browser acceptance
`tests/step3-consent-browser.mjs` generates two-page locally synthetic mixed scan/text PDF through existing `desktop/step3-scanned-fixture.cjs`. In an actual Chrome/Edge UI:
1. Import synthetic valid source; verify two exact text markers and manual checkbox.
2. Check approval; make a visible textarea text change; verify approval reset + Save disabled.
3. Reapprove; change classification; verify reset + Save disabled.
4. If an editable block-move target exists, reapprove then move, verify reset + Save disabled.
5. Reapprove; drop a real `File` with `.txt` name through `DragEvent`. Assert visible error, prior draft and original Blob iframe removed, no Save option available.
6. Valid PDF retry starts unapproved, cancel, reload shows original persisted V2 document list and selection unchanged.

`.github/workflows/ci.yml` runs the new standalone E2E after M08-D in **both Chrome and Edge**. Windows installed NSIS existing regression continues unchanged; M09-A UI is **not** separately manipulated in the Windows native GUI.

## Exact tests and release gates
- Latest executable source SHA **`657e8adf59d6ff0b1ba8a84b1611939e2f8f247b`**.
- [Linux Chrome+Edge #40362547385](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40362547385): **RUNNING/PENDING** at creation.
- [Windows NSIS #40362547537](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40362547537): **RUNNING/PENDING** at creation.
- Required real browser markers: `PASS M09-A CHROME/EDGE REVIEW CONSENT` in both jobs, both success conclusions and old M08-A/B/C/D regressions. Windows must also complete successfully (no new UI interaction claimed).
- Current app/model/paid tiers **NOT sale-ready**; actual customer source, owner PC, true local licensed Korean model, PRO20/BUSINESS30 and signing/entitlement remain unmet. PR9 stays Draft, main/PR3/PR4 untouched. No customer file or model download.

## Next decision
If browser red, inspect exact failing assertion and fix minimally once; if still blocked, STOP & PIVOT with verified partial status, do not claim PASS. If both workflows green, add final exact SHA/log evidence to STATUS/HANDOFF and lead branch. Next owner-free improvement candidate: concurrent PDF import selection stale-async response protection; do not start without verifying M09-A.


## Expanded strict reorder coverage — 2026-10-27 KST
- First version exact code `657e8adf59d6ff0b1ba8a84b1611939e2f8f247b` [Chrome+Edge #40362547385](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40362547385) **SUCCESS 2/2**: both logs `PASS M09-A CHROME/EDGE REVIEW CONSENT: text/role changes ...`; Node **61/61 PASS**, build passed. Real textarea and role edits, rejected bad drop, prior V2 across reload validated. **Block move was not exercised** because that first synthetic mixed-scan fixture yielded no movable block (the log omits `/order`).
- Tightened test *only*, switching to existing **2p synthetic multicolumn/multiblock** fixture `tests/fixtures/step3-mixed-layout-pdf.mjs` with all exact source markers, and requiring **moveCount > 0** before asserting a real block move revokes approval. No more conditional omission. **Latest exact functional/test source `575373799324c79cac6134edc28f72a00303d88e`**, [Chrome+Edge #40363162008](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40363162008) **QUEUED**, [Windows #40363162195](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40363162195) **QUEUED** at writing. Prior Windows #40362547537 for older SHA was in progress; not proof for this stricter test source. M09-A **overall verification pending**.


## FINAL VERIFIED VERDICT — 2026-10-27 KST (supersedes earlier PENDING)
- **M09-A scoped DONE:** exact executable/test SHA `575373799324c79cac6134edc28f72a00303d88e`, Linux [#40363162008](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40363162008) completed/success, **Chrome and Edge both PASS**, Node **61/61 PASS** and Vite build PASS. Both actual browser logs: `PASS M09-A CHROME/EDGE REVIEW CONSENT: text/role/order changes revoke approval; rejected drop clears stale approved draft; V2 preserved after reload`.
- Strict fixture uses `makeMixedLayoutPdf()` and requires `moveCount>0` before clicking an enabled down-move button; tests forbid continuing with approval after reorder. The old first-run green case did not test reorder and must not be cited as strict coverage.
- Windows [#40363162195](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40363162195) completed/success, installed STEP3 and native PDF output, 8/8 different A4 designs, M08-C/D rejection, STEP2 version-upgrade+PNG preservation. **No direct Windows M09-A editor/review UI action** was simulated.
- Draft PR9 remains unmerged, `main` and feature PR3/PR4 unchanged. Buyer PC/real documents, licensed actual Korean offline LLM, 20/30 premium layouts, signing/entitlements **NOT VERIFIED; commercial NO-GO**.
- **M09-B candidate:** compare (A) generation-token stale-result guard vs (B) PDF.js cancellation, but first reproduce a race; file/drop input is already disabled while busy, so a normal-user concurrency bug is not currently verified.
