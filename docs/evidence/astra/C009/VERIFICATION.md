# C009 Verification — Accessibility, keyboard, and 30-layout print regression

- Date: 2026-11-15
- Branch: `codex/astra-final-ai-sku-20261115`
- Exact feature/test SHA: `6c4c2a806aa2010c6d07f1a7aaaf999e8883caf3`
- PR workflow merge SHA exercised: `2f414fc027f6b533c73458fd22f7935e4f1906ee` (contains the feature SHA and integration base)
- Result: hosted Chrome and Edge regression PASS; score change +0

## What the hosted run verified

- [C009 accessibility and 30-layout PDF print workflow, run 43714391627](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43714391627) — PASS. GitHub executed the PR merge ref above for feature head `6c4c2a806aa2010c6d07f1a7aaaf999e8883caf3`.
- The run passed `npm test`, `npm run build`, the existing Chrome/Edge accessibility-tree and keyboard smoke, and a synthetic-only print matrix in both browsers.
- React rendered all eight base themes and 22 PRO/BUSINESS advanced layouts. Each layout printed a one-page A4 PDF; the test checked synthetic title/body/amount/negation text, absence of studio UI text, and that previewing did not change the saved design.
- Chrome produced 30 unique first-page raster hashes across 30 layouts; Edge independently produced 30 unique first-page raster hashes. Each browser's artifact contains its PDF, raster preview, and machine-readable report.
- The job uploaded 122 synthetic files in artifact [14161831651](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43714391627/artifacts/14161831651), ZIP SHA-256 `19c6901c406243036788a8bb1195e6acb3d29fd19ae3cefe773aff373faf429e`.
- Accessibility smoke: Chrome and Edge each exposed the named navigation, four stage controls and PDF action (14 button nodes); keyboard Tab reached the enabled stage controls and PDF action, and visible focus was confirmed.

## Failure and correction

The first 30-layout attempt at feature SHA `c21c898e5eb4aa0a2a384fb20b93603f45276785` failed at the Editorial title marker because PDF text extraction inserted whitespace. The test normalized extracted text and punctuation before marker checks. The corrected run above passed all layouts in both browsers. The change was limited to test assertions; it did not modify product behavior.

## Scope, score, and remaining acceptance

This is a synthetic hosted browser regression, not buyer visual approval or a complete accessibility audit. It does not establish screen-reader/assistive-technology acceptance, WCAG conformance, large-document resource limits, slow-CPU or low-memory performance, recovery under interruption, or physical-device acceptance. C009 adds **+0**; the worker evidence ceiling stays conditional **67/100**, the central ledger stays **64/100**, buyer acceptance stays **UNASSESSED**, and RELEASE HOLD remains.

## Next

Continue with any C009 large-document, constrained-runtime, and recovery checks that can be measured on standard GitHub-hosted runners. Keep physical assistive-technology and buyer visual acceptance unverified. Do not increase score without the complete acceptance evidence.
