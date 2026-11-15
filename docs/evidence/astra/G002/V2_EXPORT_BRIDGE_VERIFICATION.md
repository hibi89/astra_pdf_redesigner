# G002 — STEP2 V2 project export + review receipt + actual PDF.js independent test

**Date:** 2026-11-15 KST. **Owner acceptance:** UNASSESSED. **Provisional score:** 64/100 (+0). **Release:** HOLD.

## Completed, tested scope
- New `tools/gpt-final-qa-v2-pdfjs-bridge.mjs` verifies an actual ASTRA `astra-local-document` V2 export (schemaVersion 2) against a separate STEP7 source-review receipt and original PDF bytes. It checks the receipt's source SHA and the exported `document.content` SHA against the same payload; it then extracts anchored V2 text/image references and compares source/output **real PDF byte streams** using the independent `gpt-final-qa-real-pdfjs-parity.mjs` PDF.js parser.
- The code fails closed on mismatched source/project hash, altered acknowledgment counts, invalid schema, duplicated block IDs, invalid asset metadata, missing image assets and forged self-consistent project edits without matching receipt.
- A positive hash match is **not a signed or witnessed owner review**. The receipt is locally self-reported and only binds exact content bytes. The report explicitly says `provenance=SIGNED_DOCUMENT_NOT_VERIFIED_RECEIPT_IS_SELF_REPORTED`, `storeReadAuthenticity=EXPORTED_V2_DOCUMENT_NOT_LIVE_INDEXEDDB`, `ownerApproval=NOT_GRANTED`, `buyerAcceptance=UNASSESSED`, `scoreDelta=0`.
- New `tests/gpt-final-qa-v2-pdfjs-bridge.test.mjs` adds **10** genuine PDF.js + V2 export/receipt integration regression scenarios, including numeric corruption, mismatched source, altered project after acknowledgment, page-anchored order reversal, phantom assets and raw-text privacy.
- Earlier G002 real PDF.js parsing tests **21**, pre-existing G001–G004 provenance/security tests **52**. Total planned fixed-gate count is **83 tests (31 + 52)**. A full exact-HEAD post-pivot Actions run is required for the final PASS claim.
- Inputs are synthetic PDF files made by `tests/fixtures/step3-mixed-layout-pdf.mjs`; no real customer PDFs, path, file names, or contents are uploaded.

## Experimental live browser investigation — STOP / PIVOT

The experimental `tests/gpt-final-qa-live-v2-pdfjs-browser.mjs` was **NOT VERIFIED and was deleted from the current tree** after STOP/PIVOT; the failed source and logs remain in GitHub commit history only. It attempted real Chrome PDF import → approval → IndexedDB V2 → product export → printed PDF byte stream.

Three changed attempts were executed:
1. [Workflow 43687234735](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43687234735) failed during Chrome ephemeral profile cleanup (`ENOTEMPTY`), which masked the initial test failure. The cleanup path was hardened to avoid replacing the actual error.
2. [Workflow 43687324164](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43687324164) revealed the browser evaluator rejected an immediate read of the confirmation button in the same synchronous task as clicking the consent checkbox (`G002_BROWSER_EVALUATION_FAILED`). The code was changed to await a React re-render.
3. [Workflow 43687445890](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43687445890) failed at `tests/gpt-final-qa-live-v2-pdfjs-browser.mjs:73` after the `10s` enabled-button wait (`G002_BROWSER_TIMEOUT:target not reached`). The test reached actual Chromium and source PDF extraction but did not prove the prerequisite UI review state; it did not write a V2 document or produce a passing source/output/browser proof.

**Reason not yet proved:** the STEP3 UI might require additional manual-review actions on certain PDF layout warnings or a different state transition; it is unsafe to force-enable the save button or bypass human review. After two material failures, the experimental live E2E was **removed from required QA workflow and its unverified test file was deleted from the active tree** (not declared successful); GitHub Actions logs and commits preserve diagnostic evidence. Do not rerun it unchanged, disable product safeguards, or inflate the 83 passing test count.

**Pivot:** use the pre-existing, independently successful `tests/step3-browser.mjs` explicit source-review/confirm/IDB flow as a reviewed test pattern, or a small isolated browser-assisted export test with legitimate UI prerequisites. First identify the precise disabled-state precondition in `ImportPanel.tsx` and produce a deterministic synthetic fixture. Only then reintroduce a separate browser gate in a fresh reviewed change.

## Open quality boundaries
- Full authenticated live IndexedDB V2 read/restore sequence is **NOT VERIFIED BY THIS NEW BRIDGE**; exported V2 backup bytes are verified, but actual live-store provenance is a separate boundary.
- PDF.js parsing does not certify OCR on scanned source pages, exact semantic content equivalence, image/table geometry or buyer visual acceptance. Differences are review flags, not automatic quality approval.
- Real authorized customer files 5–10, physical Windows 10/11, software signing/supplier legal review and product launch remain owner-gated.
- No product UI/Electron code, customer data, production issuer settings, `OCR_MANIFEST` or original document state was changed by G002.

**Next READY:** independent G003 Codex C003 review already recorded in `docs/evidence/astra/G003/C003_INDEPENDENT_REVIEW.md`; next G002 step is a better-qualified real V2 import/browser test without retrying the blocked shortcut. GPT only writes `gpt/*` branch until independent PR review.
