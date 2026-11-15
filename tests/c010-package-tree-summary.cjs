'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const CHUNK_BYTES = 1024 * 1024;
const MAX_SAMPLE_DIFFERENCES = 32;

function sha256File(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const hash = crypto.createHash('sha256');
  const buffer = Buffer.allocUnsafe(CHUNK_BYTES);
  try {
    while (true) {
      const count = fs.readSync(fd, buffer, 0, buffer.length, null);
      if (count === 0) break;
      hash.update(buffer.subarray(0, count));
    }
  } finally {
    fs.closeSync(fd);
  }
  return hash.digest('hex');
}

function metadata(stat) {
  return { mtimeMs: stat.mtimeMs, birthtimeMs: stat.birthtimeMs, mode: stat.mode };
}

function inventoryTree(rootPath) {
  if (typeof rootPath !== 'string' || !rootPath.trim()) throw new TypeError('Pass the package tree root.');
  const root = fs.realpathSync(path.resolve(rootPath));
  if (!fs.statSync(root).isDirectory()) throw new Error('Package tree root is not a directory.');
  const entries = [];

  function walk(directory, relativeDirectory) {
    const children = fs.readdirSync(directory, { withFileTypes: true });
    children.sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
    for (const child of children) {
      const absolutePath = path.join(directory, child.name);
      const relativePath = path.posix.join(relativeDirectory, child.name.split(path.sep).join('/'));
      const stat = fs.lstatSync(absolutePath);
      if (stat.isSymbolicLink()) {
        entries.push({ path: relativePath, kind: 'symlink', ...metadata(stat) });
      } else if (stat.isDirectory()) {
        entries.push({ path: relativePath, kind: 'directory', ...metadata(stat) });
        walk(absolutePath, relativePath);
      } else if (stat.isFile()) {
        entries.push({
          path: relativePath,
          kind: 'file',
          size: stat.size,
          sha256: sha256File(absolutePath),
          ...metadata(stat)
        });
      } else {
        entries.push({ path: relativePath, kind: 'other', ...metadata(stat) });
      }
    }
  }
  walk(root, '');
  return entries;
}

function summarizeInventories(beforeEntries, afterEntries) {
  const before = new Map(beforeEntries.map(entry => [entry.path, entry]));
  const after = new Map(afterEntries.map(entry => [entry.path, entry]));
  const allPaths = Array.from(new Set([...before.keys(), ...after.keys()])).sort();
  const counts = { added: 0, removed: 0, kindChanged: 0, contentChangedFiles: 0, metadataChangedEntries: 0 };
  const differences = [];

  for (const relativePath of allPaths) {
    const oldEntry = before.get(relativePath);
    const newEntry = after.get(relativePath);
    const changes = [];
    if (!oldEntry) {
      counts.added += 1;
      changes.push('added');
    } else if (!newEntry) {
      counts.removed += 1;
      changes.push('removed');
    } else {
      if (oldEntry.kind !== newEntry.kind) {
        counts.kindChanged += 1;
        changes.push('kind');
      }
      if (oldEntry.kind === 'file' && newEntry.kind === 'file' &&
          (oldEntry.size !== newEntry.size || oldEntry.sha256 !== newEntry.sha256)) {
        counts.contentChangedFiles += 1;
        changes.push('content');
      }
      if (['mtimeMs', 'birthtimeMs', 'mode'].some(key => oldEntry[key] !== newEntry[key])) {
        counts.metadataChangedEntries += 1;
        changes.push('metadata');
      }
    }
    if (changes.length > 0 && differences.length < MAX_SAMPLE_DIFFERENCES) {
      differences.push({ path: relativePath, changes });
    }
  }
  return {
    samePayloadTree: counts.added === 0 && counts.removed === 0 && counts.kindChanged === 0 && counts.contentChangedFiles === 0,
    counts,
    sampleDifferences: differences
  };
}

function capture(rootPath, snapshotPath) {
  if (typeof snapshotPath !== 'string' || !snapshotPath.trim()) throw new TypeError('Pass the snapshot output path.');
  const entries = inventoryTree(rootPath);
  fs.writeFileSync(snapshotPath, JSON.stringify({ schema: 'astra-c010-package-tree-v1', entries }), { flag: 'wx' });
  process.stdout.write(JSON.stringify({
    type: 'C010_PACKAGE_TREE_CAPTURE',
    entries: entries.length,
    files: entries.filter(entry => entry.kind === 'file').length
  }) + '\n');
}

function compare(rootPath, snapshotPath) {
  const saved = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  if (saved.schema !== 'astra-c010-package-tree-v1' || !Array.isArray(saved.entries)) {
    throw new Error('Package tree snapshot has an unsupported schema.');
  }
  const current = inventoryTree(rootPath);
  const result = summarizeInventories(saved.entries, current);
  process.stdout.write(JSON.stringify({
    type: 'C010_PACKAGE_TREE_COMPARE',
    beforeEntries: saved.entries.length,
    afterEntries: current.length,
    ...result
  }) + '\n');
}

if (require.main === module) {
  try {
    const [mode, rootPath, snapshotPath] = process.argv.slice(2);
    if (mode === 'capture') capture(rootPath, snapshotPath);
    else if (mode === 'compare') compare(rootPath, snapshotPath);
    else throw new Error('Usage: node c010-package-tree-summary.cjs <capture|compare> <root> <snapshot>');
  } catch (error) {
    process.stderr.write(String(error && error.message ? error.message : error) + '\n');
    process.exitCode = 1;
  }
}

module.exports = { inventoryTree, summarizeInventories };
