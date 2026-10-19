# Personal Windows acceptance profile (2026-10-19)

## Scope
Use only the `codex/p5-windows-reliability` branch. This is an opt-in personal test, **not** the installed user's profile or the CI smoke mode.

## Run
1. Close any running ASTRA Electron windows.
2. Pull the branch with `git pull --ff-only origin codex/p5-windows-reliability`.
3. Run `npm run desktop:test`, then `npm run desktop:personal-test`.
4. Confirm the terminal prints `ASTRA PERSONAL TEST userData:` ending in `astra-p5-personal-test-profile`, **not** `AstraPDFRedesigner` under AppData.
5. In this disposable profile only, create a synthetic Korean document, insert a synthetic image, wait for saved state, close and reopen with the same command, and verify both survive.
6. Export to a manually chosen test-only PDF file and visually check A4 pagination, Korean last paragraph, and image. Export/import a synthetic `.localdoc.json` backup if the UI supports it.
7. Record observed outcomes. Do not mark these steps PASS until actually completed.

## Safety
The test profile is a stable directory under the OS temp root so reopening can verify persistence. It is **not automatically deleted**; never place real personal documents there. The `--astra-personal-test` flag is mutually exclusive with `--astra-desktop-smoke`. The regular `npm run desktop:run` command still uses the standard profile. A single-instance Electron lock may redirect a second launch to an existing window, so close the first window before switching profiles. No code-signing, STEP3 import, main merge, or installed-app changes are part of this acceptance.

## Verification status
- Windows regular desktop launch: observed by user, UI screenshot received.
- Windows isolated personal profile startup: **NOT YET VERIFIED**.
- Synthetic save/reopen, PDF visual inspection, backup import: **NOT YET VERIFIED**.
- Added source-level regression tests: committed; execution **NOT YET VERIFIED**.
