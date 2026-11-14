import test from 'node:test';
import assert from 'node:assert/strict';
import {makeBrandBatchPlan,MAX_BRAND_BATCH_DOCS} from '../src/step4/brandBatchPlan.ts';
import {PALETTE} from '../src/types.ts';
const brand={name:'테스트 회사',tagline:'내부 문서',footer:'외부 배포 금지',accent:PALETTE[0].value};
const ids=['abcdefgh-1','abcdefgh-2','abcdefgh-3'];
test('P112 owner can apply one business text brand to several independent documents in session',()=>{
 const plan=makeBrandBatchPlan(ids,ids.slice(0,2),'business-03',brand);
 assert.deepEqual(Object.keys(plan),ids.slice(0,2));
 assert.deepEqual(plan[ids[0]].kit,brand);
 assert.notEqual(plan[ids[0]].kit,brand);
 assert.equal(plan[ids[1]].layoutId,'business-03');
 assert.notEqual(plan[ids[0]].kit,plan[ids[1]].kit);
});
test('P112 rejects applying BASIC or PRO layouts as BUSINESS',()=>{
 for(const layout of ['pro-01','business-11','basic','', 'business-00']){
  assert.throws(()=>makeBrandBatchPlan(ids,ids.slice(0,2),layout,brand));
 }
});
test('P112 rejects duplicate IDs, unknown IDs, single document and excessive selection',()=>{
 for(const selected of [[],[ids[0]],[ids[0],ids[0]],[ids[0],'not-existing']]){
  assert.throws(()=>makeBrandBatchPlan(ids,selected,'business-01',brand));
 }
 const many=Array.from({length:MAX_BRAND_BATCH_DOCS+1},(_,i)=>'batchitem-'+i);
 assert.throws(()=>makeBrandBatchPlan(many,many,'business-01',brand));
});
test('P112 never upgrades corrupt/invalid kit metadata to a saved V2 document',()=>{
 assert.throws(()=>makeBrandBatchPlan(ids,ids.slice(0,2),'business-01',{...brand,name:''}));
 assert.throws(()=>makeBrandBatchPlan(ids,ids.slice(0,2),'business-01',{...brand,accent:'#GGGGGG'}));
 const original={...brand};
 const plan=makeBrandBatchPlan(ids,ids.slice(0,2),'business-10',original);
 plan[ids[0]].kit.name='Changed';
 assert.equal(original.name,'테스트 회사');
 assert.equal(plan[ids[1]].kit.name,'테스트 회사');
});
