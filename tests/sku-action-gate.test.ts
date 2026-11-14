import test from 'node:test';
import assert from 'node:assert/strict';
import {ASTRA_CUSTOMER_BUILD_ENABLED,SkuAccessDeniedError,layoutSkuCapability,
 pdfExportCapabilities,runCustomerLicensedAction,runSkuGatedAction}
 from '../src/commercial/skuActionGate.ts';
test('P109 internal preview is explicitly not a customer build',()=>{assert.equal(ASTRA_CUSTOMER_BUILD_ENABLED,false);});
test('P109 export authorization maps actual selected tier and branded output',()=>{
 assert.deepEqual(pdfExportCapabilities(undefined,false),['base-layout']);
 assert.deepEqual(pdfExportCapabilities('pro-01',false),['pro-layout']);
 assert.deepEqual(pdfExportCapabilities('business-10',false),['business-layout']);
 assert.deepEqual(pdfExportCapabilities('business-01',true),['business-layout','brand-kit']);
 assert.equal(layoutSkuCapability('pro-12'),'pro-layout');
 assert.throws(()=>pdfExportCapabilities('business-11',false),SkuAccessDeniedError);
 assert.throws(()=>pdfExportCapabilities('pro-01',true),SkuAccessDeniedError);
 assert.throws(()=>pdfExportCapabilities(undefined,true),SkuAccessDeniedError);
});
test('P109 customer operations fail closed before six real side effects when seller pin absent',async()=>{
 let calls=0;
 for(const cap of ['base-layout','pro-layout','business-layout','template-save','batch-pdf','brand-kit'] as const){
  await assert.rejects(runCustomerLicensedAction([cap],'forged',()=>{calls++;}),SkuAccessDeniedError);
 }
 assert.equal(calls,0);
});
test('P109 empty, unsupported or duplicated capability arrays never bypass',async()=>{
 for(const caps of [[],['invented'],['base-layout','base-layout']] as unknown as Array<Array<'base-layout'>>){
  await assert.rejects(runCustomerLicensedAction(caps,'',()=>{throw Error('must-not-run');}),SkuAccessDeniedError);
  await assert.rejects(runSkuGatedAction(caps,'',()=>{throw Error('must-not-run');}),SkuAccessDeniedError);
 }
});
test('P109 existing preview callbacks retain operation and output behavior',async()=>{
 let calls=0;
 assert.equal(await runSkuGatedAction(['business-layout','brand-kit'],'',()=>{calls++;return 'preview';}),'preview');
 assert.equal(calls,1);
});
