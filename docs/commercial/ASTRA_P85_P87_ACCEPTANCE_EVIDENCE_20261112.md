# ASTRA P85–P87 — Local PDF owner acceptance and CI evidence

**KST date:** 2026-11-12. **Engineering scoreboard:** 85% provisional; 95% target NOT ACHIEVED. **Release:** BASIC/PRO/BUSINESS HOLD; central Astra **[작업중]** remains.

## Work completed on existing feature branch

- **P85** `a048fba6787b8a48399bc65f8cc7ddd5c486a578`: Count PDF.js raster image painting per source/output page, not only global image count. A two-page PDF swapping an image from page 1 to page 2 keeps the same global image count but triggers two page-local risk signals. Implemented in independent CLI and in-browser STEP7; JSON/HTML count-only, no raw content.
- **P86** `ca9fce6670a98f96387a01bd7adae9134064b2ce`: Document-wide extracted-text reading-order warning when lexical multisets match but the token sequence changes, including when real reflow changes page count. Existing same-page order warning remains; this additional signal does **not** claim reconstructed semantic or multi-column order.
- **P87** `0db2acb5185445d342f97062a6962ec52a08a1fe`: Seven checkbox items for local owner visual inspection of source vs output: text, numbers/signs, tables, images, page breaks, Korean typography and clipping. Owner can export checked/un-checked state in local JSON. Check states are ephemeral and reset on source/output file selection or new review, without IndexedDB/schema migration. The JSON always retains `ownerApproval:'NOT_GRANTED'`, `externalTransfer:false`, `manualVisualReview.scope:'LOCAL_VISUAL_CHECK_ONLY_NOT_SALE_APPROVAL'`. Checkboxes do not grant sale, copyright or PDF fidelity certification.

No cloud API, paid model, OCR, licensed font, actual customer PDF, source mutating logic, storage schema, main branch, or release changes.

## Two approaches considered

**A. Broaden persistent V2 schema/theme enum now to deliver PRO20/BUSINESS30 and store model-derived styles:** more throughput toward commercial feature count, but unapproved migration/old-client compatibility and licensing hazards. Not selected without explicit owner scope/design approval.

**B. Keep V2 schema/8 working BASIC designs, strengthen real PDF review and owner acceptance evidence:** zero data migration, no API charges, local-only, tested on existing CI platforms. Selected. Does not satisfy outstanding PRO/BUSINESS layouts or physically verify buyer PDFs.

## Exact GitHub Actions evidence

| Source SHA | Linux/Chrome/Edge | Windows | Result |
|---|---|---|---|
| `a048fba6787b` P85 | [#43242919874](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43242919874) SUCCESS | [#43242919558](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43242919558) SUCCESS | complete |
| `ca9fce6670a9` P86 | [#43243356071](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43243356071) FAILURE: Edge browser startup CDP 60s `DevToolsActivePort` missing, *not an app assertion*; build-and-test job SUCCESS | [#43243355823](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43243355823) SUCCESS | platform flake, not green as a run |
| **`0db2acb51854` P87** | **[#43243819225](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43243819225) SUCCESS 2/2 jobs** | **[#43243819123](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43243819123) SUCCESS 1/1** | **Latest source fully green** |

Latest P87 code in Linux Node22 **150 PASS/0 FAIL/0 SKIP** plus production React TS/Vite build, real Chrome and Edge STEP7 PDF upload/review tests incl owner checkbox / metadata JSON and unchanged V2 / external HTTP0, other existing functionality PASS. Hosted Windows Node22 **149 PASS/0 FAIL/1 SKIP** (symlink test platform gated), desktop **16 PASS**, Electron installed app native PDF, **8/8 distinct actual A4 outputs**, NSIS install/uninstall and synthetic 0.1.0→0.1.1 in-place update preserving original IndexedDB/PNG **PASS**. The installer update number is a CI-only fixture, not a commercial release.

## Limitations and 95% gate

Warning is only a changed-signal, not proof of visual/text equivalence. Layout reflow can legitimately reorder PDF.js extraction text, and equal image operation counts do not imply matching pixels. Manual check states are unverified owner input, not evidence the documents are correct unless actually reviewed.

Product target **95% cannot be certified** until a real owner-consented representative PDF set (5–10 files) is visually reviewed, buyer-owned Windows10/11 is tested, PRO20/BUSINESS30 original layout counts and commercial terms are agreed/verified, and Korean local model/redistribution/font rights and signed installer/support/legal policies are addressed. Explicit owner approval remains necessary for protected model download, data transfer, destructive migration, commercial release or scope reduction.

Leave **[작업중]** on `hibi89/hackathon-command-center-2026@kmong-productization` unchanged until verified 95%, including pause/transfer. No claims of 95% or market-ready sale are permitted.
