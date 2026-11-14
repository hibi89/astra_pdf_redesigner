# ASTRA P105 Windows x64 PE Static Import / Delay Load Audit

2026-11-14 KST. Development milestone, not a final completion score or commercial release.

## A/B design and choice

A. Parse the SAME stream of bytes already SHA-256 hashed by P104 before reporting success (implemented). No external dependency, network, elevated privileges or binary execution. Conservative 64 MiB PE bound. Suitable for synthetic Linux/Windows CI.
B. Parse outside the bundle with Windows signature tooling alone (deferred). Windows Authenticode checks trust and publisher identity but cannot replace static DLL inventory or verify runtime dependencies. Actual vendor bytes and a trusted Windows environment are required.

## Implemented

- Validate x64 PE32+ section boundaries, optional header, import and delay import directory descriptors with raw file RVA mapping.
- Reject malformed/truncated/ambiguous RVA, nonterminated tables, unsafe DLL name, unlisted third-party DLL and bundled names matching known system DLLs. API-set descriptors are system-classified, not considered licenses to bundle arbitrary binaries.
- Run parser on the exact PE chunks already checked by SHA-256. Manifest remains separate from assets. No EXE execution.
- Integrate 11 synthetic edge-case regressions in npm test and desktop:test; update original synthetic PE32+ fixture to structurally valid optional header.

## Security and quality boundary

Preflight result still status=review-required; installerSignatureVerified=false, dllRuntimeDependencyClosureVerified=false, legalRedistributionApproved=false, productOcrEnabled=false, OCR_MANIFEST=null and NSIS RELEASE HOLD. Zero static imports and a PASS do not prove DLL closure. Import parsing does not enumerate dynamic LoadLibrary, forwarded exports, Windows loader order, knownDLLs/side-by-side runtime, certificate revocation, package provenance or redistribution rights. Unknown DLLs should be reviewed, not whitelisted merely to make a test pass.

## Genuine Windows supplier evidence still required

1. Get independently identified original vendor installer. Check its HTTPS source, exact installer SHA-256, version, timestamp, publisher trust chain and Get-AuthenticodeSignature -LiteralPath status; record the actual signer certificate thumbprint only after observing it. Do not invent SHA or signer, and do not accept a GitHub URL as a license grant.
2. Check every extracted exe/dll hash, platform, static/dynamic dependencies and Authenticode statuses on an isolated Windows x64 machine. Record all languages, DLL vendor provenance, SPDX licenses, third-party notices, SBOM and independent redistributability decision; protect the original installer.
3. Run Korean/English, won amounts, tables, two-column and misaligned-page OCR only after authorization. Review source PDF vs draft; ensure cancel, rollback and original data stay intact. Test physical Windows10/11 and permitted customer files.
4. Keep sale, installer bundling, model activation and final 100-score on HOLD until the evidence and owner approval exist.

## Source references

- Microsoft PE Format https://learn.microsoft.com/en-us/windows/win32/debug/pe-format
- Microsoft Get-AuthenticodeSignature https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-authenticodesignature
- Official Tesseract Windows downloads (no current official Windows installer) https://tesseract-ocr.github.io/tessdoc/Downloads.html
- Third-party Windows distribution https://github.com/UB-Mannheim/tesseract/wiki

## Code and CI

Feature code SHA d8e765ef538e6f41fa3fc870a9257238a7c4af98.
Linux/Chrome/Edge https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43576345594
Windows Electron/NSIS https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43576345628
Final blueprint https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43576345809
At document creation, policy succeeded and Node/build/desktop smoke steps succeeded; other workflows were still in progress. Verify exact final conclusions before changing any completion claim.
