# G003 C003 — independent STEP6 source-rights review (2026-11-15 KST)

## Source identity and scope
- Codex functionality SHA **`20ae5fcab5b069bcd269ca0506721db5c180925e`** on `codex/astra-final-ai-sku-20261115` (later worker documentation and unrelated C005/C007 changes are not interchangeable with this feature-tested SHA).
- Changed functionality: `src/step6/SourceRecordsPanel.tsx` source-specific checkbox and `tests/step5-reference-browser.mjs` real Chrome/Edge rights-gate regression.
- User-directed public reference searching remains opt-in. A stored source URL or metadata is a local record, not a downloaded asset or a copyright license.
- `src/step2/Workspace.tsx:704,708–709`: approved STEP6 record triggers native local-file picker; a separate, direct local STEP5 file chooser remains accessible without STEP6 acknowledgement and should not be misrepresented as the STEP6 path.

## Evidence
- [Exact SHA Chrome/Node/Build + Edge #43685671737](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685671737) SUCCESS; Chrome job **291 PASS / 0 FAIL / 0 SKIP**; both Chrome and Edge logs contain:
  `PASS C003 STEP6 RIGHTS GATE: HTTPS source record stays UNVERIFIED; local STEP5 use requires explicit session acknowledgement; IndexedDB V2 unchanged`.
- [Exact SHA policy #43685671876](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685671876) SUCCESS. Previous `22312c.../run 43685503695` failure was snapshot reference-equality mismatch and corrected to value comparison at the tested SHA; not evidence of a new production failure.
- The persisted record stays `rights:UNVERIFIED`, checkbox only lives in React `Set<string>` and resets on reload/removal; no bytes or customer PDF leave the browser due to this gate. Actual source-rights permissions are *user assertions*, not machine-verifiable legal proof.

## Independent risk notes
1. **Review of rights assertion, not certification:** a user can assert rights without a valid license. Accordingly `A06 +1` is **not granted** solely because Chrome/Edge tests succeed. The actual public source, use scope, copyright owner, conditions and legal permission require the owner's separate evidence.
2. **Authorization scope:** this check gates the **STEP6 stored-record → STEP5 file-picker path**, not every direct STEP5 local-file analysis. The latter must remain user-directed/offline and must never be described as fully license-certified.
3. **Trusted file identity:** the source record URL and the separately selected local file are only *user-linked metadata*. The check does not independently prove the URL's content and selected file are identical or properly licensed. The UI explicitly warns about this limitation; no silent source authenticity claims.
4. **Preservation:** verified Chrome/Edge tests check source record unchanged, project V2 IndexedDB unchanged before analysis, and source rights remain UNVERIFIED. No approval persisted. Production signing/issuing keys unchanged.
5. **Unverified:** real external website traffic/no external download is not used by the C003 CI fixture; actual rights/owner acceptance, physical Windows installer, data governance for a production customer, and product launch remain unverified.

## Result and integration boundary
`C003_TECHNICAL_SYNTHETIC_FLOW_PASS` / `REAL_SOURCE_RIGHTS_NOT_VERIFIED`. Codex PR #13 remains worker-owned and unmerged. No Codex code modifications; no new score. **64/100 technical provisional**, official buyer acceptance `UNASSESSED`, `RELEASE HOLD`.

Next review requires a verified external source URL/rights document or an owner-approved alternative; do not request or publish customer PDFs in GitHub Actions. This is an audit result, not legal advice or a sales-ready feature certificate.
