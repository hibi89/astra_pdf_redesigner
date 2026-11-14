# P123 — actual Qwen3 CPU inference — BLOCKED, 0/3

**Date:** 2026-11-15 KST  
**Product branch:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`  
**Current code head during audit:** `440cae43022314684bb5d291107521853c10b3be` (P125 verification pending)  
**Score:** 0/3; provisional total remains 59/100; A08 remains 4/14.

## GitHub-only source audit

- Official [QwenLM/Qwen3 repository](https://github.com/QwenLM/Qwen3), main snapshot [`7a2f61ffc7a20d47efcd2bf97f6f2bf52729042e`](https://github.com/QwenLM/Qwen3/commit/7a2f61ffc7a20d47efcd2bf97f6f2bf52729042e) contains source, documentation, and a technical report. The GitHub contents API at the root does not list model-weight files.
- The official repository's [GitHub Releases API](https://api.github.com/repos/QwenLM/Qwen3/releases?per_page=10) returned an empty release list; there is no official GitHub-hosted 4B model asset to pin.
- The commit-pinned [official README](https://github.com/QwenLM/Qwen3/blob/7a2f61ffc7a20d47efcd2bf97f6f2bf52729042e/README.md) directs model checkpoint downloads to Hugging Face or ModelScope. It states open-weight models use Apache 2.0 while model-specific license files are in the Hugging Face model repositories. Fetching either model host would violate this user's GitHub-only rule; the user's PC is not an allowed test environment.
- GitHub search results did not establish an official, rights-verified GitHub asset for the exact Qwen3 4B instruct model. No third-party rehost was trusted or downloaded.

## Acceptance not performed

No exact model artifact SHA-256 or artifact-specific license file/redistribution mapping was available from GitHub. No model was downloaded or installed. No real Qwen3 4B native/loopback inference ran, and there are no CPU/RAM/latency/OOM measurements, 30-plus fixed Korean paragraph observations, five valid proposals, or V1/V2 immutability evidence from actual inference. P122 mock/static evidence is not counted again.

**Result:** P123 BLOCKED, +0; no mock API or smaller model was substituted. The block can be revisited when an approved GitHub-hosted model artifact with exact hash/license evidence and an allowed free CPU runner exists.
