# C007 — Windows installer upgrade and data-preservation verification

Status: **PASS for hosted Windows install, launch, upgrade, PDF and STEP2 persistence scenarios.** Physical buyer acceptance, signing trust, SmartScreen and release remain unverified.

- Feature/test SHA: `653c3483daefa4bfbe9c082ba4b1d24bbb4a43d5`
- Branch: `codex/astra-final-ai-sku-20261115`
- Windows hosted run: [43686779251](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43686779251)
- Linux/Chrome + Edge regression run: [43686779245](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43686779245)
- Blueprint evidence-policy run: [43686779318](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43686779318)

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
