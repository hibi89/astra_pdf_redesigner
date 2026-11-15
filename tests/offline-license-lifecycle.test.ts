import test from 'node:test';
import assert from 'node:assert/strict';
import {importOfflineLicensePublicKey,verifyOfflineEntitlement,type LicenseClaims}
 from '../src/commercial/offlineLicense.ts';
import {publicIssuerJwkThumbprint,productionSkuAccessConfigured,checkProductionSkuCapability}
 from '../src/commercial/skuAccess.ts';
import {issueOfflineLicenseReceipt,extendOfflineLicenseReceipt}
 from '../src/commercial/offlineLicenseIssuer.ts';
import {createLicenseLifecycleSnapshot,effectiveLicenseLifecycleStatus,
 replayLicenseLifecycle,signLicenseLifecycleCommand}
 from '../src/commercial/offlineLicenseLifecycle.ts';

const NOW=1794657600;
let eventCounter=0;
async function owner(){
 const generated=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
 const jwk=await crypto.subtle.exportKey('jwk',generated.publicKey);
 const pkcs8=await crypto.subtle.exportKey('pkcs8',generated.privateKey);
 const privateKey=await crypto.subtle.importKey('pkcs8',pkcs8,
  {name:'ECDSA',namedCurve:'P-256'},false,['sign']);
 return {privateKey,jwk,pin:await publicIssuerJwkThumbprint(jwk)};
}
const claims=(tier:LicenseClaims['tier']='pro',patch:Partial<LicenseClaims>={}):LicenseClaims=>({
 licenseId:'ASTRA-C006-TEST-0001',tier,productMajor:1,
 issuedAt:NOW-400,expiresAt:NOW+86400,seats:tier==='business'?2:1,...patch,
});
async function fixture(tier:LicenseClaims['tier']='pro',patch:Partial<LicenseClaims>={}){
 const signer=await owner(),license=claims(tier,patch);
 const receipt=await issueOfflineLicenseReceipt(license,signer.privateKey,signer.jwk,signer.pin,NOW);
 const snapshot=await createLicenseLifecycleSnapshot(receipt,signer.jwk,signer.pin,NOW);
 return {signer,license,receipt,snapshot};
}
async function command(f:Awaited<ReturnType<typeof fixture>>,snapshot:Awaited<ReturnType<typeof createLicenseLifecycleSnapshot>>,
 action:string,fields:Record<string,unknown>={},at=NOW){
 eventCounter++;
 return signLicenseLifecycleCommand(snapshot,{
  action,eventId:'lifecycle-event-'+String(eventCounter).padStart(8,'0'),
  occurredAt:at,...fields,
 },f.signer.privateKey,f.signer.jwk,f.signer.pin,at);
}
const install=(n:number)=>n.toString(16).padStart(32,'0');
test('C006 seeds a ledger only from valid pinned signed receipts and preserves all three SKU periods',async()=>{
 const signer=await owner();
 for(const tier of ['basic','pro','business'] as const){
  const license=claims(tier),receipt=await issueOfflineLicenseReceipt(
   license,signer.privateKey,signer.jwk,signer.pin,NOW);
  const snapshot=await createLicenseLifecycleSnapshot(receipt,signer.jwk,signer.pin,NOW);
  assert.equal(snapshot.status,'issued');
  assert.equal(snapshot.license.tier,tier);
  assert.equal(snapshot.license.seats,tier==='business'?2:1);
  assert.equal(effectiveLicenseLifecycleStatus(snapshot,NOW+1),'issued');
 }
 assert.equal(await publicIssuerJwkThumbprint(signer.jwk),signer.pin);
 await assert.rejects(createLicenseLifecycleSnapshot('forged',signer.jwk,signer.pin,NOW));
 await assert.rejects(createLicenseLifecycleSnapshot(
  await issueOfflineLicenseReceipt(claims('business'),signer.privateKey,signer.jwk,signer.pin,NOW),
  signer.jwk,'0'.repeat(64),NOW));
});
test('C006 signed seat assignments enforce SKU seat count, reject duplicates, and recover a released slot',async()=>{
 const f=await fixture('business');
 const first=await command(f,f.snapshot,'activate-installation',{installationRef:install(1)});
 const state1=await replayLicenseLifecycle(f.receipt,[first],f.signer.jwk,f.signer.pin,NOW);
 assert.equal(state1.status,'active');
 const second=await command(f,state1,'activate-installation',{installationRef:install(2)});
 const state2=await replayLicenseLifecycle(f.receipt,[first,second],f.signer.jwk,f.signer.pin,NOW);
 assert.deepEqual(state2.installationRefs,[install(1),install(2)]);
 const over=await command(f,state2,'activate-installation',{installationRef:install(3)});
 await assert.rejects(replayLicenseLifecycle(f.receipt,[first,second,over],f.signer.jwk,f.signer.pin,NOW));
 const duplicate=await command(f,state2,'activate-installation',{installationRef:install(1)});
 await assert.rejects(replayLicenseLifecycle(f.receipt,[first,second,duplicate],f.signer.jwk,f.signer.pin,NOW));
 const release=await command(f,state2,'release-installation',{installationRef:install(1)});
 const state3=await replayLicenseLifecycle(f.receipt,[first,second,release],f.signer.jwk,f.signer.pin,NOW);
 const third=await command(f,state3,'activate-installation',{installationRef:install(3)});
 const state4=await replayLicenseLifecycle(f.receipt,[first,second,release,third],f.signer.jwk,f.signer.pin,NOW);
 assert.deepEqual(state4.installationRefs,[install(2),install(3)]);
});
test('C006 expiration is time-derived and signed renewal advances SKU identity/period without carrying seats forward',async()=>{
 const f=await fixture('pro',{expiresAt:NOW+100});
 const activate=await command(f,f.snapshot,'activate-installation',{installationRef:install(4)},NOW+1);
 const active=await replayLicenseLifecycle(f.receipt,[activate],f.signer.jwk,f.signer.pin,NOW+1);
 assert.equal(effectiveLicenseLifecycleStatus(active,NOW+99),'active');
 assert.equal(effectiveLicenseLifecycleStatus(active,NOW+100),'expired');
 const afterExpiry=await command(f,active,'activate-installation',{installationRef:install(5)},NOW+101);
 await assert.rejects(replayLicenseLifecycle(f.receipt,[activate,afterExpiry],f.signer.jwk,f.signer.pin,NOW+101));
 const nextClaims=claims('pro',{issuedAt:NOW+101,expiresAt:NOW+1000});
 const renewed=await extendOfflineLicenseReceipt(f.receipt,nextClaims,
  f.signer.privateKey,f.signer.jwk,f.signer.pin,NOW+101);
 const event=await command(f,active,'renew-license',{replacementReceipt:renewed},NOW+101);
 const after=await replayLicenseLifecycle(f.receipt,[activate,event],f.signer.jwk,f.signer.pin,NOW+101);
 assert.equal(after.license.licenseId,f.license.licenseId);
 assert.equal(after.license.tier,'pro');
 assert.equal(after.license.expiresAt,NOW+1000);
 assert.equal(after.status,'issued');
 assert.deepEqual(after.installationRefs,[]);
 await assert.rejects(replayLicenseLifecycle(f.receipt,[event],f.signer.jwk,f.signer.pin,NOW+101));
});
test('C006 refund and revocation are terminal in the signed owner ledger, while legacy receipt remains offline-valid',async()=>{
 for(const action of ['refund','revoke']){
  const f=await fixture('pro');
  const activate=await command(f,f.snapshot,'activate-installation',{installationRef:install(6)});
  const active=await replayLicenseLifecycle(f.receipt,[activate],f.signer.jwk,f.signer.pin,NOW);
  const close=await command(f,active,action);
  const terminal=await replayLicenseLifecycle(f.receipt,[activate,close],f.signer.jwk,f.signer.pin,NOW);
  assert.equal(terminal.status,action==='refund'?'refunded':'revoked');
  assert.deepEqual(terminal.installationRefs,[]);
  const afterClose=await command(f,terminal,'activate-installation',{installationRef:install(7)});
  await assert.rejects(replayLicenseLifecycle(f.receipt,[activate,close,afterClose],f.signer.jwk,f.signer.pin,NOW));
  const key=await importOfflineLicensePublicKey(f.signer.jwk);
  assert.equal((await verifyOfflineEntitlement(f.receipt,key,NOW)).tier,'pro',
   'ledger events are not delivered to the buyer app and do not revoke its offline receipt');
 }
});
test('C006 support lifecycle is monotone per opaque case reference and stores no free text',async()=>{
 const f=await fixture('basic');
 let log:string[]=[];
 let state=f.snapshot;
 for(const [action,caseRef] of [
  ['support-open','CASE_C006_0001'],['support-awaiting-customer','CASE_C006_0001'],
  ['support-awaiting-owner','CASE_C006_0001'],['support-resolve','CASE_C006_0001'],
 ] as const){
  const event=await command(f,state,action,{supportCaseRef:caseRef});
  log=[...log,event];
  state=await replayLicenseLifecycle(f.receipt,log,f.signer.jwk,f.signer.pin,NOW);
 }
 assert.equal(state.supportStatus,'resolved');
 assert.equal(state.supportCaseRef,'CASE_C006_0001');
 const reopen=await command(f,state,'support-open',{supportCaseRef:'CASE_C006_0002'});
 const reopened=await replayLicenseLifecycle(f.receipt,[...log,reopen],f.signer.jwk,f.signer.pin,NOW);
 assert.equal(reopened.supportStatus,'open');
 assert.equal(reopened.supportCaseRef,'CASE_C006_0002');
 const wrongCase=await command(f,state,'support-resolve',{supportCaseRef:'CASE_WRONG_0001'});
 await assert.rejects(replayLicenseLifecycle(f.receipt,[...log,wrongCase],f.signer.jwk,f.signer.pin,NOW));
 const invalidTransition=await command(f,state,'support-awaiting-owner',{supportCaseRef:'CASE_C006_0001'});
 await assert.rejects(replayLicenseLifecycle(f.receipt,[...log,invalidTransition],f.signer.jwk,f.signer.pin,NOW));
});
test('C006 rejects event tampering, wrong issuer/pin, cross-license, replay, broken chain and stale sequence',async()=>{
 const f=await fixture('business'),other=await fixture('business');
 const event=await command(f,f.snapshot,'activate-installation',{installationRef:install(8)});
 const parsed=JSON.parse(event);
 const tampered=JSON.stringify({...parsed,event:{...parsed.event,action:'refund',installationRef:null}});
 await assert.rejects(replayLicenseLifecycle(f.receipt,[tampered],f.signer.jwk,f.signer.pin,NOW));
 await assert.rejects(replayLicenseLifecycle(f.receipt,[event],other.signer.jwk,other.signer.pin,NOW));
 await assert.rejects(replayLicenseLifecycle(f.receipt,[event],f.signer.jwk,'1'.repeat(64),NOW));
 await assert.rejects(replayLicenseLifecycle(other.receipt,[event],f.signer.jwk,f.signer.pin,NOW));
 await assert.rejects(replayLicenseLifecycle(f.receipt,[event,event],f.signer.jwk,f.signer.pin,NOW));
 const forked={...f.snapshot,sequence:1,lastEventHash:'1'.repeat(64),lastEventAt:NOW-100};
 const badAnchor=await command(f,forked,'activate-installation',{installationRef:install(9)});
 await assert.rejects(replayLicenseLifecycle(f.receipt,[badAnchor],f.signer.jwk,f.signer.pin,NOW));
 const stale={...f.snapshot,sequence:4,lastEventHash:'2'.repeat(64),lastEventAt:NOW-100};
 const staleEvent=await command(f,stale,'activate-installation',{installationRef:install(10)});
 await assert.rejects(replayLicenseLifecycle(f.receipt,[staleEvent],f.signer.jwk,f.signer.pin,NOW));
 await assert.rejects(command(f,f.snapshot,'activate-installation',{installationRef:'not-a-random-ref'}));
 await assert.rejects(command(f,f.snapshot,'refund',{unexpected:'ignored'}));
});
test('C006 future events, out-of-order time, excessive event logs and product defaults fail closed',async()=>{
 const f=await fixture('pro');
 await assert.rejects(command(f,f.snapshot,'refund',{},NOW+301));
 const first=await command(f,f.snapshot,'support-open',{supportCaseRef:'CASE_C006_0003'},NOW+10);
 const opened=await replayLicenseLifecycle(f.receipt,[first],f.signer.jwk,f.signer.pin,NOW+10);
 await assert.rejects(command(f,opened,'support-awaiting-owner',
  {supportCaseRef:'CASE_C006_0003'},NOW+9));
 await assert.rejects(replayLicenseLifecycle(f.receipt,
  Array.from({length:4097},()=>first),f.signer.jwk,f.signer.pin,NOW+10));
 assert.equal(productionSkuAccessConfigured(),false);
 assert.equal((await checkProductionSkuCapability(f.receipt,'pro-layout',NOW)).allowed,false);
});
