# Codex Final Worklog — Astra 64→100

Branch: `codex/astra-final-ai-sku-20261115`  
Integration target: `integration/astra-final-blueprint-100-20261115`  
Latest feature tip: `8136c6b070eceb97e4e26fbdebae7632ab6f2ed3` (C005 optimized run pending); latest fully tested feature SHA: `09b2d9c8f60631bb2f623f840bdde03450ed9e17`  
Open draft PR: [#13](https://github.com/hibi89/astra_pdf_redesigner/pull/13)

## Completed and assessed

| Task | Feature/test SHA | Tests | Score change |
|---|---|---|---|
| C001 / P124 Windows Electron real Qwen3 3-SKU product flow | `09b2d9c8f60631bb2f623f840bdde03450ed9e17` | Real Root→Workspace→CommercialLicensePanel→SKU gate→LocalModelReview; all three Windows scenarios PASS; per-SKU PDF parity PASS | +2 A08 candidate supported; independent GPT/owner review pending |
| C003 STEP6 rights acknowledgement and STEP5 local handoff | `20ae5fcab5b069bcd269ca0506721db5c180925e` | npm test/build, Chrome and Edge browser suites, blueprint policy PASS | +0; actual source-rights acceptance NOT VERIFIED |
| C005 additional local-AI quality and 8-GiB CPU acceptance | `8136c6b070eceb97e4e26fbdebae7632ab6f2ed3` (run pending) | Windows run 43711160507 covers 31 unique inputs once across all 3 SKU contexts; prior 93-call run 43702880160 remains active; terminal results pending | 8-GiB gate BLOCKED; +0 |
| C006 offline license lifecycle prototype | `4e4bfc01aa2543ea03b0674a8fcc8f6f33f50a25` | Linux/Chrome/Edge PASS; Windows Electron/NSIS PASS; blueprint policy PASS | Operational gates BLOCKED; +0 |
| C002 responsive viewport acceptance | `bd83ac2619a80f940dd628d513a760aee06f0ecb` | 298 unit tests/build, Chrome and Edge at 390/360/320px, blueprint policy PASS | Buyer visual acceptance pending; +0 |
| C008 synthetic PDF accuracy regression | `bd83ac2619a80f940dd628d513a760aee06f0ecb` | Linux/Chrome, Edge; 15-pair corpus, 12-layout PDF risk matrix, V1/V2 no-write, policy PASS | Synthetic-only; owner acceptance pending; +0 |
| C009 keyboard/accessibility-tree smoke | `fa57116544217c6122b1cd9643fee91002f45edc` | 298 tests/build, Chrome and Edge AX tree + keyboard Tab, policy PASS | Narrow hosted smoke only; +0 |
| C010 Windows package/SBOM/ASAR re-audit | `965fb977c9983b5cf2103ee267f57676a676cde8` | Windows 298 PASS / 1 SKIP, desktop 88/88, SBOM 6/0, ASAR 552 entries excludes P124 harness, policy PASS | +0; broad data/legal/release gates remain |

Detailed reports: [C001](C001/VERIFICATION.md), [C003](C003/VERIFICATION.md), [C005](C005/VERIFICATION.md). The earlier P124 BLOCKED note was superseded with hosted evidence: [P124/VERIFICATION.md](P124/VERIFICATION.md).

## C007 — PASS with stated limits

Feature/test SHA `653c3483daefa4bfbe9c082ba4b1d24bbb4a43d5`. The Windows hosted run passed the current NSIS lifecycle, the P123 0.1.0 baseline install, and in-place upgrade to an ephemeral 0.1.1 candidate with STEP2 document and PNG persistence: [Windows run 43686779251](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43686779251). The run also passed PDF generation/audit and uninstall.

- Linux/Chrome build/test and Microsoft Edge regression: [run 43686779245](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43686779245) — PASS.
- Blueprint evidence policy: [run 43686779318](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43686779318) — PASS.
- Detailed report: [C007/VERIFICATION.md](C007/VERIFICATION.md).

C007 supports +1 A10 candidate for hosted Windows upgrade and data persistence; the physical Windows, trusted-signature/SmartScreen, interruption/quota and buyer acceptance points remain unverified. C007 score candidate is +1. C001/P124 +2 plus C007 +1 gives 67/100 technical candidate from the 64 baseline; central score ledger remains for integration-owner review. Official buyer acceptance remains UNASSESSED and RELEASE HOLD remains.

## Score and release state

Candidate ceiling: **67/100 conditional** (64 baseline + C001/P124 +2 + C007 +1). The C001/P124 +2 is now supported by the exact-SHA Windows run exercising the actual product Workspace, signed synthetic SKU receipts, and production SKU gate. It remains a worker candidate until independent GPT review and integration-owner scoring; if withheld while C007 +1 is accepted, the worker evidence candidate is 65/100. The integration-owned central ledger remains **64/100** and unchanged. Official buyer acceptance remains UNASSESSED and RELEASE HOLD remains.

C001 uses only synthetic documents and one-time test-generated signed SKU receipts. At exact SHA `09b2d9c8f60631bb2f623f840bdde03450ed9e17`, P124 exercises the real Root → Workspace → CommercialLicensePanel → runSkuGatedAction → LocalModelReview route in Windows Electron for BASIC/PRO/BUSINESS. This supersedes G003-F01's earlier test-fixture bypass finding on SHA `6e8b2eeb381874a12be041fa080fb545b5e1fb82`; independent G003 review of the new SHA is still pending, so the +2 remains a candidate rather than a central-ledger change. Production issuer keys and sale activation remain disabled. G003-F02 is resolved by exact-SHA C010 run `43700294393`: the unsigned candidate's 552-entry ASAR listing excludes the P124 test harness and fixture. A broad secret/customer-data scan remains unverified. C001 does not verify production signing, SmartScreen, physical buyer PCs, legal readiness, unique-paragraph quality breadth, or 8-GiB resource acceptance. C003 rights remain UNVERIFIED until a real selected source is assessed. C007 verifies hosted-runner upgrade/preservation only; trusted signing, physical Win10/11 buyer acceptance, SmartScreen and interruption/quota recovery remain open.

## C006 — PARTIAL, technical prototype PASS / operational gates BLOCKED

At tested tree SHA `4e4bfc01aa2543ea03b0674a8fcc8f6f33f50a25`, the owner-side signed lifecycle ledger passed seven new Linux and Windows test cases; full Actions results and scope limits are recorded in [C006/VERIFICATION.md](C006/VERIFICATION.md). C006 remains +0 because no approved production issuer, trusted key pin, buyer activation or delivered offline revocation is available. The app's fail-closed release settings remain unchanged.

## Next work

P124/C001 is PASS at code/test SHA `09b2d9c8f60631bb2f623f840bdde03450ed9e17`. C002, C003, C007, C008, C009 and C010 already have hosted technical evidence; do not repeat them. Their buyer/source/legal/physical-device qualifications remain as stated in their reports.

Remaining prerequisites:
- **C003/A06:** the code path records a user-selected HTTPS source and requires session rights acknowledgement before STEP5 local-file analysis; persisted rights remain UNVERIFIED. Real source-rights acceptance needs a user-selected source and its actual rights evidence, which this synthetic-only task does not have.
- **C004/A07:** BLOCKED on GPT-owned P119 approved OCR supplier evidence; do not build P120/P121 against an unapproved OCR asset.
- **C005/A08:** BLOCKED for completion because the hosted Windows runner has about 16 GiB total memory and no 8-GiB-class runner is available. User-local execution is outside scope. Existing P123/P124 do not satisfy the joint distinct-input/8-GiB acceptance.
- **C006/A09:** the owner-side lifecycle prototype and hostile-input tests pass, but production issuer/pin, real-user activation, refund/support policy and delivered revocation remain owner-controlled operational gates. Do not create production keys or enable sales.
- **C007/A10:** hosted Windows upgrade/data preservation passes; physical buyer Windows, trusted signing/SmartScreen and interruption/quota acceptance remain owner-only.

No other C001–C010 item is currently READY for credited completion without one of those prerequisites. The worker candidate remains 67/100 conditional (C001 +2 and C007 +1), the central ledger remains 64/100, buyer acceptance is UNASSESSED and RELEASE HOLD remains.
## C002 — hosted responsive viewport PASS, buyer acceptance pending

Feature/test SHA `bd83ac2619a80f940dd628d513a760aee06f0ecb`: [C002/VERIFICATION.md](C002/VERIFICATION.md). The dedicated workflow passed npm test (298/298), build, Chrome, Edge, three mobile widths, and the blueprint policy gate. Browser cleanup was corrected after earlier test-harness-only CDP/cleanup failures. C002 remains +0 until buyer visual acceptance; overall candidate remains 67/100, official acceptance UNASSESSED, RELEASE HOLD.


## C008 — synthetic PDF accuracy regression PASS; owner acceptance pending

At exact code/test SHA `bd83ac2619a80f940dd628d513a760aee06f0ecb`, [full CI run 43689843103](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843103) passed on Linux Chrome and Edge. The run covered the 15-pair A4 parity corpus, invalid-output recovery with V1/V2 preservation, P118 synthetic images/multipage fail-closed checks, 12 PDF layout-risk fixtures, and M04 structural audits. See [C008/VERIFICATION.md](C008/VERIFICATION.md). Customer documents, real OCR/CER, full visual fidelity, and large-document performance remain unverified; score +0.


## C009 — hosted keyboard/accessibility-tree smoke PASS; narrow scope

At exact code/test SHA `fa57116544217c6122b1cd9643fee91002f45edc`, [Chrome/Edge workflow 43690873135](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873135) passed 298 tests, build, accessibility-tree checks, keyboard Tab navigation and visible focus. [Policy run 43690873420](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873420) passed. This is not a screen-reader/WCAG certification or low-resource performance measurement; score +0.


## C010 — unsigned package candidate and SBOM PASS; release gates open

At original SHA `fa57116544217c6122b1cd9643fee91002f45edc`, [Windows run 43690873098](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873098) passed regression/build/desktop verification and built an unsigned setup. The package/ASAR re-audit at exact SHA `965fb977c9983b5cf2103ee267f57676a676cde8`, [Windows run 43693084203](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43693084203), passed 298 tests (1 skip), desktop verification 88/88, SBOM (6 components/0 missing metadata), and enumerated 552 ASAR entries confirming the P124 test harness was absent. The installer stayed unsigned, ephemeral, and unpublished. [Policy run 43693084343](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43693084343) passed. See [C010/VERIFICATION.md](C010/VERIFICATION.md). The exact-SHA full CI run 43690873096 passed on attempt 2 after attempt 1's transient STEP3 Chrome `Printing failed`; the rerun changed no source code. Manual legal review, reproducibility, package data/secret scanning, physical buyer Windows acceptance and launch of this exact candidate remain unverified; +0.


## Independent review qualifications

- C001/P124's actual production Workspace/SKU-gated Qwen3 flow passed on `09b2d9c8f60631bb2f623f840bdde03450ed9e17`; test-only receipts were issued ephemerally and no production issuer was configured. The +2 candidate awaits independent GPT review and central owner scoring; no central score change is made here.
- C010's unsigned package/SBOM checks and targeted ASAR exclusion assertion passed at SHA `965fb977c9983b5cf2103ee267f57676a676cde8`; the P124 test harness is absent from 552 enumerated entries. Broad package secret/customer-data scanning remains open.
- Overall buyer acceptance stays UNASSESSED; RELEASE HOLD stays active. See [C001](C001/VERIFICATION.md), [C010](C010/VERIFICATION.md), and [independent G003](https://github.com/hibi89/astra_pdf_redesigner/blob/gpt/astra-final-qa-ocr-20261115/docs/evidence/astra/G003/VERIFICATION.md).


## C001 / P124 — exact-SHA product-path rerun

At code/test SHA **09b2d9c8f60631bb2f623f840bdde03450ed9e17**, the Windows Electron harness now traverses the actual product Root → Workspace → CommercialLicensePanel → runSkuGatedAction → LocalModelReview path using one-time GitHub Actions test receipts. This supersedes the earlier G003-F01 fixture-bypass limitation. Production issuer keys and sale activation remain false; all documents and inputs are synthetic.

- Windows real Qwen3, all three scenarios and production-only rebuild: [run 43700294401](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294401) — PASS.
- Linux/Chrome and Microsoft Edge regression: [run 43700294427](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294427) — PASS.
- C007 Windows NSIS install/upgrade and V2 preservation: [run 43700294405](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294405) — PASS.
- C010 unsigned package/SBOM/ASAR exclusion audit: [run 43700294393](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294393) — PASS; 88/88 Windows desktop tests, SBOM 6 components/0 missing license metadata, 552 ASAR entries with the P124 harness excluded, candidate unsigned and unpublished.
- Blueprint evidence gate: [run 43700294719](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294719) — PASS.
- Synthetic reports and three screenshots: [P124 artifact 14156104065](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294401/artifacts/14156104065), SHA-256 `97d7e316127a0c18a7e9b199ba354fd554f09fe2f080a4dce6886c4fc0d722f8`.

The healthy Windows run used Qwen3-4B-Instruct-2507 Q8_0 (model SHA-256 `eed67be2a8eed4320ff71f3d5b350db10653549281e09b8967b97aeb1f1554ee`) with Ollama 0.40.16 CPU-only and cloud disabled (runtime archive SHA-256 `50fcf5ad54277f2fa5d173ebfc93bcb017adbc0c9ef2314daabc96ca9e6aa64e`). BASIC, PRO, and BUSINESS each completed 10 real inference calls, showed 10 guarded proposals, explicitly approved one and Undid it, rejected nine, cancelled inference, and recorded zero automatic applies. Model-missing and forged-response scenarios passed for all three SKU contexts and preserved the input.

Each selected layout's A4 PDF extracted text matched before/after review. The three output PDF SHA-256 values are recorded in [C001/VERIFICATION.md](C001/VERIFICATION.md); the marker, 230,000원 amount, and negation were preserved. Synthetic V1/V2 sentinels stayed unchanged; product V1/V2 content/assets were preserved, with the V2 updatedAt timestamp changing through normal edit/Undo persistence. No customer data or external inference was used.

C001's A08 +2 is now supported as a technical candidate. It remains subject to the independent GPT review and integration-owner score decision; official buyer acceptance stays UNASSESSED and RELEASE HOLD stays. The integration-owned score ledger remains 64/100. With the conditional C001 +2 and C007 +1, the worker evidence ceiling is 67/100 pending acceptance.


## C005 / P124 — unique-input run pending

At feature SHA `5b323fd47d0c2cd2efb20a136102ee65b3bb7af2`, Windows Electron/Qwen3 run [43702880160](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43702880160) is still running its real-model step. It traverses 31 distinct synthetic cases in each BASIC/PRO/BUSINESS product SKU context (93 unique-input calls). At 11:42 UTC, about 90 minutes after the run began, GitHub still reported `in_progress`; the job-log endpoint returned 404 and no artifact or terminal PASS/FAIL is available, so no outcome is claimed. The runner reports 17,174,360,064 total-memory bytes, so this cannot satisfy the required 8-GiB-class profile and C005 remains +0/BLOCKED for completion. Existing policy gate, Linux/Chrome/Edge, C007, and C010 at the same code SHA passed: [policy 43702880440](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43702880440), [Linux/Chrome/Edge 43702880167](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43702880167), [C007 43702880123](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43702880123), [C010 43702880147](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43702880147). A final terminal result will be added when available.


## C005 — optimized unique-input run pending

The official plan requires 30+ distinct synthetic Korean inputs across the run; it does not require replaying every input for all three SKUs. The initial Windows run [43702880160](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43702880160) at SHA `5b323fd47d0c2cd2efb20a136102ee65b3bb7af2` was still active after about 100 minutes because it repeated all 31 inputs in each SKU. The harness was narrowed at SHA `8136c6b070eceb97e4e26fbdebae7632ab6f2ed3` to run each input once, distributed across the three real SKU contexts. [Windows run 43711160507](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711160507) is pending; no C005 quality result or score is claimed yet. The 8-GiB host condition remains unmet. At the latest Actions check, [Linux/Chrome/Edge 43711160490](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711160490) and [C007 43711160529](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711160529) were still `in_progress`; [C010 43711160535](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711160535) and [policy gate 43711160750](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711160750) had passed at SHA `8136c6b070eceb97e4e26fbdebae7632ab6f2ed3`. No terminal result is claimed for the first two.
