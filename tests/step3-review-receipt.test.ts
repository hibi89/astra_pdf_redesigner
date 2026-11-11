import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {blankProject} from '../src/step2/model.ts';
import {reviewSignature} from '../src/step3/sourceReview.ts';
import {makeSourceReviewReceipt,SOURCE_REVIEW_RECEIPT_FORMAT} from '../src/step3/reviewReceipt.ts';
const data='%PDF-1.7\nMOCK_PDF_ORIGINAL_BYTES_\nPRIVATE_SOURCE_928';
function docWithOrigins(){
 const doc=blankProject();
 doc.content.title='PRIVATE_CUSTOMER_DRAFT_833';
 doc.content.sections[0].blocks=[{
  id:'block-A',kind:'paragraph',text:'매출 123',origin:{page:1,x:10,y:10,width:40,height:15}
 },{
  id:'block-B',kind:'heading',text:'제목',origin:{page:2,x:15,y:20,width:30,height:15}
 },{
  id:'block-C',kind:'paragraph',text:'manual note'
 }];
 return doc;
}
test('STEP7 local receipt binds original bytes, content and manual marks without exposing text',async()=>{
 const doc=docWithOrigins();
 const a=doc.content.sections[0].blocks[0],b=doc.content.sections[0].blocks[1];
 const marks={[a.id]:reviewSignature(a),[b.id]:reviewSignature(b)};
 const report=await makeSourceReviewReceipt(doc,marks,new Blob([data]));
 assert.equal(report.format,SOURCE_REVIEW_RECEIPT_FORMAT);
 assert.equal(report.source_sha256,createHash('sha256').update(data).digest('hex'));
 assert.equal(report.project_content_sha256,createHash('sha256').update(JSON.stringify(doc.content)).digest('hex'));
 assert.equal(report.status,'ALL_ANCHORED_BLOCKS_ACKNOWLEDGED');
 assert.deepEqual([report.anchored_block_count,report.acknowledged_block_count,report.unacknowledged_block_count,report.unanchored_block_count,report.anchored_source_page_count],[2,2,0,1,2]);
 assert.equal(report.owner_approval,'NOT_GRANTED');
 assert.equal(report.source_fidelity_certified,false);
 assert.equal(report.external_transfer,false);
 const wire=JSON.stringify(report);
 assert.doesNotMatch(wire,/PRIVATE_SOURCE_928|PRIVATE_CUSTOMER_DRAFT_833|manual note|매출 123/);
});
test('STEP7 any text edit invalidates the corresponding acknowledgement',async()=>{
 const doc=docWithOrigins(),a=doc.content.sections[0].blocks[0];
 const marks={[a.id]:reviewSignature(a)};
 if(a.kind==='image')throw Error('unexpected');
 a.text='수정된 금액 125';
 const report=await makeSourceReviewReceipt(doc,marks,new Blob([data]));
 assert.equal(report.status,'REVIEW_INCOMPLETE');
 assert.equal(report.acknowledged_block_count,0);
 assert.equal(report.unacknowledged_block_count,2);
 assert.equal(report.stale_acknowledgement_count,1);
});
test('STEP7 changed source bytes alter independent SHA, never silently reuse old digest',async()=>{
 const doc=docWithOrigins();
 const first=await makeSourceReviewReceipt(doc,{},new Blob([data]));
 const second=await makeSourceReviewReceipt(doc,{},new Blob([data+'APPEND']));
 assert.notEqual(first.source_sha256,second.source_sha256);
 assert.equal(first.project_content_sha256,second.project_content_sha256);
});
test('STEP7 no anchors means incomplete review, not a completed certification',async()=>{
 const doc=blankProject();
 const report=await makeSourceReviewReceipt(doc,{},new Blob([data]));
 assert.equal(report.anchored_block_count,0);
 assert.equal(report.status,'REVIEW_INCOMPLETE');
 assert.equal(report.source_fidelity_certified,false);
});
test('STEP7 malformed doc, invalid PDF Blob and oversize source rejected without writes',async()=>{
 const doc=docWithOrigins();
 const invalid=structuredClone(doc);invalid.content.sections[0].blocks[0].origin.page=-1;
 await assert.rejects(makeSourceReviewReceipt(invalid,{},new Blob([data])));
 await assert.rejects(makeSourceReviewReceipt(doc,{},new Blob([''])));
 await assert.rejects(makeSourceReviewReceipt(doc,{},new Blob(['X'.repeat(30*1024*1024+1)])));
 await assert.rejects(makeSourceReviewReceipt(doc,null as any,new Blob([data])));
});
