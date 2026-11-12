# ASTRA P78 — Same-page text order risk / P95 continuation

**Date:** 2026-11-12 KST  
**Goal:** 95% final-product engineering; **actual verified status: 85% provisional, P95 unmet, sale/release HOLD.**

## Problem reproduced
Previously, token multisets were compared for the entire PDF and again by page. An output PDF whose page-1 table labels A/B were exchanged retained identical global and same-page token counts; both checks returned zero risk. This is a potential semantic/layout issue, not proof of content loss.

## Designs compared
- **Pixel/layout certification:** complex, expensive, frequently misleading for font substitutions and different layouts; needs real documents/OCR and extra approval; not used.
- **Ordered extracted tokens with multiset guard:** O(N) over bounded selected text, returns only a page-count risk, no names/text/paths in JSON/HTML. Flags where tokens are the same but extraction order differs. Selected as an advisory check, never a fidelity certification.

## Implementation
- `src/step7/tokenParity.ts`: `countPdfPerPageOrderRisks` returns null on different page counts and count of pages whose ordered tokens differ while their bags are the same.
- `scripts/owner-pdf-source-output-review.mjs`: same analysis on PDF.js parsed pages, `per_page_order_risk_pages` plus `PER_PAGE_TEXT_ORDER_DIFFERENCES_REVIEW_REQUIRED`, and Korean HTML row.
- `src/step7/OfflinePdfReview.tsx`: same local browser warning and count on GUI; input project and IndexedDB V2 remain unchanged.
- Test coverage: order shift with same multiset; content change not miscounted as order-only; page count mismatch null; 51-page guard; full PDF synthetic table A/B replacement; browser file-pair output warning.

## Evidence and limits
- Code SHA: `071978729197c671f2a41b0e1ce6ad838ce24f8b`; six changed source/test paths in GitHub compare.
- Exact Git blob SHA `f249d24dcaad06d9050e3ab470c39c96707074d1` independently verified locally, TypeScript tsc PASS, five targeted Node22 regression tests PASS; 300 deterministic cases and 300k tokens stress PASS.
- Whole original npm/build/PDF.js browser and Windows NSIS on new SHA **NOT VERIFIED**. GitHub connector commit status empty; older full CI belongs to prior P75 SHA only.
- Token extraction order is not equivalent to reading order or semantics. False positives from legitimate reflow remain possible. Scan/OCR, vector tables, flattened images, font license, actual customer documents and PRO/BUSINESS layout expectations remain untested/unmet.

## Next gate
Run full exact-SHA regression and browser/Windows CI; independently check output PDF page-by-page against consented real customer fixtures; then handle gated licensing, physical buyer PC, product design variants, support and explicit release approval. Preserve **[작업중]** in hub until P95 is *verified*. Never silently delete marker on chat end or pause.
