# P125 — Electron main-process signed SKU action boundary — VERIFIED +2

**Date:** 2026-11-15 KST  
**Repository/branch:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`  
**Exact feature/test SHA:** `88c56e4188754f960ae94281b6d68e37b5081b62`  
**Score:** A09 5→7/11; task sum 59→61/100. G60 NOT PASSED.

## Implementation

The Electron main process now wraps the native PDF-save side effect in an independently testable SKU action policy. It validates the exact top-level trusted application frame, fixed production issuer JWK/thumbprint, signed offline entitlement, expiry, supported seat count, tier capability matrix, selected layout, and an un-reusable action ID before calling the guarded operation. IPC-provided issuer keys are ignored. The preloaded API accepts only the bounded license context fields; no arbitrary IPC or filesystem API is exposed.

Synthetic P-256 key pairs and signed BASIC/PRO/BUSINESS receipts are generated inside the test process and never stored in the repository or product. Tests cover the exact six-capability matrix; expiry, issuer mismatch, tampering, invalid seats, missing pin, attacker-supplied issuer fields; wrong window/frame/URL/destroyed shell; request replay with zero additional side effect; and retained internal preview behavior.

The shipping boundary remains intentionally disabled: `ASTRA_CUSTOMER_BUILD_ENABLED=false`, `PRODUCTION_ISSUER_JWK=null`, and `PRODUCTION_ISSUER_THUMBPRINT_SHA256=null`. No seller private key was generated, no customer entitlement was enabled, and release remains HOLD. This evidence establishes a guarded pre-release boundary, not commercial DRM or customer-build approval.

## Exact-SHA GitHub Actions

- [Linux #43641402429](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402429) — SUCCESS at this exact SHA; Node 285/285, build PASS, Chrome and Edge A4/PDF/UI/storage regression PASS.
- [Windows #43641402454](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402454) — SUCCESS; Node 284 PASS/1 Windows OS-only SKIP/0 FAIL, desktop 81/81, Electron smoke, NSIS install/launch/uninstall, and 0.1.0→0.1.1 upgrade preserving STEP2 document+PNG.
- [Final blueprint #43641402742](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402742) — SUCCESS.
- All three `head_sha` values are `88c56e4188754f960ae94281b6d68e37b5081b62`.

## Candidate failures

Earlier Windows candidate SHAs `6f471e5db5b4e854641664134e4bac4f524fdea1`, `edb05b288afffcc298826b8917aeb520d65eb2af`, `da79aea2bf1775cae0e95143db703cff61318350`, `0353a9dbe75d9ea6f9254f63a4b2e82988004d8f`, and `440cae43022314684bb5d291107521853c10b3be` failed the P125 Windows unit step and earned 0 points. The latest candidate's test incorrectly denied a valid same-pinned-key receipt; the fixture now tests a receipt signed by an attacker key and proves an IPC-supplied key cannot replace the main-process pin. Only the final exact SHA above is scored.

## Gate and remaining limits

P125 contributes 2 task points, so the verified task sum is 61/100. This does not pass G60: P119–P121 still lack approved supplier artifact and real Windows Tesseract/Electron OCR evidence. G65 also remains unpassed because P123 actual Qwen3 inference is blocked; G70 remains unpassed because P124/P126 acceptance is incomplete. Official buyer acceptance UNASSESSED; RELEASE HOLD.
