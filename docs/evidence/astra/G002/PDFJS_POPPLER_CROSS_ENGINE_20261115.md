# G002 PDF.js × Poppler independent extractor cross-check — 2026-11-15 KST

## Purpose and exact evidence
The earlier genuine Chromium test printed a **two-page deterministic synthetic PDF** after STEP3 import, explicit per-page source reading-order checks, STEP2 indexedDB V2 document save, and product JSON export. PDF.js found 10 output U+0000 text characters and the conservative risk checker raised `SOURCE_OUTPUT_NUMERIC_DIFFERENCE`. This report distinguishes **parser-specific extraction anomalies** from independently corroborated missing protected synthetic markers. It **does not prove visual fidelity**.

- Cross-parser implementation: `tools/gpt-final-qa-pdf-cross-parser.mjs`, entirely local `pdfjs-dist` plus Poppler `pdftotext -enc UTF-8 -layout - -` (stdin→stdout; no file writes or network).
- Unit cases: `tests/gpt-final-qa-pdf-cross-parser.test.mjs`, five actual fixture PDF runs including deliberately changed numeric table marker, malformed PDFs, forged duplicate/invalid marker inputs and no text disclosure.
- Product browser fixture: `tests/gpt-final-qa-live-v2-checked-browser.mjs` augments verified Chrome STEP3→live IndexedDB V2→true product backup hash→Chrome A4 output with **both parsers**, and enforces that every one of 17 protected synthetic markers survives **in both** output extraction results.
- Exact functional evidence at `e779837a30959e85c0ce0eee49b171e5737699de`: [QA workflow #43690100658](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690100658) **all four jobs SUCCESS**; existing G001 security 52 PASS, G002 PDF.js/V2 32 PASS, new Poppler×PDF.js **5 PASS** = **89 PASS / 0 FAIL / 0 SKIP**; real Chromium E2E PASS; [policy #43690100943](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690100943) SUCCESS. Later exact SHA adds stricter output marker assertions and must have a separate successful run before score inclusion.

## Actual Chrome A4 printed PDF — content-free counts

| Check | PDF.js | Poppler |
|---|---:|---:|
| Two-page source 17 synthetic text/numeric markers | 17/17 | 17/17 |
| Actual Chrome A4 printed output 17 synthetic text/numeric markers | **17/17** | **17/17** |
| Source U+0000 extracted glyphs | 0 | 0 |
| Actual Chrome output U+0000 extracted glyphs | **10** | **0** |

Source/output marker integrity is independently corroborated by two parsers in the tested synthetic case. The **10 U+0000 glyphs are specific to the PDF.js extraction path** in this test, consistent with a font/ToUnicode/text-mapping anomaly, **not proof** that the PDF has missing original numeric markers. Poppler's absence of NUL likewise **does not prove** page visual correctness, font display, data table geometry or completeness of all natural-language text.

Risk codes stay visible in the original PDF.js comparator:
`SOURCE_OUTPUT_TEXT_DIFFERENCE`,
`SOURCE_OUTPUT_NUMERIC_DIFFERENCE`,
`PDFJS_OUTPUT_NUL_GLYPH_REVIEW_REQUIRED`,
`VECTOR_PATH_OPERATOR_COUNT_CHANGED`,
`PAGE_LEVEL_TEXT_REVIEW_REQUIRED`.

The new cross-parser separately issues `OUTPUT_PDFJS_NUL_GLYPHS` and `PDFJS_ONLY_NUL_EXTRACTION_POSSIBLE_NOT_PROVEN`; `outputMissingBothParsers=0`, `outputOnlyPdfjs=0`, `outputOnlyPoppler=0`. **Do not equate either the numeric difference risk code or a matching marker subset with a certified literal numeric-loss finding.** This is a fail-closed diagnostic with a manual-review verdict.

## Security / strict acceptance boundaries

- Marker list is hard-coded synthetic; no real customer document bytes, text, filename/path, sender identity or private project content are emitted in logs.
- `pdftotext` subprocess receives PDF bytes via stdin on the GitHub-hosted VM, emits extracted text only to parent process memory, with timeout, size ceilings and fail-closed missing/extractor error behavior. No original or output PDF modification, storage mutation, network request, OCR asset, licensed model or production flag changed.
- Original V1 / V2 preservation, signed buyer rights, true device performance, actual user PDF, screen pixel comparison, Korean CJK visual mapping, and commercial launch are **not proved**.
- **A03/A08/A10/A11 score delta +0**, frozen provisional **64/100**, owner/buyer `UNASSESSED`, `RELEASE HOLD`.

## Next discriminating tests
Create a separate synthetic font/ToUnicode comparison targeting the output **non-marker glyph spans**, using a controlled browser renderer/font matrix and independent raster/Poppler/PDF.js evidence. Keep it reviewer-only; any product text/font change must be owned by Codex or accepted after independent review. Do not auto-replace unknown glyphs in the customer's saved document or printed PDF. Independent raw visual acceptance needs real screenshots / owner review.
