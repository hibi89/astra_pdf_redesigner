# G60 — NOT PASSED

**Current provisional task sum:** 61/100. **Gate points:** 0. Official acceptance remains UNASSESSED; release remains RELEASE HOLD.

Latest exact audit SHA [`c365ba07df29cd6228a794f0c420230d448f91ee`](https://github.com/hibi89/astra_pdf_redesigner/commit/c365ba07df29cd6228a794f0c420230d448f91ee) passed Linux [#43650366545](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366545), Windows [#43650366554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366554), and final policy [#43650366939](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366939). Windows Actions re-ran 12 real Tesseract 5.5.3 synthetic kor+eng cases (9 exact, 3 errors, CER 0.0486; one critical amount mismatch). Static import closure for 5.5.3 remains closed for 56 PE files, 286 direct imports, 0 delay imports (157 Windows system, 129 bundled).

An additional upstream Tesseract 5.5.0 candidate asset SHA-256 matched an independently pinned GitHub Scoop manifest, but Windows Authenticode again returned `UnknownError` for the Universität Mannheim signer. The candidate was not installed after signature verification failed. P119 remains blocked on a trusted signature, exact bundle dependency license/NOTICE and redistribution evidence. P120 app/UI acceptance (source review, PSM 3/6, cancel) and P121 actual Electron IPC/cancel/cleanup/V2 immutability remain incomplete.

P119/P120/P121 remain BLOCKED +0. The task sum of 61 does not pass G60. Keep OCR_MANIFEST=null and RELEASE HOLD.
