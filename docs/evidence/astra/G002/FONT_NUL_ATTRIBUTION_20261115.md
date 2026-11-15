# G002 — Independent PDF.js NUL font attribution and controlled print matrix

Date (KST): 2026-11-15
Repository: `hibi89/astra_pdf_redesigner`
GPT QA branch: `gpt/astra-final-qa-ocr-20261115`
Feature HEAD (before this evidence document): `5a9ff8a6343db43cb76c823ce5fae8fee874ff47`
Integration base (observed): `02f9481e441d20927d9f54a275717c7db33efa20`
Product: **unchanged**. Customer PDF: **never used**. Release: **HOLD**.

## Why this work exists

Prior exact-SHA Chromium G002 output retained all 17 protected synthetic markers in
PDF.js and Poppler, but PDF.js returned 10 U+0000 on the actual print while
Poppler returned zero. Source had zero NUL in both. This is an unexplained
extraction / font encoding issue, not proof of lost visible glyphs or correct
numeric semantics.

## New independently reviewable code

- `tools/gpt-final-qa-pdfjs-nul-attribution.mjs`:
  actual PDF.js text-item attribution per page and anonymized font key.
  Returns only counts, font class and comparison flags: no text, coordinates,
  raw font names, original document names or PDF bytes. Runs with two
  `useSystemFonts` options; `disableFontFace` remains true.
- `tests/gpt-final-qa-pdfjs-nul-attribution.test.mjs`:
  synthetic source counts, page/font consistency, source byte preservation,
  no source marker leak, invalid-input fail-closed behavior and disagreement
  never automatically certifies output.
- `tests/gpt-final-qa-live-v2-checked-browser.mjs`:
  in the previously proven actual product STEP3 -> page-by-page review -> V2 ->
  A4 print workflow, correlates the new font/page NUL counts with the
  existing independent Poppler/PDF.js report. A count mismatch fails the run.
- `tests/gpt-final-qa-font-nul-browser.mjs`:
  **fresh browser process**, independent synthetic ASCII/monospace,
  Korean/sans-serif, Korean/serif-table A4 print fixtures. Each printed
  output is parsed by PDF.js twice and local Poppler. Protected markers
  must be recovered by both. It can isolate font-family trends without
  treating any specific family as proof of ToUnicode cause.
- `.github/workflows/gpt-final-qa.yml`:
  adds NUL parser unit assertions and actual font-matrix Chrome invocation.

## Required CI checks, not yet certified

1. `g002-real-pdfjs-parity`: new NUL attribution unit tests and existing 5
   cross-engine tests; actual total to be recorded from job logs.
2. `g002-live-v2-reviewed-browser`: V2 page-review-gated Chromium PDF output,
   exact 17 protected markers and new NUL per-font/per-page correlation;
   separate fresh Chromium controlled font matrix.
3. `g001-provenance-and-release-hold`: OCR remains fail closed.
4. `g003-codex-readonly-evidence`: old pinned Codex SHA only, must not
   claim this job audited PR #13 current head.
5. Final blueprint evidence policy workflow and post-merge regression after
   approved GPT QA merge.

GitHub connector returned no workflow runs for this push SHA and no status
contexts; **CI outcome is UNKNOWN**, not success. No merge should be performed
until exact SHA and all relevant jobs are verified.

## Evidence boundaries / Stop & Pivot

- The diagnostic can demonstrate font/option correlation, not conclusively
  identify a `ToUnicode` CMap error. PDF.js and Poppler may both be wrong.
- It does not render/compare pixels and cannot certify Korean visual, table,
  semantic number or customer document fidelity.
- Do NOT replace U+0000 with spaces, drop risk codes, remove
  `PDFJS_OUTPUT_NUL_GLYPH_REVIEW_REQUIRED` / `SOURCE_OUTPUT_NUMERIC_DIFFERENCE`,
  nor change original PDF bytes.
- C009 accessibility and C010 unsigned package scoped workflows were green at
  `fa571165...`; full Codex Chrome regression #43690873096 FAILED at
  `Page.printToPDF`. Codex PR #13 remains DRAFT; detailed review posted.
- Existing product STEP1 localStorage V1, STEP2 IndexedDB V2, author rights,
  activation keys, OCR manifest and main are unchanged.

**Official central provisional score 64/100 (+0), buyer UNASSESSED, RELEASE HOLD.**
