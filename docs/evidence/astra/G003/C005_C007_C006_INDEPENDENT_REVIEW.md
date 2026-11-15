# G003 independent review — C005 8-GiB AI, C007 Windows upgrade, C006 lifecycle (2026-11-15 KST)

## C005 — BLOCKED; no unverified score credit

Codex [C005 worker evidence](../../C005/VERIFICATION.md) correctly reports `BLOCKED`, score +0. P123 tested real Qwen3 CPU on an Ubuntu ~16-GiB hosted runner with 31 synthetic Korean candidates; P124 ran actual Qwen3/Windows Electron but its artifact has 10 inference calls per test-SKU against **one distinct input and one distinct proposal**. Neither demonstrates full 30+ unique text/8-GiB Windows buyer hardware quality and resource behavior. A hosted runner with approximately 16 GiB RAM cannot itself establish an 8-GiB device profile. Do not repeatedly call the unchanged P124 fixture to claim 30 unique input coverage.

## C007 — exact earlier SHA passed genuine Windows installer lifecycle

**Verified exact functionality SHA** `653c3483daefa4bfbe9c082ba4b1d24bbb4a43d5`.
- [Windows NSIS run #43686779251](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43686779251) SUCCESS. Independently inspected job log `132728801165`. It reports real installed EXE, STEP2 IndexedDB document/PNG, reload and Electron PDF audit; **2-page installed STEP3 source/PDF.js input**, **A4 pages=3 STEP2 output with 5/5 protected Korean/numeric markers and 1 raster draw**, eight separate A4 layouts, new candidate package installed. P123 baseline version `0.1.0` built and installed; ephemeral `0.1.1` feature candidate upgraded in-place; existing STEP2 document/PNG survived restart/upgrade. NSIS uninstall PASS.
- [Chrome/Edge #43686779245](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43686779245) SUCCESS; [policy #43686779318](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43686779318) SUCCESS.
- Candidate for **A10 +1 technical evidence**, subject to the 12-area completion owner and merge review. **Not a signed release**: no customer physical Windows 10/11, publisher signature trust/SmartScreen, forced interruption or storage quota error acceptance. Do not infer safe customer launch from a passing hosted runner.
- Later workflow [#43687995482](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43687995482) FAILED because new C006 lifecycle code broke TypeScript build; the installer lifecycle phase did not run at that SHA. This **does not negate** previously passed `653c...` installer evidence, but shows current Codex HEAD must independently pass the full build and new lifecycle test before merging.

## C006 — no score before all new code and buyer revocation boundary verified

Code `src/commercial/offlineLicenseLifecycle.ts` is an **owner-side signed-event replay ledger** and explicitly not wired into production customer activation. Existing offline receipts remain valid after a ledger-only `revoke` or `refund`, as its own test acknowledges. Production issuer remains null; owner keys and customer rights cannot be asserted.
- At `b4009de76322c4ead06545374999e9e83b4e497a`, [CI #43688131242](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43688131242) **298 total / 292 PASS / 6 FAIL** on malformed Base64URL signature regex `src/commercial/offlineLicenseLifecycle.ts:86`, plus `tsc` unused-import/unused-param errors in [Windows #43687995482](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43687995482). Independent [PR #13 comment](https://github.com/hibi89/astra_pdf_redesigner/pull/13) provided precise line and fixes. These historical failures must not be described as current HEAD until its SHA/run checked.
- Later Codex commits on the isolated branch attempted fixes; acceptance is **PENDING exact latest `npm test`, `npm run build`, Windows NSIS and separate security review**. No reviewer changes were pushed to Codex-owned production code.
- The buyer app does not ingest revocation events. Owner signing/replay without secure key custody and signed revocation distribution is a partial admin lifecycle, not customer refund/seat revocation enforcement. Preserve `RELEASE HOLD`, central 64/100, A09 +0 without integration-owner signoff.

**Boundaries:** Synthetic/hosted evidence is not real buyer acceptance. No change to central score, main, customer files, issuer credentials, production signing or Vercel. GPT QA-only reviewer branch; Codex PR #13 stays draft/unmerged.
