// M08-D actual PDF.js password rejection in Chrome/Edge against a synthetic AES-256 PDF.
// Standalone browser profile avoids modifying the older 50KB STEP3 E2E harness.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import scanFixture from '../desktop/step3-scanned-fixture.cjs';
import lockedFixture from '../desktop/step3-encrypted-fixture.cjs';
const {makeScannedPagesPdf,SCAN_MARKERS}=scanFixture;
const {makePasswordProtectedPdf}=lockedFixture;
const binary=process.env.CHROME_PATH||'chromium';
const profile=mkdtempSync(join(tmpdir(),'astra-m08d-'));
const browser=launchBrowser(binary,profile,'M08-D password PDF');
let ws,seq=0;const pending=new Map();
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(fn,test=x=>Boolean(x),timeout=45000){
  const start=Date.now();let last;
  while(Date.now()-start<timeout){
    last=await fn();if(test(last))return last;await sleep(200);
  }
  throw Error('M08-D timed out: '+JSON.stringify(last));
}
try{
  ws=await browser.connect();
  ws.addEventListener('message',e=>{
    const item=JSON.parse(e.data);
    if(item.id&&pending.has(item.id)){
      const promise=pending.get(item.id);pending.delete(item.id);
      if(item.error)promise.reject(Error(item.error.message));
      else promise.resolve(item.result);
    }
  });
  const rpc=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
    const id=++seq;pending.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  const {targetId}=await rpc('Target.createTarget',{url:process.env.SMOKE_URL||'http://127.0.0.1:4173'});
  const {sessionId}=await rpc('Target.attachToTarget',{targetId,flatten:true});
  const evalInPage=async expression=>{
    const result=await rpc('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);
    if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await rpc('Runtime.enable',{},sessionId);await rpc('Page.enable',{},sessionId);
  await until(()=>evalInPage("Boolean(document.querySelector('.step3-import-panel input[type=file]')&&document.querySelector('.doc-list-item.active'))"));
  const before=await evalInPage("(()=>({names:[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent),active:document.querySelector('.doc-list-item.active strong')?.textContent}))()");
  assert.ok(before.names.length,'Expected pre-existing V2 document to test preservation');
  const upload=async(pdf,name)=>evalInPage("(()=>{const data=Uint8Array.from(atob("+
    JSON.stringify(pdf.toString('base64'))+"),c=>c.charCodeAt(0));"+
    "const input=document.querySelector('.step3-import-panel input[type=file]');"+
    "const dt=new DataTransfer();dt.items.add(new File([data],"+
    JSON.stringify(name)+",{type:'application/pdf'}));"+
    "input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()");
  const valid=makeScannedPagesPdf({selectableSecondPage:true});
  const encrypted=makePasswordProtectedPdf();
  assert.equal(encrypted.subarray(0,5).toString('ascii'),'%PDF-');
  assert.ok(encrypted.includes(Buffer.from('/Encrypt')),'Must test an actual encryption dictionary');
  assert.equal(encrypted.length,1964,'M08-D frozen AES-256 fixture size changed');
  // A successful pre-review must be discarded before we inspect the encrypted source.
  await upload(valid,'m08d-valid-before-locked.pdf');
  await until(()=>evalInPage("document.querySelector('.step3-import-panel')?.textContent"),
    text=>text?.includes(SCAN_MARKERS.first)&&text.includes(SCAN_MARKERS.end));
  await upload(encrypted,'m08d-aes256-locked.pdf');
  const alert=await until(()=>evalInPage("document.querySelector('.step3-import-panel [role=alert]')?.textContent"),
    text=>text?.includes('암호화된 PDF는 이번 버전에서 지원하지 않습니다'));
  assert.ok(alert.includes('암호를 해제하고 다시 선택하세요'));
  assert.equal(await evalInPage("Boolean(document.querySelector('.step3-import-panel .step3-block-review'))"),false);
  assert.equal(await evalInPage("Boolean(document.querySelector('.step3-import-panel iframe[src^=blob]'))"),false);
  const after=await evalInPage("(()=>({names:[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent),active:document.querySelector('.doc-list-item.active strong')?.textContent}))()");
  assert.deepEqual(after,before,'Rejected password-protected PDF changed a previous V2 document');
  await upload(valid,'m08d-valid-retry.pdf');
  await until(()=>evalInPage("document.querySelector('.step3-import-panel')?.textContent"),
    text=>text?.includes(SCAN_MARKERS.first)&&text.includes(SCAN_MARKERS.end));
  assert.equal(await evalInPage("Boolean(document.querySelector('.step3-import-panel [role=alert]'))"),false);
  assert.equal(await evalInPage("document.querySelector('.step3-import-panel > label.step3-confirm input')?.checked"),false);
  await evalInPage("([...document.querySelectorAll('.step3-import-panel button')].find(x=>x.textContent.includes('가져오기 취소'))).click()");
  await rpc('Page.reload',{ignoreCache:true},sessionId);
  const recovered=await until(()=>evalInPage("(()=>({names:[...document.querySelectorAll('.doc-list-item strong')].map(x=>x.textContent),active:document.querySelector('.doc-list-item.active strong')?.textContent}))()"),
    value=>value?.names?.length===before.names.length&&Boolean(value.active));
  assert.deepEqual(recovered,before,'V2 documents changed after AES-256 rejection and reload');
  console.log('PASS M08-D CHROME/EDGE AES-256 PASSWORD: real encrypted PDF rejected, clear Korean warning, stale review/Blob removed, V2 preserved after reload, valid retry unapproved');
}finally{
  if(ws)ws.close();
  await browser.close();
  try{rmSync(profile,{recursive:true,force:true,maxRetries:10,retryDelay:250});}
  catch(error){if(!['EBUSY','EPERM','ENOTEMPTY'].includes(error?.code))throw error;}
}
