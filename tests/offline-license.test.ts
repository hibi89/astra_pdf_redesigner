import test from 'node:test';
import assert from 'node:assert/strict';
import {ASTRA_LICENSE_FORMAT,ASTRA_LICENSE_VERSION,canonicalLicensePayload,
  importOfflineLicensePublicKey,verifyOfflineEntitlement,type LicenseClaims} from '../src/commercial/offlineLicense.ts';

const NOW=1794657600;
async function signer(){
 const keys=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
 const jwk=await crypto.subtle.exportKey('jwk',keys.publicKey);
 const imported=await importOfflineLicensePublicKey(jwk);
 const sign=async(claims:LicenseClaims)=>{
   const payload=canonicalLicensePayload(claims);
   const sig=new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},keys.privateKey,new TextEncoder().encode(payload)));
   const base64=Buffer.from(sig).toString('base64url');
   return JSON.stringify({format:ASTRA_LICENSE_FORMAT,version:ASTRA_LICENSE_VERSION,license:claims,signature:base64});
 };
 return {imported,sign,jwk};
}
const claims=(tier:'basic'|'pro'|'business'='basic'):LicenseClaims=>({
 licenseId:'ASTRA-TEST-OWNER-0001',tier,productMajor:1,issuedAt:NOW-3600,expiresAt:NOW+86400,seats:1,
});
test('P96 3 tiers signed license features verified offline by public key only',async()=>{
 const {imported,sign}=await signer();
 for(const tier of ['basic','pro','business'] as const){
   const receipt=await sign(claims(tier));
   const entitlement=await verifyOfflineEntitlement(receipt,imported,NOW);
   assert.equal(entitlement.tier,tier);
   assert.equal(entitlement.layouts,tier==='basic'?8:tier==='pro'?20:30);
   assert.equal(entitlement.brandKit,tier==='business');
   assert.equal(entitlement.multiPdf,tier!=='basic');
 }
});
test('P96 tampered tier, absent/mismatched signer and expired receipt fail closed',async()=>{
 const {imported,sign,jwk}=await signer();
 const original=await sign(claims('basic'));
 assert.rejects(verifyOfflineEntitlement(original,null,NOW));
 assert.rejects(verifyOfflineEntitlement(JSON.stringify({...JSON.parse(original),license:{...claims('basic'),tier:'business'}}),imported,NOW));
 assert.rejects(verifyOfflineEntitlement(original,imported,NOW+86400));
 const other=await signer();
 assert.rejects(verifyOfflineEntitlement(original,other.imported,NOW));
 assert.rejects(importOfflineLicensePublicKey({...jwk,d:'DO-NOT-IMPORT-PRIVATE-KEY'}));
 assert.rejects(verifyOfflineEntitlement('garbage',imported,NOW));
 assert.rejects(verifyOfflineEntitlement(' '.repeat(2049),imported,NOW));
});
test('P96 old major version, malformed payload, forged future issue fail closed',async()=>{
 const {imported,sign}=await signer();
 const valid=await sign(claims('pro'));
 const parsed=JSON.parse(valid);
 assert.rejects(verifyOfflineEntitlement(JSON.stringify({...parsed,extra:'injected'}),imported,NOW));
 assert.rejects(verifyOfflineEntitlement(JSON.stringify({...parsed,license:{...parsed.license,productMajor:2}}),imported,NOW));
 const future=await sign({...claims('pro'),issuedAt:NOW+400,expiresAt:NOW+1000});
 assert.rejects(verifyOfflineEntitlement(future,imported,NOW));
});
