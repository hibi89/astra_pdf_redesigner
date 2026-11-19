'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { inventoryTree, summarizeInventories } = require('./c010-package-tree-summary.cjs');

test('C010 package tree inventory hashes files and captures package metadata', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'astra-c010-tree-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'resources'));
  fs.writeFileSync(path.join(root, 'resources', 'app.asar'), 'synthetic package bytes');

  const first = inventoryTree(root);
  const second = inventoryTree(root);
  assert.deepEqual(first.map(entry => entry.path), ['resources', 'resources/app.asar']);
  assert.equal(first[1].kind, 'file');
  assert.equal(first[1].sha256.length, 64);
  assert.equal(summarizeInventories(first, second).samePayloadTree, true);
});

test('C010 package tree comparison distinguishes content and metadata changes', () => {
  const before = [
    { path: 'app.asar', kind: 'file', size: 4, sha256: 'before', mtimeMs: 10, birthtimeMs: 5, mode: 33188 }
  ];
  const contentChanged = [
    { path: 'app.asar', kind: 'file', size: 5, sha256: 'after', mtimeMs: 10, birthtimeMs: 5, mode: 33188 }
  ];
  const contentResult = summarizeInventories(before, contentChanged);
  assert.equal(contentResult.samePayloadTree, false);
  assert.equal(contentResult.counts.contentChangedFiles, 1);
  assert.equal(contentResult.counts.metadataChangedEntries, 0);

  const metadataChanged = [
    { path: 'app.asar', kind: 'file', size: 4, sha256: 'before', mtimeMs: 11, birthtimeMs: 5, mode: 33188 }
  ];
  const metadataResult = summarizeInventories(before, metadataChanged);
  assert.equal(metadataResult.samePayloadTree, true);
  assert.equal(metadataResult.counts.contentChangedFiles, 0);
  assert.equal(metadataResult.counts.metadataChangedEntries, 1);
  assert.equal(metadataResult.sampleDifferences[0].changes.includes('metadata'), true);
});

test('C010 package tree comparison reports added and removed entries', () => {
  const result = summarizeInventories(
    [{ path: 'old.dll', kind: 'file', size: 1, sha256: 'a' }],
    [{ path: 'new.dll', kind: 'file', size: 1, sha256: 'b' }]
  );
  assert.equal(result.counts.added, 1);
  assert.equal(result.counts.removed, 1);
  assert.equal(result.samePayloadTree, false);
});
