# P123 — actual Qwen3 4B CPU inference — BLOCKED, 0/3

**Date:** 2026-11-15 KST  
**Product branch:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`  
**Product source SHA:** [`b6d7909e6897578181dbd304ff12491760422530`](https://github.com/hibi89/astra_pdf_redesigner/commit/b6d7909e6897578181dbd304ff12491760422530); branch/doc head during this source audit: [`511161c9c2f7f35c484915b9f137f875e88a8890`](https://github.com/hibi89/astra_pdf_redesigner/commit/511161c9c2f7f35c484915b9f137f875e88a8890)  
**Score:** 0/3; provisional total remains 61/100; A08 remains 4/14. Official acceptance UNASSESSED; RELEASE HOLD.

## Official GitHub source audit

- The official [QwenLM/Qwen3 repository](https://github.com/QwenLM/Qwen3), main snapshot [`7a2f61ffc7a20d47efcd2bf97f6f2bf52729042e`](https://github.com/QwenLM/Qwen3/commit/7a2f61ffc7a20d47efcd2bf97f6f2bf52729042e), contains source, documentation, and a technical report; its root has no model-weight files.
- The official [GitHub Releases API](https://api.github.com/repos/QwenLM/Qwen3/releases?per_page=10) returned zero releases. The commit-pinned [README](https://github.com/QwenLM/Qwen3/blob/7a2f61ffc7a20d47efcd2bf97f6f2bf52729042e/README.md) directs checkpoint retrieval to Hugging Face or ModelScope, outside the GitHub-only rule.
- A GitHub repository search found [`Dadhichi-Sarker-Shayon/model-qwen3-4b-q4-k-m-gguf`](https://github.com/Dadhichi-Sarker-Shayon/model-qwen3-4b-q4-k-m-gguf) at pinned main commit [`38a5c001fbdaf3485f98ba4d51d09ebd82f06547`](https://github.com/Dadhichi-Sarker-Shayon/model-qwen3-4b-q4-k-m-gguf/commit/38a5c001fbdaf3485f98ba4d51d09ebd82f06547). It is 55 KB, has no repository license metadata, no GitHub releases/assets, and contains only a README, conversion notebook, Modelfile, reproduction metadata, checksums, and images. Its README explicitly states the GGUF binaries are hosted on Hugging Face and the GitHub repository contains the conversion pipeline and checksums. The listed SHA-256 values identify binaries that are not available from this GitHub repo. They cannot satisfy the present GitHub-only requirement.
- Repository search also found code/docs for Qwen3 but no exact Qwen3 4B checkpoint in a GitHub release or file tree. Adjacent Qwen3.5 or Qwen3-VL repositories are different models and are not substitutes.

## Acceptance not performed

No model binary was downloaded. No external model host, local PC, or inference API was used. There is no GitHub-accessible exact 4B artifact/license mapping, so no native or loopback inference, CPU/RAM/latency/OOM measurement, fixed 30-plus Korean paragraph evaluation, five valid review proposals, or actual-inference V1/V2 immutability evidence exists. P122 mock/static evidence is not counted again.

**Result:** P123 BLOCKED, +0. No smaller model, mock API, Qwen3.5, or Qwen3-VL was substituted. Resume only when an approved GitHub-accessible Qwen3 4B artifact with exact hash/license evidence and an allowed free CPU runner is available.
