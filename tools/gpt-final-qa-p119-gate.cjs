'use strict';
// G001 independent triage. It NEVER authenticates a supplier or enables OCR.
// Human/legal review and real Windows Authenticode evidence are separate gates.
const fs = require('node:fs');
const crypto = require('node:crypto');
const SHA256 = /^[0-9a-f]{64}$/;
const THUMBPRINT = /^[0-9a-fA-F]{40}$/;
const RELEASE = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/releases\/download\/[^\s?#]+\/[^\s?#]+$/;
const PINNED_SOURCE = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/blob\/[0-9a-f]{40}\/[A-Za-z0-9_./-]+$/;
const OFFICIAL_DIGEST = /^https:\/\/api\.github\.com\/repos\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/releases\/(?:tags\/[^\s?#]+|[0-9]+)$/;

function validSha(value) { return typeof value === 'string' && SHA256.test(value) && !/^(.)\1{63}$/.test(value); }
function validSource(value) { return typeof value === 'string' && (PINNED_SOURCE.test(value) || OFFICIAL_DIGEST.test(value)); }
function issue(issues, code, condition) { if (!condition) issues.push(code); }
function evaluateCandidate(candidate) {
  const reasons = [];
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return { id: 'invalid-candidate', verdict: 'BLOCKED', blockers: ['INVALID_CANDIDATE'], supplierApproved: false, productOcrEnabled: false, scoreDelta: 0 };
  }
  const id = typeof candidate.id === 'string' && /^[a-z0-9][a-z0-9-]{2,70}$/.test(candidate.id) ? candidate.id : 'invalid-candidate';
  issue(reasons, 'INVALID_CANDIDATE_ID', id !== 'invalid-candidate');
  issue(reasons, 'RELEASE_URL_UNVERIFIED', RELEASE.test(candidate.releaseUrl || ''));
  const p = candidate.provenance || {};
  issue(reasons, 'INSTALLER_SHA256_UNVERIFIED', validSha(p.expectedSha256) && p.expectedSha256 === p.observedSha256);
  issue(reasons, 'INDEPENDENT_HASH_PIN_MISSING', validSource(p.hashEvidenceUrl));
  const s = candidate.authenticode || {};
  issue(reasons, 'AUTHENTICODE_NOT_VALID', s.verifier === 'Get-AuthenticodeSignature' &&
    s.status === 'Valid' && THUMBPRINT.test(s.signerThumbprint || '') && s.timestampChain === 'Valid');
  const d = candidate.dependencies || {};
  issue(reasons, 'DLL_RUNTIME_CLOSURE_NOT_VERIFIED', d.runtimeClosure === 'VERIFIED' &&
    Number.isSafeInteger(d.peFiles) && d.peFiles > 0 &&
    Number.isSafeInteger(d.dllFiles) && d.dllFiles > 0);
  issue(reasons, 'EXACT_DEPENDENCY_SBOM_NOT_VERIFIED', d.exactVersionLicenseNoticeMap === 'VERIFIED' &&
    Number.isSafeInteger(d.mappedDlls) && d.mappedDlls === d.dllFiles && d.dllFiles > 0);
  const l = candidate.legal || {};
  issue(reasons, 'BUNDLE_REDISTRIBUTION_RIGHTS_UNVERIFIED', l.exactBundleRedistribution === 'VERIFIED' &&
    validSource(l.rightsEvidenceUrl));
  issue(reasons, 'KOR_ENG_TESSDATA_CHAIN_UNVERIFIED', l.pinnedLanguageDataAndLicenses === 'VERIFIED' &&
    validSource(l.languageEvidenceUrl));
  // Evidence JSON is an UNTRUSTED assertion, not cryptographic or legal verification.
  // Even perfect metadata can only request independent source/Windows/legal review.
  return Object.freeze({
    id, verdict: reasons.length ? 'BLOCKED' : 'INDEPENDENT_REVIEW_REQUIRED',
    blockers: reasons, supplierApproved: false, installerExecutionPermitted: false,
    productOcrEnabled: false, scoreDelta: 0,
  });
}
function auditFile(filename) {
  const st = fs.lstatSync(filename);
  if (!st.isFile() || st.isSymbolicLink() || st.size < 20 || st.size > 128 * 1024) throw Error('INVALID_EVIDENCE_FILE');
  const evidence = JSON.parse(fs.readFileSync(filename, 'utf8'));
  if (!evidence || evidence.schema !== 'astra-g001-p119-candidates-v1' ||
      !Array.isArray(evidence.candidates) || evidence.candidates.length < 1 || evidence.candidates.length > 16) {
    throw Error('INVALID_EVIDENCE_SCHEMA');
  }
  const ids = new Set();
  const candidates = evidence.candidates.map(c => {
    const result = evaluateCandidate(c);
    if (ids.has(result.id)) throw Error('DUPLICATE_CANDIDATE_ID');
    ids.add(result.id);
    return result;
  });
  return {
    schema: 'astra-g001-p119-triage-v1',
    evidenceSha256: crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex'),
    overall: candidates.every(c => c.blockers.length === 0) ? 'INDEPENDENT_REVIEW_REQUIRED' : 'BLOCKED',
    candidates,
    release: 'RELEASE HOLD',
    ocrManifest: null,
    officialAcceptance: 'UNASSESSED',
    scoreDelta: 0,
    disclaimer: 'Metadata triage only; no binary downloaded or executed; independent legal and Windows signature verification required.',
  };
}
module.exports = { evaluateCandidate, auditFile };
if (require.main === module) {
  if (process.argv.length !== 3) {
    console.error('Usage: node tools/gpt-final-qa-p119-gate.cjs <candidate-evidence.json>');
    process.exitCode = 2;
  } else {
    try {
      const report = auditFile(process.argv[2]);
      console.log(JSON.stringify(report, null, 2));
      if (report.overall === 'BLOCKED') process.exitCode = 1;
    } catch (error) {
      console.error('P119_EVIDENCE_REJECTED:', error.message);
      process.exitCode = 2;
    }
  }
}
