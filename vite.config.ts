import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const p124ElectronAcceptance = process.env.ASTRA_P124_ELECTRON_ACCEPTANCE === '1';

export default defineConfig({
  // Bundle assets relative to the installed Electron app, not the web root.
  base: './',
  plugins: [react()],
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
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
