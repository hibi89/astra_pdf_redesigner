# G60 — NOT PASSED

**Current provisional task sum:** 61/100. **Gate points:** 0. Official acceptance remains UNASSESSED; release remains RELEASE HOLD.

Latest exact audit SHA [`b6d7909e6897578181dbd304ff12491760422530`](https://github.com/hibi89/astra_pdf_redesigner/commit/b6d7909e6897578181dbd304ff12491760422530) passed Linux [#43651926094](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926094), Windows [#43651926099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099), and final policy [#43651926332](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926332). Windows Actions reran the 12-case Tesseract 5.5.3 synthetic corpus (9 exact, 3 errors, mean normalized CER 0.0486; one critical amount mismatch). Static import closure for the earlier 5.5.3 audit remains 56 PE files, 286 direct imports, 0 delay imports (157 Windows system, 129 bundled).

An additional upstream Tesseract 5.5.0 candidate asset SHA-256 matched an independently pinned GitHub Scoop manifest, but Windows Authenticode again returned `UnknownError` for the Universität Mannheim signer. The candidate was not installed after signature verification failed. P119 remains blocked on a trusted signature, exact bundle dependency license/NOTICE and redistribution evidence. P120 app/UI acceptance (source review, PSM 3/6, cancel) and P121 actual Electron IPC/cancel/cleanup/V2 immutability remain incomplete.

P119/P120/P121 remain BLOCKED +0. The task sum of 61 does not pass G60. Keep OCR_MANIFEST=null and RELEASE HOLD.


## 2026-11-15 exact-SHA recheck

The latest SHA [`b6d7909e6897578181dbd304ff12491760422530`](https://github.com/hibi89/astra_pdf_redesigner/commit/b6d7909e6897578181dbd304ff12491760422530) passed Linux [#43651926094](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926094), Windows [#43651926099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099), and policy [#43651926332](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926332). P119 audited a third candidate: UB-Mannheim 5.4.0 SHA-256 matched Microsoft’s pinned manifest, but Authenticode was `UnknownError`; fail-closed audit skipped installation. 5.5.3 and 5.5.0 had the same signer validity-period error. P119/P120/P121 remain BLOCKED +0. Total stays 61/100; G60 remains NOT PASSED, G65/G70 NOT PASSED, OCR_MANIFEST=null, RELEASE HOLD.
