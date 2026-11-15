'use strict';

const fs = require('node:fs');

const CHUNK_SIZE = 1024 * 1024;
const MAX_RECORDED_RANGES = 32;
const MAX_RECORDED_OFFSETS = 16;

function readPeTimestamp(filePath) {
  const fd = fs.openSync(filePath, 'r');
  try {
    const fileSize = fs.fstatSync(fd).size;
    if (fileSize < 64) return null;
    const dosHeader = Buffer.alloc(64);
    if (fs.readSync(fd, dosHeader, 0, dosHeader.length, 0) !== dosHeader.length) return null;
    if (dosHeader.readUInt16LE(0) !== 0x5a4d) return null;
    const peOffset = dosHeader.readUInt32LE(0x3c);
    if (!Number.isSafeInteger(peOffset) || peOffset < 64 || peOffset + 12 > fileSize) return null;
    const signatureAndCoff = Buffer.alloc(12);
    if (fs.readSync(fd, signatureAndCoff, 0, signatureAndCoff.length, peOffset) !== signatureAndCoff.length) return null;
    if (signatureAndCoff.readUInt32LE(0) !== 0x00004550) return null;
    return signatureAndCoff.readUInt32LE(8);
  } finally {
    fs.closeSync(fd);
  }
}

function compareFiles(firstPath, secondPath) {
  const firstSize = fs.statSync(firstPath).size;
  const secondSize = fs.statSync(secondPath).size;
  const firstFd = fs.openSync(firstPath, 'r');
  const secondFd = fs.openSync(secondPath, 'r');
  const firstBuffer = Buffer.allocUnsafe(CHUNK_SIZE);
  const secondBuffer = Buffer.allocUnsafe(CHUNK_SIZE);
  const commonSize = Math.min(firstSize, secondSize);
  let differingByteCount = 0;
  let differingRangeCount = 0;
  let activeRange = null;
  const firstDifferingOffsets = [];
  const firstDifferingRanges = [];

  function markDifference(offset) {
    differingByteCount += 1;
    if (firstDifferingOffsets.length < MAX_RECORDED_OFFSETS) firstDifferingOffsets.push(offset);
    if (activeRange === null || activeRange.end + 1 !== offset) {
      differingRangeCount += 1;
      activeRange = { start: offset, end: offset };
      if (firstDifferingRanges.length < MAX_RECORDED_RANGES) firstDifferingRanges.push(activeRange);
    } else {
      activeRange.end = offset;
    }
  }

  try {
    for (let offset = 0; offset < commonSize;) {
      const length = Math.min(CHUNK_SIZE, commonSize - offset);
      const firstRead = fs.readSync(firstFd, firstBuffer, 0, length, offset);
      const secondRead = fs.readSync(secondFd, secondBuffer, 0, length, offset);
      if (firstRead !== length || secondRead !== length) throw new Error('Unexpected short read during binary comparison.');
      for (let index = 0; index < length; index += 1) {
        if (firstBuffer[index] !== secondBuffer[index]) markDifference(offset + index);
        else activeRange = null;
      }
      offset += length;
    }

    if (firstSize !== secondSize) {
      const trailingLength = Math.abs(firstSize - secondSize);
      const trailingStart = commonSize;
      differingByteCount += trailingLength;
      if (firstDifferingOffsets.length < MAX_RECORDED_OFFSETS) firstDifferingOffsets.push(trailingStart);
      if (activeRange !== null && activeRange.end + 1 === trailingStart) {
        activeRange.end = Math.max(firstSize, secondSize) - 1;
      } else {
        differingRangeCount += 1;
        activeRange = { start: trailingStart, end: Math.max(firstSize, secondSize) - 1 };
        if (firstDifferingRanges.length < MAX_RECORDED_RANGES) firstDifferingRanges.push(activeRange);
      }
    }
  } finally {
    fs.closeSync(firstFd);
    fs.closeSync(secondFd);
  }

  const firstPeTimestamp = readPeTimestamp(firstPath);
  const secondPeTimestamp = readPeTimestamp(secondPath);
  return {
    sameBytes: firstSize === secondSize && differingByteCount === 0,
    firstBytes: firstSize,
    secondBytes: secondSize,
    differingByteCount,
    differingRangeCount,
    firstDifferingOffsets,
    firstDifferingRanges,
    peTimestamp: {
      first: firstPeTimestamp,
      second: secondPeTimestamp,
      equal: firstPeTimestamp === secondPeTimestamp
    }
  };
}

if (require.main === module) {
  try {
    const [firstPath, secondPath] = process.argv.slice(2);
    if (!firstPath || !secondPath) throw new Error('Usage: node c010-binary-diff-summary.cjs <first-file> <second-file>');
    const result = compareFiles(firstPath, secondPath);
    process.stdout.write(JSON.stringify(result) + '\n');
  } catch (error) {
    process.stderr.write(String(error && error.message ? error.message : error) + '\n');
    process.exitCode = 1;
  }
}

module.exports = { compareFiles, readPeTimestamp };
