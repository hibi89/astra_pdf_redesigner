# ASTRA 52→70% provisional engineering checkpoint — 2026-11-11 KST

Repository: hibi89/astra_pdf_redesigner
Isolated feature: feature/astra-p52-to-p70-20261111
Parent: integration/astra-commercial-core @ b80830ab3219dbcf88556d60ce2c47c2dcec7764.
Stable main, draft PR #3/#4/#9, original seven-step plan and original user project data were not merged or overwritten.

## What was implemented (conservative safety boundary)
1. STEP4: strict bounded local-only astra-style-preset v1 containing *only* theme/accent/textSize/font and user label. App may export JSON or import manually; import provides an ephemeral preview first. Apply is an explicit user click; existing 20-entry style undo permits reversal. Validation rejects unknown fields, forbidden/invisible names, incorrect type/theme/palette and oversized files. No localStorage/IndexedDB schema change or source PDF upload.
2. STEP5: local PNG/JPEG/WebP or selectable PDF-page analyzer can export its manually adjustable proposed design as the same STEP4 portable preset. Reference image/PDF pixels or text are never embedded in style file. Unsupported image/OCR remains explicitly unsupported; file export is only a style-token suggestion.
3. STEP7 owner review: when original imported PDF is still open in the source comparison panel, explicit button exports astra-local-source-review-receipt JSON containing original file SHA-256, local document *content* SHA-256, anchor/review/stale counts and estimated anchored pages. Contains no original PDF bytes, names or raw document text. Acknowledgment is not proof of accurate extraction; receipt always source_fidelity_certified=false and owner_approval=NOT_GRANTED. Asynchronous content/file change before download is rejected.
4. Independent offline verifier: scripts/verify-source-review.mjs compares the receipt against the unchanged original .pdf and a self-exported .localdoc.json project backup. It rejects symlinks, malformed/oversized files, forged certificate/approval, inconsistent counts and missing/changed inputs; emits match/mismatch flags, not text/path content. A hash match is **not** proof that the redesign preserved all content or typography, or an authenticated manual reviewer. No remote calls or file modifications.

## User flow
- Open the existing local React/Electron editor. Choose text-oriented PDF in the existing STEP3 flow; inspect source anchors; manually mark reviewed blocks.
- Use **검토 근거 JSON 저장** in the source panel to download astra-source-review.json. Separately use existing **프로젝트 내보내기** to save the actual project .localdoc.json, and keep the original source PDF locally.
- The optional developer/local verification command is:
  node scripts/verify-source-review.mjs "/absolute/receipt.json" "/absolute/original.pdf" "/absolute/project.localdoc.json"
  Output MATCHED_HASHES_NOT_FIDELITY_CERTIFIED = bytes and stored-content snapshots match; MISMATCH = bytes changed; SOURCE_RECEIPT_VERIFICATION_BLOCKED = invalid/unsafe input. Even on matched hashes, human completeness review remains required.
- In Design Studio, **현재 디자인 파일로 저장** stores only the current style controls. **프리셋 파일 가져오기** loads a selected local JSON as a nonpersistent preview, then **미리보기 디자인 적용** or **가져오기 취소**. Previous design can be undone via the existing undo control. Existing STEP5 local reference proposal also offers **참고 스타일 파일로 저장**. Use the saved JSON file after restarting or on a different local device; presets are not silently persisted to a new schema.

## Scope-based management estimate (not release fitness)
Management baseline = ASTRA whole-product engineering completion 52% provisional.
- STEP4 portable style settings import/export, preview/actual apply/undo +5 percentage points.
- STEP5 local reference→portable style reuse workflow +4.
- STEP7 source and local document provenance/hash receipt linked with manual review counts +5.
- Independent source/project verification and source-loss safety regression +4.
Subtotal +18 = **70% provisional engineering progress**. These are feature-scope weighting assumptions, not measured implementation fraction of original 7 steps, market-ready percentage, statistical accuracy or a formally accepted customer workflow. No credit for existing 8 BASIC designs or M09 work already in the 52% baseline.

## Exact evidence / constraints
New source and tests are committed in this isolated branch. At initial checkpoint, CI on exact functional SHA must be independently checked before calling it PASS.
Primary test commands:
  npm test
  npm run build
  node tests/step4-style-preset-browser.mjs (requires running Vite + Chrome/Edge)
  node tests/step3-browser.mjs (includes actual original-PDF SHA receipt acceptance)
  node tests/step5-reference-browser.mjs (includes reference→style-token export)
  npm run desktop:verify
  npx electron-builder --win nsis --x64 --publish never
Use GitHub Actions / .github/workflows/ci.yml and windows-desktop.yml for actual Chrome/Edge and Windows packaged app verification; never infer physical end-user Windows test from hosted runner.
Historical first browser test defects: too-narrow A4 pt constant and comparing post-undo updatedAt to initial timestamp. Both test-only corrected after confirming PDF is reported A4 and document content/design remain unchanged. Historical Windows standalone verifier initial test path used URL.pathname on Windows instead of fileURLToPath; fixed. Do not mislabel these harness errors as source PDF data corruption.

## Still blocked before sale/100%
Original roadmap STEP6 external search and STEP7 OCR remain approval-gated; a real Korean offline AI model, license, CPU speed, redistribution and same-model-on-3-SKU requirement are not met. PRO 20 and BUSINESS 30 distinctive tested designs, batch/brand-kit/entitlements, code signing, buyer Windows 10/11 physical devices, customer-consented 5–10 real PDFs and difficult tables/scans/multicolumn PDFs, Korean font/font substitution, SmartScreen, seller license/refund/helpdesk are unverified or unfinished. Commercial **NO-GO / RELEASE HOLD**; production deployment N/A. Keep source PDF and data local; no customer sample in public GitHub/CI and no unauthorized model/file uploads. Nothing in this checkpoint claims flattened PDFs can be reconstructed pixel-identically.

## Recovery and next
The functional branch was cut from b80830ab...; individual feature commits can be normally reverted. Do not force merge/rebase/reset original integration or stable/main; Draft PR #9 remains unmerged. First confirm exact functional SHA and cross-platform CI, then update STATUS/HANDOFF and command-center scoring; future 70→85 should prioritize real content fidelity for difficult documents, signed/pinned licensed local LLM, PRO/BUSINESS templates and real Windows/customer acceptance. Owner approval required for proprietary models, client data, payments, permissions, release and schema migration. No user action is needed for this synthetic 70% feature checkpoint; external approvals are deferred.
