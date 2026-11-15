# C002 Verification — Responsive SKU studio viewports

- Date: 2026-11-15
- Branch: `codex/astra-final-ai-sku-20261115`
- Exact tested feature/test SHA: `bd83ac2619a80f940dd628d513a760aee06f0ecb`
- Task: C002 responsive three-SKU studio and A4 preview viewport check
- Result: hosted technical viewport check PASS; score change +0

## Hosted evidence

- [C002 Chrome and Edge mobile viewport workflow, run 43689843233](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843233) — PASS at the exact SHA above.
  - `npm test`: 298 passed, 0 failed.
  - `npm run build`: PASS.
  - Chrome and Microsoft Edge each passed actual 390, 360, and 320 CSS-pixel viewport checks.
  - At each width, document root/body matched viewport width with no horizontal overflow; all four stage controls and the primary PDF button remained visible; editor, preview, A4 page, and style panel stayed inside the viewport.
  - Observed A4 preview widths: 346px at 390px viewport, 316px at 360px, and 276px at 320px.
- [Blueprint evidence policy, run 43689843486](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843486) — PASS.

## Test history and limits

The first run at `e2856f43e1adec7738efccb42a278f3da5cc134a` failed because the test called unsupported CDP method `Emulation.enable`. That call was removed. The subsequent run at `1ff180ed7a8f8bb8b3693cec2c6178636e702203` hung after browser checks because cleanup called `kill()` instead of the helper's `close()`. The cleanup was corrected in the tested SHA above. Neither issue was an application CSS failure.

This verifies the automated responsive viewport conditions only. The existing P116/P117 design and BUSINESS batch evidence is reused; no new buyer visual acceptance or 30-design buyer sign-off is claimed. Official buyer acceptance remains **UNASSESSED**, commercial state remains **RELEASE HOLD**, and C002 adds **+0** pending the required acceptance evidence.

## Next

Proceed to independent task C008. Keep the technical candidate at 67/100 until a separate scoring gate has sufficient acceptance evidence.
