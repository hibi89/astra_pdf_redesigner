# ASTRA P108 — Owner-side offline signed receipt issuance and monotonic extension

2026-11-14 KST. Dev-only, commercial release is HOLD. This is one technical prerequisite for owner-approved A09 (11/100), NOT completed licensing.

## Architecture options, cost and security

A — **Selected:** Reuse P96 canonical ECDSA P-256 v1 signed receipt, make a pure owner-side signing/extension library that requires an external nonextractable private CryptoKey, a public JWK, and an independently trusted SHA-256 RFC 7638 issuer thumbprint. Zero new runtime dependencies, no network, a clear issuance/verification separation, low maintenance. No operational signing keys are produced, distributed or added to GitHub.

B — **Not selected:** Implement online license activation, server-synchronized seat checkout and revocation. Would allow fresher revocation/seat checks but introduces paid operations, privacy and connectivity dependence, breaches local-first offline design, and requires owner approval.

## Implemented

- src/commercial/offlineLicenseIssuer.ts: issueOfflineLicenseReceipt() accepts operator-selected validated claims and a nonextractable P-256 CryptoKey signer; compares independently pinned public issuer thumbprint, signs exactly the original P96 canonicalLicensePayload and verifies the resulting P1363 64-byte signature with P96 before returning the receipt. Rejects wrong private/public pair, invalid pin, tampering, future-issued or already-expired grants, invalid version/claims.
- extendOfflineLicenseReceipt() verifies the **historic** license signature with its original valid-time timestamp, then permits a new receipt for the same licenseId/tier/productMajor/seat count only when issuedAt and expiresAt strictly advance; no edits to the original. Already-expired historical receipts may pass crypto proof validation; this is a code contract, not a claim of physical buyer validation.
- Draft seat checks: BASIC and PRO one seat only; BUSINESS one or two seats as a prototype, **not** owner-final legal or operational seat terms. A seat count in signed claims is **not physical device binding**.
- The existing application has no actual seller signing key or pinned production public issuer key: PRODUCTION_ISSUER_JWK=null, PRODUCTION_ISSUER_THUMBPRINT_SHA256=null. test keys are generated transiently in memory only. No creation of vendor credentials or communication with customer systems. This module has no GUI or caller in the shipped app.

## Eight synthetic automated regressions

Tests generate a disposable P-256 signer, reimport it nonextractably, and cover three SKU receipt roundtrips, publisher/private/public mismatch, draft seat ceiling, future/expired/malformed claims, monotonic renewal, rollback/tier/seat/ID forgery, cross-signer/tampered prior proof and perpetual no-op rejection, and no production activation.

## Threat limitations and follow-ups

- A newly issued receipt does **not** invalidate an old unexpired receipt when devices are offline; signatures alone cannot enforce refunds, revocation, lost keys, concurrency, replay or seat occupancy. A separately authenticated revocation/rollback protocol (and human refund/reissue policy) is required.
- This pure signing API intentionally lacks a real-owner key provisioning process or customer license issuance UI. Private keys must never be committed, embedded in renderer apps, CI logs or shared with ChatGPT.
- Operational deployment must be decided and accepted, with signed seller key provenance, key rotation, Windows10/11 user tests, buyer refund/seat terms, guarded GUI and export entry points, and explicit release approval. No real license receipt or customer data was created.
- Source PDF V1/V2 IndexedDB/previous design assets and UI remain unchanged. OCR_MANIFEST=null; native Tesseract and Korean local LLM redistribution/quality are unverified; no Kmong listing or Vercel production.

## CI tracking

Function SHA 0bf9c7bb125b25b3441117a6e54ba53ac05cba67.
- Linux Chrome/Edge: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747520
- Windows Electron NSIS: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747579
- Final blueprint policy: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747799

At this initial document commit, policy SUCCESS and main Linux/Windows npm test/build steps PASS, complete browser+installer workflows still running. Only exact SHA final logs may upgrade this conclusion.
