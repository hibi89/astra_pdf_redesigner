'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { evaluateCandidate, auditFile } = require('../tools/gpt-final-qa-p119-gate.cjs');

const matrixPath = path.resolve(__dirname, '../docs/evidence/astra/G001/SUPPLIER_EVIDENCE_MATRIX.json');
const known = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
function syntheticComplete() {
  return {
    id: 'synthetic-only-evidence-not-authenticated',
    releaseUrl: 'https://github.com/synthetic/fixture/releases/download/test/fixture.exe',
    provenance: {
      expectedSha256: '0123456789abcdef'.repeat(4), observedSha256: '0123456789abcdef'.repeat(4),
      hashEvidenceUrl: 'https://github.com/synthetic/fixture/blob/' + 'a'.repeat(40) + '/hashes.txt',
    },
    authenticode: {
      verifier: 'Get-AuthenticodeSignature', status: 'Valid',
      signerThumbprint: 'B'.repeat(40), timestampChain: 'Valid',
    },
    dependencies: {
      runtimeClosure: 'VERIFIED', peFiles: 3, dllFiles: 2,
      mappedDlls: 2, exactVersionLicenseNoticeMap: 'VERIFIED',
    },
    legal: {
      exactBundleRedistribution: 'VERIFIED',
      rightsEvidenceUrl: 'https://github.com/synthetic/fixture/blob/' + 'a'.repeat(40) + '/LICENCE.txt',
      pinnedLanguageDataAndLicenses: 'VERIFIED',
      languageEvidenceUrl: 'https://github.com/synthetic/fixture/blob/' + 'a'.repeat(40) + '/traineddata/LICENSE',
    },
  };
}
function fixture(callback) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'astra-g001-'));
  const file = path.join(root, 'evidence.json');
  try { return callback({ file, root, save: body => fs.writeFileSync(file, JSON.stringify(body), 'utf8') }); }
  finally { fs.rmSync(root, { recursive: true, force: true, maxRetries: 2 }); }
}

test('historical 5.5.3, 5.5.0, 5.4.0 candidate evidence is BLOCKED with no score', () => {
  const summary = auditFile(matrixPath);
  assert.equal(summary.overall, 'BLOCKED');
  assert.equal(summary.ocrManifest, null);
  assert.equal(summary.release, 'RELEASE HOLD');
  assert.equal(summary.officialAcceptance, 'UNASSESSED');
  assert.equal(summary.scoreDelta, 0);
  assert.equal(summary.candidates.length, 3);
  for (const candidate of summary.candidates) {
    assert.equal(candidate.verdict, 'BLOCKED');
    assert.ok(candidate.blockers.includes('AUTHENTICODE_NOT_VALID'));
    assert.ok(candidate.blockers.includes('BUNDLE_REDISTRIBUTION_RIGHTS_UNVERIFIED'));
    assert.ok(candidate.blockers.includes('EXACT_DEPENDENCY_SBOM_NOT_VERIFIED'));
    assert.equal(candidate.supplierApproved, false);
    assert.equal(candidate.productOcrEnabled, false);
    assert.equal(candidate.installerExecutionPermitted, false);
  }
});
test('even fabricated complete claims can only enter independent review, never approval', () => {
  const result = evaluateCandidate(syntheticComplete());
  assert.equal(result.verdict, 'INDEPENDENT_REVIEW_REQUIRED');
  assert.equal(result.blockers.length, 0);
  assert.equal(result.supplierApproved, false);
  assert.equal(result.installerExecutionPermitted, false);
  assert.equal(result.productOcrEnabled, false);
  assert.equal(result.scoreDelta, 0);
});
test('matching hash does not override UnknownError Authenticode', () => {
  const candidate = syntheticComplete();
  candidate.authenticode.status = 'UnknownError';
  assert.ok(evaluateCandidate(candidate).blockers.includes('AUTHENTICODE_NOT_VALID'));
  candidate.authenticode.status = 'Valid';
  candidate.authenticode.timestampChain = 'NotVerified';
  assert.ok(evaluateCandidate(candidate).blockers.includes('AUTHENTICODE_NOT_VALID'));
});
test('missing or inconsistent binary hash cannot pass evidence triage', () => {
  const c = syntheticComplete();
  c.provenance.observedSha256 = 'f'.repeat(64);
  assert.ok(evaluateCandidate(c).blockers.includes('INSTALLER_SHA256_UNVERIFIED'));
  c.provenance.observedSha256 = c.provenance.expectedSha256;
  c.provenance.hashEvidenceUrl = 'https://example.invalid/sha256.txt';
  assert.ok(evaluateCandidate(c).blockers.includes('INDEPENDENT_HASH_PIN_MISSING'));
});
test('static import closure cannot masquerade as runtime dependency and DLL legal coverage', () => {
  const c = syntheticComplete();
  c.dependencies.runtimeClosure = 'CLOSED_STATIC_ONLY';
  assert.ok(evaluateCandidate(c).blockers.includes('DLL_RUNTIME_CLOSURE_NOT_VERIFIED'));
  c.dependencies.runtimeClosure = 'VERIFIED';
  c.dependencies.mappedDlls = 1;
  assert.ok(evaluateCandidate(c).blockers.includes('EXACT_DEPENDENCY_SBOM_NOT_VERIFIED'));
});
test('source license alone is not evidence of the specific bundle redistribution rights', () => {
  const c = syntheticComplete();
  c.legal.rightsEvidenceUrl = null;
  assert.ok(evaluateCandidate(c).blockers.includes('BUNDLE_REDISTRIBUTION_RIGHTS_UNVERIFIED'));
  c.legal.rightsEvidenceUrl = 'https://github.com/synthetic/fixture/blob/' + 'a'.repeat(40) + '/LICENCE.txt';
  c.legal.pinnedLanguageDataAndLicenses = 'NOT_VERIFIED';
  assert.ok(evaluateCandidate(c).blockers.includes('KOR_ENG_TESSDATA_CHAIN_UNVERIFIED'));
});
test('malformed, duplicate, oversized and unsafe evidence files are refused', () => fixture(({file, save, root}) => {
  save({schema:'wrong',candidates:[syntheticComplete()]});
  assert.throws(() => auditFile(file), /INVALID_EVIDENCE_SCHEMA/);
  save({schema:'astra-g001-p119-candidates-v1',candidates:[syntheticComplete(), syntheticComplete()]});
  assert.throws(() => auditFile(file), /DUPLICATE_CANDIDATE_ID/);
  fs.writeFileSync(file, 'x'.repeat(128*1024+1));
  assert.throws(() => auditFile(file), /INVALID_EVIDENCE_FILE/);
  const target = path.join(root, 'target.json');
  fs.writeFileSync(target, '{}');
  const link = path.join(root, 'link.json');
  try { fs.symlinkSync(target, link, 'file'); }
  catch (e) { if (process.platform === 'win32' && e.code === 'EPERM') return; throw e; }
  assert.throws(() => auditFile(link), /INVALID_EVIDENCE_FILE/);
}));
test('product OCR remains disabled regardless of independent evidence result', () => {
  const controller = require('../desktop/local-ocr-controller.cjs');
  assert.equal(controller.OCR_MANIFEST, null);
  const result = evaluateCandidate(syntheticComplete());
  assert.equal(result.productOcrEnabled, false);
});
