# M08-D — genuine AES-256 password PDF rejection (2026-10-27 KST)

**Current verdict: IMPLEMENTED; CI PENDING**. Never mark DONE until both final SHA workflows complete with the named browser and Windows installed pass markers.

## Decision and scope

Two possible tests were evaluated:
1. Download or install qpdf/Python generator in CI: genuine encrypted PDFs but introduces OS/package/network variability and external dependency.
2. **Selected:** generate one entirely synthetic password-protected PDF offline, pin byte SHA-256 and embed the 1,964-byte result as Base64 in a CommonJS fixture. Runtime tests use existing Node/Electron/PDF.js; **no new dependency, model, internet call or customer file**.

The original was generated locally with PyMuPDF AES-256, 2 A4 pages and invented marker content. Locally verified: header `%PDF-1.7`, `/Encrypt`, requires password, fails authentication with a wrong string, opens correctly with a synthetic test password. SHA-256 `7772417339b715932626d840f759a15126936226ddf8a829b7d080dedfeae8a2`. No real-user passwords/contents. The password is deliberately **not** supplied to PDF.js.

## Scope of added verification

- `desktop/step3-encrypted-fixture.cjs`: static encrypted PDF and SHA pin; no binary PDF stored in repository.
- `tests/step3-password-browser.mjs`: independent actual Chrome/Edge real PDF.js input. Valid pending review -> encrypted source -> actionable Korean password rejection -> old transient review/Blob gone -> same V2 list/selection -> valid retry does not inherit approval -> cancel -> reload confirms V2 persistence.
- `desktop/step3-password-acceptance.cjs`: installed Windows Electron genuine input, same reject/no-write/retry and reload check in isolated temporary user profile.
- `desktop/step3-project-acceptance.cjs`: wires Windows M08-D after verified M08-C, existing native STEP3, BASIC eight templates.
- `.github/workflows/ci.yml`: runs new standalone real-browser test **in both Chrome and Edge** after existing E2E, no CI dependency install added.
- `tests/desktop-shell.test.cjs`: validates frozen SHA-256 and both Windows/browser wiring.

The older 54 KB `tests/step3-browser.mjs` is deliberately unchanged. Attempting to update it was blocked by the tooling, so a separate test was selected. No runtime `src/**` behavior, original user data, V1/V2 schema or model code was changed.

## CI and release gate

**Exact latest test code SHA:** `0fb3f82151d550bfbd963c51b8fce49cc50bc365`.

- [Linux Chrome + Microsoft Edge workflow #40352669870](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40352669870) — **PENDING** at document creation.
- [Windows installed NSIS workflow #40352669611](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40352669611) — **PENDING** at document creation.

Pass markers to confirm in actual logs: `PASS M08-D CHROME/EDGE AES-256 PASSWORD`; `PASS M08-D WINDOWS INSTALLED AES-256 PASSWORD`. Check Node unit SHA fixture, build and all previous M08-A/B/C results; independently verify final workflow job conclusions and exact head code SHA.

**Not verified:** encrypted PDFs with owner-only restrictions, varying password algorithms, all real customer files, actual customer Windows PCs, local Korean GGUF model, OCR, full 20/30 themes, commercial entitlement, licensing/signing. Product remains **SALE NO-GO**. PR #9 stays Draft, main and PR3/PR4 untouched; Vercel/production not applicable.

## NEXT after verification

If successful, update this verdict and commercial STATUS/HANDOFF + lead STATUS/HANDOFF + PR #9 with precise two-run evidence. Further work should prioritize 5–10 consented customer PDFs and real Windows QA or blocker-free UI/reflow improvements; do not download model assets without owner approval.


## Real Windows feedback and bounded correction — 2026-10-27 KST
- Pre-final commit `60f99227af7d00756006692db9c923ff8fbd1c62` [Windows NSIS #40352546255](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40352546255) **FAIL**. Exact log: `PASS M08-C WINDOWS INSTALLED CORRUPT CATALOG`, then `ASTRA desktop startup failure: Error: M08-D existing project list or selection changed after reload` in `desktop/step3-password-acceptance.cjs:77`. This is a test verification gap, not proof of customer data loss: the test read the React document list immediately after `loadURL`, before awaited IDB hydration.
- Test-only correction at **`e80aa0643f27485d46a883645385816956cd70a2`** waits/polls up to 32s for the full expected saved document names and selected document after reload. A genuine mismatch still throws with the last actual state, and does not silently pass. No `src/**`, DB schema, source PDF or original records touched.
- New exact-head [Linux Chrome/Edge #40354394703](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40354394703) and [Windows NSIS #40354394704](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40354394704) **queued/pending** at this update. Prior #40352669870/#40352669611 are the now-superseded M08-D code SHA and cannot validate the fix. Do not claim M08-D DONE without exact-final SHA two-workflow pass.


## Final-candidate results: Windows and Edge PASS, Chrome PENDING (2026-10-27 KST)
- **Same final functional SHA `e80aa0643f27485d46a883645385816956cd70a2`**. [Windows NSIS #40354394703](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40354394703) **SUCCESS** with actual `PASS M08-D WINDOWS INSTALLED AES-256 PASSWORD`, persisted original V2 document after reload, valid retry unapproved, prior M08-A/B/C and 8 native printed layouts, NSIS in-place upgrade/uninstaller success. Previously failing post-loadURL hydration verification now passes.
- [Linux Chrome+Edge #40354394704](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40354394704): **Edge job SUCCESS** with actual `PASS M08-D CHROME/EDGE AES-256 PASSWORD` (real PDF.js warning, old Blob/review removed, restored V2 and valid retry), M08-B/C PASS. **Chrome job still IN PROGRESS** at `Install Korean fonts for visual comparison on CI only`; overall Linux run not yet SUCCESS. Keep M08-D overall **PARTIAL VERIFIED** until Chrome finishes; do not mistake Edge success for entire workflow success.
- Prior #40352546255 and #40352669611 failure logs had the old immediate UI hydration comparator; final exact-head installed Windows success resolves that test race. Real customer data/source diversity and physical user PC still not covered; commercial sale remains NO-GO.
