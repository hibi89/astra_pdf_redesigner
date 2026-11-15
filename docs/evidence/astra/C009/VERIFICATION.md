# C009 Verification — Keyboard navigation and accessibility tree

- Date: 2026-11-15
- Branch: `codex/astra-final-ai-sku-20261115`
- Exact code/test SHA: `fa57116544217c6122b1cd9643fee91002f45edc`
- Result: hosted browser accessibility smoke PASS; score change +0

## Exact-SHA hosted evidence

- [Chrome and Edge AX-tree/keyboard workflow, run 43690873135](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873135) — PASS at the exact SHA.
  - `npm test`: 298 passed, 0 failed; `npm run build`: PASS.
  - Chrome and Edge accessibility trees each exposed the named navigation and all four stage-control names plus the primary PDF action (14 button nodes observed).
  - Keyboard-only Tab navigation reached the enabled PDF import/design stage controls and primary PDF action; the stage focus indicator was visible.
- [Blueprint evidence policy, run 43690873420](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43690873420) — PASS.

## Scope limits and score

The first attempt at `f469d0c9e031151851d803eee0db7e438b144cb0` failed because the test looked for the header PDF action inside the main studio node. The selector was corrected; the passing run above checks the actual header location. This was test-only; no product code changed.

This smoke is a narrow Chromium accessibility-tree and keyboard-focus check. It is not a screen-reader certification or a complete WCAG audit. The hosted run does not establish physical assistive-technology acceptance, low-memory/slow-CPU performance, large-document resource limits, or owner visual acceptance. C009 adds **+0**; technical candidate remains **67/100**, buyer acceptance **UNASSESSED**, RELEASE HOLD.

## Next

C010 unsigned package candidate and SBOM audit is running on GitHub Actions; retain unsigned/no-publish settings and report all package and license limitations.
