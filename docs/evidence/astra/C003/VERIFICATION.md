# C003 — STEP6 reference rights gate and STEP5 local handoff

**Implementation/CI status:** PASS for the synthetic local source and rights-gated STEP5 handoff flow  
**Real-world source-rights acceptance:** NOT VERIFIED  
**Feature/test SHA:** `a7f7ed58f11faf95be8a8782952dea52f049acda`  
**Branch:** `codex/astra-final-ai-sku-20261115`  
**Score change:** +0. A06 remains pending an actual selected source and rights evidence. This report does not update the central score ledger.

## Change

- `src/step6/SourceRecordsPanel.tsx`: added a per-source, session-only checkbox requiring the user to confirm they checked the source and usage conditions before the recorded source can launch STEP5 local-file selection. Removing a source also clears its session acknowledgement.
- The persisted source record remains `rights: UNVERIFIED`. The UI explicitly says Astra does not certify copyright or license status. The acknowledgement is not written into localStorage and never upgrades the stored rights value.
- `tests/step5-reference-browser.mjs`: verifies the STEP5 handoff is disabled by default, becomes enabled only after acknowledgement, the acknowledgement does not alter the stored source record, and IndexedDB V2 remains unchanged.
- At the current C003 SHA, `tests/step5-reference-browser.mjs` additionally exercises the complete source-record → rights acknowledgement → native local PDF file selection → linked STEP5 analysis → explicit apply → Undo path. It checks the selected file's SHA-256, source rights stay UNVERIFIED, the full V2 document/assets/meta fingerprint returns to baseline, and no request targets the recorded source URL.

Existing STEP6 behavior continues to require user-entered search keywords and explicit consent before showing fixed Google/Bing HTTPS links. The browser test does not fetch external search results or any image. Existing STEP5 synthetic tests verify local reference analysis is transient, user-controlled, and supports apply/Undo while preserving source content and V2 storage.

## Previous exact-SHA GitHub Actions evidence — P100 implementation

All checks below cover `20ae5fcab5b069bcd269ca0506721db5c180925e`.

| Verification | Result | Evidence |
|---|---|---|
| npm test, production build, Chrome print/persistence browser suite | PASS | [CI run 43685671737](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685671737) |
| Microsoft Edge A4 PDF/IndexedDB browser suite | PASS | [CI run 43685671737](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685671737) |
| Final blueprint evidence policy | PASS | [Policy run 43685671876](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685671876) |

Edge logs include `PASS C003 STEP6 RIGHTS GATE`: the source stays UNVERIFIED, STEP5 use requires a session acknowledgement, and IndexedDB V2 is unchanged. Chrome build/test and the suite including the rights gate also passed at the same SHA.


## Latest exact-SHA integrated-flow evidence — 2026-11-16

- Code/test SHA: a7f7ed58f11faf95be8a8782952dea52f049acda. [Linux/Chrome/Edge full regression run 43744625660](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43744625660) **PASS**: npm test 315/315, production build PASS, Chrome and Edge PDF/reference suites PASS.
- Both browser jobs logged PASS C003 LINKED SOURCE E2E: session-only rights gate, native local PDF picker, source-linked STEP5 preview, user-chosen theme apply and Undo, exact local PDF SHA-256 match, V2 document/assets/meta restored, and zero request to the recorded HTTPS source URL.
- [C009 accessibility/layout run 43744631300](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43744631300) and [blueprint policy run 43744626125](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43744626125) also **PASS** at the same code/test SHA.
- The fixture uses only a synthetic HTTPS metadata source and a synthetic local PDF. No external search result, third-party image, actual licensing decision, or customer PDF was used. The manual browser navigation/download from a rights-reviewed real source remains owner acceptance work.
- C003 score remains **+0**. A06 remains pending real-source rights evidence; buyer acceptance is UNASSESSED and commercial status RELEASE HOLD.

## Failure and limits

The first CI attempt, [run 43685503695](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685503695), failed in a new test assertion that used strict reference equality for a returned content snapshot. The assertion was corrected to compare structures by value; the next exact-SHA run passed on both Chrome and Edge.

No actual public image/source was downloaded or used, no external service was contacted by the CI test, and no copyright/license determination was made. The user still has to inspect the source and applicable rights. Therefore C003 does not receive A06 score credit yet; buyer acceptance and commercial release remain UNASSESSED/RELEASE HOLD.
