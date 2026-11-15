'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {evaluate,evaluateFile}=require('../tools/gpt-final-qa-owner-acceptance.cjs');
function fixture() {
  const kinds=['text','table','multi-column','image','scan','mixed-korean'];
  return {
    schema:'astra-g004-anonymous-owner-summary-v1',windows:['Windows10','Windows11'],ownerPerformedLocally:true,
    cases:Array.from({length:5},(_,i)=>({
      caseId:'CASE-0'+(i+1),features:[kinds[i]],sourcePages:i+1,outputPages:i+1,
      sourceHashUnchanged:true,textOmissions:0,numericMismatches:0,
      tableIssues:0,imageIssues:0,readingOrderIssues:0,layoutIssues:0,
      warningsAcknowledged:true,visualReviewed:true,
    })),
  };
}
test('G004 5-case all-clear self-attested summary is never official approval',()=>{
  const r=evaluate(fixture());
  assert.equal(r.status,'MANUAL_EVIDENCE_REVIEW_REQUIRED');
  assert.deepEqual(r.blockers,[]);
  assert.equal(r.caseCount,5);
  assert.equal(r.caseCheckPassCount,5);
  assert.equal(r.buyerAcceptance,'UNASSESSED');
  assert.equal(r.scoreDelta,0);
  assert.equal(r.release,'RELEASE HOLD');
});
test('G004 flags missing Win11 physical claim and fails closed',()=>{
  const f=fixture();f.windows=['Windows10'];
  const r=evaluate(f);
  assert.ok(r.blockers.includes('PHYSICAL_WINDOWS10_AND_11_NOT_BOTH_RECORDED'));
  assert.equal(r.scoreDelta,0);
});
test('G004 counts a changed source hash and an OCR amount mismatch',()=>{
  const f=fixture();f.cases[0].sourceHashUnchanged=false;f.cases[1].numericMismatches=1;
  const r=evaluate(f);
  assert.equal(r.status,'INCOMPLETE_OWNER_EVIDENCE');
  assert.equal(r.counts.numericMismatches,1);
  assert.equal(r.sourceHashUnchangedCount,4);
  assert.ok(r.blockers.includes('CASE_LEVEL_DEFECT_OR_UNREVIEWED'));
});
test('G004 requires five-to-ten unique anonymous case IDs',()=>{
  const f=fixture();f.cases.pop();assert.throws(()=>evaluate(f),/FIVE_TO_TEN_CASES_REQUIRED/);
  f.cases=fixture().cases;f.cases[1].caseId='CASE-01';assert.throws(()=>evaluate(f),/ANONYMOUS_CASE_ID/);
  f.cases=fixture().cases;f.cases[0].caseId='real-customer-name';assert.throws(()=>evaluate(f),/ANONYMOUS_CASE_ID/);
});
test('G004 prevents raw PDF text/filepaths/customer identifiers from entering the summary',()=>{
  const f=fixture();f.cases[0].filename='C:\\customer\\private.pdf';
  assert.throws(()=>evaluate(f),/UNKNOWN_FIELD_MAY_CONTAIN_PRIVATE_DATA/);
  delete f.cases[0].filename;f.pdfText='고객 문서 비밀 내용';
  assert.throws(()=>evaluate(f),/UNKNOWN_FIELD_MAY_CONTAIN_PRIVATE_DATA/);
});
test('G004 handles missing table/scan coverage and unreviewed rows without claiming acceptance',()=>{
  const f=fixture();f.cases[1].features=['text'];f.cases[4].features=['text'];
  f.cases[2].visualReviewed=false;
  const r=evaluate(f);
  assert.ok(r.blockers.includes('MANDATORY_PDF_FEATURE_COVERAGE_MISSING'));
  assert.ok(r.blockers.includes('CASE_LEVEL_DEFECT_OR_UNREVIEWED'));
  assert.equal(r.caseCheckPassCount,4);
});
test('G004 rejects negative defects and wrong boolean types',()=>{
  const f=fixture();f.cases[0].numericMismatches=-1;
  assert.throws(()=>evaluate(f),/DEFECT_COUNTS/);
  f.cases[0].numericMismatches=0;f.ownerPerformedLocally='yes';
  assert.throws(()=>evaluate(f),/OWNER_ATTESTATION_TYPE/);
});
test('G004 rejects a symlinked input and does not emit original data',()=>{
  const f=fixture(),root=fs.mkdtempSync(path.join(os.tmpdir(),'astra-g004-'));
  try{
    const file=path.join(root,'local-only-summary.json'),link=path.join(root,'alias.json');
    fs.writeFileSync(file,JSON.stringify(f),'utf8');
    assert.equal(evaluateFile(file).caseCount,5);
    try{fs.symlinkSync(file,link,'file');}
    catch(error){if(process.platform==='win32'&&error.code==='EPERM')return;throw error;}
    assert.throws(()=>evaluateFile(link),/UNSAFE_FILE/);
    const r=JSON.stringify(evaluateFile(file));
    assert.ok(!r.includes('CASE-01'));
    assert.ok(!r.includes(file));
  }finally{fs.rmSync(root,{recursive:true,force:true,maxRetries:2});}
});
