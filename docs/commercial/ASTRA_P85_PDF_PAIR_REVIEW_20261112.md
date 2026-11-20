# ASTRA P71–P75 source/output PDF source-fidelity risk review — 2026-11-12 KST

**Product:** Astra PDF Redesigner, original React/TS/Vite + Electron, local-only owner PDF editor.  
**Base:** `hibi89/astra_pdf_redesigner@feature/astra-p52-to-p70-20261111` `8f987462dc7c2edd02303ec32c9813340170860a`, baseline **70% subjective engineering**.  
**New feature:** `feature/astra-p71-pdf-source-parity-20261112`; **all original STEP1–STEP5 user content, V2 IndexedDB schema, PDF import and Electron save implementation remain untouched**. Draft PR, independent branch only; no merge, model download, cloud, payment or buyer data.

## Design alternatives

- **A — automatically mark a generated PDF as equivalent to the original when A4 and output text markers pass:** minimal cost but dangerously overstates source completeness; original PDF can contain omitted numbers/table text, scanned images, different multi-column order or unsupported fonts. Rejected.
- **B — independently selected original PDF vs saved output PDF, SHA-pinned to existing manual receipt/project when possible, explicitly report lexical/numeric/image risk and keep all human gates BLOCKED:** uses bundled PDF.js and no new Python/LLM/external API; moderate extra QA and transparent limitations. Selected.

## Delivered functionality

1. **P71 independent local source+output PDF comparison:** `scripts/owner-pdf-source-output-review.mjs` reads exactly one owner-specified original source PDF, already saved STEP7 receipt and `.localdoc.json` project backup, and one owner-specified actual redesigned output PDF. It validates source and project hashes via **existing** `scripts/verify-source-review.mjs` receipt verifier; requires independent SHA256 of result PDF; refuses same binary posing as changed output. Actual PDF.js extraction compares selected text token multiset, numeric identifier token counts, raster draw counts and output A4 geometry. Reports only SHA256, counts and risk codes, no raw PDF, text, fragments, project names, absolute paths, model data or fonts. File limit: 30MiB source and output, 50 pages, 300K tokens, 1.5M text characters; project 100MiB/receipt 16KiB. No symlinks, no overwriting previous outputs. Writes only **two new** owner-selected private JSON+static HTML files and removes only newly created files on partial write failure.
2. **P72 independent owner preview evidence:** the generated static Korean HTML has no JavaScript and CSP `script-src 'none'; connect-src 'none'; img-src 'none'`; it shows SHA/number of PDF pages, selected text token counts and automated warning categories. It is intended for human review, not automatic permission or actual OCR/pixel comparison.
3. **P73 actual Astra GUI entry point:** new `src/step7/OfflinePdfReview.tsx` reachable from current `Workspace` via **최종 PDF 원본 대조**. Customer chooses the original and saved PDF manually; PDF.js parses them inside Chromium/Electron without external transfer or schema changes. Number-bearing changed tokens, added/removed selected text, image-draw changes and non-A4 pages are shown as explicit risks. The owner can explicitly download JSON metadata and return to original editor. All user data continues in existing storage as before. Generated metadata has `ownerApproval: NOT_GRANTED`, `contentFidelityCertified:false`.
4. **P74 regression:** actual synthetic two-page selectable PDF fixtures check changed numerals, omitted/duplicated text, extra/removed raster, non-A4, wrong source/project/output SHA, malformed/corrupt PDF, symlinks, no-overwrite/repeated run, strict no-network HTML and no plaintext disclosure. Real Chrome+Edge E2E tests upload two PDF files using Browser File API and verify numeric drift, JSON export, zero remote requests and unchanged original IndexedDB V2. Original STEP1–5 Node/build and Windows signed/unsigned installer pack regressions are not replaced.
5. **P75 accurate release boundary:** even if token counts match, status remains `NOT_FIDELITY_CERTIFIED`, legal/OS buyer acceptance remains `NOT_VERIFIED`, and owner_sale_approval is never granted by the tool or UI.

## Usage (developer/owner controlled local Windows PC)

In Astra, open the stored document, inspect original source anchors, use **검토 근거 JSON 저장** and **프로젝트 내보내기**, then save the resulting redesigned PDF. Open **최종 PDF 원본 대조**, choose both PDFs and click **두 PDF 대조하기**; inspect warnings and optionally save `astra-pdf-parity-review.json`. There is no automatic PDF value edit, no server/URL search, no AI model download, and no consent impersonation.

For independent source+project+PDF binding, obtain output PDF SHA using the OS local file hashing tool and run from a full existing project checkout:

```powershell
$hash = (Get-FileHash "C:\Private\redesigned.pdf" -Algorithm SHA256).Hash.ToLowerInvariant()
node scripts/owner-pdf-source-output-review.mjs `
  "C:\Private\astra-source-review.json" `
  "C:\Private\original.pdf" `
  "C:\Private\project.localdoc.json" `
  "C:\Private\redesigned.pdf" `
  $hash `
  "C:\Private\NEW-pair-review.json" `
  "C:\Private\NEW-pair-review.html"
```

Never place actual customer PDF, project, JSON or model contents in GitHub issues, public branch, CI artifacts, or a third-party LLM. The report is **metadata only**, but SHA may still be sensitive for private documents; keep it private until sharing is approved.

## Evidence and scoring boundaries

- 2026-11-12, preliminary core source SHA `2b5a000fee5f03f486925f1c2112025215c583e6`: original complete Chrome+Edge / Windows Electron NSIS workflows both finished **SUCCESS**, including newly added CLI PDF comparison regressions after correcting a genuine `Array.map(path.resolve)` callback-index error.
- New combined GUI + independent CLI improvement **code SHA `3b3c6f73a11d1791076eb5a860f14f87691844b5`**: exact-SHA **Chrome/Edge #43118808792 2/2 SUCCESS**, Node134 PASS, actual browser STEP7 PDF PAIR and IndexedDB V2 preservation; **Windows NSIS #43118808750 1/1 SUCCESS**, Node133 PASS/1SKIP, desktop16 PASS and installed EXE/installer/upgrade regression PASS. No physical buyer QA. This document is not a certification.
- Proposed subjective internal engineering rubric once verified: from prior70 +5 independent original/receipt/project/output integrity, +4 actual in-app user PDF compare, +3 offline owner JSON+static no-JS HTML metadata review, +3 risk regressions and cross-browser/packaged Windows integrity = **85% provisional**. This is **not 85% completion of the original 7-step commercial scope**; PRO 20 distinct layouts, BUSINESS 30 layouts, verified/redistributable offline Korean LLM, STEP6 network search, OCR, real consented 5–10 buyer PDF types, font/color/pixel matching, actual physical Win10/11 buyer, code signing and license/refund/support remain unimplemented/unapproved.
- An original PDF that is flattened/scanned may contain no selectable text. This tool reports an unverified source and requires human/manual review, not OCR. Extra/removed selected tokens can also arise from legitimate intentional exclusion or different page headers/numbering. Results are **risk signals**, not proof of loss, duplication, reading order fidelity or exact visual replication. Human final approval remains required.
- **BASIC/PRO/BUSINESS commercial RELEASE HOLD.** `main` / old integration / original user data untouched. Source rollback uses Git commit parents; no force push, no hosted web service/Vercel applicable.

## Commands for follow-on verification

```bash
npm install --no-audit --no-fund
npm test
npm run build
npm run desktop:verify
# with Vite localhost available and Chrome/Edge installed:
CHROME_PATH=/path/to/chrome node tests/step7-pdf-review-browser.mjs
# GitHub branch workflows: .github/workflows/ci.yml and windows-desktop.yml
```

No physical customer Windows/PDF quality or actual buyer source acceptance was run here. CI can verify source and synthetic fixtures, but only owner-controlled QA can finish the commercial gates.
