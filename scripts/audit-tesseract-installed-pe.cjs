'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { inspectPeStaticImports, verifyPeImportClosure } = require('../desktop/ocr-pe-import-audit.cjs');
const root = process.argv[2];
if (!root || !fs.statSync(root).isDirectory()) throw new Error('missing-bin-root');
const files = fs.readdirSync(root, { withFileTypes: true });
if (files.some(entry => entry.isSymbolicLink())) throw new Error('symlink-in-bin');
const native = files.filter(entry => entry.isFile() && (entry.name.toLowerCase() === 'tesseract.exe' || /\.dll$/i.test(entry.name)));
const engines = native.filter(entry => entry.name.toLowerCase() === 'tesseract.exe');
if (engines.length !== 1) throw new Error('expected-one-tesseract-engine');
const byName = new Map();
const imports = new Map();
const inventory = [];
for (const entry of native) {
  const full = path.join(root, entry.name);
  const bytes = fs.readFileSync(full);
  const rel = 'bin/' + entry.name;
  const kind = entry.name.toLowerCase() === 'tesseract.exe' ? 'engine' : 'dependency';
  byName.set(rel.toLowerCase(), { kind });
  imports.set(rel, inspectPeStaticImports(bytes));
  inventory.push({ path: entry.name, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), direct: imports.get(rel).direct, delayed: imports.get(rel).delayed });
}
const closure = verifyPeImportClosure(imports, byName);
process.stdout.write(JSON.stringify({ status: 'static-imports-closed', count: inventory.length, closure, files: inventory }, null, 2));
