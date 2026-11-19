# P124 verification status

**Current status:** PASS for the synthetic GitHub-hosted Windows Electron scope at exact feature/test SHA `09b2d9c8f60631bb2f623f840bdde03450ed9e17`. This replaces the earlier blocked report and prior P124 status at `a2ca668c9578b68e760b922c026a5f2f8f941c8d`.

The exact-SHA Windows run [43700294401](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294401) exercised actual Root → Workspace → CommercialLicensePanel → runSkuGatedAction → LocalModelReview in BASIC, PRO, and BUSINESS using ephemeral signed test receipts. Real Qwen3-4B-Instruct-2507 Q8_0 CPU inference completed 10 guarded proposals per SKU. Model-missing and forged-response scenarios passed for each SKU; the healthy run preserved per-layout PDF text, synthetic V1/V2 sentinels, and product V1/V2 content/assets, with zero automatic applies.

- Linux/Chrome and Edge: [run 43700294427](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294427) — PASS.
- C007 Windows NSIS install/upgrade and STEP2 persistence: [run 43700294405](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294405) — PASS.
- C010 unsigned package/SBOM/ASAR test-harness exclusion: [run 43700294393](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294393) — PASS.
- Blueprint evidence policy: [run 43700294719](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43700294719) — PASS.

Detailed per-SKU results, exact model/runtime hashes, PDF hashes, report artifact, independent-review limit, and release boundaries are recorded in [C001/VERIFICATION.md](../C001/VERIFICATION.md).

The prior G003-F01 finding accurately described the old harness pinned at `6e8b2eeb381874a12be041fa080fb545b5e1fb82`; it is addressed by the actual product-path test at the new SHA. Independent GPT review of this exact SHA remains pending. Production issuer keys and sale activation remain disabled, buyer acceptance remains UNASSESSED, the central score ledger remains unchanged, and RELEASE HOLD remains.
