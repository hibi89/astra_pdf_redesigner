# G002 follow-up — real PDF.js source/output structural risk QA

**Date:** 2026-11-15 KST. **Independent functionality SHA:** `56dfc824b43fa9176bbb2afff4ea465297d63e6c`. **Score delta:** +0. User buyer acceptance `UNASSESSED`; `RELEASE HOLD`.

## 1. What changed (actual code, not a plan)

- `tools/gpt-final-qa-real-pdfjs-parity.mjs` imports the project's pinned `pdfjs-dist/legacy/build/pdf.mjs` and parses two **actual PDF byte streams** in memory, unlike G002's earlier string-only synthetic snapshot validator.
- Compares original pre/post SHA-256, source vs imported text claim vs redesigned PDF text, protected numbers/negation, explicit table-row order, per-page PDF.js text order, non-A4 size, text overflow, rotated/unextractable glyph risks, raster draws, vector path operators, source/output identical byte risk, changed page count. Report returns only issue codes, counts, hashes, and review status. It never returns raw customer text. It never writes files or invokes a network endpoint.
- `tests/gpt-final-qa-real-pdfjs-parity.test.mjs` uses actual deterministic 2-page synthetic PDFs from `tests/fixtures/step3-mixed-layout-pdf.mjs` (selectable table cells, text in two columns, embedded raster and vector table lines). Cases cover source/output identity, numeric text change, page order reversal, image removal/duplication, A4 geometry, off-page glyphs, table cell order, original hash mutation, malformed PDF and caller-controlled imported-text mismatch.
- Dedicated `g002-real-pdfjs-parity` GitHub Actions job installs the package's existing `pdfjs-dist@6.4.299` via `npm install --no-audit --no-fund` and runs these plus existing PDF integrity / Electron export audits. It does not ship or alter the actual Electron product logic.

## 2. Exact independent verification

- [G001–G004 + actual PDF.js run #43685325171](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685325171) exact feature SHA `56dfc824b43fa9176bbb2afff4ea465297d63e6c`: **G002 PDF.js 21 PASS / 0 FAIL / 0 SKIP**. Existing G001–G004 regression **52 PASS / 0 FAIL / 0 SKIP**; independent Codex pinned-source reviewer SUCCESS.
- [Final blueprint policy #43685325429](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685325429) SUCCESS on same feature SHA.
- **Total 73 tests PASS** across two separately executed test sets. Not a claim of 73 completely new tests: **12 are new real PDF.js scenarios, nine are existing PDF.js/output tests, 52 are previously integrated G001–G004 tests**.
- Failed candidates, **no score**:
  - `7773006c3eeb8ffba2d76a07825c6c889048eab0` / [run #43685149205](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685149205): 18/19 PASS; vector path counting did not include PDF.js `OPS.constructPath`. Fixed by accounting for path operators separately without claiming exact rendered stroke fidelity.
  - `4d52d5da30a1b7c5deab8e8664d64553eca1c2a5` / [run #43685232487](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685232487): unexpected `]` syntax error because a literal escaped newline inside a JS comment swallowed the declaration; corrected with a real newline before the declaration.
  - Additional `0f20ad86d9f8d4350d0fa61a9f9d428dd0c2f515` ran before that literal-newline fix; same unchanged syntax failure, no scoring. **Current exact feature SHA 56df passes.**

## 3. Explicit non-certification and restrictions

- PDF.js text output and operator counts are **risk indicators**, not OCR or semantic accuracy, visual image identity, table cell geometry, actual screenshot pixel parity, or user acceptance.
- `importedText` is still an independent caller assertion: the tool cannot certify that ASTRA's editable project store matches the imported text without a separate UI/IndexedDB snapshot binding. `importTextProvenance=CALLER_ASSERTION_NOT_AUTHENTICATED`.
- A redesigned document may legitimately change pages and layout; flagged differences require manual review, not automatic rejection of a valid redesign. Even a zero-issues synthetic case yields `PDFJS_STRUCTURAL_PARITY_MANUAL_REVIEW_REQUIRED`, `scoreDelta=0`, `RELEASE HOLD`.
- Bounds: PDF <32MiB, pages <=30, extracted text <=2M characters. Malformed/huge PDF fail closed. Rotate/page pixel rendering remains manual.
- **Never upload real customer PDF, filenames, raw contents, or sensitive hashes into public GitHub/Actions.** G004 buyer acceptance remains 0 verified files.
- Existing core PDF.js tests and source/STEP1 localStorage V1/STEP2 IndexedDB V2 are unchanged. Codex Windows/AI/SKU files untouched.

**Next independent G002 task**: bind real UI imported-text/V2 snapshot to this validator on an isolated, synthetic browser fixture, with no customer document upload. This component cannot by itself increase A03/A07/A11 score.
