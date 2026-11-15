# C001 / P124 — Windows Electron real Qwen3 3-SKU verification

**Status:** PASS for the synthetic Windows-hosted real-model product-path acceptance on the exact SHA below. Independent GPT review of this latest SHA and buyer acceptance remain pending.  
**Feature/test SHA:** `09b2d9c8f60631bb2f623f840bdde03450ed9e17`  
**Branch:** `codex/astra-final-ai-sku-20261115`  
**Integration PR:** [#13](https://github.com/hibi89/astra_pdf_redesigner/pull/13) → `integration/astra-final-blueprint-100-20261115`  
**Score:** A08 +2 candidate is supported by this technical evidence; the central score ledger remains 64/100 until integration-owner review. Official buyer acceptance is UNASSESSED; RELEASE HOLD remains.

## Product path and changes

The acceptance harness launches the trusted Electron application protocol and actual Root/Workspace UI. It fills an ephemeral signed receipt through the real CommercialLicensePanel, verifies BASIC/PRO/BUSINESS with runSkuGatedAction, selects the actual permitted/denied layouts, and exercises the production LocalModelReview component through the Electron preload and main-process IPC.

The code change in this rerun compares PDF text before and after review within each active SKU layout. It avoids requiring different BASIC, PRO, and BUSINESS visual layouts to have identical extracted text. The PowerShell validator now requires the per-SKU equality result.

Changed in SHA 09b2d9c8:
- desktop/p124-electron-qwen3-acceptance.cjs
- tests/p124-windows-qwen3-acceptance.ps1

All application inputs, V1/V2 fixtures, model receipts, and rendered PDFs are synthetic. The test receipt signer is generated ephemerally by the hosted workflow. Production issuer configuration and customer sale activation remain disabled. No customer files are opened and the Ollama cloud route is disabled.

## Exact-SHA GitHub Actions evidence

All runs below checked out `09b2d9c8f60631bb2f623f840bdde03450ed9e17`.

| Verification | Result | Evidence |
|---|---|---|
| Windows Electron real Qwen3, actual product SKU flow, healthy/missing/forged scenarios, production-only rebuild and unsigned package | PASS | [Run 43700294401](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294401) |
| Linux build/tests/Chrome print and Microsoft Edge A4 PDF/IndexedDB | PASS | [Run 43700294427](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294427) |
| C007 Windows NSIS install/upgrade and STEP2 preservation | PASS | [Run 43700294405](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294405) |
| C010 package/SBOM/ASAR exclusion audit | PASS | [Run 43700294393](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294393) |
| Final blueprint evidence policy | PASS | [Run 43700294719](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294719) |

The P124 run's report and screenshot artifact is [artifact 14156104065](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294401/artifacts/14156104065), archive SHA-256 `97d7e316127a0c18a7e9b199ba354fd554f09fe2f080a4dce6886c4fc0d722f8`. It contains healthy, missing-model and tampered-response reports and synthetic screenshots for all three tiers.

## Scenario results

- **Healthy model:** Qwen3-4B-Instruct-2507 Q8_0 on GitHub-hosted Windows through Ollama 0.40.16 CPU-only. The exact model hash was `eed67be2a8eed4320ff71f3d5b350db10653549281e09b8967b97aeb1f1554ee`; the runtime archive hash was `50fcf5ad54277f2fa5d173ebfc93bcb017adbc0c9ef2314daabc96ca9e6aa64e`. Cloud inference was disabled.
- **BASIC:** verified signed test receipt; BASIC layout allowed and PRO layout denied; 10 real inference calls/10 guarded visible proposals; approve then Undo 1, reject 9, cancel 1, automatic applies 0.
- **PRO:** verified signed test receipt; PRO layout allowed and BUSINESS layout denied; same 10/10 proposals and review decisions.
- **BUSINESS:** verified signed test receipt; BUSINESS layout allowed; same 10/10 proposals and review decisions.
- **Model missing:** all three SKU contexts kept inference disabled and retained the original paragraph.
- **Forged loopback response:** all three contexts rejected tampered output and kept the input unchanged.
- **PDF:** Each SKU's one-page A4 output passed structural checks. Extracted text was identical before and after review within that SKU layout. All outputs retained synthetic marker ASTRA_P124_PDF_SOURCE_7401, amount 230,000원, and the negation statement. Output PDF SHA-256: BASIC `13aa49d92b18a5469ea763b45749211f0ba3d314a5cdc6a4a59abd1e18acf790`; PRO `63e733735d2b0c9ce076b94f8794bdbb16371e440c81b0b6539cefb5879758c4`; BUSINESS `1848e9f888cee8d37628e575e94ab078e818cee09dc8320a662dc94e8301d341`.
- Synthetic V1/V2 sentinels remained unchanged. Product V1 and STEP2 V2 content/assets were preserved; updatedAt changed through normal edit/Undo writes. No automatic application or external document transfer occurred.
- The model was downloaded only during CI from a pinned GitHub release under its Apache-2.0 license; it was not added to the installer or redistributed.

## Package and release boundaries

The exact-SHA C010 audit passed the Windows suite (88/88), SBOM metadata coverage (6 production components, 0 missing), and ASAR enumeration (552 entries) confirming the P124 harness and fixture are absent from the unsigned application package. The P124 workflow rebuilt a production-only Vite bundle and unsigned NSIS candidate after the acceptance run.

No signing, publication, installation on a buyer PC, production issuer setup, sales activation, or release was performed. Production signing/SmartScreen, physical Windows buyer acceptance, legal/model redistribution review, 8-GiB resource behavior, and distinct-paragraph quality breadth remain unverified.

## Independent review and score qualification

G003's earlier F01 review was pinned to SHA `6e8b2eeb381874a12be041fa080fb545b5e1fb82` and correctly identified that the then-current harness bypassed Workspace and SKU gating. SHA `09b2d9c8f60631bb2f623f840bdde03450ed9e17` now exercises the actual product route with ephemeral test receipts. This resolves the previously identified harness gap in this branch, but GPT has not yet independently reviewed the updated SHA. The A08 +2 remains a technical candidate pending that review and the integration owner's scoring decision.

C001 does not establish 30 unique-input quality breadth; the same guarded synthetic paragraph is replayed for fresh decisions. C005's 8-GiB profile remains BLOCKED. Overall buyer acceptance stays UNASSESSED and RELEASE HOLD stays active.

## Next

C003 is the next independent Codex workstream after P124. Preserve the no-customer-data/no-external-inference boundaries and leave the central STATUS, HANDOFF, and score ledger to the integration owner.
