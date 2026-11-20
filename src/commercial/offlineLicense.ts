// Pure offline commercial receipt verifier; without a pinned vendor public key no tier can be unlocked.
// No license server, cloud check, customer document upload or embedded private signing key.
export const ASTRA_LICENSE_FORMAT='astra-offline-license';
export const ASTRA_LICENSE_VERSION=1;
export const ASTRA_PRODUCT_MAJOR=1;
const MAX_LICENSE_BYTES=2048;
const SIGNATURE_BYTE_COUNT=64;
export type LicenseTier='basic'|'pro'|'business';
export interface LicenseClaims {
  licenseId:string;
  tier:LicenseTier;
  productMajor:number;
  issuedAt:number; // epoch seconds UTC
  expiresAt:number|null;
  seats:number;
}
export interface VerifiedEntitlement {
  licenseId:string;
  tier:LicenseTier;
  layouts:8|20|30;
  savedPresets:boolean;
  multiPdf:boolean;
  brandKit:boolean;
  seats:number;
  expiresAt:number|null;
}
const fail=():never=>{throw Error('라이선스 형식·서명·만료를 검증할 수 없습니다.');};
const keys=(raw:unknown,expected:readonly string[]):raw is Record<string,unknown>=>
  raw!==null&&typeof raw==='object'&&!Array.isArray(raw)&&
  Object.keys(raw).length===expected.length&&expected.every(k=>Object.hasOwn(raw,k));
const validEpoch=(n:unknown):n is number=>Number.isSafeInteger(n)&&Number(n)>=1577836800;
export function validateLicenseClaims(raw:unknown):LicenseClaims{
  if(!keys(raw,['licenseId','tier','productMajor','issuedAt','expiresAt','seats']))return fail();
  if(typeof raw.licenseId!=='string'||!/^[A-Z0-9-]{12,64}$/.test(raw.licenseId)||
    !['basic','pro','business'].includes(String(raw.tier))||
    raw.productMajor!==ASTRA_PRODUCT_MAJOR||
    !validEpoch(raw.issuedAt)||
    (raw.expiresAt!==null&&(!validEpoch(raw.expiresAt)||raw.expiresAt<=raw.issuedAt))||
    (raw.seats!==1&&raw.seats!==2))return fail();
  return {licenseId:raw.licenseId,tier:raw.tier as LicenseTier,
    productMajor:ASTRA_PRODUCT_MAJOR,issuedAt:raw.issuedAt,expiresAt:raw.expiresAt as number|null,
    seats:raw.seats};
}
export function canonicalLicensePayload(claims:LicenseClaims):string{
  const license=validateLicenseClaims(claims);
  return JSON.stringify({format:ASTRA_LICENSE_FORMAT,version:ASTRA_LICENSE_VERSION,license});
}
export async function importOfflineLicensePublicKey(jwk:JsonWebKey):Promise<CryptoKey>{
  if(!jwk||jwk.kty!=='EC'||jwk.crv!=='P-256'||typeof jwk.x!=='string'||
    typeof jwk.y!=='string'||jwk.d!==undefined)return fail();
  try{return await crypto.subtle.importKey('jwk',jwk,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);}
  catch{return fail();}
}
function decodeSignature(raw:unknown):Uint8Array<ArrayBuffer>{
  if(typeof raw!=='string'||! /^[A-Za-z0-9_-]{86}$/.test(raw))return fail();
  try{
    const signature=Uint8Array.from(atob(raw.replace(/-/g,'+').replace(/_/g,'/')+'=='),v=>v.charCodeAt(0));
    if(signature.length!==SIGNATURE_BYTE_COUNT)return fail();
    return signature;
  }catch{return fail();}
}
export async function verifyOfflineEntitlement(
  source:string,publicKey:CryptoKey|null,now=Math.floor(Date.now()/1000),
):Promise<VerifiedEntitlement>{
  if(!publicKey||typeof source!=='string'||new TextEncoder().encode(source).length>MAX_LICENSE_BYTES||
     !Number.isSafeInteger(now)||now<1577836800)return fail();
  let raw:unknown;
  try{raw=JSON.parse(source);}catch{return fail();}
  if(!keys(raw,['format','version','license','signature'])||
    raw.format!==ASTRA_LICENSE_FORMAT||raw.version!==ASTRA_LICENSE_VERSION)return fail();
  const claims=validateLicenseClaims(raw.license);
  if(claims.issuedAt>now+300 || (claims.expiresAt!==null && claims.expiresAt<=now))return fail();
  const signature=decodeSignature(raw.signature);
  const encoded=new TextEncoder().encode(canonicalLicensePayload(claims));
  let verified=false;
  try{verified=await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},publicKey,signature,encoded);}catch{return fail();}
  if(!verified)return fail();
  const tier=claims.tier;
  return {licenseId:claims.licenseId,tier,layouts:tier==='basic'?8:tier==='pro'?20:30,
    savedPresets:tier!=='basic',multiPdf:tier!=='basic',brandKit:tier==='business',
    seats:claims.seats,expiresAt:claims.expiresAt};
}
