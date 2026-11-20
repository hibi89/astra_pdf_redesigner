# P121 — Electron OCR IPC 실제 실행 차단 기록

**상태:** BLOCKED · 0/1점 · 잠정 61/100 · 공식 수용 UNASSESSED · RELEASE HOLD

P121 requires the P119 supplier approval and P120 real OCR prerequisite. The latest exact-SHA Windows run [#43651926099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099) passed the existing controller synthetic unit tests, Windows Electron desktop and NSIS regressions, but it did not enable the production OCR manifest or execute the unapproved candidate through the app IPC path. Chrome/Edge synthetic OCR UI tests use a mocked native response and do not substitute for P121 acceptance.

The 5.5.3, 5.5.0 and UB-Mannheim 5.4.0 Windows installers all returned Authenticode `UnknownError` for the Universität Mannheim signer due to a certificate validity-period error. The 5.4.0 candidate's SHA matched a pinned Microsoft winget-pkgs manifest, but fail-closed verification skipped installation. No P121 point is recognized until an approved signed/licensed asset supports Windows Electron PNG→kor+eng execution, cancellation/timeout, temporary-file cleanup, broken-input rejection, source review, and proof that V2 remains unchanged.

Keep `OCR_MANIFEST=null`; do not ship or bundle any candidate. See [P119 verification](../P119/VERIFICATION.md) and [supplier audit JSON](../P119/SUPPLIER_CANDIDATE_AUDIT.json).
