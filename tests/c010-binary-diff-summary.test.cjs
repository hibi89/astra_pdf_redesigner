'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { compareFiles, readPeTimestamp } = require('./c010-binary-diff-summary.cjs');

function makeTempFiles(run) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'astra-c010-binary-diff-'));
  try {
    run(directory);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function makePe(timestamp) {
  const bytes = Buffer.alloc(192);
  bytes.write('MZ', 0, 'ascii');
  bytes.writeUInt32LE(0x80, 0x3c);
  bytes.write('PE\0\0', 0x80, 'binary');
  bytes.writeUInt32LE(timestamp, 0x88);
  bytes.write('fixture', 0xa8, 'ascii');
  return bytes;
}

test('C010 binary comparator reports byte-identical candidates and equal PE timestamps', () => {
  makeTempFiles(directory => {
    const first = path.join(directory, 'first.exe');
    const second = path.join(directory, 'second.exe');
    fs.writeFileSync(first, makePe(0x12345678));
    fs.writeFileSync(second, makePe(0x12345678));
    assert.deepEqual(compareFiles(first, second), {
      sameBytes: true,
      firstBytes: 192,
      secondBytes: 192,
      differingByteCount: 0,
      differingRangeCount: 0,
      firstDifferingOffsets: [],
      firstDifferingRanges: [],
      peTimestamp: { first: 0x12345678, second: 0x12345678, equal: true }
    });
  });
});

test('C010 binary comparator reports bounded byte offsets and PE timestamps without byte contents', () => {
  makeTempFiles(directory => {
    const first = path.join(directory, 'first.exe');
    const second = path.join(directory, 'second.exe');
    fs.writeFileSync(first, makePe(0x12345678));
    const changed = makePe(0x12345679);
    changed[0xaa] = 0x42;
    fs.writeFileSync(second, changed);
    const result = compareFiles(first, second);
    assert.equal(result.sameBytes, false);
    assert.equal(result.differingByteCount, 2);
    assert.equal(result.differingRangeCount, 2);
    assert.deepEqual(result.firstDifferingOffsets, [0x8b, 0xaa]);
    assert.deepEqual(result.firstDifferingRanges, [{ start: 0x8b, end: 0x8b }, { start: 0xaa, end: 0xaa }]);
    assert.deepEqual(result.peTimestamp, { first: 0x12345678, second: 0x12345679, equal: false });
    assert.equal(JSON.stringify(result).includes('fixture'), false);
  });
});

test('C010 binary comparator counts unmatched trailing bytes when file sizes differ', () => {
  makeTempFiles(directory => {
    const first = path.join(directory, 'first.exe');
    const second = path.join(directory, 'second.exe');
    fs.writeFileSync(first, Buffer.from([1, 2, 3]));
    fs.writeFileSync(second, Buffer.from([1, 2, 3, 4, 5]));
    const result = compareFiles(first, second);
    assert.equal(result.sameBytes, false);
    assert.equal(result.differingByteCount, 2);
    assert.deepEqual(result.firstDifferingOffsets, [3]);
    assert.deepEqual(result.firstDifferingRanges, [{ start: 3, end: 4 }]);
    assert.equal(readPeTimestamp(first), null);
  });
});

test('C010 binary comparator handles short non-PE inputs without interpreting them as executables', () => {
  makeTempFiles(directory => {
    const file = path.join(directory, 'short.bin');
    fs.writeFileSync(file, Buffer.from('no'));
    assert.equal(readPeTimestamp(file), null);
  });
});
