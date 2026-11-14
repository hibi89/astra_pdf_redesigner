import test from 'node:test';
import assert from 'node:assert/strict';
import {comparePdfTokenLists,comparePdfValueLists,countPdfPerPageTokenDifferences,countPdfPerPageOrderRisks,hasPdfDocumentTextOrderRisk,normalizePdfLinkTarget,tokenizePdfLinks,tokenizePdfNegationTokens,tokenizePdfSymbols,tokenizePdfText} from '../src/step7/tokenParity.ts';

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


test('STEP7 within-page table item swap is detected despite identical global/page token multisets',()=>{
 const a=tokenizePdfText(['TABLE_A_906 TABLE_B_907 TABLE_C_908']);
 const b=tokenizePdfText(['TABLE_B_907 TABLE_A_906 TABLE_C_908']);
 assert.equal(comparePdfTokenLists(a,b).missingTokens,0);
 assert.equal(countPdfPerPageTokenDifferences([a],[b]),0);
 assert.equal(countPdfPerPageOrderRisks([a],[b]),1);
 assert.equal(countPdfPerPageOrderRisks([a],[a]),0);
});
test('STEP7 order-only check is unknown when page counts differ and does not mislabel content changes',()=>{
 const a=tokenizePdfText(['one 010 two']),b=tokenizePdfText(['one 999 two']);
 assert.equal(countPdfPerPageOrderRisks([a],[]),null);
 assert.equal(countPdfPerPageOrderRisks([a],[b]),0);
 assert.throws(()=>countPdfPerPageOrderRisks(Array(51).fill([]),Array(51).fill([])),/제한/);
});


test('STEP7 negative, positive and unicode-minus signs are significant numeric source data',()=>{
 const a=tokenizePdfText(['매출 -100 +20 100 −100 2026년']);
 assert.deepEqual(a,['매출','-100','+20','100','-100','2026년']);
 for(const [before,after] of [['-100','100'],['+100','100'],['100','-100']]){
  const result=comparePdfTokenLists(tokenizePdfText([before]),tokenizePdfText([after]));
  assert.equal(result.missingTokens,1);
  assert.equal(result.missingNumericTokens,1);
  assert.equal(result.addedTokens,1);
 }
 const same=comparePdfTokenLists(tokenizePdfText(['−100']),tokenizePdfText(['-100']));
 assert.equal(same.missingTokens,0);
 assert.equal(same.addedTokens,0);
});


test('STEP7 huge local PDF lexical input fails at explicit limit, not JS stack overflow',()=>{
 const huge=Array(300_001).fill('x').join(' ');
 assert.throws(()=>tokenizePdfText([huge]),/PDF 선택 텍스트 검수 제한/);
});

test('STEP7 global order risk catches reordered sections even when page counts and token bags differ in shape',()=>{
 const first=tokenizePdfText(['section A 100']),second=tokenizePdfText(['section B 200']);
 const source=[...first,...second],out=[...second,...first];
 assert.equal(comparePdfTokenLists(source,out).missingTokens,0);
 assert.equal(hasPdfDocumentTextOrderRisk(source,out),true);
 assert.equal(hasPdfDocumentTextOrderRisk(source,source),false);
 assert.equal(hasPdfDocumentTextOrderRisk(source,tokenizePdfText(['different'])),false);
 assert.equal(hasPdfDocumentTextOrderRisk([],[]),false);
 assert.throws(()=>hasPdfDocumentTextOrderRisk(Array(300001).fill('x'),[]),/제한/);
});


test('STEP7 symbol parity detects lost currency, punctuation and number signs without source text',()=>{
 const before=tokenizePdfSymbols(['Total: -$1,200.50 (due)']);
 const after=tokenizePdfSymbols(['Total: $1,200.50 due']);
 const diff=comparePdfValueLists(before,after);
 assert.ok(diff.missingValues>=3);
 assert.ok(diff.addedValues>=0);
 assert.doesNotMatch(JSON.stringify(diff),/Total|due|1,200/);
});

test('STEP7 negation parity covers English and Korean refusal/status markers',()=>{
 assert.deepEqual(tokenizePdfNegationTokens(['Payment NOT APPROVED; NO transfer; without consent']),['not','no','without']);
 assert.deepEqual(tokenizePdfNegationTokens(['승인하지않음 결재 안됨 금지 미승인']),['승인하지않음','안됨','금지','미승인']);
 const before=tokenizePdfNegationTokens(['payment not approved']);
 const after=tokenizePdfNegationTokens(['payment approved']);
 assert.deepEqual(comparePdfValueLists(before,after),{sourceValues:1,outputValues:0,missingValues:1,addedValues:0});
});

test('STEP7 visible and annotation link targets compare without exporting their value',()=>{
 assert.deepEqual(tokenizePdfLinks(['See https://Example.test/policy/1001.']),['https://example.test/policy/1001']);
 assert.equal(normalizePdfLinkTarget('https://EXAMPLE.test/policy/1001'),'https://example.test/policy/1001');
 const diff=comparePdfValueLists(['https://example.test/policy/1001'],['https://example.test/policy/1002']);
 assert.deepEqual(diff,{sourceValues:1,outputValues:1,missingValues:1,addedValues:1});
 assert.doesNotMatch(JSON.stringify(diff),/example|policy|1001|1002/);
});
