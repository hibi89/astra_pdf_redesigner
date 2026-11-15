'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.allocUnsafe(1024 * 1024);
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

function isWithin(parentPath, candidatePath) {
  const relative = path.relative(parentPath, candidatePath);
  return relative === '' || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative));
}

function auditIntermediates(appArchivePath, uninstallerPath, env = process.env) {
  if (typeof env.RUNNER_TEMP !== 'string' || !env.RUNNER_TEMP.trim()) {
    throw new Error('RUNNER_TEMP is required.');
  }
  if (!['first', 'second'].includes(env.ASTRA_C010_AUDIT_LABEL)) {
    throw new Error('ASTRA_C010_AUDIT_LABEL must be first or second.');
  }
  const runnerTemp = fs.realpathSync(path.resolve(env.RUNNER_TEMP));
  const evidenceRoot = path.join(runnerTemp, 'astra-c010-nsis-intermediates');
  const outputDirectory = path.join(evidenceRoot, env.ASTRA_C010_AUDIT_LABEL);
  if (!isWithin(runnerTemp, outputDirectory)) throw new Error('Intermediate evidence path escaped RUNNER_TEMP.');
  fs.mkdirSync(evidenceRoot, { recursive: true });
  fs.mkdirSync(outputDirectory, { recursive: false });

  function inspect(sourcePath, label, expectedExtension) {
    if (typeof sourcePath !== 'string' || !sourcePath.trim()) throw new TypeError(`Missing ${label} input path.`);
    const absolutePath = path.resolve(sourcePath);
    const sourceStat = fs.lstatSync(absolutePath);
    if (sourceStat.isSymbolicLink() || !sourceStat.isFile()) throw new Error(`${label} input is not a regular file.`);
    const extension = path.extname(absolutePath) || expectedExtension;
    const copyPath = path.join(outputDirectory, `${label}${extension}`);
    fs.copyFileSync(absolutePath, copyPath, fs.constants.COPYFILE_EXCL);
    return {
      name: path.basename(absolutePath),
      bytes: sourceStat.size,
      sha256: sha256File(absolutePath),
      mtimeMs: sourceStat.mtimeMs,
      lastWriteTimeUtc: sourceStat.mtime.toISOString(),
      copy: path.basename(copyPath)
    };
  }

  const report = {
    type: 'C010_NSIS_INTERMEDIATES',
    label: env.ASTRA_C010_AUDIT_LABEL,
    appArchive: inspect(appArchivePath, 'app-archive', '.7z'),
    uninstaller: inspect(uninstallerPath, 'uninstaller', '.exe')
  };
  const reportPath = path.join(outputDirectory, 'summary.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), { flag: 'wx' });
  process.stdout.write(JSON.stringify(report) + '\n');
  return report;
}

if (require.main === module) {
  try {
    const [appArchivePath, uninstallerPath] = process.argv.slice(2);
    if (!appArchivePath || !uninstallerPath) throw new Error('Pass the NSIS app archive and generated uninstaller paths.');
    auditIntermediates(appArchivePath, uninstallerPath);
  } catch (error) {
    process.stderr.write(String(error && error.message ? error.message : error) + '\n');
    process.exitCode = 1;
  }
}

module.exports = { auditIntermediates, isWithin, sha256File };
