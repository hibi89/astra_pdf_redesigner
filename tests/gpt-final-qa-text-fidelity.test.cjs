'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {checkSnapshots}=require('../tools/gpt-final-qa-text-fidelity.cjs');
const fixture=()=>{
  const sourcePdfBefore=Buffer.from('%PDF-1.7\nSynthetic bytes only, NOT an actual PDF.\n');
  const sourcePdfAfter=Buffer.from(sourcePdfBefore);
  const sourceText='청구금액 2,300,000원은 승인하지 않는다.\n표 A 2026-11-15 15건\n표 B 300원 4건';
  return{sourcePdfBefore,sourcePdfAfter,sourceText,importedText:sourceText,
    outputText:sourceText,expectedTableRows:['표 A 2026-11-15 15건','표 B 300원 4건']};
};
test('G002 matching synthetic Korean amount/negative/table snapshots are review-required only',()=>{
 const input=fixture(),result=checkSnapshots(input);
 assert.equal(result.status,'SYNTHETIC_TEXT_PARITY_REVIEW_REQUIRED');
 assert.deepEqual(result.issues,[]);
 assert.equal(result.tableRowsChecked,2);
 assert.equal(result.sourcePdfSha256Before,result.sourcePdfSha256After);
 assert.equal(result.pdfExtractionAuthenticity,'NOT_VERIFIED');
 assert.equal(result.imagesAndTableGeometry,'NOT_VERIFIED');
 assert.equal(result.userAcceptance,'UNASSESSED');
 assert.equal(result.scoreDelta,0);
});
test('G002 OCR critical amount corruption is caught in both import and output',()=>{
 const input=fixture();
 input.importedText=input.importedText.replace('2,300,000','22300,000');
 input.outputText=input.importedText;
 const result=checkSnapshots(input);
 assert.ok(result.issues.includes('SOURCE_IMPORT_NUMERIC_DIFFERENCE'));
 assert.ok(result.issues.includes('SOURCE_OUTPUT_NUMERIC_DIFFERENCE'));
 assert.equal(result.status,'POTENTIAL_CONTENT_DIFFERENCE_REVIEW_REQUIRED');
});
test('G002 omitted Korean negation remains a blocking review flag',()=>{
 const input=fixture();
 input.outputText=input.outputText.replace('승인하지 않는다','승인한다');
 const result=checkSnapshots(input);
 assert.ok(result.issues.includes('SOURCE_OUTPUT_TEXT_DIFFERENCE'));
 assert.ok(result.issues.includes('SOURCE_OUTPUT_NEGATION_DIFFERENCE'));
});
test('G002 row reorder is reported even though all row values remain',()=>{
 const input=fixture();
 input.outputText='청구금액 2,300,000원은 승인하지 않는다. 표 B 300원 4건 표 A 2026-11-15 15건';
 const result=checkSnapshots(input);
 assert.ok(result.issues.includes('TABLE_ROW_ORDER_OR_MULTIPLICITY_RISK'));
});
test('G002 duplicated row is reported rather than counted as successful preservation',()=>{
 const input=fixture();input.outputText += '\n표 A 2026-11-15 15건';
 assert.ok(checkSnapshots(input).issues.includes('TABLE_ROW_ORDER_OR_MULTIPLICITY_RISK'));
});
test('G002 changed original PDF bytes are detected even if all text snapshots match',()=>{
 const input=fixture();input.sourcePdfAfter=Buffer.concat([input.sourcePdfAfter,Buffer.from('tamper')]);
 const result=checkSnapshots(input);
 assert.ok(result.issues.includes('ORIGINAL_PDF_BYTES_CHANGED'));
 assert.notEqual(result.sourcePdfSha256Before,result.sourcePdfSha256After);
});
test('G002 Unicode NFC and whitespace reflow are accepted without changing original values',()=>{
 const input=fixture();
 input.importedText=input.sourceText.normalize('NFD').replace(/\n/g,'   ');
 input.outputText=input.sourceText.replace(/\n/g,'\t');
 assert.deepEqual(checkSnapshots(input).issues,[]);
});
test('G002 rejects missing PDF hash evidence and invalid input types',()=>{
 const input=fixture();input.sourcePdfBefore=Buffer.from('not pdf');
 assert.throws(()=>checkSnapshots(input),/INVALID_ORIGINAL_PDF_BUFFER/);
 const other=fixture();other.outputText=null;
 assert.throws(()=>checkSnapshots(other),/INVALID_TEXT_SNAPSHOT/);
});
test('G002 report does not include private raw document contents',()=>{
 const input=fixture(),result=checkSnapshots(input);
 const report=JSON.stringify(result);
 assert.ok(!report.includes('청구금액')&&!report.includes('승인하지')&&!report.includes('표 A'));
});
