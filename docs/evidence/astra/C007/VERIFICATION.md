# C007 — Windows installer upgrade and data-preservation verification

Status: **PASS for hosted Windows install, launch, upgrade, PDF and STEP2 persistence scenarios.** Physical buyer acceptance, signing trust, SmartScreen and release remain unverified.

- Latest feature/test SHA: `304b4a59a4bb37007a0796133cb7bfcb1e18ab22` (recovery extension; prior install/upgrade evidence below remains at its recorded SHA)
- Branch: `codex/astra-final-ai-sku-20261115`
- Latest Windows hosted run: [43726659709](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659709)
- Latest Linux/Chrome + Edge regression run: [43726659775](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659775)
- Latest blueprint evidence-policy run: [43726659959](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659959)

## Windows results

The Windows hosted job ran `npm test`, the production build and `desktop:verify`, then built and exercised isolated NSIS installers.

- Current 0.1.0 candidate: build PASS; isolated install, launch, PDF checks and uninstall/data-preservation lifecycle PASS.
- P123 baseline `f5751bbb559f268706f2e7bc15438d0a8f590ed9` 0.1.0: installed; created a STEP2 document and PNG in IndexedDB; generated a parsed PDF.
- Feature branch candidate: test-only ephemeral version 0.1.1, with no committed package/schema mutation. In-place 0.1.0 → 0.1.1 upgrade PASS. Existing STEP2 document and PNG remained readable after restart; A4 Electron PDF export PASS; upgraded package uninstall PASS.
- PDF audit: 3 pages, 3 markers, 71 text items checked, 0 skipped for rotation, 1 raster draw; Korean/numeric markers 5/5 persisted.
- Baseline installer SHA-256: `6800304A0B605073AE78002F30274DA0CD3DD02C9C4F0E5EE7CE51D8DF7F59C8`.
- Upgrade candidate installer SHA-256: `7EC6106DCC466DB00A0F5CD6C92A72457932017ED0CF0AF6879D0B8747FB3FD2`.

## Limits and score

This verifies the hosted Windows runner and synthetic STEP2 data only. It does not establish physical Windows 10/11 buyer acceptance, a trusted publisher signature, SmartScreen behavior, power-loss/quota recovery, or release readiness. The build log's signtool messages are not treated as proof of a valid trusted signature. No production signing identity or release action was configured.

The upgrade/persistence evidence supports **+1 A10 candidate** (baseline 64 + C001/P124 +2 + C007 +1 = **67/100 technical candidate**). The second remaining A10 point is not claimed. C007 does not change the central score ledger; integration-owner review is required. Buyer acceptance remains **UNASSESSED** and commercial status remains **RELEASE HOLD**.

## Exact-SHA checks

- Windows NSIS lifecycle and upgrade — SHA `653c3483daefa4bfbe9c082ba4b1d24bbb4a43d5`: **PASS**, run 43686779251.
- Linux/Chrome build/test and Microsoft Edge regression — SHA `653c3483daefa4bfbe9c082ba4b1d24bbb4a43d5`: **PASS**, run 43686779245.
- Blueprint evidence policy — SHA `653c3483daefa4bfbe9c082ba4b1d24bbb4a43d5`: **PASS**, run 43686779318.


## Latest exact-SHA recovery verification — 2026-11-16 KST

- Feature/test SHA: `304b4a59a4bb37007a0796133cb7bfcb1e18ab22`.
- Windows NSIS install, STEP2 preservation, upgrade, and uninstall: [run 43726659709](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659709) — **PASS**. The installed STEP2 PDF audit reported A4 pages=3, Korean/numeric markers 5/5, and one raster draw. The actual installed renderer and IndexedDB document were used.
- Injected a synthetic `QuotaExceededError` into an IndexedDB document write, compared sanitized full `documents/assets/meta` storage snapshots and PNG bytes, retried successfully, and then verified renderer reload and a separate installed EXE launch. A second multi-store transaction was explicitly aborted before commit and matched the pre-abort storage digests. **This is synthetic quota/transaction recovery, not physical power-loss evidence.**
- The log-leak check passed; the uploaded report contains sanitized digests and booleans rather than document text. [Artifact 14166357202](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659709/artifacts/14166357202), ZIP SHA-256 `ef3361ec1bb77a2020125509bba6bd72530e95a97a7cacfc10ed0acb81a6c46a`.
- Linux Chrome/Edge regression: [run 43726659775](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659775) — **PASS**, 307 tests passed, 0 failed, 0 skipped, production build and browser smoke passed.
- Blueprint evidence policy: [run 43726659959](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659959) — **PASS** at the same SHA.
- This is an evidence extension, so incremental score is **+0**. Existing C007 evidence continues to support **+1 A10 candidate** pending integration-owner review. Conditional worker ceiling remains 67/100; central ledger 64/100; buyer acceptance UNASSESSED; RELEASE HOLD. Physical Windows buyer acceptance, trusted signing, SmartScreen, and actual interruption/power-loss remain unverified.

## Latest exact-SHA hosted rerun — 2026-11-16

At code/test SHA `83acd1ddd02f55eb4c81d6154646d4a8f7db399b`, Windows NSIS lifecycle run [43738686349](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43738686349) completed **PASS**. The workflow reports 314/315 unit tests passed with 0 failures and one platform-specific skip, 88/88 desktop tests passed, production-only unsigned package build, install/launch/PDF verification, STEP2 data preservation, upgrade from the P123 baseline, and uninstall. Sanitized recovery artifact [14171082942](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43738686349/artifacts/14171082942) is 656 bytes, ZIP SHA-256 `5b4170db85ef2822f73d6393efaadf6cae6740b992adaeaf0446bd6acd242c8d`.

Same-SHA regression [43738686327](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43738686327) and policy [43738686649](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43738686649) passed. Incremental score +0; existing A10 +1 remains a technical candidate only. Physical buyer acceptance, signing trust, SmartScreen, and real power-loss behavior remain unverified.
