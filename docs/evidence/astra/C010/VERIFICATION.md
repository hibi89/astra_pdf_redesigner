# C010 Verification — Unsigned Windows package candidate audit

- Date: 2026-11-15
- Branch: `codex/astra-final-ai-sku-20261115`
- Latest C010 code/test SHA: `304b4a59a4bb37007a0796133cb7bfcb1e18ab22`; earlier package/ASAR evidence at `965fb977c9983b5cf2103ee267f57676a676cde8` and `fa57116544217c6122b1cd9643fee91002f45edc` is retained below
- Result: unsigned package content/SBOM checks PASS; same-source NSIS installer reproducibility FAIL; C010 BLOCKED, score change +0

## Exact-SHA hosted evidence

## Earlier exact-SHA attempt — reproducibility gate FAIL (historical)

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



## Latest exact-SHA attempt — reproducibility gate FAIL — 2026-11-16 KST

- [Windows candidate/SBOM/content audit run 43726659739](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659739), exact feature/test SHA `304b4a59a4bb37007a0796133cb7bfcb1e18ab22`: **FAIL** only at same-source unsigned NSIS reproducibility. Regression (306 passed, 0 failed, 1 skipped of 307), build, desktop verification (88/88), SBOM, ASAR exclusion, and package scan passed.
- CycloneDX SBOM: 6 components, 0 missing license metadata. Built `app.asar`: 552 entries; P124 acceptance harness/fixture excluded. Content scan: 525 files / 84,108,747 bytes; 13 text files; 0 findings. License metadata is not legal license/NOTICE approval.
- Same-source unsigned build 1: 129,203,178 bytes, SHA-256 `FA925C44EA4DF49BBC5596C6A179883C55354E89DC9EF0391BA013614B043F34`. Build 2: 129,203,183 bytes, SHA-256 `2300E1AD9378BAD3341557ECAC8BDA8149358AADCCBA9FD031DCCA374F8426B8`. Both were NotSigned; both `app.asar` hashes matched at `2532275C8AA2DFEC3E7ECC5626A0AB5996CA64080B6B93D43A8091FA5098E86D`.
- The byte comparator found 128,622,904 differing bytes across 510,019 ranges while PE timestamps matched. Root cause remains unresolved; reproducibility gate correctly failed closed. The unsigned candidate was not uploaded or released.
- [Linux/Chrome/Edge regression run 43726659775](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659775) and [blueprint evidence-policy run 43726659959](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43726659959) passed at the same SHA.
- C010 remains **BLOCKED**, score +0. Worker evidence ceiling remains conditional 67/100; central ledger 64/100; buyer acceptance UNASSESSED; RELEASE HOLD. Physical buyer Windows install/signature/SmartScreen and legal review remain unverified.

## Limits and score

C010 remains **BLOCKED** and adds **+0**. The latest scan, SBOM metadata report, ASAR exclusion assertion, Windows build, and package regression all passed, but two builds from the same source on one Windows runner produced different installer bytes. The exact cause is unresolved. No release or artifact upload was made. C010 does not establish legal license/NOTICE approval, signed production installation, physical buyer Windows install/launch, customer-PDF acceptance, or SmartScreen behavior.

Worker score ceiling remains **67/100 conditional**; central score remains **64/100** pending integration-owner review. Buyer acceptance remains **UNASSESSED** and commercial status remains **RELEASE HOLD**.

## Latest exact-SHA Windows attempts — 2026-11-16

The C010 workflow's first repaired attempt at `d7bb6078aff3e2261b4bb75343601ffefc9e7f85` ([Windows run 43734552682](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43734552682)) compiled NSIS and produced two unsigned candidates after correcting the generated audit macro. With the temporary test-only `SetDateSave off` setting, the independent 82-entry source trees and 128,634,683-byte app archives matched, but generated uninstallers did not (171,423 vs 171,365 bytes); final installer SHA-256 values differed. The first macro-termination error at prior SHA `2d0dabbe4b9e0ccc811b109a89f283fe84257f5b` was diagnosed from the hosted log and fixed before this run.

The next attempt removed that non-production date setting and corrected the tree assertion to allow only NSIS's expected `resources/elevate.exe` addition. At exact SHA `9ae65db11c9dce649267069215eef0721cf0d3c3`:

- [Windows C010 run 43735068645](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43735068645): **FAIL** only at unsigned same-source installer reproducibility. `npm test`: 311 pass / 0 fail / 1 Windows-only skip of 312; `desktop:verify`: 88/88 pass; CycloneDX SBOM: 6 production components / 0 missing license metadata; `app.asar`: 552 entries with the P124 harness/fixture absent; package scan: 525 files / 84,108,747 bytes / 0 findings.
- Both independent source trees had 82 entries / 76 files and matched before NSIS; `app.asar` SHA-256 was `2532275C8AA2DFEC3E7ECC5626A0AB5996CA64080B6B93D43A8091FA5098E86D`. Both generated NSIS archives were 128,634,683 bytes and had SHA-256 `6f55f5ba6e3de80036ba985435d20dd35e44aed57f3b3d351feb1f8312c6430c`. The injected `elevate.exe` matched at SHA-256 `9B1FBF0C11C520AE714AF8AA9AF12CFD48503EEDECD7398D8992EE94D1B4DC37`; the post-package tree difference was exactly the expected helper and parent-directory metadata in both runs.
- The generated uninstaller was **not** reproducible: build 1 was 171,365 bytes / SHA-256 `f7ef9028d27af1ed5292874c60bde9483d6446edb35ebd597bc19c60114d5244`; build 2 was 171,423 bytes / SHA-256 `b18f75deed46b862deb88a104c4039c6f13bf9ed349289bbe4ada21ef425cf35`. The comparator reported 115,069 differing bytes across 1,530 ranges while PE timestamps matched. Both final candidates were `NotSigned`, sizes 129,203,070 and 129,203,183 bytes, SHA-256 `7BF86E0C29BBC281335BAE4484D47189F81625654438E7157238061A6A9BB02B` and `5EA5B0DF78A5BF77A681871B967F465F45D91C5DB18E2929493435E095CDF33F`. The temporary candidates were not uploaded or released.
- Exact-SHA Linux/Chrome/Edge regression [run 43735068659](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43735068659) and blueprint policy [run 43735068997](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43735068997) both **PASS**.

The cause of the generated uninstaller byte differences is still unknown. C010 remains **BLOCKED**, +0; no reproducibility claim or score is made. Central score remains 64/100, buyer acceptance UNASSESSED, RELEASE HOLD.

## Latest exact-SHA hosted rerun — reproducibility still FAILS

At code/test SHA `83acd1ddd02f55eb4c81d6154646d4a8f7db399b`, [Windows C010 run 43738686360](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43738686360) completed **FAIL** at the unsigned same-source NSIS reproducibility gate. Other same-SHA evidence passed: `npm test`, package content/SBOM checks, and blueprint policy [43738686649](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43738686649).

The two unsigned builds contained byte-identical `app.asar` files and identical NSIS 7z app archives (128,634,723 bytes, SHA-256 `0aabc1d3c15cb52840199f7899ac52cabcb7e10986a7091ec27d88270dd66a1f`). Generated `elevate.exe` matched; expected packaging-stage mutations were verified. The generated uninstallers differed: 171,423 versus 171,365 bytes, with 115,069 differing bytes across 1,530 ranges despite equal PE timestamps. Final unsigned installer hashes differed (`0AD5397DE9074E6F28494AA0E09F0B93D7A00E0F63227EA0F4486C693879C686` vs `36820579C13043DF0CC024C7716512E8871B2326739CCCDCF09B1E4C0B0AB903`). No artifact was uploaded or released. Root cause remains unknown; C010 is BLOCKED, +0.
