import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const p124ElectronAcceptance = process.env.ASTRA_P124_ELECTRON_ACCEPTANCE === '1';
type P124TestEntitlements = {
  schema: string;
  issuerPublicJwk: Record<string, unknown>;
  issuerThumbprintSha256: string;
  receipts: Record<string, unknown>;
};
let p124TestEntitlements: P124TestEntitlements | null = null;
if (p124ElectronAcceptance) {
  if (process.env.GITHUB_ACTIONS !== 'true' || !process.env.RUNNER_TEMP ||
      !process.env.ASTRA_P124_ENTITLEMENT_CONFIG) {
    throw new Error('P124 entitlement builds are restricted to GitHub-hosted Actions.');
  }
  const runnerTemp = resolve(process.env.RUNNER_TEMP);
  const entitlementPath = resolve(process.env.ASTRA_P124_ENTITLEMENT_CONFIG);
  if (dirname(entitlementPath) !== runnerTemp ||
      !/^astra-p124-test-entitlements\.json$/i.test(entitlementPath.split(/[\\/]/).at(-1) || '')) {
    throw new Error('P124 entitlement config must be a named file directly under RUNNER_TEMP.');
  }
  const configuredEntitlements = JSON.parse(readFileSync(entitlementPath, 'utf8')) as P124TestEntitlements | null;
  if (!configuredEntitlements || configuredEntitlements.schema !== 'astra-p124-test-entitlements-v1' ||
      !configuredEntitlements.issuerPublicJwk || Object.hasOwn(configuredEntitlements.issuerPublicJwk, 'd') ||
      !/^[0-9a-f]{64}$/.test(configuredEntitlements.issuerThumbprintSha256 || '') ||
      !configuredEntitlements.receipts || ['basic', 'pro', 'business'].some(tier =>
        typeof configuredEntitlements.receipts[tier] !== 'string') ||
      Object.hasOwn(configuredEntitlements, 'privateKey') || Object.hasOwn(configuredEntitlements, 'privateJwk')) {
    throw new Error('P124 entitlement config is incomplete or contains private-key material.');
  }
  p124TestEntitlements = configuredEntitlements;
}

export default defineConfig({
  // Bundle assets relative to the installed Electron app, not the web root.
  base: './',
  plugins: [react()],
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  define: {
    __ASTRA_P124_TEST_ENTITLEMENTS__: JSON.stringify(Boolean(p124TestEntitlements)),
    __ASTRA_P124_TEST_ISSUER_JWK__: JSON.stringify(p124TestEntitlements?.issuerPublicJwk ?? null),
    __ASTRA_P124_TEST_ISSUER_THUMBPRINT_SHA256__: JSON.stringify(p124TestEntitlements?.issuerThumbprintSha256 ?? null),
  },
  ...(p124ElectronAcceptance ? {
    build: {
      rollupOptions: {
        input: {
          app: resolve(root, 'index.html'),
          p124ElectronAcceptance: resolve(root, 'tests/fixtures/p124-electron-qwen3.html'),
        },
      },
    },
  } : {}),
});
