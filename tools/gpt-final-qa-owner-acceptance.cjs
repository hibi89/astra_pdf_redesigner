'use strict';
// G004: validate privacy-safe local buyer acceptance SUMMARIES only.
// Real PDF content, file names, hashes and paths must never be uploaded to CI.
const fs=require('node:fs');
const allowedTop=new Set(['schema','cases','windows','ownerPerformedLocally']);
const allowedCase=new Set(['caseId','features','sourcePages','outputPages','sourceHashUnchanged','textOmissions','numericMismatches','tableIssues','imageIssues','readingOrderIssues','layoutIssues','warningsAcknowledged','visualReviewed']);
const allowedWindows=new Set(['Windows10','Windows11']);
const features=new Set(['text','table','multi-column','image','scan','mixed-korean','long-document','vector']);
const issues=['textOmissions','numericMismatches','tableIssues','imageIssues','readingOrderIssues','layoutIssues'];
function reject(msg){throw Error('G004_INVALID_ANONYMOUS_SUMMARY:'+msg);}
function keysOnly(obj,allowed){
  if(!obj||typeof obj!=='object'||Array.isArray(obj))reject('OBJECT_EXPECTED');
  if(Object.keys(obj).some(key=>!allowed.has(key)))reject('UNKNOWN_FIELD_MAY_CONTAIN_PRIVATE_DATA');
}
function nonnegative(value){return Number.isSafeInteger(value)&&value>=0&&value<=1000;}
function evaluate(summary) {
  keysOnly(summary,allowedTop);
  if(summary.schema!=='astra-g004-anonymous-owner-summary-v1')reject('SCHEMA');
  if(!Array.isArray(summary.cases)||summary.cases.length<5||summary.cases.length>10)reject('FIVE_TO_TEN_CASES_REQUIRED');
  if(!Array.isArray(summary.windows)||summary.windows.length>2||
     summary.windows.some(x=>!allowedWindows.has(x))||new Set(summary.windows).size!==summary.windows.length)reject('WINDOWS_ENUM');
  if(typeof summary.ownerPerformedLocally!=='boolean')reject('OWNER_ATTESTATION_TYPE');
  const seen=new Set(),coverage=new Set(),counts=Object.fromEntries(issues.map(x=>[x,0]));
  let safeCases=0,visualCases=0,unchanged=0;
  for(const entry of summary.cases){
    keysOnly(entry,allowedCase);
    if(!/^CASE-(0[1-9]|10)$/.test(entry.caseId)||seen.has(entry.caseId))reject('ANONYMOUS_CASE_ID');
    seen.add(entry.caseId);
    if(!Array.isArray(entry.features)||entry.features.length===0||
       entry.features.length>features.size||entry.features.some(x=>!features.has(x))||
       new Set(entry.features).size!==entry.features.length)reject('FEATURES');
    for(const f of entry.features)coverage.add(f);
    if(!nonnegative(entry.sourcePages)||entry.sourcePages<1||
       !nonnegative(entry.outputPages)||entry.outputPages<1)reject('PAGE_COUNTS');
    if(typeof entry.sourceHashUnchanged!=='boolean'||typeof entry.warningsAcknowledged!=='boolean'||
       typeof entry.visualReviewed!=='boolean')reject('CHECK_TYPES');
    for(const field of issues) {
      if(!nonnegative(entry[field]))reject('DEFECT_COUNTS');
      counts[field]+=entry[field];
    }
    if(entry.sourceHashUnchanged)unchanged++;
    if(entry.visualReviewed)visualCases++;
    if(entry.sourceHashUnchanged&&entry.visualReviewed&&entry.warningsAcknowledged&&
       issues.every(field=>entry[field]===0))safeCases++;
  }
  const broad=coverage.has('text')&&coverage.has('table')&&coverage.has('multi-column')&&
    coverage.has('image')&&coverage.has('scan');
  const blockers=[];
  if(!summary.ownerPerformedLocally)blockers.push('OWNER_LOCAL_EXECUTION_NOT_ATTESTED');
  if(!summary.windows.includes('Windows10')||!summary.windows.includes('Windows11'))
    blockers.push('PHYSICAL_WINDOWS10_AND_11_NOT_BOTH_RECORDED');
  if(!broad)blockers.push('MANDATORY_PDF_FEATURE_COVERAGE_MISSING');
  if(safeCases!==summary.cases.length)blockers.push('CASE_LEVEL_DEFECT_OR_UNREVIEWED');
  return {
    schema:'astra-g004-summary-check-v1',
    status:blockers.length?'INCOMPLETE_OWNER_EVIDENCE':'MANUAL_EVIDENCE_REVIEW_REQUIRED',
    blockers,caseCount:summary.cases.length,
    counts,sourceHashUnchangedCount:unchanged,visualReviewCount:visualCases,
    caseCheckPassCount:safeCases,coverage:[...coverage].sort(),
    windowsClaimed:[...summary.windows].sort(),
    noCustomerDocumentContentProcessedByValidator:true,
    trustBoundary:'Owner-supplied claims are not independently authenticated; local PDF and physical PC evidence require separate owner sign-off.',
    buyerAcceptance:'UNASSESSED',release:'RELEASE HOLD',scoreDelta:0,
  };
}
function evaluateFile(filename) {
  const st=fs.lstatSync(filename);
  if(!st.isFile()||st.isSymbolicLink()||st.size<20||st.size>32*1024)reject('UNSAFE_FILE');
  return evaluate(JSON.parse(fs.readFileSync(filename,'utf8')));
}
module.exports={evaluate,evaluateFile};
if(require.main===module){
  if(process.argv.length!==3){console.error('Usage: node tools/gpt-final-qa-owner-acceptance.cjs <local-anonymous-summary.json>');process.exitCode=2;}
  else try{const result=evaluateFile(process.argv[2]);console.log(JSON.stringify(result,null,2));if(result.blockers.length)process.exitCode=1;}
  catch(error){console.error(String(error.message).slice(0,200));process.exitCode=2;}
}
