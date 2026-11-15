# C010 Verification — Unsigned Windows package candidate audit

- Date: 2026-11-15
- Branch: `codex/astra-final-ai-sku-20261115`
- Latest C010 code/test SHA: `d0701f007c58bf53a452297a45cb81574a6ae039`; earlier package/ASAR evidence at `965fb977c9983b5cf2103ee267f57676a676cde8` and `fa57116544217c6122b1cd9643fee91002f45edc` is retained below
- Result: unsigned package content/SBOM checks PASS; same-source NSIS installer reproducibility FAIL; C010 BLOCKED, score change +0

## Exact-SHA hosted evidence

## Latest exact-SHA attempt — reproducibility gate FAIL

- [Windows C010 run 43720322521](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720322521) ran at exact code/test SHA `d0701f007c58bf53a452297a45cb81574a6ae039`. The overall run is **FAIL** only at the same-source NSIS installer reproducibility assertion; regression, build, scan, SBOM, ASAR exclusion, and desktop verification passed.
- `npm test`: 306 passed, 0 failed, 1 skipped of 307; production build PASS; `npm run desktop:verify`: 88 passed, 0 failed, 0 skipped.
- CycloneDX SBOM: 6 production components, 0 with missing license metadata. `app.asar`: 552 entries, P124 acceptance harness/fixture absent. Content audit: 525 files / 84,095,509 bytes scanned; 13 static text files; 8 secret-signature rules, 3 PII text rules, 3 path rules; 0 findings.
- Unsigned build 1: 129,200,848 bytes, SHA-256 `E556F5C39AE4B85B8E1BCB7A6154162C0C899BEE4EA81B7F4D1F277854D38DAC`. Same-source build 2: 129,200,961 bytes, SHA-256 `C437370AC577818350E2B6BE73ABB18833B542205A763F92BCA5FD39AF5833C3`. Both were `NotSigned` and used `--publish never`.
- Both runs had the same `app.asar` SHA-256 `9BFCC661F51B7A4A779780F45F2250162F1D83FA2921C169B3408EE63524A353`, and PE timestamp fields matched. The comparator found 128,635,692 differing bytes across 506,889 ranges. The installer output is not bit-for-bit reproducible; the cause is unresolved.
- [Blueprint evidence policy 43720322704](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720322704) and [Linux/Chrome/Edge regression 43720322561](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43720322561) — PASS at the same SHA.

### Corrected attempts

- The earlier content scan at SHA `73c775391b3c9d814acc96284967b20b0c623d1e`, [run 43716421105](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43716421105), flagged PII-shaped byte sequences in minified/binary dependency data. The scanner was narrowed to static text/data extensions for PII checks while retaining secret-signature scanning across package bytes and path checks. Current scan reports zero findings.
- A first diagnostic-test commit at SHA `af3de99c0f8f1b2d0655f9ca1b1cf92fb52c1422`, [run 43718283581](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43718283581), failed a PE timestamp byte-offset assertion in the new test helper. The fixture offset was corrected; the subsequent unit suite passed.
- Probe run [43717541113](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43717541113) at SHA `8cbb5fb4f55c1699712b2a81b08dcbdf682c7cd9` printed `C010 reproducibility FAIL` but did not fail the job. The current workflow throws on any mismatch. The explicit failure gate then failed reproducibility at SHA `2384a8287a7d5a196596acb4cf351ff61d7a7f34` in [run 43718313656](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43718313656) and again at the latest SHA in run 43720322521.


- [Windows NSIS candidate/SBOM workflow, run 43690873098](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873098) — PASS at the exact SHA.
  - Windows `npm test`: 297 passed, 0 failed, 1 skipped of 298; build and `npm run desktop:verify` passed, with 87/87 desktop tests.
  - A local-runner CycloneDX SBOM was generated and JSON-validated: 6 production components, 0 with missing license metadata. The SBOM itself stayed in the ephemeral runner and was not published. Metadata presence is not a legal license/NOTICE approval.
  - Windows NSIS produced `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe`, 129,206,014 bytes, Authenticode status `NotSigned`, SHA-256 `AA04F9E8C7705087F035ADAF6E34AAA7E81F95B8A77812C1597ACCC8E1CC6144`.
  - Build used `--publish never`; the workflow did not sign, upload an artifact, or release the candidate.
- [Post-review package and ASAR re-audit, run 43693084203](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43693084203) — PASS at SHA `965fb977c9983b5cf2103ee267f57676a676cde8`.
  - Windows `npm test`: 298 passed, 0 failed, 1 skipped; `desktop:verify`: 88/88 passed. CycloneDX SBOM: 6 production components, 0 missing license metadata.
  - The unsigned NSIS installer was built with `--publish never`; SHA-256 `A74A0D3AC8AF45749FE30621E8594C12AD41DF5273E10945EF4F18DC75EAA68C`, 129,200,839 bytes. It was not signed, uploaded, or released.
  - The runner enumerated 552 `app.asar` entries and passed the assertion that the P124 test harness and its fixture are absent.
- [Blueprint evidence policy run 43693084343](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43693084343) — PASS at the same SHA.
- [C009 Chrome/Edge accessibility smoke, run 43690873135](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873135) — PASS at the same code/test SHA.
- [Blueprint evidence policy, run 43690873420](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873420) — PASS.
- The exact-SHA full cross-platform regression is [run 43690873096](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873096). Attempt 1 had Edge PASS but Chrome failed in `tests/step3-browser.mjs` with `Printing failed` after prior mixed-layout and eight-design checks passed. The failed Chrome job was rerun once at the same SHA; attempt 2 passed. Its complete Linux run passed 298/298 unit tests, build, Chrome and Edge browser suites, including the 15/15 PDF parity corpus, C002 390/360/320px viewports, and STEP3 mixed/layout review. No source change was made between attempts; record both attempts because the first print result was transient.

## Post-review package-content qualification

G003-F02 is resolved for the unsigned Windows package at exact SHA `965fb977c9983b5cf2103ee267f57676a676cde8`. The Electron main process now loads the P124 acceptance module only for the hosted acceptance invocation, the builder explicitly excludes that module, and Windows run 43693084203 enumerated the built `app.asar` (552 entries) and confirmed the P124 module/fixture paths are absent. OCR remains disabled and the release HOLD remains active. This targeted ASAR assertion is not a broad secret/customer-data scan or legal release approval. See the [independent G003 review](https://github.com/hibi89/astra_pdf_redesigner/blob/gpt/astra-final-qa-ocr-20261115/docs/evidence/astra/G003/VERIFICATION.md).

## Limits and score

C010 remains **BLOCKED** and adds **+0**. The latest scan, SBOM metadata report, ASAR exclusion assertion, Windows build, and package regression all passed, but two builds from the same source on one Windows runner produced different installer bytes. The exact cause is unresolved. No release or artifact upload was made. C010 does not establish legal license/NOTICE approval, signed production installation, physical buyer Windows install/launch, customer-PDF acceptance, or SmartScreen behavior.

Worker score ceiling remains **67/100 conditional**; central score remains **64/100** pending integration-owner review. Buyer acceptance remains **UNASSESSED** and commercial status remains **RELEASE HOLD**.