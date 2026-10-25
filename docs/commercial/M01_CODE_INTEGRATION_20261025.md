# M01 first integrated source checkpoint — 2026-10-25

> WIP CODE INTEGRATION — **NOT YET VERIFIED**. GitHub Actions results must be checked against THIS commit HEAD before claiming PASS.

## Source composition
- Base `integration/astra-commercial-core` (starting from commercial docs / main).
- PR3 imported core: `src/step3/*`, `src/step2/{model,useWorkspace,Workspace}.ts[x]`, `src/styles.css`, fixtures and STEP3 unit/browser tests.
- PR4 desktop: `desktop/*`, `electron-builder.yml`, desktop bridge `src/desktopPdf.ts`, legacy `src/App.tsx`, Desktop & Windows tests, Vite config, `.gitignore`.
- Explicit overlap: `src/step2/Workspace.tsx` starts with PR3 importer UI and uses PR4's `savePdfFromEditor()` rather than direct `window.print()`; browser fallback retained.
- Explicit overlap: `package.json` includes both Electron desktop scripts and PDF.js runtime `pdfjs-dist:6.4.299`.
- CI branch selectors allow `integration/astra-commercial-core`; do not mistake 'triggered' for 'PASS'.
- PR3/PR4 historical STATUS/HANDOFF/REQUIREMENTS not overwritten. Source branches/main unchanged.

## Mandatory next checks
1. Linux Actions `npm install` → `npm test` → `npm run build` → actual Chrome/Edge STEP3 import E2E.
2. Windows Actions `npm test` → build → Electron smoke → NSIS installed EXE/STEP2 PDF output. **Newly imported STEP3-to-desktop E2E is not covered by existing PR4 tests**; add to M01/M04.
3. Electron `astra://app` PDF.js worker & native export with 2-page Korean PDF import → saved PDF; verify first/last text, distinct style.
4. Prior STEP1 v1 and STEP2 v2 storage preservation, import cancellation; unsupported PDF warnings.
5. If any type/CI/browser step fails, record exact log and fix before calling M01 DONE.

This composition is the fastest viable vertical slice, NOT product shipment or all 3 SKU implementation.
