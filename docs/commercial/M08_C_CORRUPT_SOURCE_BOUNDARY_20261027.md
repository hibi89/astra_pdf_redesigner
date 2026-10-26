# M08-C — corrupt PDF parse failure must not mutate stored V2 data

**Implementation checkpoint:** 2026-10-27 KST. **Status: CI PENDING**, until exact-code Linux Chrome+Edge and installed-Windows logs both complete. Current implementation SHA `274845f04760377aacb98f320450535e41ff9849`. No claim of M08-C success from mere commit.

## Test design decision
| Option | Benefit | Cost/risk | Decision |
|---|---|---|---|
| Corrupt an otherwise valid synthetic PDF Catalog root pointer in the trailer | No extra dependency/download, deterministic two-page source, real image and selectable text still embedded; exercises PDF.js's structural parser rather than mere file extension/empty text checks | Does not model all encryption/password, arbitrary corruption or real-world malformed PDFs | **M08-C first** |
| Produce encrypted PDF with external qpdf or other binary | Exercises PasswordException and source-unlock UX | CI tool/environment/install/license inspection needed; unnecessary for this first no-write proof | Defer to a separate acceptance unit |

## Implementation, no external files
- `desktop/step3-invalid-fixture.cjs` takes the existing valid two-page mixed scan PDF and changes only `/Root 1 0 R` to nonexistent `/Root 9 0 R` with identical byte length. Xref offsets and non-sensitive synthetic image/text streams are left intact.
- Browser `tests/step3-browser.mjs`: pending valid review -> upload broken PDF -> require visible import error, no old review blocks or Blob URL, same active V2 document/list -> reupload valid original -> verify no carried approval/error -> cancel without write.
- Windows `desktop/step3-project-acceptance.cjs`: same behavior inside installed Electron app after normal STEP3 native PDF export, M08-A installed eight A4 style proofs and M08-B scan guard; reload and verify previous saved STEP3 project unchanged.
- `tests/desktop-shell.test.cjs` validates fixture contains xref/image/selectable markers and that both browser and installed acceptance are connected. No production runtime behavior altered.

## Pending exact-head evidence
- Linux Chrome/Edge workflow: [#40347906231](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40347906231) — **PENDING** at this checkpoint.
- Windows NSIS workflow: [#40347906006](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40347906006) — **PENDING** at this checkpoint.
- Explicitly distinguish build/unit from full browser/installed E2E conclusions; update only after job logs and HEAD SHA match.

## Acceptance limits
- No real customer PDF, scanned handwriting OCR, password-protected PDF, true offline Korean LLM or physical consumer Windows device tested.
- M08-C tests malformed document handling, not general PDF source completeness/pixel fidelity.
- `main`, PR3/PR4, production/credentials/user data stay unchanged. PR9 remains Draft; 3 SKU commercial sale **NO-GO**.

## 2026-10-27 KST — Windows CI false-negative diagnosis and minimal repair (verification pending)
- At `274845f04760377aacb98f320450535e41ff9849`, [Windows #40347906006](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40347906006) completed **FAILURE** in installed STEP3 smoke: `Imported STEP3 document/theme not restored after reload`. Earlier installed app startup, STEP2 persistence, STEP3 native printing, and all M08-A eight layout output logs showed PASS. The final M08-C Windows success marker was **not reached**; this failure is not proof of a damaged user V2 database.
- Root cause from test control flow: M08-A cycles and persists eight themes, ending on a different theme than the initial imported value. The newly introduced M08-C final reload compared to stale pre-M08-A `imported.themeClass` and timed out, independent of malformed PDF parsing itself.
- Minimal test-only change `a1cf97736e9278e11e14c4f42bd540206e82126e`: after eight-template and corrupt/recovery sequence, wait for Saved state and capture actual current `project-paper.className`, then reload and verify stored project/count against **that** observed final theme. Do not alter app runtime, data, source PDF, or old tests.
- [New Linux CI #40348815412](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40348815412) and [new Windows CI #40348815406](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40348815406) triggered for exact fix SHA; both conclusions **PENDING** at this entry. If failed, diagnose actual logs before any further write. Sale stays NO-GO.
