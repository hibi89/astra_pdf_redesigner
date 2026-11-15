# G003 independent C002 mobile responsive acceptance review — 2026-11-15 KST

## Exact reviewed source and run
- Codex test SHA `bd83ac2619a80f940dd628d513a760aee06f0ecb`; working branch `codex/astra-final-ai-sku-20261115`, Draft PR [#13](https://github.com/hibi89/astra_pdf_redesigner/pull/13) **unmerged**.
- Source `tests/c002-mobile-layout-browser.mjs` uses Chrome DevTools `Emulation.setDeviceMetricsOverride`, real product React studio and A4 preview at **390/360/320 CSS px**, two browser engines, no mocked DOM. The test asserts the actual root/body widths match the viewport, editor/paper/style bounding boxes have positive widths, 4 stage controls and primary PDF action remain inside screen; CSS flex column stacking is checked.
- [Exact C002 workflow #43689843233](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843233) **SUCCESS**, one Chrome/Edge job. Inspected job `132737974726` logs: npm **298/298 PASS / 0 FAIL / 0 SKIP**, build PASS, Chrome & Edge each print independent PASS at all three widths:
  - 390px viewport: root/body 390, actual A4 page preview 346px wide, four stage controls and 140.90625×43px PDF action.
  - 360px: root/body 360, page preview 316px.
  - 320px: root/body 320, page preview 276px.
- [Blueprint policy #43689843486](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689843486) **SUCCESS**.
- Historical C002 initial SHA `e2856f...` [#43689397268](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43689397268) **FAIL** from unsupported CDP `Emulation.enable`, not a proven CSS product defect. Later `1ff180...` browser cleanup hung; current SHA replaced cleanup with actual browser helper `close()`. Both historical runs superseded by exact `bd83ac...` PASS.

## Independent limits and decision
- This is a UI layout **synthetic-hosted browser test**, not touch input, accessibility, all phones, paid SKU entitlement or final buyer visual acceptance. Testing `mobile:true` CDP environment does not authenticate Android/iPhone device touch, platform font differences, 30-design buyer signoff, performance under large customer PDF or real Windows installer.
- Current checked C002 source adds a browser regression test and CI, not a new user-facing responsive CSS feature. The current product already stacks panels at small widths. Therefore C002 **technical responsive test PASS / A02 additional score +0**, central 64/100 and `RELEASE HOLD` remain.
- Other Codex C001 production 3-SKU entitlement and ASAR isolation, C005 8-GiB real model, C006 offline license customer revocation and C007 physical buyer Windows remain separate. Do not merge all of PR #13 merely because C002 tests pass.

## Next
Continue source/output glyph risk isolation (G002 PDF.js vs Poppler) and review Codex incremental C008/C009/C010 only at exact finished SHAs. Do not alter seller keys, product customer files, package/signing or production activation.
