# Astra Codex 6 Luna Extra High — isolated worker start

Repository: `hibi89/astra_pdf_redesigner`
Your *only write branch*: `codex/astra-final-ai-sku-20261115`
Review/integration target: `integration/astra-final-blueprint-100-20261115`
Read first: `docs/commercial/ASTRA_PARALLEL_FINAL_64_TO_100_20261115.md` (all final tasks C001–C010 and A01–A12), then `HANDOFF.md` → `STATUS.md` → `AGENTS.md` → `REQUIREMENTS.md` → `docs/ASTRA_ORIGINAL_ROADMAP.txt` → source.

## Start now: C001 / P124

- Confirm `git status`, exact remote branch HEAD and latest source first; no stale clone push. Do not change the user's main/PR#10, existing data, release config, auth, schema, production keys, or Vercel.
- P123 real Qwen3 CPU verified on Ubuntu with 31 synthetic Korean cases and 10 review proposals; `f5751bbb559f268706f2e7bc15438d0a8f590ed9`, not Windows consumer accepted. P124 requires *real local model*, Windows Electron (or separately validated equivalent CPU environment), and BASIC/PRO/BUSINESS × healthy/missing/cancel/tampered+error. At least 10 actual GUI proposals; explicit approve/reject/Undo, protected facts and printed PDF text unchanged if not approved; original STEP1 V1/STEP2 V2 stores intact; no automatic apply.
- Inspect `src/humanize/LocalModelReview.tsx`, `src/step2/Workspace.tsx`, `src/commercial/skuAccess.ts`, `desktop/*`, existing test fixtures and `.github/workflows/*` before editing. Make the minimal scoped code/test changes; don't loosen assertions, falsely count mock outputs, or distribute model weights.
- Use only standard/free GitHub-hosted runners and synthetic PDFs, no customer files, non-GitHub inference, paid services or external CI. If Windows hosted Qwen is infeasible, capture exact reason and choose the safe alternative for user approval, 0 score until the exact acceptance passed.
- Run targeted test/build, then GitHub Ubuntu Chrome+Edge, Windows Electron/NSIS, final policy (and real model run if needed) at exact functionality SHA. Confirm **every required job** conclusion; each task's completion includes PASS/FAIL/SKIP and evidence. Review `docs/evidence/astra/P123/VERIFICATION.md` and `docs/commercial/ASTRA_P114_P126_TASK_REGISTER_20261114.json` to avoid rework.
- Write worker-only `docs/evidence/astra/CODEX_FINAL_WORKLOG.md` and per-task `docs/evidence/astra/C001/VERIFICATION.md`. **Do not edit STATUS.md, HANDOFF.md, central A01–A12 score or GPT's files on your worker branch.** GPT reviewer owns central integration update after merge.
- Open PR from your worker branch to isolated integration branch. No auto-merge; no main/legacy PR merge. After C001, continue independent C003/C005/C006/C007/C009/C010 under the execution master plan; OCR C004 waits on GPT G001 approved supplier. Other final owner acceptance gates remain HOLD.
- Return a compact result `C001 | branch/SHA | changed paths | tests PASS/FAIL/SKIP | concrete verification | unmet gates | next C###`. If blocked, pivot to next independent task; do not repeatedly re-run failed CI without a changed cause.

## Out of scope without owner approval

Production signing/issuer/certificates, customer PDF upload, actual buyer acceptance, OCR unsafe/unsigned redistribution, any paid runner/API, software release, package/public distribution, Kmong registration, overriding original requirements or granting your own final 100.
