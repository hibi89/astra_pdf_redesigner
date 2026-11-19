# C008 Verification — Synthetic PDF accuracy and fail-closed checks

- Date: 2026-11-16
- Branch: `codex/astra-final-ai-sku-20261115`
- Exact code/test SHA: `d9f6f1778eaea365b8180f43f1f545e98a8ca4a2`
- Result: exact-SHA 30-MiB Chrome and Edge STEP3 import/review/V2 restore/print PASS; score change +0

## Previous exact-SHA hosted evidence — 2026-11-15

- [Full Linux Chrome/Edge regression, run 43689843103](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843103) — both `build-and-test` and `Microsoft Edge A4 PDF and IndexedDB` jobs PASS at the exact SHA.
  - `npm test`: 298 passed, 0 failed; `npm run build`: PASS.
  - Actual Chrome and Edge browser flows passed the 15/15 synthetic A4 PDF source/output corpus. It checks money, dates, numeric signs, symbols, negation, links, duplicates, page risk, and source SHA parity.
  - Invalid PDF output took the manual-review/error path while preserving original bytes and STEP1 localStorage V1 plus all STEP2 IndexedDB V2 stores.
  - P118 exercised eight synthetic raster/layout cases and two-page fail-closed analysis without claiming OCR.
  - STEP3 browser fixtures passed 12/12 layout-risk cases. The two-page mixed fixture retained 17 markers, preserved the synthetic raster, displayed multi-column/table/vector risk, and required page review before saving.
  - The M04 audit uses PDF.js text geometry/A4 bounds, marker sequence, and raster checks; rotated text is counted as skipped/unknown rather than certified.
- [Blueprint evidence policy, run 43689843486](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843486) — PASS.
- The separate C002 mobile run at the same source SHA is [43689843233](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843233) — PASS.


## Latest exact-SHA 30-MiB stress — 2026-11-16

- Canonical code/test SHA: d9f6f1778eaea365b8180f43f1f545e98a8ca4a2; [Linux Chrome/Edge full regression run 43742609879](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43742609879) **PASS**. npm test 315/315, npm run build PASS, Chrome and Edge STEP3/PDF suites PASS.
- The actual 30-MiB synthetic PDF passed preflight as one page with selectable markers and a raster XObject. Chrome and Edge both imported it through the native file input, kept save disabled until explicit consent, saved a V2 document and PNG asset, verified the session-only original Blob SHA-256 against the exact source, printed an output PDF retaining both text markers and raster content, then reloaded the app and verified V2 text/image recovery.
- Chrome JSON metrics artifact: [ID 14172878382](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43742609879/artifacts/14172878382), 676 bytes, SHA-256 98bc6e6258486e6e4f9c7dcd7cf6fa8f53ca3070fd0f96e7851841346e63b094.
- Edge JSON metrics artifact: [ID 14173506608](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43742609879/artifacts/14173506608), 672 bytes, SHA-256 0c243a3ee95ea67622f92f129e43aade8328e5364c35fd1f2b1df1053a43ae42. The artifacts contain sanitized timings/heap metadata only; no source/output PDF is uploaded.
- [C009 accessibility/layout regression run 43742614941](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43742614941) **PASS** and [blueprint evidence gate 43742610186](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43742610186) **PASS** at the same code/test SHA.
- The first implementation SHA f8ae9bbe856104ea1b1a0367b5433f1ffe59638b failed because the fixture selected the startxref suffix instead of the xref table. The generator now parses and validates the declared xref offset. The final SHA above also adds direct V2 document/asset readback, page-reload recovery, bounded CDP timeouts, and exit-confirmed browser cleanup.
- C008 adds **+0**; synthetic stress evidence does not satisfy buyer/owner acceptance. Candidate ceiling remains 67/100, official buyer acceptance UNASSESSED, and RELEASE HOLD.

## Scope limits and score

All PDF inputs were synthetic. No customer or owner PDF was uploaded. The 30-MiB check stresses file-size ingestion with deterministic PDF comment padding around a tiny one-page text/raster payload. It does not test a 30-MiB image, many-page parsing, peak process memory, constrained 8-GiB performance, visual/semantic equivalence, lossless conversion, or customer acceptance. Real scanned-document OCR/CER, vector-table restoration, rotated-text fidelity, and owner-approved 5–10 PDF comparison remain unverified. OCR stays governed by the GPT-owned supply-chain prerequisite; this work does not enable OCR.

C008 adds **+0**. Technical candidate remains **67/100**, official buyer acceptance **UNASSESSED**, and commercial status **RELEASE HOLD**.

## Next

C009 accessibility/layout regression is now PASS. C010 remains BLOCKED on unsigned NSIS byte-for-byte reproducibility; continue only other READY work without retrying the same failure.
