// P108 owner-side offline license issuance. Never bundle a private key or customer records.
import {ASTRA_LICENSE_FORMAT,ASTRA_LICENSE_VERSION,canonicalLicensePayload,
  validateLicenseClaims,importOfflineLicensePublicKey,verifyOfflineEntitlement,
  type LicenseClaims} from './offlineLicense.ts';
import {publicIssuerJwkThumbprint} from './skuAccess.ts';
const PIN=/^[a-f0-9]{64}$/;
const ERROR='offline-license-issuance-denied';
function deny():never{throw Error(ERROR);}
function validNow(now:number):boolean{return Number.isSafeInteger(now)&&now>=1577836800;}
function operatorClaims(raw:LicenseClaims,now:number):LicenseClaims{
 const c=validateLicenseClaims(raw);
 if(!validNow(now)||c.issuedAt>now+300||
   (c.expiresAt!==null&&c.expiresAt<=now))return deny();
 // Conservative prototype seat policy; final BUSINESS two-seat terms need owner approval.
 if(c.tier!=='business'&&c.seats!==1)return deny();
 return c;
}
async function issuerPublicKey(privateKey:CryptoKey,jwk:JsonWebKey,pin:string):Promise<CryptoKey>{
 if(!privateKey||privateKey.type!=='private'||privateKey.extractable||
   privateKey.algorithm.name!=='ECDSA'||
   !('namedCurve' in privateKey.algorithm)||
   privateKey.algorithm.namedCurve!=='P-256'||
   !privateKey.usages.includes('sign')||!PIN.test(pin))return deny();
 try{
  if(await publicIssuerJwkThumbprint(jwk)!==pin)return deny();
  return await importOfflineLicensePublicKey(jwk);
 }catch{return deny();}
}
export async function issueOfflineLicenseReceipt(
 raw:LicenseClaims,ownerPrivateKey:CryptoKey,ownerPublicJwk:JsonWebKey,
 issuerThumbprintSha256:string,now=Math.floor(Date.now()/1000),
):Promise<string>{
 const c=operatorClaims(raw,now);
 const verifier=await issuerPublicKey(ownerPrivateKey,ownerPublicJwk,issuerThumbprintSha256);
 let bytes:Uint8Array<ArrayBuffer>;
 try{
  bytes=new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},
   ownerPrivateKey,new TextEncoder().encode(canonicalLicensePayload(c))));
 }catch{return deny();}
 if(bytes.length!==64)return deny();
 const signature=btoa(Array.from(bytes,x=>String.fromCharCode(x)).join(''))
  .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 const receipt=JSON.stringify({format:ASTRA_LICENSE_FORMAT,
  version:ASTRA_LICENSE_VERSION,license:c,signature});
 try{
  const verified=await verifyOfflineEntitlement(receipt,verifier,now);
  if(verified.licenseId!==c.licenseId||verified.tier!==c.tier||
    verified.seats!==c.seats||verified.expiresAt!==c.expiresAt)return deny();
  return receipt;
 }catch{return deny();}
}
/** Renew an already-signed identity to a strictly later expiry, without modifying original.
 * Expired originals may be renewed by checking their original valid-time signature.
 * Offline revocation of old grants is NOT possible without authenticated new revocation data.
 */
export async function extendOfflineLicenseReceipt(
 previousReceipt:string,newClaims:LicenseClaims,ownerPrivateKey:CryptoKey,
 ownerPublicJwk:JsonWebKey,issuerThumbprintSha256:string,
 now=Math.floor(Date.now()/1000),
):Promise<string>{
 if(typeof previousReceipt!=='string'||new TextEncoder().encode(previousReceipt).length>2048||
   !validNow(now))return deny();
 let previous:LicenseClaims;
 try{
  const parsed:unknown=JSON.parse(previousReceipt);
  if(!parsed||typeof parsed!=='object'||!('license' in parsed))return deny();
  previous=validateLicenseClaims(parsed.license);
 }catch{return deny();}
 if(previous.issuedAt>now+300||previous.expiresAt===null)return deny();
 const verifier=await issuerPublicKey(ownerPrivateKey,ownerPublicJwk,issuerThumbprintSha256);
 try{await verifyOfflineEntitlement(previousReceipt,verifier,Math.min(now,previous.expiresAt-1));}
 catch{return deny();}
 const next=operatorClaims(newClaims,now);
 if(next.licenseId!==previous.licenseId||next.productMajor!==previous.productMajor||
   next.tier!==previous.tier||next.seats!==previous.seats||
   next.issuedAt<=previous.issuedAt||next.expiresAt===null||
   next.expiresAt<=previous.expiresAt)return deny();
 return issueOfflineLicenseReceipt(next,ownerPrivateKey,ownerPublicJwk,issuerThumbprintSha256,now);
}
