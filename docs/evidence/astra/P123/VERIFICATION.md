# P123 — actual Qwen3 4B CPU inference — VERIFIED +3/3

**Date:** 2026-11-15 KST  
**Product branch:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`  
**Exact feature SHA:** [`f5751bbb559f268706f2e7bc15438d0a8f590ed9`](https://github.com/hibi89/astra_pdf_redesigner/commit/f5751bbb559f268706f2e7bc15438d0a8f590ed9)  
**Result:** VERIFIED +3/3; provisional total 61→64/100; A08 4→7/14. Official acceptance remains UNASSESSED; RELEASE HOLD.

## Model provenance and integrity

- Model: `Qwen3-4B-Instruct-2507 Q8_0`, installed as exact Ollama tag `qwen3:4b-instruct`.
- GitHub release source: [`locomotive-works/npu-local-model-running`](https://github.com/locomotive-works/npu-local-model-running), release `v1.0`, pinned source commit [`6bbfd43a548c506734fb8899ed5adee5878a5e4a`](https://github.com/locomotive-works/npu-local-model-running/commit/6bbfd43a548c506734fb8899ed5adee5878a5e4a).
- License file at the pinned revision is Apache-2.0; Git blob SHA `6634c8cc3133b3848ec74b9f275acaaa1ea618ab`. This evidence covers the test artifact's stated license only; no model redistribution or customer build was performed.
- Combined model SHA-256: `eed67be2a8eed4320ff71f3d5b350db10653549281e09b8967b97aeb1f1554ee`.
- Three GGUF parts: `2,013,265,920` bytes / `611f555849d7360ac5157df694b2ca7327a9d69a40612cf86807e765cbfdb75c`; `2,013,265,920` bytes / `4d329adca10c17ab73a64d47a22ffc8163f0f89567459ccb149ef685cf33e87a`; `253,871,776` bytes / `8aa6a472d08a4ba1922eff00e2833cbb36f30ae7b13d98620ff84d8b81862e21`.
- Ollama runtime `v0.40.16` release asset SHA-256: `87bfafb2acbc89b2e6a1be0a9043de6aa75fb450696f86bc426e65fc448f788d`.
- Runner served the model only on `127.0.0.1:11434`, with `OLLAMA_NO_CLOUD=1`. No external inference API or non-GitHub model host was used. Model weights were downloaded only during the hosted workflow and were not added to the repository or product installer.

## Hosted acceptance results

The P123 workflow executed the real model on a GitHub-hosted Ubuntu CPU runner (4 CPU threads, `system_total_ram_bytes=16759439360`, approximately 15.62 GiB) and exercised the production `LocalModelReview.tsx` component in an isolated Chrome harness.

- 31 fixed synthetic Korean cases ran through actual local Qwen3 inference.
- 10 valid proposals were displayed in the review UI; 21 cases were safely rejected or returned errors.
- For all 10 displayed proposals, protected-fact signatures matched for numbers, dates, amounts, names, table rows, negations, quotations, and URLs. Automatic apply count: 0; original text remained unchanged until review.
- Cancellation returned `local-inference-timeout-or-cancelled` in 114 ms, with 0.12 CPU seconds and no automatic apply.
- Valid proposal latency ranged approximately 7.56–9.03 seconds. Error/rejection latency ranged approximately 6.7–10.6 seconds. Sampled Ollama process-tree peak RSS was approximately 4.71 GB. Per-case input/proposal hashes, status, reason, latency, CPU, RSS, and sample counts are in the report artifact.
- Synthetic localStorage V1 and IndexedDB V2 sentinels were unchanged. No customer PDF, real user database, or production browser profile was opened.
- All exact-SHA required Actions were SUCCESS: [actual Qwen3 #43678897970](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897970); [Linux #43678897941](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897941); [Windows #43678897933](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897933); [final policy #43678898126](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678898126).

## Evidence artifact

[Redacted P123 report artifact 14147513507](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897970/artifacts/14147513507)  
Artifact ZIP SHA-256: `d30312476d75175ef24847cbc35672b0b398f13dded94e0b77e8fb31c245b811`.

## Limits and next work

This verifies only the synthetic GitHub-runner P123 conditions. It does not establish Windows buyer-PC performance, customer-data acceptance, 3-SKU production Electron flow, product packaging, or model redistribution rights. P124 is now READY but remains 0 points until its separate actual-model 3-SKU GUI acceptance passes. G55 PASS; G60 remains NOT PASSED because P119–P121 Windows OCR acceptance is blocked; G65 is NOT PASSED at 64/100; G70 is NOT PASSED. Official buyer acceptance UNASSESSED; RELEASE HOLD.
