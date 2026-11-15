# C001 / P124 — Windows Electron real Qwen3 3-SKU verification

**Status:** VERIFIED for the synthetic hosted-runner acceptance scope  
**Feature SHA:** `a2ca668c9578b68e760b922c026a5f2f8f941c8d`  
**Branch:** `codex/astra-final-ai-sku-20261115`  
**Integration PR:** [#13](https://github.com/hibi89/astra_pdf_redesigner/pull/13) → `integration/astra-final-blueprint-100-20261115`  
**Score:** A08 +2 candidate based on this evidence; cumulative technical score candidate 66/100. The central score ledger remains unchanged pending integration-owner review. Official buyer acceptance is UNASSESSED; RELEASE HOLD remains.

## Changes

The feature was implemented in commit `8a02e3c0d78bfe0e227677899c9ff1202cab1910`, workflow setup corrected in `6e8b2eeb381874a12be041fa080fb545b5e1fb82`, and the acceptance test stabilized in the exact tested feature SHA above.

Changed paths:

- `.github/workflows/p124-windows-qwen3-electron.yml`
- `.github/workflows/ci.yml`
- `desktop/main.cjs`
- `desktop/p124-electron-qwen3-acceptance.cjs`
- `tests/fixtures/p124-electron-qwen3.html`
- `tests/fixtures/p124-electron-qwen3.jsx`
- `tests/p124-fake-ollama.cjs`
- `tests/p124-windows-qwen3-acceptance.ps1`
- `vite.config.ts`

The test uses the production `LocalModelReview`, Electron preload and main-process IPC, synthetic STEP2 PDF input, and synthetic localStorage/IndexedDB sentinels. The known safe neutral paragraph that produced a valid real-model proposal is replayed only after its first proposal passes the production output guard. Each replay performs a new model inference and requires a fresh visible decision; this proves the repeated review flow, not ten unique-paragraph quality coverage.

## Exact-SHA GitHub Actions evidence

All listed runs checked out `a2ca668c9578b68e760b922c026a5f2f8f941c8d`.

| Verification | Result | Evidence |
|---|---|---|
| Existing regression suite, production build, desktop release-hold verification, native Electron smoke, real Qwen3 scenarios, production-only NSIS packaging and packaged EXE smoke | PASS | [Windows run 43684225170](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43684225170) |
| Linux/Chrome build and test plus Microsoft Edge A4 PDF/IndexedDB | PASS | [Linux/Edge run 43684225214](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43684225214) |
| Final blueprint evidence policy | PASS | [Policy run 43684225409](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43684225409) |

The Windows run exported the synthetic report/screenshots as artifact `p124-windows-electron-qwen3-a2ca668c9578b68e760b922c026a5f2f8f941c8d` (artifact ID `14149509892`, SHA-256 `4bdc85bb367c2165beaefdfeaa187c79607e98eb52267b073a0187044cb7e91b`). The artifact is retained by GitHub Actions for 14 days.

## Scenario results

- **Healthy CPU model:** Qwen3-4B-Instruct-2507 Q8_0 with Ollama 0.40.16. BASIC, PRO, and BUSINESS each completed 10 fresh real inference calls with 10 visible, validated proposals; each context explicitly approved one proposal and Undid it, rejected nine proposals, cancelled an inference, and recorded zero automatic applies.
- **Model missing:** all three contexts reported unavailable, kept inference disabled, and preserved the original source.
- **Forged loopback output:** all three contexts rejected the tampered response and preserved the original source.
- All three reports record `external_transfer=false`, synthetic V1/V2 sentinels unchanged, actual product localStorage V1 and STEP2 IndexedDB V2 unchanged, and zero automatic text applications.
- The healthy report records PDF text equality before and after review and preserves the synthetic document marker, amount, and negation. Extracted-text SHA-256: `a6b4e8c690989b20b7935d9d1f36a8c3814616a9f227fa52144141a0062eb079`.
- The test model was fetched during the hosted run from a pinned GitHub release; combined model SHA-256 `eed67be2a8eed4320ff71f3d5b350db10653549281e09b8967b97aeb1f1554ee`. Ollama Windows release SHA-256: `50fcf5ad54277f2fa5d173ebfc93bcb017adbc0c9ef2314daabc96ca9e6aa64e`. Neither model nor production credentials were added to the application bundle.
- Production-only Vite bundle rebuild, Windows NSIS packaging and packaged application smoke completed successfully. Installer SHA-256 printed by the runner: `2ff47d42cd1e730c05db16f6e52addc59be2613dc1e32df7f8bb00cb5feedfa1`. Production signing identity and SmartScreen status were not independently attested.

## Failure history and limits

- Run [43683050524](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43683050524) at `6e8b2eeb381874a12be041fa080fb545b5e1fb82` passed setup/regressions but failed the acceptance threshold because the initial fixture produced fewer than ten valid proposals. The acceptance loop was revised to replay a proposal source only after an actual guarded output passed, then re-tested on the current exact SHA.
- The first run at `8a02e3c0d78bfe0e227677899c9ff1202cab1910` failed before testing because npm caching expected a lockfile absent from this repository; the workflow now follows the repository's `npm install` convention.
- SKU names are test-only contexts for the shared production review UI; this does not verify production SKU entitlements, issuer keys, or sale activation.
- Inputs are synthetic. No customer documents or customer data were used. Physical buyer-machine behavior, production signing, legal/model redistribution review, and buyer acceptance remain unverified.

**Next READY work:** C003 (A06 user-selected online reference path), subject to the existing policy and browser/data isolation constraints.
