# ASTRA P106 — Windows Authenticode Evidence Collector

2026-11-14 KST. Development evidence only, not product release or official 12-domain score.

## Design comparison

Option A (selected): Native Windows PowerShell Get-AuthenticodeSignature + Get-FileHash. Zero external API or new binary/tool cost, no execution of inspected binaries, independent local SHA evidence. Cannot by itself prove publisher trust, actual network origin, timestamp/revocation or legal redistribution.

Option B (deferred): External SignTool/WinTrust + dynamic DLL loader inspection on real Windows with genuine supplier assets. Higher setup and verification cost; can complement but not replace independent offline SHA-256 and SBOM rights audit.

References: Microsoft official documentation https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-authenticodesignature and official Tesseract Windows installer status https://tesseract-ocr.github.io/tessdoc/Downloads.html . Official Tesseract does not provide a current official Windows installer; UB Mannheim is a third-party Windows distribution https://github.com/UB-Mannheim/tesseract/wiki .

## Implementation / limitations

- scripts/ocr-windows-authenticode-evidence.ps1 validates external manifest schema/platform, separately held installer SHA-256, same-bytes pre/post SHA for executable and DLL, file size, no symlink/reparse point on explicitly read files, literal path, duplicate name/unsafe traversal, unlisted extra native EXE/DLL.
- Outputs relative asset IDs, SHA/size, actual signature Status and signer thumbprint/subject if observed. Does not output absolute local paths or customer PDF contents. Does not launch target binaries or perform network requests.
- Always reports status review-required and publisherTrustApproved, installerSignatureApproved, runtimeDllClosureVerified, legalRedistributionApproved, productOcrEnabled all false. manifestInventoryIndependentlyVerified is false; P104 SHA/license full inventory + P105 static import checks remain mandatory independent gates.
- Synthetic Windows CI tests check unsigned pseudo installer/EXE/DLL, deliberately modified DLL, false installer pin, manifest path escape, and unexpected DLL. No real vendor bytes or licenses are involved.
- Authenticode can prefer catalog signatures over embedded signatures. Valid status alone is not independent vendor identity or redistribution permission. Real installer, all DLLs, language packs, SPDX/NOTICE/SBOM, code-signing chain, revocation/time stamps, DLL dynamic closure and physical Windows10/11/OCR quality still require independent authorized testing.

### Future optional owner-provided local data

Run P104 preflight first, then on Windows with separately verified vendor bytes:
pwsh -NoProfile -File scripts/ocr-windows-authenticode-evidence.ps1 -InstallerPath <real-installer> -AssetsRoot <bundle> -ManifestPath <external-manifest>

No actual supplier installer downloaded or bundled; OCR_MANIFEST=null and NSIS RELEASE HOLD remain. Current score UNASSESSED/100% incomplete and no Kmong listing.

Function SHA: 7ec1de61a750d324df7e7ae25ff30f109fc766e5. Policy CI #43580696839 success; Windows synthetic Authenticode step success, overall NSIS #43580696709 and Linux/Chrome/Edge #43580696635 final conclusions pending at document creation.

## Exact-SHA P106 final CI verified — 2026-11-14 KST

- Function commit: 7ec1de61a750d324df7e7ae25ff30f109fc766e5.
- Linux/Chrome/Edge run #43580696635: 2/2 SUCCESS; Node 221 PASS/0 FAIL/0 SKIP, Chrome+Edge actual browser synthetic PDF.js/OCR review PASS.
- Windows Electron/NSIS run #43580696709: SUCCESS; Node 220 PASS/0 FAIL/1 Windows symlink permission SKIP, desktop 59 PASS/0 FAIL. New offline P106 PowerShell Authenticode regression emitted 11 PASS assertions plus completion marker in raw Windows job logs; Windows NSIS install/uninstall and in-place 0.1.0 to 0.1.1 IndexedDB/PNG preserved PASS. Release HOLD PASS.
- Final blueprint policy run #43580696839: SUCCESS. Overall EXACT feature SHA 3/3 workflows SUCCESS.
- Scope: Windows runner used **synthetic unsigned files**, not the genuine Tesseract third-party distribution, not signed by its publisher. Genuine installer/PE verification, revocation/timestamp/source provenance, SPDX/NOTICE/legal redistribution, runtime DLL closure, physical Windows buyer testing and 12-domain user acceptance UNVERIFIED. Official score UNASSESSED and RELEASE HOLD.
