# G003 independent P124 Windows Qwen3 artifact audit

**Date:** 2026-11-15 KST. **Codex exact tested functionality SHA** `a2ca668c9578b68e760b922c026a5f2f8f941c8d`. **Source:** GitHub Actions [Windows #43684225170](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43684225170), [synthetic report artifact #14149509892](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43684225170/artifacts/14149509892).

Independently downloaded artifact ZIP; **SHA-256** `4bdc85bb367c2165beaefdfeaa187c79607e98eb52267b073a0187044cb7e91b` exactly matches the signed workflow's reported archive hash. Opened only the three synthetic JSON reports without extracting unknown binaries. No customer's files, PDF contents, names or product credentials processed.

| Test context | Real Qwen3 inference attempts | Valid visible proposals | Distinct `input_sha256` | Distinct `proposal_sha256` | Undo / reject / cancel |
|---|---:|---:|---:|---:|---|
| BASIC | 10 | 10 | **1** | **1** | 1 / 9 / 1 |
| PRO | 10 | 10 | **1** | **1** | 1 / 9 / 1 |
| BUSINESS | 10 | 10 | **1** | **1** | 1 / 9 / 1 |

The healthy/missing/tampered reports each say `PASS`. `healthy` reports untouched V1/V2 storage, zero auto-apply and PDF extracted text equality. GitHub Actions job steps also prove successful Windows Electron, pinned Ollama/Qwen3 loopback and an **unsigned production NSIS candidate / packaged smoke**. These are **legitimate positive repeated-call acceptance tests**.

**Critical qualification:** The C001 task register calls for at least **10 selected paragraphs per SKU**. The exact report proves ten calls using **one source paragraph and one resulting proposal**, replayed ten times in each test-only SKU context. It does not demonstrate 10 distinct selected paragraphs, diverse Korean prose quality, production seller entitlement, or the actual BUSINESS layout flow. The worker's `C001/VERIFICATION.md` discloses repeated-source behavior, so score +2 remains a candidate pending independent acceptance decision, **not automatically 66/100**.

In `tests/fixtures/p124-electron-qwen3.jsx`, SKU is a synthetic local selector; the real `CommercialLicensePanel`/SKU entitlement is not covered by this test. `desktop/main.cjs` statically requires `desktop/p124-electron-qwen3-acceptance.cjs`, and `electron-builder.yml` includes `desktop/**`; absence of Vite test HTML does **not** independently prove ASAR test code exclusion. Do not infer production package isolation from this artifact. F01/F02/F04 remain review items in [Codex PR #13](https://github.com/hibi89/astra_pdf_redesigner/pull/13).

**Independent verdict:** `HOSTED_REPEATED_GUI_INTERACTION_VERIFIED`; `DIVERSE_SELECTED_PARAGRAPHS_NOT_VERIFIED`; `ACTUAL_PRODUCT_SKU_ENTITLEMENT_NOT_VERIFIED`; `ASAR_TEST_HARNESS_EXCLUSION_NOT_VERIFIED`. **Score delta +0 for this review**, 64/100 central provisional score maintained, official buyer acceptance `UNASSESSED`, `RELEASE HOLD`.

Follow-up: Codex should supply ≥10 distinct `input_sha256` values per SKU on verified synthetic case coverage or obtain explicit scoped owner acceptance for repeated-call evidence, plus actual entitlement/UI and package inspection. Do not rerun unchanged expensive Qwen3 fixture merely to duplicate these identical hashes.
