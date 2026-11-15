# C010 Verification — Unsigned Windows package candidate audit

- Date: 2026-11-15
- Branch: `codex/astra-final-ai-sku-20261115`
- Exact tested code/workflow SHA: `fa57116544217c6122b1cd9643fee91002f45edc`
- Result: unsigned package-candidate build and SBOM audit PASS; score change +0

## Exact-SHA hosted evidence

- [Windows NSIS candidate/SBOM workflow, run 43690873098](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873098) — PASS at the exact SHA.
  - Windows `npm test`: 297 passed, 0 failed, 1 skipped of 298; build and `npm run desktop:verify` passed, with 87/87 desktop tests.
  - A local-runner CycloneDX SBOM was generated and JSON-validated: 6 production components, 0 with missing license metadata. The SBOM itself stayed in the ephemeral runner and was not published. Metadata presence is not a legal license/NOTICE approval.
  - Windows NSIS produced `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe`, 129,206,014 bytes, Authenticode status `NotSigned`, SHA-256 `AA04F9E8C7705087F035ADAF6E34AAA7E81F95B8A77812C1597ACCC8E1CC6144`.
  - Build used `--publish never`; the workflow did not sign, upload an artifact, or release the candidate.
- [C009 Chrome/Edge accessibility smoke, run 43690873135](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873135) — PASS at the same code/test SHA.
- [Blueprint evidence policy, run 43690873420](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873420) — PASS.
- The exact-SHA full cross-platform regression is [run 43690873096](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873096). Attempt 1 had Edge PASS but Chrome failed in `tests/step3-browser.mjs` with `Printing failed` after prior mixed-layout and eight-design checks passed. The failed Chrome job was rerun once at the same SHA; attempt 2 passed. Its complete Linux run passed 298/298 unit tests, build, Chrome and Edge browser suites, including the 15/15 PDF parity corpus, C002 390/360/320px viewports, and STEP3 mixed/layout review. No source change was made between attempts; record both attempts because the first print result was transient.

## Post-review package-content qualification

Independent review G003 raised a test-harness inclusion risk. At tested source SHA `fa57116544217c6122b1cd9643fee91002f45edc`, `electron-builder.yml` selects `desktop/**` and `desktop/main.cjs` statically imports `p124-electron-qwen3-acceptance.cjs`. The C010 workflow generated the installer and SBOM but did not enumerate or scan the built `app.asar`. Thus test-module exclusion from the customer package is **not verified**; actual ASAR contents remain unknown. This does not change C010's +0 score and is a follow-up packaging audit item. See the [independent G003 review](https://github.com/hibi89/astra_pdf_redesigner/blob/gpt/astra-final-qa-ocr-20261115/docs/evidence/astra/G003/VERIFICATION.md).

## Limits and score

This is an ephemeral unsigned build candidate, not a release. The workflow did not install and launch this exact candidate, compare two reproducible builds, perform a package-content customer-data/secret scan, or obtain manual dependency-license/NOTICE review. Production signing/SmartScreen, physical buyer Windows acceptance, customer PDF validation and legal/sales approval remain unverified. The release gate stays **HOLD**.

C010 adds **+0**. Technical candidate remains **67/100**, official buyer acceptance **UNASSESSED**, and commercial status **RELEASE HOLD**.
