# Codex Final Worklog — Astra 64→100

Branch: `codex/astra-final-ai-sku-20261115`  
Integration target: `integration/astra-final-blueprint-100-20261115`  
Latest code/test SHA: `304b4a59a4bb37007a0796133cb7bfcb1e18ab22` (Windows C007 run 43726659709 PASS; Linux/Chrome/Edge regression 43726659775 PASS; C009 43726663515 PASS; C010 43726659739 fails reproducibility; blueprint policy 43726659959 PASS). Real-Qwen quality runs `8136c6b070eceb97e4e26fbdebae7632ab6f2ed3` and `5b323fd47d0c2cd2efb20a136102ee65b3bb7af2` remain pending
Open draft PR: [#13](https://github.com/hibi89/astra_pdf_redesigner/pull/13)

## Completed and assessed

| Task | Feature/test SHA | Tests | Score change |
|---|---|---|---|
| C001 / P124 Windows Electron real Qwen3 3-SKU product flow | `09b2d9c8f60631bb2f623f840bdde03450ed9e17` | Real Root→Workspace→CommercialLicensePanel→SKU gate→LocalModelReview; all three Windows scenarios PASS; per-SKU PDF parity PASS | +2 A08 candidate supported; independent GPT/owner review pending |
| C003 STEP6 rights acknowledgement and STEP5 local handoff | `20ae5fcab5b069bcd269ca0506721db5c180925e` | npm test/build, Chrome and Edge browser suites, blueprint policy PASS | +0; actual source-rights acceptance NOT VERIFIED |
| C005 additional local-AI quality and 8-GiB CPU acceptance | `4aa4f533ea652f2f391a9b2deca15f6d7f804130` | Run 43711870155: npm test/build + Chrome/Edge smoke PASS. Windows NSIS/SBOM 43711870072 and policy 43711870456 PASS. Real-Qwen runs 43711160507 and 43702880160 still in progress | 8-GiB gate BLOCKED; +0 |
| C006 offline license lifecycle prototype | `4e4bfc01aa2543ea03b0674a8fcc8f6f33f50a25` | Linux/Chrome/Edge PASS; Windows Electron/NSIS PASS; blueprint policy PASS | Operational gates BLOCKED; +0 |
| C002 responsive viewport acceptance | `bd83ac2619a80f940dd628d513a760aee06f0ecb` | 298 unit tests/build, Chrome and Edge at 390/360/320px, blueprint policy PASS | Buyer visual acceptance pending; +0 |
| C008 synthetic PDF accuracy regression | `bd83ac2619a80f940dd628d513a760aee06f0ecb` | Linux/Chrome, Edge; 15-pair corpus, 12-layout PDF risk matrix, V1/V2 no-write, policy PASS | Synthetic-only; owner acceptance pending; +0 |
| C009 accessibility, 30-layout print, large-document resource and recovery | `d0701f007c58bf53a452297a45cb81574a6ae039` | Push 43720322613 + PR 43720328240 PASS: npm test 307/0/0 skipped; Chrome/Edge keyboard print, 30 unique layouts, 28-page throttled print, V2/localStorage recovery; artifact 14163937633 | Hosted synthetic only; buyer screen-reader/visual acceptance pending; +0 |
| C010 Windows package/SBOM/content/reproducibility audit | `d0701f007c58bf53a452297a45cb81574a6ae039` | Run 43720322521: npm test 306 pass/0 fail/1 skip of 307, build, desktop 88/88, SBOM 6/0, ASAR 552, scan 525 files/84,095,509 bytes/0 findings PASS; repeat NSIS build hashes differ, gate FAIL; policy 43720322704 PASS | Reproducible installer BLOCKED; +0 |

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

P124/C001 is PASS at code/test SHA `09b2d9c8f60631bb2f623f840bdde03450ed9e17`. C002, C003, C007, C008 and C009 have hosted technical evidence; C010's SBOM, ASAR, and content scan pass, but two exact-SHA Windows builds (`2384a828` and `d0701f00`) failed the same-source NSIS installer reproducibility gate. Do not claim C010 complete or award score until a repeatable candidate is demonstrated.

Remaining prerequisites:
- **C003/A06:** the code path records a user-selected HTTPS source and requires session rights acknowledgement before STEP5 local-file analysis; persisted rights remain UNVERIFIED. Real source-rights acceptance needs a user-selected source and its actual rights evidence, which this synthetic-only task does not have.
- **C004/A07:** BLOCKED on GPT-owned P119 approved OCR supplier evidence; do not build P120/P121 against an unapproved OCR asset.
- **C005/A08:** BLOCKED for completion because the hosted Windows runner has about 16 GiB total memory and no 8-GiB-class runner is available. User-local execution is outside scope. Existing P123/P124 do not satisfy the joint distinct-input/8-GiB acceptance.
- **C006/A09:** the owner-side lifecycle prototype and hostile-input tests pass, but production issuer/pin, real-user activation, refund/support policy and delivered revocation remain owner-controlled operational gates. Do not create production keys or enable sales.
- **C007/A10:** hosted Windows upgrade/data preservation passes; physical buyer Windows, trusted signing/SmartScreen and interruption/quota acceptance remain owner-only.
- **C010/A10:** the unsigned package content scan, SBOM metadata, and ASAR exclusion checks passed, but repeated same-source Windows builds generated different installer hashes, including 128,635,692 differing bytes at the latest code/test SHA. The root cause is unresolved; C010 remains +0/BLOCKED and the release gate stays HOLD.

C009 hosted browser automation is complete for 30 layouts, synthetic large-document printing under 4× CPU throttling, JS heap/DOM observations, and close/reopen V2 recovery. Remaining C009 screen-reader/WCAG and buyer visual acceptance require an owner-controlled device. C003/C004/C005/C006/C007/C008/C010 still have source, OCR, 8-GiB, operational, physical-device, or legal/owner gates listed above. No score changes: worker candidate remains 67/100 conditional, central ledger 64/100, buyer acceptance UNASSESSED, RELEASE HOLD.
## C002 — hosted responsive viewport PASS, buyer acceptance pending

Feature/test SHA `bd83ac2619a80f940dd628d513a760aee06f0ecb`: [C002/VERIFICATION.md](C002/VERIFICATION.md). The dedicated workflow passed npm test (298/298), build, Chrome, Edge, three mobile widths, and the blueprint policy gate. Browser cleanup was corrected after earlier test-harness-only CDP/cleanup failures. C002 remains +0 until buyer visual acceptance; overall candidate remains 67/100, official acceptance UNASSESSED, RELEASE HOLD.


## C008 — synthetic PDF accuracy regression PASS; owner acceptance pending

At exact code/test SHA `bd83ac2619a80f940dd628d513a760aee06f0ecb`, [full CI run 43689843103](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843103) passed on Linux Chrome and Edge. The run covered the 15-pair A4 parity corpus, invalid-output recovery with V1/V2 preservation, P118 synthetic images/multipage fail-closed checks, 12 PDF layout-risk fixtures, and M04 structural audits. See [C008/VERIFICATION.md](C008/VERIFICATION.md). Customer documents, real OCR/CER, full visual fidelity, and large-document performance remain unverified; score +0.


## C009 — hosted accessibility, 30-layout print, resource, and recovery PASS

At exact test SHA `d0701f007c58bf53a452297a45cb81574a6ae039`, both [push run 43720322613](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720322613) and [PR run 43720328240](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720328240) passed. The keyboard check now brings the page to front and pauses briefly between Tab transitions; both runs reached the print action and showed visible focus.

- `npm test` 307 passed / 0 failed / 0 skipped; build PASS.
- Chrome and Edge each printed 8 base themes + 22 advanced layouts with 30 unique first-page rasters, and a 28-page synthetic document under 4× CPU throttling. Closing/reopening restored IndexedDB V2 and legacy localStorage, then printed again.
- Chrome print/recovery: 777/839 ms; heap 7,426,764/5,938,768 bytes; DOM 1,371/1,368. Edge print/recovery: 824/834 ms; heap 7,217,892/5,881,016 bytes; DOM 1,361/1,358.
- [Artifact 14163937633](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720322613/artifacts/14163937633): 4,026,775 bytes, ZIP SHA-256 `76cf1e90f776c0e1e6c73d7a868e3d52260e75cb63d87466d247c7db0e44039c`.

Hosted synthetic browser evidence only; no screen-reader/WCAG or buyer visual acceptance. C009 +0.

## C010 — package-content audit PASS; reproducible NSIS candidate BLOCKED

At exact code/test SHA `d0701f007c58bf53a452297a45cb81574a6ae039`, [Windows run 43720322521](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720322521) passed `npm test` (306 passed, 0 failed, 1 skipped of 307), build, desktop verification (88/88), SBOM generation (6 components/0 missing license metadata), 552-entry ASAR harness exclusion, and package-content scan (525 files/84,095,509 bytes/0 findings). The overall run failed at the installer reproducibility gate.

- Build 1: 129,200,848 bytes, SHA-256 `E556F5C39AE4B85B8E1BCB7A6154162C0C899BEE4EA81B7F4D1F277854D38DAC`.
- Same-source build 2: 129,200,961 bytes, SHA-256 `C437370AC577818350E2B6BE73ABB18833B542205A763F92BCA5FD39AF5833C3`.
- Both unsigned builds used `--publish never`; `app.asar` was byte-identical (`9BFCC661F51B7A4A779780F45F2250162F1D83FA2921C169B3408EE63524A353`). PE timestamps matched. The comparator found 128,635,692 differing bytes across 506,889 ranges; package cause remains unresolved.
- This is a repeated failure: [run 43718313656](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43718313656) at SHA `2384a828` also failed, with 128,634,409 differing bytes across 507,828 ranges. Exact candidate hashes and both runs are in [C010/VERIFICATION.md](C010/VERIFICATION.md).
- [Linux/Chrome/Edge run 43720322561](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720322561) and [blueprint policy 43720322704](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720322704) — PASS at the same SHA.
- The content scan's earlier PII false positives and intermediate comparator-test offset error were corrected; see C010/VERIFICATION.md for attempt history.

C010 remains **BLOCKED**, +0. No installer was signed, uploaded, or released. Legal/NOTICE, physical buyer Windows, SmartScreen, customer-PDF and final sales acceptance remain open.

## Independent review qualifications

- C001/P124's actual production Workspace/SKU-gated Qwen3 flow passed on `09b2d9c8f60631bb2f623f840bdde03450ed9e17`; test-only receipts were issued ephemerally and no production issuer was configured. The +2 candidate awaits independent GPT review and central owner scoring; no central score change is made here.
- C010's unsigned package/SBOM/ASAR and broad package-content checks passed at SHA `d0701f007c58bf53a452297a45cb81574a6ae039`, with 552 ASAR entries, 525 scanned files and 0 findings. Same-source NSIS reproducibility failed at this and the previous SHA; C010 remains +0/BLOCKED.
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


## C005 — latest exact-SHA evidence (2026-11-15)

At code/test SHA `4aa4f533ea652f2f391a9b2deca15f6d7f804130`, the controller timeout/cancel regression tests use a synthetic stalled child process; they are not a real-Qwen timeout measurement.

- [GitHub regression run 43711870155](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711870155): `npm test`, production build, Chrome print/persistence smoke and Microsoft Edge A4 PDF/IndexedDB smoke all PASS.
- [Windows NSIS/SBOM/release-hold run 43711870072](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711870072): PASS.
- [Blueprint policy run 43711870456](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711870456): PASS at the same code/test SHA.
- [Optimized 31-distinct-input Windows Electron/Qwen3 run 43711160507](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711160507), feature SHA `8136c6b070eceb97e4e26fbdebae7632ab6f2ed3`: still in progress.
- [Earlier 93-call Windows Electron/Qwen3 run 43702880160](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43702880160), feature SHA `5b323fd47d0c2cd2efb20a136102ee65b3bb7af2`: still in progress.
- The Actions host reports `17,174,360,064` bytes of RAM (about 16 GiB). This does not satisfy the 8-GiB-class CPU acceptance.

C005 stays +0/BLOCKED for completion. The real-Qwen corpus has no terminal result, and the low-memory acceptance is not met. Central score remains 64/100; the worker candidate ceiling remains conditional 67/100; buyer acceptance UNASSESSED; RELEASE HOLD.


## Latest exact-SHA evidence update — 2026-11-16 KST

| Task | Exact feature/test SHA | Latest hosted evidence | Score delta / state |
|---|---|---|---|
| C007 installed STEP2 recovery extension | `304b4a59a4bb37007a0796133cb7bfcb1e18ab22` | Windows NSIS run [43726659709](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659709) PASS; Linux/Chrome/Edge [43726659775](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659775) PASS; policy [43726659959](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659959) PASS. Synthetic quota exception and transaction-abort preservation, retry, renderer reload, separate EXE launch. Sanitized artifact [14166357202](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659709/artifacts/14166357202), digest `ef3361ec1bb77a2020125509bba6bd72530e95a97a7cacfc10ed0acb81a6c46a`. | Incremental +0; existing +1 A10 remains a candidate only. Actual power loss/physical buyer acceptance unverified. |
| C009 latest Chrome/Edge | `304b4a59a4bb37007a0796133cb7bfcb1e18ab22` | [Run 43726663515](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726663515) PASS; 307/0/0 unit tests, 30 distinct layout rasters in each browser, accessibility tree/keyboard checks, 28-page print and close/reopen recovery. Artifact [14166652727](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726663515/artifacts/14166652727), digest `21086aedda7e53d2308cb269480435562869d4c8fa3b86f6f25575dc003d8353`. | +0; buyer visual and assistive-technology acceptance remains open. |
| C010 latest unsigned package audit | `304b4a59a4bb37007a0796133cb7bfcb1e18ab22` | [Windows run 43726659739](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659739): content/SBOM/ASAR and regressions PASS; same-source installer reproducibility FAIL. Exact package hashes and limits are in [C010/VERIFICATION.md](C010/VERIFICATION.md). | +0 / BLOCKED. |
| C005 real-Qwen unique-input and 8-GiB gate | `8136c6b070eceb97e4e26fbdebae7632ab6f2ed3` and `5b323fd47d0c2cd2efb20a136102ee65b3bb7af2` | GitHub Actions API still reported runs [43711160507](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711160507) and [43702880160](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43702880160) in progress at 2026-11-16 00:03 KST; no artifacts. Available host is about 16 GiB. | +0 / BLOCKED; no 8-GiB or distinct-input outcome claimed. |

Latest evidence files: [C007](C007/VERIFICATION.md), [C009](C009/VERIFICATION.md), [C010](C010/VERIFICATION.md), [C005](C005/VERIFICATION.md). These are worker-branch records only; central `STATUS.md`, `HANDOFF.md`, and score ledger remain under integration-owner control. Central score remains 64/100; worker ceiling remains conditional 67/100. Official buyer acceptance is UNASSESSED and RELEASE HOLD remains.
