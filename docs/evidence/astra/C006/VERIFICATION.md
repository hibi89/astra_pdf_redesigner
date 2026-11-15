# C006 — Offline license lifecycle technical prototype

Status: **PARTIAL**. The owner-side signed lifecycle ledger and hostile-input regressions pass on GitHub-hosted Linux and Windows. Production issuer pin, real-user activation, legal refund/support policy and buyer revocation delivery remain **BLOCKED / NOT APPROVED**. C006 earns **+0** and does not authorize sale or release.

- Tested tree SHA: `4e4bfc01aa2543ea03b0674a8fcc8f6f33f50a25`
- Lifecycle source: `fed14c249cf1dee8b046ccd6ed1889777996408cec`
- Lifecycle tests: `0fda0586373541e92172db52bae5973efe173c7d`
- Windows-trigger path update: `4e4bfc01aa2543ea03b0674a8fcc8f6f33f50a25`

## Implementation

Added `src/commercial/offlineLicenseLifecycle.ts`, a pure owner-side replay helper over the existing P96 signed receipt format. It verifies the pinned P-256 public-key thumbprint, signed ordered events, per-event sequence and previous-event hash, event bounds, SKU/seat limits, expiry and monotone renewal. It tracks random opaque installation references with seat caps and release/reassignment, terminal refund/revocation states, and constrained support-case transitions using opaque case references and no free-text fields. Full event history is replayed from the original signed receipt.

The helper is not wired into product UI, persistence or customer activation. `ASTRA_CUSTOMER_BUILD_ENABLED`, `PRODUCTION_ISSUER_JWK`, and `PRODUCTION_ISSUER_THUMBPRINT_SHA256` remain false/null. CI creates disposable keys in memory; no seller key, pin, customer record or real activation is created.

## Exact-SHA verification

- [Linux/Chrome + Edge run 43688579463](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43688579463) — PASS at SHA `4e4bfc01aa2543ea03b0674a8fcc8f6f33f50a25`; npm test 298/298, build and browser suites PASS.
- [Windows Electron/NSIS run 43688579509](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43688579509) — PASS at the same SHA; npm test 297 PASS / 0 FAIL / 1 Windows-only SKIP, desktop verification 87/87, NSIS install/upgrade/uninstall PASS.
- [Blueprint evidence policy 43688579785](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43688579785) — PASS at the same SHA.
- Seven new C006 lifecycle tests passed in both Node test runs. They cover three SKUs and period boundaries, seat caps/release, monotone renewal, refund/revocation, support-state transitions, wrong issuer/pin, tampering, cross-license use, replay, broken sequence/hash chain, event time bounds, event-log size limits, and release-disabled defaults.

The first test attempt failed because a test helper passed the future event timestamp as the signing clock too, so the expected future-time rejection was not exercised. The helper was corrected; the exact final SHA above passed. No product failure is concealed by that test-fixture correction.

## Remaining security and operational limits

- No production issuer key or pin is configured. Its creation, custody, key rotation and final SKU terms require owner authorization; this task does not create them.
- An installation reference is a random logical seat label, not a hardware identity or tamper-resistant device binding.
- Refund/revocation state is only in this owner ledger. The offline buyer app still accepts an otherwise valid unexpired receipt because it receives no authenticated revocation feed; the test explicitly confirms this limitation.
- No offline-state backup/rollback resistance, buyer activation UI, real seller workflow, binding support/refund policy, or physical buyer acceptance is established.
- Official buyer acceptance remains **UNASSESSED**; commercial release remains **RELEASE HOLD**.

## Score

C006 technical prototype: **+0** pending the production/operational conditions above. Candidate total remains **67/100** from the established 64 baseline + C001/P124 +2 + C007 +1. The central score ledger is unchanged for integration-owner review.
