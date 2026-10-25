# M08-A — Windows 설치형 Electron BASIC 8/8 실제 A4 출력 검증

- **검증일:** 2026-10-26 KST (GitHub Actions logs UTC 2026-10-25).
- **테스트 앱 코드 SHA:** `a7f0796e391fcb0920a63669601cbcf7cfe99387`.
- **Linux Chrome/Edge:** [#40214408684](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40214408684), 2/2 **SUCCESS**, Node **61/61 PASS**, TypeScript + Vite build success. Existing M07-B browser eight-layout print regression remains passing.
- **Windows installed NSIS:** [#40214414020](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40214414020), **SUCCESS**, Node 61/61, separate desktop shell 9/9, installed PDF import/review/IDB + eight PDFs printed using actual Electron `webContents.printToPDF` before native bridge save, version upgrade and uninstall checks PASS.

## Windows native renderer per-design findings

Same locally generated 2-page synthetic PDF is reviewed and committed into a V2 document once; eight designs are selected in real installed React UI and printed separately. The verifier reopened each generated PDF **from Windows runner disk** using independent PDF.js parsing, not CSS class assertions.

| Theme | Saved bytes | Output pages | PDF title X / Y / width (pt; PDF coordinate) | Normalized 3pt signature |
|---|---:|---:|---|---|
| report | 52,281 | 1 | 64.84 / 718.92 / 217.55 | 22, 240, 73 |
| minimal | 44,820 | 2 | 45.00 / 721.92 / 245.78 | 15, 241, 82 |
| diary | 57,218 | 1 | 67.68 / 712.17 / 208.43 | 23, 237, 69 |
| compact | 52,619 | 1 | 45.00 / 753.42 / 164.55 | 15, 251, 55 |
| editorial | 53,006 | 2 | 156.07 / 676.92 / 284.34 | 52, 226, 95 |
| ledger | 53,246 | 1 | 92.75 / 746.67 / 155.47 | 31, 249, 52 |
| brief | 52,937 | 1 | 121.54 / 711.42 / 232.26 | 41, 237, 77 |
| folio | 52,542 | 2 | 182.98 / 687.42 / 310.51 | 61, 229, 104 |

All eight: A4 across every page, six exact ordered Korean/numeric source markers, one embedded raster draw, heading inside A4, no rotated text missed, 8/8 pairwise distinct title geometry signatures. Output page count differs according to reflow and is not intended to equal source page count.

## Provenance and implementation

- `desktop/step3-eight-layout-acceptance.cjs`: CI-only installed Electron theme selection, real `printToPDF` (8 times), strictly temporary runner folder and no overwrite.
- `desktop/step3-project-acceptance.cjs`: after actual PDF.js import/confirmation, IndexedDB save and restart, call 8-theme test before original native save regression.
- `tests/verify-eight-desktop-layouts.mjs`: separate on-disk read-back (PDF.js) with A4/media/text geometry, six exact ordered markers, raster and 8 pairwise print-coordinate signatures; rejects missing/extra output PDFs.
- `tests/windows-installer-lifecycle.ps1`: run new test flag on **installed** NSIS EXE and clean test-only directory; keep prior STEP2, STEP3, uninstall and 0.1.0→0.1.1 persistence checks.
- `tests/desktop-shell.test.cjs`: new static guard preventing accidental removal of installed Windows eight-layout validation.
- Exact code changes are in `a7f0796e391fcb0920a63669601cbcf7cfe99387`; this report is docs-only and no newly tested binary.

## Outcome, limitations, next READY

**M08-A scoped DONE:** eight layouts now verified both actual Linux Chrome/Edge and Windows **installed** Electron print output (synthetic-only). This is significantly stronger than a static screenshot/theme selector test, but **not** equivalent to real customer file accuracy, physical 8GB/16GB Windows PC acceptance or commercial release readiness.

Not covered: real customer PDFs, unsupported scanned OCR, complex/vector tables, multi-column fidelity, original pixel-exact reproduction, model-free true AI proofreading, Windows SmartScreen/code signing and commercial SKUs PRO20/BUSINESS30. Genuine local Korean LLM M03-B1 still not downloaded or benchmarked because owner approval is required. No external API, model or user file was acquired, no main/PR3/PR4 merge; PR9 remains Draft. **Commercial sale NO-GO.**

**NEXT READY M08-B:** prepare an independently testable PDF acceptance matrix for selectable text / large paragraph / image / multi-column / vector table / potentially missing glyph / scanned PDF, with clear supported vs warning vs reject outcomes and no real user data. Compare existing tests to this matrix first, then add the highest-value missing synthetic fixture and Chrome/Windows regression; customer originals/consumer hardware remain approval/input dependent.
