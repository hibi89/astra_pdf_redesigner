'use strict';
// P125 main-process entitlement boundary. No product release is authorized here.
const crypto=require('node:crypto');
const APP_DOCUMENT='astra://app/index.html';
const ASTRA_LICENSE_FORMAT='astra-offline-license';
const ASTRA_LICENSE_VERSION=1;
const ASTRA_PRODUCT_MAJOR=1;
const ASTRA_CUSTOMER_BUILD_ENABLED=false;
const PRODUCTION_ISSUER_JWK=null;
const PRODUCTION_ISSUER_THUMBPRINT_SHA256=null;
const MAX_LICENSE_BYTES=2048;
const MAX_CONSUMED_REQUESTS=4096;
const CAPABILITIES=new Set(['base-layout','pro-layout','business-layout','template-save','batch-pdf','brand-kit']);
const DENIED='Customer SKU action denied';
function deny(){throw Error(DENIED);}
function exactKeys(value,expected){
 return value!==null&&typeof value==='object'&&!Array.isArray(value)&&
  Object.keys(value).length===expected.length&&expected.every(key=>Object.hasOwn(value,key));
}
function validEpoch(value){return Number.isSafeInteger(value)&&value>=1577836800;}
function validPublicJwk(jwk){
 return jwk!==null&&typeof jwk==='object'&&jwk.kty==='EC'&&jwk.crv==='P-256'&&
  typeof jwk.x==='string'&&/^[A-Za-z0-9_-]{43}$/.test(jwk.x)&&
  typeof jwk.y==='string'&&/^[A-Za-z0-9_-]{43}$/.test(jwk.y)&&jwk.d===undefined;
}
function publicIssuerJwkThumbprint(jwk){
 if(!validPublicJwk(jwk))deny();
 const canonical=JSON.stringify({crv:'P-256',kty:'EC',x:jwk.x,y:jwk.y});
 return crypto.createHash('sha256').update(canonical,'utf8').digest('hex');
}
function canonicalLicensePayload(license){
 const canonical={
  licenseId:license.licenseId,tier:license.tier,productMajor:license.productMajor,
  issuedAt:license.issuedAt,expiresAt:license.expiresAt,seats:license.seats,
 };
 return JSON.stringify({format:ASTRA_LICENSE_FORMAT,version:ASTRA_LICENSE_VERSION,license:canonical});
}
function verifySignedEntitlement(receipt,issuerPublicJwk,pinnedThumbprint,nowSeconds){
 if(typeof receipt!=='string'||Buffer.byteLength(receipt,'utf8')>MAX_LICENSE_BYTES||
    !validPublicJwk(issuerPublicJwk)||typeof pinnedThumbprint!=='string'||
    !/^[0-9a-f]{64}$/.test(pinnedThumbprint)||!Number.isSafeInteger(nowSeconds)||nowSeconds<1577836800)
  deny();
 if(publicIssuerJwkThumbprint(issuerPublicJwk)!==pinnedThumbprint)deny();
 let parsed;
 try{parsed=JSON.parse(receipt);}catch{deny();}
 if(!exactKeys(parsed,['format','version','license','signature'])||
    parsed.format!==ASTRA_LICENSE_FORMAT||parsed.version!==ASTRA_LICENSE_VERSION||
    !exactKeys(parsed.license,['licenseId','tier','productMajor','issuedAt','expiresAt','seats']))
  deny();
 const license=parsed.license;
 if(typeof license.licenseId!=='string'||!/^[A-Z0-9-]{12,64}$/.test(license.licenseId)||
    !['basic','pro','business'].includes(license.tier)||license.productMajor!==ASTRA_PRODUCT_MAJOR||
    !validEpoch(license.issuedAt)||
    (license.expiresAt!==null&&(!validEpoch(license.expiresAt)||license.expiresAt<=license.issuedAt))||
    (license.seats!==1&&license.seats!==2)||license.issuedAt>nowSeconds+300||
    (license.expiresAt!==null&&license.expiresAt<=nowSeconds))deny();
 if(typeof parsed.signature!=='string'||! /^[A-Za-z0-9_-]{86}$/.test(parsed.signature))deny();
 let signature;
 try{signature=Buffer.from(parsed.signature,'base64url');}catch{deny();}
 if(signature.length!==64||signature.toString('base64url')!==parsed.signature)deny();
 let verified=false;
 try{
  const key=crypto.createPublicKey({key:issuerPublicJwk,format:'jwk'});
  verified=crypto.verify('sha256',Buffer.from(canonicalLicensePayload(license),'utf8'),
   {key,dsaEncoding:'ieee-p1363'},signature);
 }catch{deny();}
 if(!verified)deny();
 return {tier:license.tier,seats:license.seats,expiresAt:license.expiresAt};
}
function capabilityAllowed(tier,capability){
 switch(capability){
  case 'base-layout':return tier==='basic'||tier==='pro'||tier==='business';
  case 'pro-layout':return tier==='pro'||tier==='business';
  case 'business-layout':return tier==='business';
  case 'template-save':return tier==='pro'||tier==='business';
  case 'batch-pdf':return tier==='pro'||tier==='business';
  case 'brand-kit':return tier==='business';
  default:return false;
 }
}
function pdfCapabilitiesForLayout(layoutId,brand){
 if(typeof brand!=='boolean')deny();
 let capability;
 if(layoutId===null||layoutId===undefined)capability='base-layout';
 else if(typeof layoutId==='string'&&/^pro-(?:0[1-9]|1[0-2])$/.test(layoutId))capability='pro-layout';
 else if(typeof layoutId==='string'&&/^business-(?:0[1-9]|10)$/.test(layoutId))capability='business-layout';
 else deny();
 if(brand){
  if(capability!=='business-layout')deny();
  return [capability,'brand-kit'];
 }
 return [capability];
}
function assertTrustedMainFrame(event,mainWindow){
 if(!mainWindow||typeof mainWindow.isDestroyed!=='function'||mainWindow.isDestroyed())deny();
 const contents=mainWindow.webContents;
 if(!contents||typeof contents.isDestroyed!=='function'||contents.isDestroyed()||
    !event||event.sender!==contents||!event.senderFrame||!contents.mainFrame||
    event.senderFrame!==contents.mainFrame||event.senderFrame.url!==APP_DOCUMENT||
    contents.getURL()!==APP_DOCUMENT)deny();
}
function createCustomerSkuActionGuard(options={}){
 const customerBuildEnabled=options.customerBuildEnabled===true;
 const issuerPublicJwk=options.issuerPublicJwk===undefined?null:options.issuerPublicJwk;
 const pinnedThumbprint=options.issuerThumbprintSha256===undefined?null:options.issuerThumbprintSha256;
 const nowSeconds=typeof options.nowSeconds==='function'?options.nowSeconds:()=>Math.floor(Date.now()/1000);
 const consumedRequestIds=new Set();
 async function run(context,action){
  if(typeof action!=='function')deny();
  assertTrustedMainFrame(context&&context.event,context&&context.mainWindow);
  if(!customerBuildEnabled)return action();
  if(!context||typeof context.requestId!=='string'||
     !/^[A-Za-z0-9_-]{16,128}$/.test(context.requestId)||
     !Array.isArray(context.requiredCapabilities)||context.requiredCapabilities.length<1||
     context.requiredCapabilities.length>CAPABILITIES.size||
     new Set(context.requiredCapabilities).size!==context.requiredCapabilities.length||
     context.requiredCapabilities.some(value=>!CAPABILITIES.has(value))||
     consumedRequestIds.has(context.requestId)||consumedRequestIds.size>=MAX_CONSUMED_REQUESTS)deny();
  const entitlement=verifySignedEntitlement(context.receipt,issuerPublicJwk,pinnedThumbprint,nowSeconds());
  if(context.requiredCapabilities.some(capability=>!capabilityAllowed(entitlement.tier,capability)))deny();
  // Reserve before side effects so concurrent or repeated IPC with the same ID cannot run twice.
  consumedRequestIds.add(context.requestId);
  return action();
 }
 async function runPdf(context,action){
  if(typeof action!=='function')deny();
  const requiredCapabilities=pdfCapabilitiesForLayout(context&&context.layoutId,context&&context.brand);
  return run({...context,requiredCapabilities},action);
 }
 return Object.freeze({run,runPdf});
}
module.exports={
 APP_DOCUMENT,ASTRA_CUSTOMER_BUILD_ENABLED,PRODUCTION_ISSUER_JWK,
 PRODUCTION_ISSUER_THUMBPRINT_SHA256,createCustomerSkuActionGuard,
 canonicalLicensePayload,publicIssuerJwkThumbprint,verifySignedEntitlement,
 capabilityAllowed,pdfCapabilitiesForLayout,
};
