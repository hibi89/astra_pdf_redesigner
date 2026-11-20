// P107: prospective SKU capability authorization. No runtime activation or customer data.
// Only a vendor-pinned public-key fingerprint may authorize a signed offline receipt.
import {importOfflineLicensePublicKey,verifyOfflineEntitlement,type VerifiedEntitlement} from './offlineLicense.ts';

export type SkuCapability='base-layout'|'pro-layout'|'business-layout'|
 'template-save'|'batch-pdf'|'brand-kit';
export type SkuDecision={
 allowed:boolean;
 reason:'verified-tier'|'untrusted-issuer'|'invalid-or-expired-receipt'|'tier-not-entitled';
 tier:'basic'|'pro'|'business'|null;
 commercialReleaseApproved:false;
};
const deny=(reason:SkuDecision['reason']):SkuDecision=>({
 allowed:false,reason,tier:null,commercialReleaseApproved:false,
});
const SHA=/^[0-9a-f]{64}$/;
function validJwk(jwk:JsonWebKey):boolean{
 return jwk!==null&&jwk.kty==='EC'&&jwk.crv==='P-256'&&
   typeof jwk.x==='string'&&typeof jwk.y==='string'&&
   /^[A-Za-z0-9_-]{43}$/.test(jwk.x)&&/^[A-Za-z0-9_-]{43}$/.test(jwk.y)&&
   jwk.d===undefined;
}
/** RFC 7638 JWK thumbprint: canonical crv,kty,x,y order; only the public key. */
export async function publicIssuerJwkThumbprint(jwk:JsonWebKey):Promise<string>{
 if(!validJwk(jwk))throw Error('invalid-issuer-public-jwk');
 const raw=JSON.stringify({crv:'P-256',kty:'EC',x:jwk.x,y:jwk.y});
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));
 return Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
}
function tierAllows(e:VerifiedEntitlement,capability:SkuCapability):boolean{
 switch(capability){
  case 'base-layout': return e.layouts>=8;
  case 'pro-layout': return e.layouts>=20;
  case 'business-layout': return e.layouts===30;
  case 'template-save':return e.savedPresets;
  case 'batch-pdf':return e.multiPdf;
  case 'brand-kit':return e.brandKit;
  default:return false;
 }
}
/** Building block only: caller's key+pin must be sourced from a trusted build, never UI or receipt. */
export async function verifyPinnedSkuCapability(
 licenseText:string,
 issuerPublicJwk:JsonWebKey|null,
 pinnedIssuerThumbprintSha256:string|null,
 capability:SkuCapability,
 now=Math.floor(Date.now()/1000),
):Promise<SkuDecision>{
 if(!issuerPublicJwk||typeof pinnedIssuerThumbprintSha256!=='string'||
    !SHA.test(pinnedIssuerThumbprintSha256))return deny('untrusted-issuer');
 if(!['base-layout','pro-layout','business-layout','template-save','batch-pdf','brand-kit']
  .includes(capability))return deny('tier-not-entitled');
 try{
  const fingerprint=await publicIssuerJwkThumbprint(issuerPublicJwk);
  if(fingerprint!==pinnedIssuerThumbprintSha256)return deny('untrusted-issuer');
  const key=await importOfflineLicensePublicKey(issuerPublicJwk);
  const verified=await verifyOfflineEntitlement(licenseText,key,now);
  const allowed=tierAllows(verified,capability);
  return {allowed,reason:allowed?'verified-tier':'tier-not-entitled',
    tier:verified.tier,commercialReleaseApproved:false};
 }catch{return deny('invalid-or-expired-receipt');}
}

// Never fill from user input, localStorage, IPC, network or a test-generated key.
// The actual vendor key pin must be code-reviewed and approved before this is wired into UI.
// Without one, commercial access always denies; existing unsold dev preview is unchanged.
export const PRODUCTION_ISSUER_JWK:JsonWebKey|null=null;
export const PRODUCTION_ISSUER_THUMBPRINT_SHA256:string|null=null;
export function productionSkuAccessConfigured():boolean{
 return PRODUCTION_ISSUER_JWK!==null&&PRODUCTION_ISSUER_THUMBPRINT_SHA256!==null;
}
export async function checkProductionSkuCapability(
 licenseText:string,capability:SkuCapability,now=Math.floor(Date.now()/1000),
):Promise<SkuDecision>{
 return verifyPinnedSkuCapability(
  licenseText,PRODUCTION_ISSUER_JWK,PRODUCTION_ISSUER_THUMBPRINT_SHA256,capability,now);
}
