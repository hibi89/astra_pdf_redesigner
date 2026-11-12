import test from 'node:test';
import assert from 'node:assert/strict';
import {countPdfVectorStrokes,countPdfPageStrokeDrift} from '../src/step7/pdfPaintSignals.ts';
const ops={stroke:1,closeStroke:2,fillStroke:3,eoFillStroke:4,closeFillStroke:5,closeEOFillStroke:6};
test('STEP7 only PDF vector stroke-painting operators are counted, not images/text/endPath',()=>{
 assert.equal(countPdfVectorStrokes([1,2,3,4,5,6,7,8,0],ops),6);
 assert.equal(countPdfVectorStrokes([7,8,9],ops),0);
 assert.equal(countPdfVectorStrokes([],ops),0);
});
test('STEP7 count-only painting advisory does not contain owner token or name',()=>{
 const n=countPdfVectorStrokes([1,3,5],ops);
 assert.deepEqual({source_vector_strokes:n},{source_vector_strokes:3});
 assert.doesNotMatch(JSON.stringify({source_vector_strokes:n}),/CLIENT|PRIVATE|ORIGINAL/);
});

test('STEP7 same total vector draws moving between pages still flags page-local risk',()=>{
 assert.equal(countPdfPageStrokeDrift([4,0],[0,4]),2);
 assert.equal(countPdfPageStrokeDrift([4,0],[4,0]),0);
 assert.equal(countPdfPageStrokeDrift([4,0],[4]),null);
 assert.throws(()=>countPdfPageStrokeDrift(Array(51).fill(0),Array(51).fill(0)),/제한/);
 assert.throws(()=>countPdfPageStrokeDrift([4,-1],[4,0]),/유효하지/);
});
