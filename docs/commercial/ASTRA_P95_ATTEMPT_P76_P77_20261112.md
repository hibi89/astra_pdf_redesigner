# Astra PDF Redesigner — P76/P77 towards P95 (2026-11-12 KST)

**State:** 85% provisional engineering unchanged, P95 not achieved; BASIC, PRO, BUSINESS release HOLD.

## Two designs and chosen result
1. Path/inode checked rollback after a write failure: fast cleanup, but the output pathname may change between check and delete (TOCTOU). Rejected.
2. Never delete owner output by pathname on a write failure: preserve partial report as HOLD for manual inspection, O_EXCL refuses overwriting previous output. Selected.

## Implemented, without PDF content transfer
- CLI actual PDF.js and browser GUI now compare per-page selected-text multisets in addition to overall counts. Reversed-page synthetic PDF gives zero global text difference but two flagged page-local risks.
- Changed number or swapped-page risk becomes review-required; page-count mismatch is flagged and positional comparison remains unknown. No pixel/semantic/table/ocr fidelity guarantees.
- A second output creation error no longer unlinks the first file, including a file concurrently replaced by another owner writer.
- Added independent regression tests for page swap, output replacement preservation, browser file pair, and page count.

## Verification
- Source SHA 047d48372f4e5c997bf6f24683a90cd05c506873; prior CLI code SHA 702032f0f24a6ebfbc682eab5915fe6766a22a2c. GitHub diff includes only six scoped source/test paths.
- Exact Git blob tokenParity 6a9ebc5c3f08ebca0e567cf0d920803141d0eb46 reconstructed and verified by SHA-1 Git blob hash; Node22.16 Linux 6/6 assertions PASS.
- Whole repository npm test, Vite build, actual Chrome/Edge and Windows installer at final code SHA NOT VERIFIED. Last historical source 3b3c6f73 had Chrome/Edge and hosted Windows workflows fully passing, but is not new source.

## Remaining gates
- Execute whole tests/build and native Windows installer for new exact SHA, then actual browser PDF upload E2E.
- Owner-consented real PDF set (5–10), page-by-page visual and contents review; PRO20 and BUSINESS30 product layouts.
- Licensed redistributable local Korean LLM, remaining STEP6 design, physical Windows buyer, rights/fonts/signing/support/sale approval. Separate explicit approval for external services, OCR, real customer data and release.

No percentage increase or sale GO without those verifications. Existing main, customer source, schema, credentials and live deployment unchanged.
