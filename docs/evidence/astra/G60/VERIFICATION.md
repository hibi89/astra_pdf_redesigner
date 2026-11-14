# G60 — NOT PASSED

**Current provisional task sum:** 61/100. **Gate points:** 0. Official acceptance remains UNASSESSED; release remains RELEASE HOLD.

The exact feature/audit SHA [`0f82c8f0764cd00460abe3b27f97b497ce61ceb5`](https://github.com/hibi89/astra_pdf_redesigner/commit/0f82c8f0764cd00460abe3b27f97b497ce61ceb5) passed Linux [#43647106432](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106432), Windows [#43647106409](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106409), and policy [#43647106804](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106804). Windows Actions ran Tesseract 5.5.3 on 12 synthetic kor+eng samples (9 exact, 3 errors; mean whitespace-normalized CER 0.0486; one critical amount mismatch). The same run closed the static PE import inventory: 56 PE files, 286 direct imports, 0 delay imports, with 157 Windows system and 129 bundled dependency imports.

This still does not pass G60. P119 remains blocked because Windows Authenticode returned `UnknownError` and the exact bundle's dependency license/NOTICE and redistribution mapping remains unproven. P120 app/UI acceptance (source review, PSM 3/6, cancel) and P121 actual Electron IPC/cancel/cleanup/V2 immutability remain incomplete.

P119/P120/P121 remain BLOCKED +0. The task sum of 61 does not pass G60. Keep OCR_MANIFEST=null and RELEASE HOLD.
