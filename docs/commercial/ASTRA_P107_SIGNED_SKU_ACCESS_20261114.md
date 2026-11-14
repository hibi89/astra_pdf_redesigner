# ASTRA P107 — Offline signed SKU feature authorization (RELEASE HOLD)

Date: 2026-11-14 KST. Part of owner-final A09 (11 points of 100); not A09 acceptance, seller entitlement activation, or commercial release.

## Comparison

A: Keep P96's independently verified ECDSA P-256 offline receipt, then require a trusted build-pinned public JWK RFC7638 SHA-256 thumbprint before authorizing each capability. No new package, network, SaaS, telemetry, private key, API cost. Implemented as an unconnected policy module.

B: Grant capability by visible tier string or editable localStorage/JSON data. Low implementation cost but trivially forgeable. Rejected.

## Implemented policy (noncommercial prototype is unchanged)

The signed receipt must pass its schema, issuer public key import, ECDSA signature and issue/expiry checks. The issuer JWK must match an explicitly supplied SHA-256 thumbprint. An unconfigured production issuer JWK/pin is null and cannot unlock any commercial feature. Tests use an ephemeral generated key but no real seller key or private key is committed.

Capability matrix:
- BASIC: base-layout.
- PRO: base-layout, pro-layout, template-save, batch-pdf.
- BUSINESS: all PRO features, business-layout and brand-kit.

Each decision carries commercialReleaseApproved=false. The policy does not grant local AI runtime readiness, actual product publication, seats enforcement or device activation. It is deliberately not wired into Workspace until a genuine seller public key is pinned, licensing/renewal/revocation policy is approved, UI entry points and export paths are guarded, and customer data rollback is tested.

## Tests

Added tests/sku-access.test.ts (7 test cases):
- Actual ephemeral WebCrypto signed BASIC, PRO and BUSINESS receipts and all six actions.
- Production no-pinned-key fail-closed for all actions.
- Mismatched issuer thumbprint.
- Missing/malformed pins and private-key-in-JWK rejection.
- Altered tier, expired, future-dated and wrong-signer receipts.
- Arbitrary capability values rejected.
- Stable RFC7638 thumbprint of public key only.

The test suite covers authorization logic only. It does not verify issuance, device seats, consumer GUI enforcement, seller key trust, key rotation, refunds or physical Windows deployment.

## CI exact SHA

Code SHA 0d3501d0cf51f3b5e87370f6a973fbb01d72e697.
Linux/Chrome/Edge: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817449
Windows/NSIS: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817441
Final-blueprint policy: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817679

At first documentation commit, exact SHA policy SUCCESS; Linux/Windows unit and build steps passed but whole browser/installer CI still in progress. Update only after exact SHA verified.

## Release boundary

Full final score UNASSESSED; P107 does not prove 100% or A09 11 points. OCR_MANIFEST=null, native Tesseract and Korean CPU local AI models not approved for resale. Existing owner PDF, localStorage V1, IndexedDB V2, main and Draft PR10 unchanged. No external transfer, vendor key or private key, product registration, sale or Vercel production deployment.
