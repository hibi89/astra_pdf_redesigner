# C010 Verification — Unsigned Windows package candidate audit

- Date: 2026-11-15
- Branch: `codex/astra-final-ai-sku-20261115`
- Latest C010 package/test SHA: `965fb977c9983b5cf2103ee267f57676a676cde8` (the original audit at `fa57116544217c6122b1cd9643fee91002f45edc` is retained below)
- Result: unsigned package-candidate build and SBOM audit PASS; score change +0

## Exact-SHA hosted evidence

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

This is an ephemeral unsigned build candidate, not a release. The C010 workflow did not install and launch this exact candidate or compare reproducible builds, and it did not perform a broad customer-data/secret scan or manual dependency-license/NOTICE review. Its targeted ASAR check did confirm the P124 acceptance module is excluded. Production signing/SmartScreen, physical buyer Windows acceptance, customer PDF validation and legal/sales approval remain unverified. Production signing/SmartScreen, physical buyer Windows acceptance, customer PDF validation and legal/sales approval remain unverified. The release gate stays **HOLD**.

C010 adds **+0**. Worker score ceiling remains **67/100 conditional**; C001/P124 +2 is held pending production Workspace/SKU-path evidence. If withheld while C007 +1 is accepted, worker candidate is 65/100. Central score remains 64/100 pending integration-owner review; buyer acceptance is **UNASSESSED** and commercial status **RELEASE HOLD**.
