// C006 owner-side offline license lifecycle ledger.
// This is an unsigned-by-default, pure replay helper. It is not wired into customer activation.
// Production issuer material must remain null until the owner approves its custody and policy.
import {ASTRA_PRODUCT_MAJOR,
  importOfflineLicensePublicKey,validateLicenseClaims,verifyOfflineEntitlement,
  type LicenseClaims} from './offlineLicense.ts';
import {publicIssuerJwkThumbprint} from './skuAccess.ts';

export const ASTRA_LICENSE_LIFECYCLE_FORMAT='astra-offline-license-lifecycle';
export const ASTRA_LICENSE_LIFECYCLE_EVENT_FORMAT='astra-offline-license-lifecycle-event';
export const ASTRA_LICENSE_LIFECYCLE_VERSION=1;
const ZERO_HASH='0'.repeat(64);
const PIN=/^[a-f0-9]{64}$/;
const HASH=/^[a-f0-9]{64}$/;
const EVENT_ID=/^[A-Za-z0-9_-]{16,128}$/;
const INSTALLATION_REF=/^[a-f0-9]{32}$/;
const SUPPORT_CASE_REF=/^[A-Z0-9_-]{12,64}$/;
const MAX_LICENSE_BYTES=2048;
const MAX_EVENT_BYTES=4096;
const MAX_LIFECYCLE_EVENTS=4096;
const DENIED='offline-license-lifecycle-denied';

export type LicenseLifecycleStatus='issued'|'active'|'revoked'|'refunded';
export type LicenseEffectiveStatus=LicenseLifecycleStatus|'expired';
export type LicenseSupportStatus='none'|'open'|'awaiting-customer'|'awaiting-owner'|'resolved';
export type LicenseLifecycleAction=
 'activate-installation'|'release-installation'|'renew-license'|'revoke'|'refund'|
 'support-open'|'support-awaiting-customer'|'support-awaiting-owner'|'support-resolve';

export interface LicenseLifecycleEvent {
 licenseId:string;
 sequence:number;
 previousEventHash:string;
 eventId:string;
 action:LicenseLifecycleAction;
 occurredAt:number;
 installationRef:string|null;
 supportCaseRef:string|null;
 replacementReceipt:string|null;
}
export interface SignedLicenseLifecycleEvent {
 format:typeof ASTRA_LICENSE_LIFECYCLE_EVENT_FORMAT;
 version:typeof ASTRA_LICENSE_LIFECYCLE_VERSION;
 event:LicenseLifecycleEvent;
 signature:string;
}
export interface LicenseLifecycleSnapshot {
 format:typeof ASTRA_LICENSE_LIFECYCLE_FORMAT;
 version:typeof ASTRA_LICENSE_LIFECYCLE_VERSION;
 license:LicenseClaims;
 status:LicenseLifecycleStatus;
 installationRefs:string[];
 supportStatus:LicenseSupportStatus;
 supportCaseRef:string|null;
 sequence:number;
 lastEventHash:string;
 lastEventAt:number;
}

function deny():never{throw Error(DENIED);}
function exactKeys(value:unknown,expected:readonly string[]):value is Record<string,unknown>{
 return value!==null&&typeof value==='object'&&!Array.isArray(value)&&
  Object.keys(value).length===expected.length&&expected.every(key=>Object.hasOwn(value,key));
}
function validEpoch(value:unknown):value is number{
 return Number.isSafeInteger(value)&&Number(value)>=1577836800;
}
function parseJson(value:string,maxBytes:number):unknown{
 if(typeof value!=='string'||new TextEncoder().encode(value).byteLength>maxBytes)return deny();
 try{return JSON.parse(value) as unknown;}catch{return deny();}
}
function validatePublicPin(pin:string):void{
 if(typeof pin!=='string'||!PIN.test(pin))deny();
}
async function importPinnedPublicKey(jwk:JsonWebKey|null,pin:string|null):Promise<CryptoKey>{
 if(!jwk||!pin)deny();
 validatePublicPin(pin);
 try{
  if(await publicIssuerJwkThumbprint(jwk)!==pin)deny();
  return await importOfflineLicensePublicKey(jwk);
 }catch{return deny();}
}
function encodeSignature(bytes:Uint8Array):string{
 if(bytes.length!==64)deny();
 return btoa(Array.from(bytes,value=>String.fromCharCode(value)).join(''))
  .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function decodeSignature(raw:unknown):Uint8Array<ArrayBuffer>{
 if(typeof raw!=='string'||!/^[A-Za-z0-9_-]{86}$/.test(raw))return deny();
 try{
  const bytes=Uint8Array.from(atob(raw.replace(/-/g,'+').replace(/_/g,'/')+'=='),
   value=>value.charCodeAt(0));
  if(bytes.length!==64||encodeSignature(bytes)!==raw)return deny();
  return bytes;
 }catch{return deny();}
}
function canonicalEvent(raw:unknown):LicenseLifecycleEvent{
 const fields=['licenseId','sequence','previousEventHash','eventId','action','occurredAt',
  'installationRef','supportCaseRef','replacementReceipt'] as const;
 if(!exactKeys(raw,fields))return deny();
 const event=raw as unknown as LicenseLifecycleEvent;
 const actions:readonly string[]=[
  'activate-installation','release-installation','renew-license','revoke','refund',
  'support-open','support-awaiting-customer','support-awaiting-owner','support-resolve',
 ];
 if(typeof event.licenseId!=='string'||!/^[A-Z0-9-]{12,64}$/.test(event.licenseId)||
   !Number.isSafeInteger(event.sequence)||event.sequence<1||
   typeof event.previousEventHash!=='string'||!HASH.test(event.previousEventHash)||
   typeof event.eventId!=='string'||!EVENT_ID.test(event.eventId)||
   !actions.includes(event.action)||!validEpoch(event.occurredAt)||
   (event.installationRef!==null&&
    (typeof event.installationRef!=='string'||!INSTALLATION_REF.test(event.installationRef)))||
   (event.supportCaseRef!==null&&
    (typeof event.supportCaseRef!=='string'||!SUPPORT_CASE_REF.test(event.supportCaseRef)))||
   (event.replacementReceipt!==null&&
    (typeof event.replacementReceipt!=='string'||
     new TextEncoder().encode(event.replacementReceipt).byteLength>MAX_LICENSE_BYTES)))return deny();

 const deviceAction=event.action==='activate-installation'||event.action==='release-installation';
 const supportAction=event.action.startsWith('support-');
 const renewal=event.action==='renew-license';
 if((deviceAction)!==(event.installationRef!==null)||
    (supportAction)!==(event.supportCaseRef!==null)||
    (renewal)!==(event.replacementReceipt!==null))return deny();
 return {
  licenseId:event.licenseId,sequence:event.sequence,previousEventHash:event.previousEventHash,
  eventId:event.eventId,action:event.action,occurredAt:event.occurredAt,
  installationRef:event.installationRef,supportCaseRef:event.supportCaseRef,
  replacementReceipt:event.replacementReceipt,
 };
}
function parseEnvelope(raw:string):SignedLicenseLifecycleEvent{
 const parsed=parseJson(raw,MAX_EVENT_BYTES);
 if(!exactKeys(parsed,['format','version','event','signature'])||
    parsed.format!==ASTRA_LICENSE_LIFECYCLE_EVENT_FORMAT||
    parsed.version!==ASTRA_LICENSE_LIFECYCLE_VERSION||
    typeof parsed.signature!=='string')return deny();
 const event=canonicalEvent(parsed.event);
 decodeSignature(parsed.signature);
 return {format:ASTRA_LICENSE_LIFECYCLE_EVENT_FORMAT,
  version:ASTRA_LICENSE_LIFECYCLE_VERSION,event,signature:parsed.signature};
}
async function verifyReceiptClaims(
 receipt:string,key:CryptoKey,now:number,
):Promise<LicenseClaims>{
 const parsed=parseJson(receipt,MAX_LICENSE_BYTES);
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)||
   !('license' in parsed))return deny();
 const claims=validateLicenseClaims(parsed.license);
 if(claims.productMajor!==ASTRA_PRODUCT_MAJOR||claims.issuedAt>now+300)return deny();
 // Validate historic signatures even after the grant expires. Effective expiry is derived below.
 const signatureCheckAt=claims.expiresAt===null
  ?Math.max(now,claims.issuedAt)
  :Math.max(claims.issuedAt,Math.min(now,claims.expiresAt-1));
 try{
  const entitlement=await verifyOfflineEntitlement(receipt,key,signatureCheckAt);
  if(entitlement.licenseId!==claims.licenseId||entitlement.tier!==claims.tier||
    entitlement.seats!==claims.seats||entitlement.expiresAt!==claims.expiresAt)return deny();
 }catch{return deny();}
 return claims;
}
function effectiveStatus(snapshot:LicenseLifecycleSnapshot,now:number):LicenseEffectiveStatus{
 if(!validEpoch(now))return deny();
 if((snapshot.status==='issued'||snapshot.status==='active')&&
   snapshot.license.expiresAt!==null&&snapshot.license.expiresAt<=now)return 'expired';
 return snapshot.status;
}
function validateSnapshot(snapshot:LicenseLifecycleSnapshot):void{
 if(!snapshot||typeof snapshot!=='object')return deny();
 const checkedLicense=validateLicenseClaims(snapshot.license);
 if(checkedLicense.tier!=='business'&&checkedLicense.seats!==1)return deny();
 if(!exactKeys(snapshot,['format','version','license','status','installationRefs',
  'supportStatus','supportCaseRef','sequence','lastEventHash','lastEventAt'])||
   snapshot.format!==ASTRA_LICENSE_LIFECYCLE_FORMAT||
   snapshot.version!==ASTRA_LICENSE_LIFECYCLE_VERSION||
   !['issued','active','revoked','refunded'].includes(snapshot.status)||
   !Array.isArray(snapshot.installationRefs)||snapshot.installationRefs.length>2||
   snapshot.installationRefs.some(ref=>typeof ref!=='string'||!INSTALLATION_REF.test(ref))||
   new Set(snapshot.installationRefs).size!==snapshot.installationRefs.length||
   snapshot.installationRefs.length>snapshot.license.seats||
   !['none','open','awaiting-customer','awaiting-owner','resolved'].includes(snapshot.supportStatus)||
   (snapshot.supportCaseRef!==null&&
    (typeof snapshot.supportCaseRef!=='string'||!SUPPORT_CASE_REF.test(snapshot.supportCaseRef)))||
   !Number.isSafeInteger(snapshot.sequence)||snapshot.sequence<0||
   typeof snapshot.lastEventHash!=='string'||!HASH.test(snapshot.lastEventHash)||
   !validEpoch(snapshot.lastEventAt))deny();
 if((snapshot.supportStatus==='none')!==(snapshot.supportCaseRef===null))deny();
 if(snapshot.status==='issued'&&snapshot.installationRefs.length!==0)deny();
 if(snapshot.status==='active'&&snapshot.installationRefs.length===0)deny();
 if((snapshot.status==='revoked'||snapshot.status==='refunded')&&snapshot.installationRefs.length!==0)deny();
 if(snapshot.lastEventAt<snapshot.license.issuedAt||
   (snapshot.sequence===0&&
    (snapshot.lastEventHash!==ZERO_HASH||snapshot.lastEventAt!==snapshot.license.issuedAt)))deny();
}
function commandEvent(snapshot:LicenseLifecycleSnapshot,command:unknown):LicenseLifecycleEvent{
 if(!command||typeof command!=='object'||Array.isArray(command))return deny();
 const raw=command as Record<string,unknown>;
 const action=raw.action;
 let expected:readonly string[];
 if(action==='activate-installation'||action==='release-installation')
  expected=['action','eventId','occurredAt','installationRef'];
 else if(action==='renew-license')
  expected=['action','eventId','occurredAt','replacementReceipt'];
 else if(action==='revoke'||action==='refund')
  expected=['action','eventId','occurredAt'];
 else if(action==='support-open'||action==='support-awaiting-customer'||
         action==='support-awaiting-owner'||action==='support-resolve')
  expected=['action','eventId','occurredAt','supportCaseRef'];
 else return deny();
 if(!exactKeys(raw,expected)||typeof raw.eventId!=='string'||
  !EVENT_ID.test(raw.eventId)||!validEpoch(raw.occurredAt)||
  raw.occurredAt<snapshot.lastEventAt)return deny();
 const event:LicenseLifecycleEvent={
  licenseId:snapshot.license.licenseId,sequence:snapshot.sequence+1,
  previousEventHash:snapshot.lastEventHash,eventId:raw.eventId,action:action as LicenseLifecycleAction,
  occurredAt:raw.occurredAt,
  installationRef:action==='activate-installation'||action==='release-installation'
   ?raw.installationRef as string:null,
  supportCaseRef:action.startsWith('support-')?raw.supportCaseRef as string:null,
  replacementReceipt:action==='renew-license'?raw.replacementReceipt as string:null,
 };
 return canonicalEvent(event);
}
function sameLicenseIdentity(a:LicenseClaims,b:LicenseClaims):boolean{
 return a.licenseId===b.licenseId&&a.tier===b.tier&&
  a.productMajor===b.productMajor&&a.seats===b.seats;
}

export function effectiveLicenseLifecycleStatus(
 snapshot:LicenseLifecycleSnapshot,now=Math.floor(Date.now()/1000),
):LicenseEffectiveStatus{
 validateSnapshot(snapshot);
 return effectiveStatus(snapshot,now);
}

/** Seed an owner-side ledger from a genuine P96 signed receipt. No real issuer is configured by this module. */
export async function createLicenseLifecycleSnapshot(
 receipt:string,issuerPublicJwk:JsonWebKey|null,pinnedIssuerThumbprintSha256:string|null,
 now=Math.floor(Date.now()/1000),
):Promise<LicenseLifecycleSnapshot>{
 if(!validEpoch(now))return deny();
 const key=await importPinnedPublicKey(issuerPublicJwk,pinnedIssuerThumbprintSha256);
 const license=await verifyReceiptClaims(receipt,key,now);
 return {
  format:ASTRA_LICENSE_LIFECYCLE_FORMAT,version:ASTRA_LICENSE_LIFECYCLE_VERSION,
  license,status:'issued',installationRefs:[],supportStatus:'none',supportCaseRef:null,
  sequence:0,lastEventHash:ZERO_HASH,lastEventAt:license.issuedAt,
 };
}

/** Owner-side signer. Caller should pass a snapshot produced by full signed-log replay. */
export async function signLicenseLifecycleCommand(
 snapshot:LicenseLifecycleSnapshot,command:unknown,ownerPrivateKey:CryptoKey,
 issuerPublicJwk:JsonWebKey|null,pinnedIssuerThumbprintSha256:string|null,
 now=Math.floor(Date.now()/1000),
):Promise<string>{
 validateSnapshot(snapshot);
 if(!validEpoch(now)||!ownerPrivateKey||ownerPrivateKey.type!=='private'||
   ownerPrivateKey.extractable||ownerPrivateKey.algorithm.name!=='ECDSA'||
   !('namedCurve' in ownerPrivateKey.algorithm)||
   ownerPrivateKey.algorithm.namedCurve!=='P-256'||
   !ownerPrivateKey.usages.includes('sign'))return deny();
 const key=await importPinnedPublicKey(issuerPublicJwk,pinnedIssuerThumbprintSha256);
 const event=commandEvent(snapshot,command);
 if(event.occurredAt>now+300||event.sequence>MAX_LIFECYCLE_EVENTS)return deny();
 const bytes=new TextEncoder().encode(JSON.stringify(event));
 let signatureBytes:Uint8Array<ArrayBuffer>;
 try{signatureBytes=new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},ownerPrivateKey,bytes));}
 catch{return deny();}
 const signature=encodeSignature(signatureBytes);
 const envelope:SignedLicenseLifecycleEvent={
  format:ASTRA_LICENSE_LIFECYCLE_EVENT_FORMAT,version:ASTRA_LICENSE_LIFECYCLE_VERSION,
  event,signature,
 };
 const encoded=JSON.stringify(envelope);
 if(new TextEncoder().encode(encoded).byteLength>MAX_EVENT_BYTES)return deny();
 try{
  if(!await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,signatureBytes,bytes))return deny();
 }catch{return deny();}
 return encoded;
}

/**
 * Replays the signed event log from the original receipt; do not trust a snapshot restored without its full log.
 * Refund/revoke here updates this owner ledger only; the current offline buyer app does not receive revocation data.
 */
export async function replayLicenseLifecycle(
 receipt:string,signedEvents:readonly string[],issuerPublicJwk:JsonWebKey|null,
 pinnedIssuerThumbprintSha256:string|null,now=Math.floor(Date.now()/1000),
):Promise<LicenseLifecycleSnapshot>{
 if(!Array.isArray(signedEvents)||signedEvents.length>MAX_LIFECYCLE_EVENTS||!validEpoch(now))return deny();
 const key=await importPinnedPublicKey(issuerPublicJwk,pinnedIssuerThumbprintSha256);
 const state=await createLicenseLifecycleSnapshot(receipt,issuerPublicJwk,pinnedIssuerThumbprintSha256,now);
 let lastEventAt=state.lastEventAt;
 for(const raw of signedEvents){
  if(typeof raw!=='string')return deny();
  const envelope=parseEnvelope(raw),event=envelope.event;
  const valid=await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,
   decodeSignature(envelope.signature),new TextEncoder().encode(JSON.stringify(event)));
  if(!valid||event.licenseId!==state.license.licenseId||
    event.sequence!==state.sequence+1||event.sequence>MAX_LIFECYCLE_EVENTS||
    event.previousEventHash!==state.lastEventHash||
    event.occurredAt<lastEventAt||event.occurredAt>now+300)return deny();

  const current=effectiveStatus(state,event.occurredAt);
  switch(event.action){
   case 'activate-installation':{
    if(current!=='issued'&&current!=='active')return deny();
    const ref=event.installationRef!;
    if(state.installationRefs.includes(ref)||state.installationRefs.length>=state.license.seats)return deny();
    state.installationRefs.push(ref);state.status='active';break;
   }
   case 'release-installation':{
    const ref=event.installationRef!,index=state.installationRefs.indexOf(ref);
    if(index<0)return deny();
    state.installationRefs.splice(index,1);
    if(state.status==='active'&&state.installationRefs.length===0)state.status='issued';
    break;
   }
   case 'renew-license':{
    if(current==='revoked'||current==='refunded')return deny();
    const next=await verifyReceiptClaims(event.replacementReceipt!,key,event.occurredAt);
    if(!sameLicenseIdentity(state.license,next)||state.license.expiresAt===null||
      next.expiresAt===null||next.issuedAt<=state.license.issuedAt||
      next.expiresAt<=state.license.expiresAt||next.expiresAt<=event.occurredAt)return deny();
    state.license=next;state.status='issued';state.installationRefs=[];break;
   }
   case 'revoke':
   case 'refund':{
    if(current==='revoked'||current==='refunded')return deny();
    state.status=event.action==='revoke'?'revoked':'refunded';
    state.installationRefs=[];break;
   }
   case 'support-open':{
    if(state.supportStatus!=='none'&&state.supportStatus!=='resolved')return deny();
    state.supportStatus='open';state.supportCaseRef=event.supportCaseRef;break;
   }
   case 'support-awaiting-customer':{
    if(state.supportStatus!=='open'&&state.supportStatus!=='awaiting-owner'||
      state.supportCaseRef!==event.supportCaseRef)return deny();
    state.supportStatus='awaiting-customer';break;
   }
   case 'support-awaiting-owner':{
    if(state.supportStatus!=='open'&&state.supportStatus!=='awaiting-customer'||
      state.supportCaseRef!==event.supportCaseRef)return deny();
    state.supportStatus='awaiting-owner';break;
   }
   case 'support-resolve':{
    if((state.supportStatus!=='open'&&state.supportStatus!=='awaiting-customer'&&
      state.supportStatus!=='awaiting-owner')||state.supportCaseRef!==event.supportCaseRef)return deny();
    state.supportStatus='resolved';break;
   }
   default:return deny();
  }
  state.sequence=event.sequence;
  state.lastEventAt=event.occurredAt;
  const canonicalEnvelope=JSON.stringify(envelope);
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonicalEnvelope));
  state.lastEventHash=Array.from(new Uint8Array(digest),value=>value.toString(16).padStart(2,'0')).join('');
  lastEventAt=event.occurredAt;
 }
 validateSnapshot(state);
 return {
  ...state,license:{...state.license},installationRefs:[...state.installationRefs],
 };
}
