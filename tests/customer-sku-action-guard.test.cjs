'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {
 APP_DOCUMENT,ASTRA_CUSTOMER_BUILD_ENABLED,PRODUCTION_ISSUER_JWK,
 PRODUCTION_ISSUER_THUMBPRINT_SHA256,createCustomerSkuActionGuard,
 canonicalLicensePayload,publicIssuerJwkThumbprint,
}=require('../desktop/customer-sku-action-guard.cjs');
const NOW=Math.floor(Date.now()/1000);
const FEATURES=['base-layout','pro-layout','business-layout','template-save','batch-pdf','brand-kit'];
const EXPECTED={
 basic:[true,false,false,false,false,false],
 pro:[true,true,false,true,true,false],
 business:[true,true,true,true,true,true],
};
let sequence=0;
function requestId(){sequence++;return 'p125-request-'+String(sequence).padStart(6,'0');}
function frameFixture(){
 const mainFrame={url:APP_DOCUMENT};
 const contents={mainFrame,isDestroyed:()=>false,getURL:()=>APP_DOCUMENT};
 const mainWindow={webContents:contents,isDestroyed:()=>false};
 return {mainFrame,contents,mainWindow,event:{sender:contents,senderFrame:mainFrame}};
}
function signer(){
 const pair=crypto.generateKeyPairSync('ec',{namedCurve:'prime256v1'});
 const issuerPublicJwk=pair.publicKey.export({format:'jwk'});
 const issuerThumbprintSha256=publicIssuerJwkThumbprint(issuerPublicJwk);
 function sign(tier,overrides={}){
  const license={
   licenseId:'ASTRA-P125-SYNTHETIC-01',tier,productMajor:1,
   issuedAt:NOW-600,expiresAt:NOW+3600,seats:1,...overrides,
  };
  const payload=canonicalLicensePayload(license);
  const signature=crypto.sign('sha256',Buffer.from(payload,'utf8'),
   {key:pair.privateKey,dsaEncoding:'ieee-p1363'}).toString('base64url');
  return JSON.stringify({format:'astra-offline-license',version:1,license,signature});
 }
 return {pair,issuerPublicJwk,issuerThumbprintSha256,sign};
}
function createGuard(f,options={}){
 return createCustomerSkuActionGuard({
  customerBuildEnabled:true,
  issuerPublicJwk:f.issuerPublicJwk,
  issuerThumbprintSha256:f.issuerThumbprintSha256,
  nowSeconds:()=>NOW,
  ...options,
 });
}
function context(f,{receipt,capability='base-layout',id=requestId(),override={}}={}){
 const {event,mainWindow}=frameFixture();
 return {
  event,mainWindow,receipt,requestId:id,requiredCapabilities:[capability],
  ...override,
 };
}
test('P125 ephemeral signed BASIC/PRO/BUSINESS receipts enforce the exact six-capability matrix',async()=>{
 const f=signer(),guard=createGuard(f);
 for(const tier of ['basic','pro','business']){
  const receipt=f.sign(tier);
  for(let i=0;i<FEATURES.length;i++){
   let sideEffects=0;
   const ctx=context(f,{receipt,capability:FEATURES[i]});
   if(EXPECTED[tier][i]){
    await assert.doesNotReject(guard.run(ctx,()=>{sideEffects++;return 'allowed';}),tier+':'+FEATURES[i]);
    assert.equal(sideEffects,1,tier+':'+FEATURES[i]);
   }else{
    await assert.rejects(guard.run(ctx,()=>{sideEffects++;}),/Customer SKU action denied/,tier+':'+FEATURES[i]);
    assert.equal(sideEffects,0,tier+':'+FEATURES[i]);
   }
  }
 }
});
test('P125 main PDF gate maps BASIC8/PRO12/BUSINESS10 and branded output to signed entitlements',async()=>{
 const f=signer(),guard=createGuard(f),base=frameFixture();
 async function invoke(tier,layoutId,brand,allowed){
  let sideEffects=0;
  const receipt=f.sign(tier);
  const ctx={...base,receipt,layoutId,brand,requestId:requestId()};
  const action=()=>{sideEffects++;return 'saved';};
  if(allowed){assert.equal(await guard.runPdf(ctx,action),'saved');assert.equal(sideEffects,1);}
  else {await assert.rejects(guard.runPdf(ctx,action),/Customer SKU action denied/);assert.equal(sideEffects,0);}
 }
 await invoke('basic',null,false,true);
 await invoke('basic','pro-01',false,false);
 await invoke('pro','pro-12',false,true);
 await invoke('pro','business-01',false,false);
 await invoke('business','business-10',true,true);
 await invoke('business','business-01',false,true);
 await invoke('pro','business-01',true,false);
 await assert.rejects(guard.runPdf({...base,receipt:f.sign('business'),layoutId:'business-11',brand:false,requestId:requestId()},()=>{}),/Customer SKU action denied/);
 await assert.rejects(guard.runPdf({...base,receipt:f.sign('pro'),layoutId:null,brand:true,requestId:requestId()},()=>{}),/Customer SKU action denied/);
});
test('P125 missing pin, wrong issuer, malformed, tampered, expired, and invalid-seat receipts fail before side effects',async()=>{
 const a=signer(),b=signer(),guard=createGuard(a);
 const valid=a.sign('business');
 const tampered=JSON.stringify({...JSON.parse(valid),license:{...JSON.parse(valid).license,tier:'basic'}});
 const expired=a.sign('business',{expiresAt:NOW-1});
 const badSeat=a.sign('business',{seats:3});
 const other= createGuard(b);
 const noPin=createCustomerSkuActionGuard({customerBuildEnabled:true,issuerPublicJwk:null,issuerThumbprintSha256:null,nowSeconds:()=>NOW});
 for(const [candidate,policy] of [
  [valid,guard],[valid,other],['not-json',guard],[tampered,guard],[expired,guard],[badSeat,guard],[valid,noPin],
 ]){
  const f=frameFixture();let sideEffects=0;
  await assert.rejects(policy.run({...f,receipt:candidate,requestId:requestId(),requiredCapabilities:['business-layout']},()=>{sideEffects++;}),/Customer SKU action denied/);
  assert.equal(sideEffects,0);
 }
 const f=frameFixture();let sideEffects=0;
 await assert.rejects(guard.run({...f,receipt:valid,requestId:requestId(),requiredCapabilities:['business-layout'],issuerPublicJwk:a.issuerPublicJwk,issuerThumbprintSha256:a.issuerThumbprintSha256},()=>{sideEffects++;}),/Customer SKU action denied/);
 assert.equal(sideEffects,0,'IPC context cannot supply its own issuer key or thumbprint');
});
test('P125 wrong main window, reused frame, child frame, alternate URL, and destroyed shell are denied',async()=>{
 const f=signer(),guard=createGuard(f),receipt=f.sign('business');
 const valid=frameFixture();
 const invalidContexts=[
  {...valid,event:{...valid.event,sender:{}}},
  {...valid,event:{...valid.event,senderFrame:{url:APP_DOCUMENT}}},
  {...valid,event:{...valid.event,senderFrame:{url:'astra://app/child.html'}}},
  {...valid,event:{...valid.event,senderFrame:{...valid.mainFrame,url:'astra://app/index.html?q=1'}}},
  {...valid,mainWindow:{...valid.mainWindow,isDestroyed:()=>true}},
  {...valid,mainWindow:{...valid.mainWindow,webContents:{...valid.contents,isDestroyed:()=>true}}},
 ];
 for(const base of invalidContexts){
  let sideEffects=0;
  await assert.rejects(guard.run({...base,receipt,requestId:requestId(),requiredCapabilities:['business-layout']},()=>{sideEffects++;}),/Customer SKU action denied/);
  assert.equal(sideEffects,0);
 }
});
test('P125 duplicate request id is reserved before the first side effect and replay has zero additional effects',async()=>{
 const f=signer(),guard=createGuard(f),receipt=f.sign('business');
 const ctx=context(f,{receipt,capability:'brand-kit',id:requestId()});
 let sideEffects=0;
 await guard.run(ctx,()=>{sideEffects++;return 'saved';});
 await assert.rejects(guard.run(ctx,()=>{sideEffects++;}),/Customer SKU action denied/);
 assert.equal(sideEffects,1);
});
test('P125 default production policy keeps issuer and customer build disabled while preview remains available',async()=>{
 assert.equal(ASTRA_CUSTOMER_BUILD_ENABLED,false);
 assert.equal(PRODUCTION_ISSUER_JWK,null);
 assert.equal(PRODUCTION_ISSUER_THUMBPRINT_SHA256,null);
 const guard=createCustomerSkuActionGuard({
  customerBuildEnabled:ASTRA_CUSTOMER_BUILD_ENABLED,
  issuerPublicJwk:PRODUCTION_ISSUER_JWK,
  issuerThumbprintSha256:PRODUCTION_ISSUER_THUMBPRINT_SHA256,
 });
 const f=frameFixture();
 assert.equal(await guard.runPdf({...f,layoutId:'business-10',brand:true},()=> 'preview'),'preview');
});
test('P125 production Electron handler passes the untrusted renderer receipt through the main-only policy',()=>{
 const fs=require('node:fs');
 const path=require('node:path');
 const main=fs.readFileSync(path.resolve(__dirname,'../desktop/main.cjs'),'utf8');
 assert.ok(main.includes("require('./customer-sku-action-guard.cjs')"));
 assert.ok(main.includes('customerBuildEnabled:ASTRA_CUSTOMER_BUILD_ENABLED'));
 assert.ok(main.includes('issuerPublicJwk:PRODUCTION_ISSUER_JWK'));
 assert.ok(main.includes('return customerSkuActionGuard.runPdf({'));
 assert.ok(main.includes('receipt:licenseContext&&licenseContext.receipt'));
 assert.ok(main.includes('layoutId:licenseContext?licenseContext.layoutId:null'));
 assert.ok(main.includes('brand:licenseContext?licenseContext.brand:false'));
 assert.ok(main.includes('requestId:licenseContext&&licenseContext.requestId'));
 assert.ok(!main.includes('licenseContext&&licenseContext.issuerPublicJwk'));
});
