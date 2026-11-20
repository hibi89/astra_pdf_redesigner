import test from 'node:test';
import assert from 'node:assert/strict';
import {ASTRA_LICENSE_FORMAT,ASTRA_LICENSE_VERSION,canonicalLicensePayload,type LicenseClaims}
 from '../src/commercial/offlineLicense.ts';
import {publicIssuerJwkThumbprint,verifyPinnedSkuCapability,checkProductionSkuCapability,
 productionSkuAccessConfigured,type SkuCapability} from '../src/commercial/skuAccess.ts';

const NOW=1794657600;
const BASE={licenseId:'ASTRA-P107-SYNTHETIC-01',productMajor:1,issuedAt:NOW-600,expiresAt:NOW+3600,seats:1};
async function fixture(){
 const kp=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
 const jwk=await crypto.subtle.exportKey('jwk',kp.publicKey);
 const pin=await publicIssuerJwkThumbprint(jwk);
 async function sign(tier:LicenseClaims['tier'],change:Partial<LicenseClaims>={}){
  const claims:LicenseClaims={...BASE,tier,...change};
  const payload=canonicalLicensePayload(claims);
  const signature=Buffer.from(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},
   kp.privateKey,new TextEncoder().encode(payload))).toString('base64url');
  return JSON.stringify({format:ASTRA_LICENSE_FORMAT,version:ASTRA_LICENSE_VERSION,
    license:claims,signature});
 }
 return {jwk,pin,sign};
}
const features:SkuCapability[]=[
 'base-layout','pro-layout','business-layout','template-save','batch-pdf','brand-kit'];
const expected={
 basic:[true,false,false,false,false,false],
 pro:[true,true,false,true,true,false],
 business:[true,true,true,true,true,true],
};
test('P107 exact SKU feature matrix enforced on real WebCrypto signed synthetic receipts',async()=>{
 const f=await fixture();
 for(const tier of ['basic','pro','business'] as const){
  const receipt=await f.sign(tier);
  for(let i=0;i<features.length;i++){
   const d=await verifyPinnedSkuCapability(receipt,f.jwk,f.pin,features[i],NOW);
   assert.equal(d.allowed,expected[tier][i],tier+':'+features[i]);
   assert.equal(d.tier,tier);
   assert.equal(d.commercialReleaseApproved,false);
  }
 }
});
test('P107 product default refuses all entitlements with no vendor public-key pin',async()=>{
 assert.equal(productionSkuAccessConfigured(),false);
 for(const feature of features){
  const r=await checkProductionSkuCapability('untrusted',{...{f:feature}}.f,NOW);
  assert.equal(r.allowed,false);
  assert.equal(r.reason,'untrusted-issuer');
  assert.equal(r.commercialReleaseApproved,false);
 }
});
test('P107 mismatched issuer fingerprint rejected without trusting user-provided JWK',async()=>{
 const f=await fixture(),d=await verifyPinnedSkuCapability(await f.sign('business'),f.jwk,'1'.repeat(64),'brand-kit',NOW);
 assert.equal(d.allowed,false);assert.equal(d.reason,'untrusted-issuer');
});
test('P107 missing pin, public key, private-key JWK or malformed pin never unlocks',async()=>{
 const f=await fixture(),r=await f.sign('business');
 for(const [jwk,pin] of [[null,f.pin],[f.jwk,null],[f.jwk,'AB'.repeat(32)]] as const){
  assert.equal((await verifyPinnedSkuCapability(r,jwk,pin,'brand-kit',NOW)).allowed,false);
 }
 const corrupted={...f.jwk,d:'malicious-private-key-field'};
 assert.equal((await verifyPinnedSkuCapability(r,corrupted,f.pin,'brand-kit',NOW)).allowed,false);
});
test('P107 altered tier, expired, future and wrong-signer receipts rejected',async()=>{
 const a=await fixture(),b=await fixture();
 const base=await a.sign('basic');
 const tampered=JSON.stringify({...JSON.parse(base),license:{...JSON.parse(base).license,tier:'business'}});
 for(const [receipt,jwk,pin,now] of [
  [tampered,a.jwk,a.pin,NOW],[base,b.jwk,b.pin,NOW],
  [await a.sign('pro'),a.jwk,a.pin,NOW+7200],
  [await a.sign('business',{issuedAt:NOW+400,expiresAt:NOW+1000}),a.jwk,a.pin,NOW],
 ] as const){
  assert.equal((await verifyPinnedSkuCapability(receipt,jwk,pin,'brand-kit',now)).allowed,false);
 }
});
test('P107 arbitrary capability strings cannot inherit basic permissions',async()=>{
 const f=await fixture(),receipt=await f.sign('business');
 const result=await verifyPinnedSkuCapability(receipt,f.jwk,f.pin,'delete-all-pdf' as SkuCapability,NOW);
 assert.equal(result.allowed,false);assert.equal(result.commercialReleaseApproved,false);
});
test('P107 pinned public JWK thumbprint stable and private JWK rejected',async()=>{
 const f=await fixture();
 assert.equal(await publicIssuerJwkThumbprint(f.jwk),f.pin);
 await assert.rejects(publicIssuerJwkThumbprint({...f.jwk,d:'bad-private'}));
});
