import test from 'node:test';
import assert from 'node:assert/strict';
import {importOfflineLicensePublicKey,verifyOfflineEntitlement,
  type LicenseClaims} from '../src/commercial/offlineLicense.ts';
import {publicIssuerJwkThumbprint,checkProductionSkuCapability,
 productionSkuAccessConfigured} from '../src/commercial/skuAccess.ts';
import {issueOfflineLicenseReceipt,extendOfflineLicenseReceipt}
 from '../src/commercial/offlineLicenseIssuer.ts';
const NOW=1794657600;
async function owner(){
 const keys=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
 const jwk=await crypto.subtle.exportKey('jwk',keys.publicKey);
 const exported=await crypto.subtle.exportKey('pkcs8',keys.privateKey);
 const privateKey=await crypto.subtle.importKey('pkcs8',exported,
  {name:'ECDSA',namedCurve:'P-256'},false,['sign']);
 return {privateKey,jwk,pin:await publicIssuerJwkThumbprint(jwk),exportable:keys.privateKey};
}
const claims=(tier:LicenseClaims['tier']='basic',patch:Partial<LicenseClaims>={}):LicenseClaims=>({
 licenseId:'ASTRA-P108-TEST-0001',tier,productMajor:1,
 issuedAt:NOW-400,expiresAt:NOW+3600,seats:1,...patch,
});
async function issue(o:Awaited<ReturnType<typeof owner>>,c=claims()){
 return issueOfflineLicenseReceipt(c,o.privateKey,o.jwk,o.pin,NOW);
}
test('P108 nonextractable owner key signs all 3 P96-format SKU receipts',async()=>{
 const o=await owner(),key=await importOfflineLicensePublicKey(o.jwk);
 for(const tier of ['basic','pro','business'] as const){
  const receipt=await issue(o,claims(tier));
  const json=JSON.parse(receipt);
  assert.equal(json.signature.length,86);
  assert.deepEqual(Object.keys(json),['format','version','license','signature']);
  const entitlement=await verifyOfflineEntitlement(receipt,key,NOW);
  assert.equal(entitlement.tier,tier);
  assert.equal(entitlement.layouts,tier==='basic'?8:tier==='pro'?20:30);
 }
});
test('P108 extractable owner key and mismatch to public JWK/pin denied',async()=>{
 const o=await owner(),other=await owner(),c=claims();
 await assert.rejects(issueOfflineLicenseReceipt(c,o.exportable,o.jwk,o.pin,NOW));
 await assert.rejects(issueOfflineLicenseReceipt(c,other.privateKey,o.jwk,o.pin,NOW));
 await assert.rejects(issueOfflineLicenseReceipt(c,o.privateKey,o.jwk,other.pin,NOW));
 await assert.rejects(issueOfflineLicenseReceipt(c,o.privateKey,{...o.jwk,d:'PRIVATE'},o.pin,NOW));
});
test('P108 BASIC/PRO are one seat; BUSINESS two-seat draft not license deployment',async()=>{
 const o=await owner(),key=await importOfflineLicensePublicKey(o.jwk);
 for(const tier of ['basic','pro'] as const){
  await assert.rejects(issue(o,claims(tier,{seats:2})));
 }
 const receipt=await issue(o,claims('business',{seats:2}));
 assert.equal((await verifyOfflineEntitlement(receipt,key,NOW)).seats,2);
});
test('P108 rejects future, expired, malformed ID and unsupported SKU',async()=>{
 const o=await owner();
 for(const c of [
  claims('basic',{issuedAt:NOW+400,expiresAt:NOW+4000}),
  claims('basic',{expiresAt:NOW}),
  claims('basic',{licenseId:'short'}),
  claims('basic',{tier:'enterprise' as LicenseClaims['tier']}),
 ]){
  await assert.rejects(issue(o,c));
 }
});
test('P108 valid signed old receipt can be extended without changing SKU or ID',async()=>{
 const o=await owner(),key=await importOfflineLicensePublicKey(o.jwk);
 const old=await issue(o,claims('pro',{issuedAt:NOW-3600,expiresAt:NOW+1}));
 const renewed=await extendOfflineLicenseReceipt(old,
  claims('pro',{issuedAt:NOW,expiresAt:NOW+86400}),o.privateKey,o.jwk,o.pin,NOW);
 assert.notEqual(old,renewed);
 assert.equal((await verifyOfflineEntitlement(renewed,key,NOW+86399)).tier,'pro');
});
test('P108 renewal rejects replayed issue time, shorter expiry, tier and seat switch',async()=>{
 const o=await owner(),old=await issue(o,claims('business'));
 for(const c of [
  claims('business',{issuedAt:NOW-401,expiresAt:NOW+86400}),
  claims('business',{issuedAt:NOW,expiresAt:NOW+3600}),
  claims('basic',{issuedAt:NOW,expiresAt:NOW+86400}),
  claims('business',{seats:2,issuedAt:NOW,expiresAt:NOW+86400}),
  claims('business',{licenseId:'ASTRA-OTHER-TEST-0002',issuedAt:NOW,expiresAt:NOW+86400}),
  claims('business',{issuedAt:NOW,expiresAt:null}),
 ]){
  await assert.rejects(extendOfflineLicenseReceipt(old,c,
   o.privateKey,o.jwk,o.pin,NOW));
 }
});
test('P108 forged old receipt, foreign issuer and perpetual original deny extension',async()=>{
 const o=await owner(),other=await owner(),old=await issue(o,claims('pro'));
 const forged=JSON.stringify({...JSON.parse(old),license:{...JSON.parse(old).license,tier:'business'}});
 const target=claims('pro',{issuedAt:NOW,expiresAt:NOW+90000});
 await assert.rejects(extendOfflineLicenseReceipt(forged,target,o.privateKey,o.jwk,o.pin,NOW));
 await assert.rejects(extendOfflineLicenseReceipt(old,target,other.privateKey,other.jwk,other.pin,NOW));
 const perpetual=await issue(o,claims('pro',{expiresAt:null}));
 await assert.rejects(extendOfflineLicenseReceipt(perpetual,target,o.privateKey,o.jwk,o.pin,NOW));
});
test('P108 test-only private keys never activate unpinned production SKU',async()=>{
 const o=await owner(),receipt=await issue(o,claims('business'));
 assert.equal(productionSkuAccessConfigured(),false);
 assert.equal((await checkProductionSkuCapability(receipt,'brand-kit',NOW)).allowed,false);
 assert.ok(!receipt.includes('PRIVATE KEY'));
});
