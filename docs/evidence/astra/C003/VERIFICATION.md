# C003 — STEP6 reference rights gate and STEP5 local handoff

**Implementation/CI status:** PASS for the local synthetic flow  
**Real-world source-rights acceptance:** NOT VERIFIED  
**Feature/test SHA:** `20ae5fcab5b069bcd269ca0506721db5c180925e`  
**Branch:** `codex/astra-final-ai-sku-20261115`  
**Score change:** +0. A06 remains pending an actual selected source and rights evidence. This report does not update the central score ledger.

## Change

- `src/step6/SourceRecordsPanel.tsx`: added a per-source, session-only checkbox requiring the user to confirm they checked the source and usage conditions before the recorded source can launch STEP5 local-file selection. Removing a source also clears its session acknowledgement.
- The persisted source record remains `rights: UNVERIFIED`. The UI explicitly says Astra does not certify copyright or license status. The acknowledgement is not written into localStorage and never upgrades the stored rights value.
- `tests/step5-reference-browser.mjs`: verifies the STEP5 handoff is disabled by default, becomes enabled only after acknowledgement, the acknowledgement does not alter the stored source record, and IndexedDB V2 remains unchanged.

Existing STEP6 behavior continues to require user-entered search keywords and explicit consent before showing fixed Google/Bing HTTPS links. The browser test does not fetch external search results or any image. Existing STEP5 synthetic tests verify local reference analysis is transient, user-controlled, and supports apply/Undo while preserving source content and V2 storage.

## Exact-SHA GitHub Actions evidence

All checks below cover `20ae5fcab5b069bcd269ca0506721db5c180925e`.

| Verification | Result | Evidence |
|---|---|---|
| npm test, production build, Chrome print/persistence browser suite | PASS | [CI run 43685671737](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685671737) |
| Microsoft Edge A4 PDF/IndexedDB browser suite | PASS | [CI run 43685671737](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685671737) |
| Final blueprint evidence policy | PASS | [Policy run 43685671876](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685671876) |

Edge logs include `PASS C003 STEP6 RIGHTS GATE`: the source stays UNVERIFIED, STEP5 use requires a session acknowledgement, and IndexedDB V2 is unchanged. Chrome build/test and the suite including the rights gate also passed at the same SHA.

## Failure and limits

The first CI attempt, [run 43685503695](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685503695), failed in a new test assertion that used strict reference equality for a returned content snapshot. The assertion was corrected to compare structures by value; the next exact-SHA run passed on both Chrome and Edge.

No actual public image/source was downloaded or used, no external service was contacted by the CI test, and no copyright/license determination was made. The user still has to inspect the source and applicable rights. Therefore C003 does not receive A06 score credit yet; buyer acceptance and commercial release remain UNASSESSED/RELEASE HOLD.
