'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { auditIntermediates } = require('./c010-nsis-intermediate-audit.cjs');

test('C010 hashes and copies the generated NSIS archive and uninstaller to runner temp', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'astra-c010-nsis-audit-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const archivePath = path.join(root, 'astra.nsis.7z');
  const uninstallerPath = path.join(root, 'astra.__uninstaller.exe');
  fs.writeFileSync(archivePath, Buffer.from('synthetic archive bytes'));
  fs.writeFileSync(uninstallerPath, Buffer.from('synthetic uninstaller bytes'));

  const report = auditIntermediates(archivePath, uninstallerPath, {
    RUNNER_TEMP: root,
    ASTRA_C010_AUDIT_LABEL: 'first'
  });
  const output = path.join(root, 'astra-c010-nsis-intermediates', 'first');
  assert.equal(report.type, 'C010_NSIS_INTERMEDIATES');
  assert.equal(report.appArchive.bytes, fs.statSync(archivePath).size);
  assert.equal(report.uninstaller.bytes, fs.statSync(uninstallerPath).size);
  assert.match(report.appArchive.sha256, /^[a-f0-9]{64}$/);
  assert.match(report.uninstaller.sha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(fs.readFileSync(path.join(output, report.appArchive.copy)), fs.readFileSync(archivePath));
  assert.deepEqual(fs.readFileSync(path.join(output, report.uninstaller.copy)), fs.readFileSync(uninstallerPath));
  assert.equal(JSON.parse(fs.readFileSync(path.join(output, 'summary.json'), 'utf8')).label, 'first');
});

test('C010 rejects an invalid intermediate capture label', () => {
  assert.throws(
    () => auditIntermediates('unused.7z', 'unused.exe', {
      RUNNER_TEMP: os.tmpdir(),
      ASTRA_C010_AUDIT_LABEL: '../escape'
    }),
    /must be first or second/
  );
});
