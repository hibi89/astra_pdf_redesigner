# ASTRA P82–P83: PDF vector stroke inspection, advisory only

**As of:** 2026-11-12 KST  
**Engineering progress:** 85% provisional; **95% target NOT MET**; BASIC/PRO/BUSINESS **RELEASE HOLD**; central **[작업중] stays**.

## Defect and alternatives

Existing owner-only PDF parity compared selected text, page-by-page position, signed numeric tokens, raster paint count and A4. A PDF with equal text but a removed vector-drawn table border was not flagged. A page relocation of vector elements can also preserve the document-wide stroke count.

- **A — Rasterize and compare images:** detects many visual changes but a redesign intentionally changes pixel placement; high CPU/memory, difficult thresholds and misleading fidelity claims.
- **B — Compare PDF.js vector stroke paint-operator counts (chosen):** no extra network, model, user data or storage; O(N) per parsed operator list; count-only report for total stroke differences and same-index page count differences. This only flags structural risk, **not loss or equivalence certification**. Filled shapes without strokes, geometric relocation on the same page and OCR/flattened vector scans are not certified.

## Changed scope

**P82 code SHA** `31304eae012c7f78de597ce3095764559764a364`:
- New `src/step7/pdfPaintSignals.ts`: count `OPS.stroke`, `OPS.closeStroke`, `OPS.fillStroke`, `OPS.eoFillStroke`, `OPS.closeFillStroke`, `OPS.closeEOFillStroke`; exclude text and raster draw operators.
- Browser `src/step7/OfflinePdfReview.tsx` and CLI `scripts/owner-pdf-source-output-review.mjs`: capture count-only original/output strokes, export JSON and display in local HTML or UI. Difference triggers vector review warning.
- Regression: `tests/step7-pdf-paint-signals.test.ts`, actual synthetic PDF fixture with vector table rectangle stroke replaced by no-paint `n`, browser file-input test.

**P83 code SHA** `36bc458da322ebb77b9b48190857112b637ea7bf`:
- Add same-index per-page vector stroke risk count. For unequal page counts return null / comparison not possible. Global stroke count equality can no longer hide page movement.
- Add two-page source/output swap test: vector totals equal but per-page risk should be 2; same scenario in Chrome/Edge browser E2E test.
- No original source edit, no PDF/textrun data logged, no commercial approval, schema migration, customer document, service or permissions changed. Draft PR #10 remains unmerged.

## Evidence

- Exact Git blob `src/step7/pdfPaintSignals.ts@0399a2c8ba957797f15ca41e9b5672b30a4cf8b2` and test `tests/step7-pdf-paint-signals.test.ts@adf5c769d7a789a8f53fca28978cf878ad646a8d` reconstructed in Linux and independently SHA verified.
- Node22.16 standalone test **3/3 PASS, 0 FAIL**, TypeScript `tsc --noEmit --skipLibCheck --target ES2022 --module ESNext` **PASS**.
- Local synthetic PyMuPDF sanity check: two different generated PDFs have **identical extracted text** yet 4 vs 3 vector drawing objects. This proves the test case exists, **not** that the exact GitHub PDF.js integration passed.
- GitHub commit comparison lists exactly 6 files each for P82 and P83; feature branch source head `36bc458d`. GitHub connector returns zero PR-triggered Actions runs and empty commit statuses for latest SHA; this is neither CI PASS nor CI FAIL.
- **NOT VERIFIED:** original full `npm test` suite, `npm run build`, browser integrated PDF.js `getOperatorList` in Chrome/Edge, Windows Electron+NSIS, actual buyer PC, 5–10 owner-approved real customer PDFs, graphic fidelity, PRO20/BUSINESS30 design requirement and licensed local Korean LLM. **No percentage increase claimed.**

## Next valid completion gates

1. Run exact code-SHA full `npm test`, `npm run build`, `npm run desktop:verify` and real Chrome/Edge/Windows installed-app CI. Inspect full result and blockers; never extrapolate historic P75 checks to this SHA.
2. Use owner-approved real test documents and physical Windows to verify that stroke change warnings are advisory and do not silently accept missing tables/geometry or suppress legitimate redesigned layouts.
3. Separately resolve owner approval and license conditions for 20 PRO and 30 BUSINESS distinct designs, local Korean model and legal sale obligations before commercial GO.
4. Keep hub ASTRA **[작업중]** until **verified 95%**; do not remove on pause, chat change or code-only completion.
