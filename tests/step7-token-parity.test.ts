import test from 'node:test';
import assert from 'node:assert/strict';
import {comparePdfTokenLists,countPdfPerPageTokenDifferences,tokenizePdfText} from '../src/step7/tokenParity.ts';

test('STEP7 lexical comparison keeps source and output order-independent counts',()=>{
 const source=tokenizePdfText(['원문 001, 매출 3,500.', '결론 A-01']);
 const same=tokenizePdfText(['결론 A-01', '원문 001 매출 3,500']);
 const r=comparePdfTokenLists(source,same);
 assert.equal(r.sourceTokens,same.length);
 assert.equal(r.missingTokens,0);
 assert.equal(r.missingNumericTokens,0);
 assert.equal(r.addedTokens,0);
});
test('STEP7 changed monetary figure is flagged as missing numeric',()=>{
 const src=tokenizePdfText(['매출 2026년 001 150,000원']);
 const out=tokenizePdfText(['매출 2026년 001 160,000원']);
 const r=comparePdfTokenLists(src,out);
 assert.ok(r.missingTokens>=1);
 assert.ok(r.missingNumericTokens>=1);
});
test('STEP7 repeated output text is counted separately',()=>{
 const r=comparePdfTokenLists(tokenizePdfText(['alpha alpha 001']),tokenizePdfText(['alpha alpha alpha 001']));
 assert.equal(r.missingTokens,0);
 assert.equal(r.addedTokens,1);
});
test('STEP7 omitted repeated source marker is still missing',()=>{
 const r=comparePdfTokenLists(tokenizePdfText(['alpha alpha 001']),tokenizePdfText(['alpha 001']));
 assert.equal(r.missingTokens,1);
 assert.equal(r.addedTokens,0);
});
test('STEP7 Unicode NFC tokens match across composed/decomposed Korean',()=>{
 const src=tokenizePdfText(['안녕 cafe\u0301 2026']);
 const dst=tokenizePdfText(['안녕 café 2026']);
 const r=comparePdfTokenLists(src,dst);
 assert.equal(r.missingTokens,0);assert.equal(r.addedTokens,0);
});
test('STEP7 English case changes do not hide numeric code identity',()=>{
 const src=tokenizePdfText(['INVOICE AB-001']);
 const dst=tokenizePdfText(['invoice ab-002']);
 const r=comparePdfTokenLists(src,dst);
 assert.equal(r.missingNumericTokens,1);
});
test('STEP7 empty scanned input does not fabricate matched source content',()=>{
 const r=comparePdfTokenLists([],tokenizePdfText(['visible']));
 assert.equal(r.sourceTokens,0);assert.equal(r.addedTokens,1);
});
test('STEP7 report helper returns only counts, not sensitive source tokens',()=>{
 const secret='CLIENT-ALPHA-PRIVATE_2026';
 const r=comparePdfTokenLists(tokenizePdfText([secret]),tokenizePdfText(['MISSING']));
 assert.doesNotMatch(JSON.stringify(r),/CLIENT|ALPHA|PRIVATE_2026|MISSING/);
});
test('STEP7 300001-token untrusted input is rejected before work',()=>{
 assert.throws(()=>comparePdfTokenLists(Array(300001).fill('x'),[]),/제한/);
});


test('STEP7 page count mismatch never implies positional parity',()=>{
 const a=tokenizePdfText(['page1 01']),b=tokenizePdfText(['page2 02']);
 assert.equal(countPdfPerPageTokenDifferences([a,b],[a,b,[]]),null);
});
test('STEP7 swapped page text is found despite exact global token counts',()=>{
 const a=tokenizePdfText(['alpha 123']),b=tokenizePdfText(['beta 456']);
 const global=comparePdfTokenLists([...a,...b],[...b,...a]);
 assert.equal(global.missingTokens,0);assert.equal(global.addedTokens,0);
 assert.equal(countPdfPerPageTokenDifferences([a,b],[b,a]),2);
 assert.equal(countPdfPerPageTokenDifferences([a,b],[a,b]),0);
});
