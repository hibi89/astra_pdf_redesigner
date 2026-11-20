import test from 'node:test';
import assert from 'node:assert/strict';
import {validateProPdfBatch,PRO_BATCH_MAX_FILES,PRO_BATCH_TOTAL_BYTES} from '../src/step3/batchQueue.ts';
const pdf=(name:string,size=100,type='application/pdf')=>({name,size,type});
test('PRO batch supports bounded 2-10 local PDF metadata without reading PDF bytes',()=>{
 assert.doesNotThrow(()=>validateProPdfBatch([pdf('one.pdf'),pdf('two.pdf')]));
 assert.doesNotThrow(()=>validateProPdfBatch(Array.from({length:PRO_BATCH_MAX_FILES},(_,i)=>pdf('src'+i+'.pdf'))));
 assert.equal(PRO_BATCH_TOTAL_BYTES,100*1024*1024);
});
test('PRO batch rejects unsafe and oversize items, duplicates and invalid MIME',()=>{
 for(const files of [[pdf('one.pdf')],[pdf('one.pdf'),pdf('one.pdf')],
   [pdf('../secret.pdf'),pdf('two.pdf')],[pdf('a.pdf',31*1024*1024),pdf('two.pdf')],
   [pdf('a.txt'),pdf('two.pdf')],[pdf('a.pdf',-10),pdf('two.pdf')],
   [pdf('a.pdf',100,'text/plain'),pdf('two.pdf')],
   Array.from({length:11},(_,i)=>pdf('src'+i+'.pdf'))]){
   assert.throws(()=>validateProPdfBatch(files));
 }
});
