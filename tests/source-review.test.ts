import test from 'node:test';
import assert from 'node:assert/strict';
import {blankProject} from '../src/step2/model.ts';
import {anchorRectangle,isReviewed,reviewableBlocks,reviewSignature,reviewableOrigin} from '../src/step3/sourceReview.ts';

test('M06 source review is explicit and invalidated by any text edit',()=>{
  const doc=blankProject();
  const block=doc.content.sections[0].blocks[0];
  if(block.kind==='image')throw Error('Unexpected default block');
  block.text='원본 내용';
  block.origin={page:2,x:25,y:110,width:200,height:16};
  assert.equal(reviewableBlocks(doc).length,1);
  const marks={[block.id]:reviewSignature(block)};
  assert.equal(isReviewed(block,marks),true);
  block.text='원본 내용 수정';
  assert.equal(isReviewed(block,marks),false);
  block.text='원본 내용';
  block.origin={...block.origin,x:26};
  assert.equal(isReviewed(block,marks),false);
});
test('M06 source origins reject malformed page positions and clamp highlight rectangle',()=>{
  assert.equal(reviewableOrigin({page:0,x:0,y:0,width:0,height:0}),false);
  assert.equal(reviewableOrigin({page:51,x:0,y:0,width:0,height:0}),false);
  assert.equal(reviewableOrigin({page:1,x:Infinity,y:0,width:1,height:1}),false);
  const rect=anchorRectangle({page:1,x:20,y:30,width:100,height:12},595,842);
  assert.deepEqual(rect,{x:20,y:30,width:100,height:12});
  const corner=anchorRectangle({page:2,x:593,y:840,width:300,height:40},595,842);
  assert.deepEqual(corner,{x:593,y:840,width:2,height:2});
});
