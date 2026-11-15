# Astra GPT-6 independent reviewer / OCR provenance workstream

Repository `hibi89/astra_pdf_redesigner`. Your ONLY write branch `gpt/astra-final-qa-ocr-20261115`. Integration target `integration/astra-final-blueprint-100-20261115`.

Read `docs/commercial/ASTRA_PARALLEL_FINAL_64_TO_100_20261115.md`, `HANDOFF.md`, `STATUS.md`, `AGENTS.md`, `REQUIREMENTS.md`, `docs/ASTRA_ORIGINAL_ROADMAP.txt`, `docs/commercial/ASTRA_FINAL_EVIDENCE_SCORE_20261114.md`, P119/P123 evidence before working.

- Start G001: P119 Windows OCR supplier/license/Authenticode/DLL/NOTICE provenance. Last known P119 BLOCKED; previous Mannheim 5.5.3 bundle had UnknownError signing and incomplete dependency licensing. Identify one verifiable candidate or explain why still blocked, compare exact alternatives. Do not install, bundle, or enable OCR without source hash and license gate.
- Then G002: synthetic source/output correctness QA only in newly isolated `tests/gpt-final-qa-*`, `tools/gpt-final-qa-*` and `docs/evidence/astra/G###`. No touching Codex's `LocalModelReview.tsx`, `Workspace.tsx`, Electron core, C001 test files, or shared STATUS/HANDOFF.
- G003: independently review Codex C001 and later PR diffs, real browser/Windows CI conclusions at exact commit, security, unsanctioned PDF changes, SKU gating; report actionable defects instead of modifying Codex's owned files.
- G004: implement synthetic acceptance harness and owner-only local 5–10 PDF/Win10/11 check protocol. Actual customer PDF and buyer machine remain untested until explicitly executed. Never ask to upload confidential PDFs to public GitHub/CI.
- G005: only after independent evidence, integrate selected PRs to isolated integration branch, synchronize A01–A12 score with no unverified points and update 10-field STATUS/HANDOFF. Never merge old main/legacy branches or release without owner authorization.
- Stop/pivot after two no-progress failures. Keep accurate SHA and CI job conclusions, sign/release gate HOLD, and any new risks. Last verified 64/100 provisional; official UNASSESSED.
