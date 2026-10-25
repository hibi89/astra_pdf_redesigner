# M08-B — PDF 원본 유형 수용 기준 및 위험·거부 매트릭스

*2026-10-26 KST. Truth source: `src/step3/pdf.ts`, `structure.ts`, `ImportPanel.tsx` and the linked browser + Windows synthetic tests. A test fixture is not a proof of customer-file fidelity.*

## Status semantics

- **SUPPORTED (review required)** = parsing and new-document opt-in are implemented within limits; not equal to perfect geometry or customer-grade restoration.
- **WARN / manual comparison** = user can inspect extracted blocks, image recovery counts, warnings and original comparison view, manually accept or cancel. Original PDF pixels/vector lines/masks are not guaranteed.
- **REJECT / no write** = import cannot form a text-bearing editable document or violates input constraints; original STEP2 V2 IndexedDB documents remain untouched.
- **NOT VERIFIED** = no exact real customer/hardware test or dedicated fixture; do not extrapolate from other PDFs.

| Original PDF content | Outcome | Actual evidence and limits |
|---|---|---|
| Small valid selectable **single-column text** (Korean/numbers/punctuation, simple headings) | SUPPORTED / review | STEP3 Chrome/Edge upload and Windows installed NSIS import→explicit checkbox→new V2 save; title/body role and layout reflow heuristic; not source pixel fidelity. |
| **Multi-page** selectable text | SUPPORTED / review | Browser STEP3 2+ pages, installed STEP3 2 pages; per-page blocks and source reference. |
| **Raster image** plus selectable text | WARN | PDF.js-decoded PNG recovery candidate, count/missing assets and geometry preview; raster survives synthetic browser/windows output. Color/clip/alpha/position fidelity unproved. |
| **Multi-column/sparse wide lines** | WARN | Mixed-layout 2-page synthetic PDF; reading-order risk raised. Text tokens may exist but order/columns are not reliably reconstructed. |
| **Vector table rules or shapes** | WARN | PDF.js paint-event diagnostic; visible count is neither recovered cells nor preserved grid. Cell association and lines lost unless manually fixed. |
| **Clip/mask/alpha/Form XObject** | WARN | Synthetic path/clip and transparent/opaque Form operator traces; approximation/missing-image disclosure. |
| **Full image-only scan** (no selectable text) | REJECT | M08-B 2-page actual raster-only synthetic PDF injected through true Chrome/Edge and installed Windows file picker; verify no draft, no source Blob, no new V2 doc. OCR not included. |
| **Mixed scan image-only page + selectable page** | WARN, explicit opt-in | M08-B 2-page real synthetic PDF, page 1 blank selectable text + image warning; page 2 two exact text markers; review cannot save without checkbox; Chrome/Edge consent→new V2 A4 output retaining image+markers. Installed Windows warning/cancel preserves prior V2 project; Windows mixed-scan *save/print* not yet exercised. |
| Wrong extension or corrupt header | REJECT | Browser drag/drop extension check; `extractLocalPdf` validates %PDF- header before parse. Malformed-header exact browser upload not separately measured. |
| Password encrypted PDF | REJECT | `extractLocalPdf` explicitly surfaces unsupported password errors; dedicated real encrypted fixture not yet run. |
| Above **30 MiB / 50 pages / 500,000 characters / 2,500 blocks** | REJECT | Validation implemented in adapter/reconstructor; all thresholds not yet exercised with full physical/PDF.js corpus. |
| Missing/invalid glyph mapping or ligature extraction | WARN / NOT VERIFIED | PDF.js selectable text may be garbled and UI comparison is mandatory. Dedicated unsupported fonts/language fixtures not yet run. |
| Scanned handwriting / OCR / handwriting recognition | NOT SUPPORTED | OCR engine not present; scan-only PDFs rejected, not silently recognized. |
| Complex multi-column tables, digital signatures/forms, rotated content, embedded attachments | NOT VERIFIED | Some diagnostics flag risk but fidelity, fields and annotations not preserved as equivalent documents. |

## Why M08-B prioritizes scans

A scan resembles a visually complete PDF even when extracted editable text is absent. A mixed document can silently lose image-only page content. M08-B closes this gap with real PDF.js/browser and installed Windows checks: block full-scan import; warn mixed scan, prohibit implicit save, allow opt-in output with raster after review.

## Acceptance gates — required for test success

1. Generate deterministic source PDFs in `desktop/step3-scanned-fixture.cjs`; **two A4 pages with real embedded raster XObject**, never any customer files.
2. Independently inspect in Chrome/Edge using `pdfinfo`, `pdftotext`, `pdfimages`; image-only has zero extracted characters, mixed has exact two page-2 markers.
3. Full scan: alert contains `선택 가능한 텍스트가 없습니다`, no review/approval flow/source Blob, no new IndexedDB project.
4. Mixed scan: explicit page 1 missing-selectable-text warning, both review page sections shown, save disabled until checkbox. Chrome/Edge after explicit acceptance: new saved document, two exact original markers, at least one PDF image on reprint, A4 output and older projects preserved.
5. Installed Windows NSIS: scan-only rejection and partial scan warning/cancel on previously persisted STEP3 project, in addition to existing 8/8 theme prints; do not claim mixed-scan Windows native export from this test.
6. Keep `main`, PR3/PR4, source bytes/user data untouched; fixture/generated output ephemeral. CI conclusions and exact app SHA must be verified before marking PASS.

## Business gate

BASIC 8/8 synthetic templates have print/layout evidence, but this content matrix does **not** imply actual customer input quality or commercial readiness. 30/60/90k SKUs, genuine Korean offline proofreading model (license/size/quality/CPU consent), PRO20/BUSINESS30 and real customer PC/files remain incomplete. **Sale NO-GO.**

## NEXT

After M08-B CI, target single known missing fixture: corrupt/locked PDF rejection, or genuine missing-glyph mapping. Prioritize boundary with highest possible data-loss risk, maintain no-write guarantee. Real customer files and buyer PC are separate owner supplied evidence.
