// M09-C real Chrome/Edge import cancel + retry isolation. Synthetic PDF only.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import {makeMixedLayoutPdf,MIXED_LAYOUT_MARKERS} from './fixtures/step3-mixed-layout-pdf.mjs';

const profile=mkdtempSync(join(tmpdir(),'astra-m09c-'));
const browser=launchBrowser(process.env.CHROME_PATH||'chromium',profile,'M09-C cancel and retry');
let ws,sequence=0;const waiting=new Map();
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function eventually(fn,check=Boolean,ms=45000){
  const until=Date.now()+ms;let last;
  while(Date.now()<until){last=await fn();if(check(last))return last;await pause(130);}
  throw Error('M09-C timeout: '+JSON.stringify(last));
}
try{
  ws=await browser.connect();
  ws.addEventListener('message',event=>{
    const data=JSON.parse(event.data);
    if(data.id&&waiting.has(data.id)){
      const w=waiting.get(data.id);waiting.delete(data.id);
      if(data.error)w.reject(Error(data.error.message));else w.resolve(data.result);
    }
  });
  const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
    const id=++sequence;waiting.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  const {targetId}=await send('Target.createTarget',{url:process.env.SMOKE_URL||'http://127.0.0.1:4173'});
  const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
  const evaluate=async expression=>{
    const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);
    if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  await send('Runtime.enable',{},sessionId);
  await send('Page.enable',{},sessionId);
  await eventually(()=>evaluate("Boolean(document.querySelector('.step3-import-panel input[type=file]')&&document.querySelector('.doc-list-item.active'))"));
  const original=await evaluate("(()=>({active:document.querySelector('.doc-list-item.active strong')?.textContent,count:document.querySelectorAll('.doc-list-item').length}))()");
  const snapshot=()=>evaluate("(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('astra-pdf-redesigner:v2');"+
    "r.onerror=()=>reject(Error('IDB open failed'));r.onsuccess=()=>{const db=r.result;"+
    "const tx=db.transaction(['documents','meta'],'readonly');"+
    "const docs=tx.objectStore('documents').getAll();const active=tx.objectStore('meta').get('activeDocumentId');"+
    "tx.oncomplete=()=>{db.close();resolve({docs:docs.result,active:active.result});};"+
    "tx.onerror=()=>reject(Error('IDB snapshot failed'));};})())");
  const before=await snapshot();
  assert.equal(before.docs.length,original.count);
  const originalPdf=makeMixedLayoutPdf();
  const upload=(name,bytes)=>evaluate("(()=>{const data=Uint8Array.from(atob("+JSON.stringify(bytes.toString('base64'))+
    "),c=>c.charCodeAt(0));const input=document.querySelector('.step3-import-panel input[type=file]');"+
    "const transfer=new DataTransfer();transfer.items.add(new File([data],"+JSON.stringify(name)+
    ",{type:'application/pdf'}));input.files=transfer.files;"+
    "input.dispatchEvent(new Event('change',{bubbles:true}));})()");
  const cancelButton="([...document.querySelectorAll('.step3-import-panel button')].find(b=>b.textContent.includes('가져오기 취소')))";
  const saveButton="([...document.querySelectorAll('.step3-import-panel button')].find(b=>b.textContent.includes('검수 결과를 새 문서로 저장')))";

  // Failure should leave no approved draft, and a valid retry must remain usable.
  await upload('m09c-invalid.pdf',Buffer.from('%NO-SIGNATURE-BAD-INPUT'));
  await eventually(()=>evaluate("document.querySelector('.step3-import-panel [role=alert]')?.textContent"),
    x=>typeof x==='string'&&x.includes('시그니처'));
  assert.equal(await evaluate("Boolean(document.querySelector('.step3-block-review'))"),false);
  assert.equal(await evaluate("document.querySelector('.step3-import-panel input[type=file]').disabled"),false);

  // Hold the first valid source's real File.arrayBuffer while the user cancels.
  await evaluate("(()=>{const read=File.prototype.arrayBuffer,create=URL.createObjectURL,revoke=URL.revokeObjectURL;"+
    "window.__m09c={held:false,released:false,created:[],revoked:[]};"+
    "File.prototype.arrayBuffer=function(...args){if(this.name!=='m09c-old.pdf')return read.apply(this,args);"+
      "window.__m09c.held=true;return new Promise((resolve,reject)=>{window.__m09c.release=()=>{"+
      "window.__m09c.released=true;read.apply(this,args).then(resolve,reject);};});};"+
    "URL.createObjectURL=function(x){const u=create.call(URL,x);"+
      "if(x instanceof File)window.__m09c.created.push({name:x.name,url:u});return u;};"+
    "URL.revokeObjectURL=function(u){window.__m09c.revoked.push(u);return revoke.call(URL,u);};"+
  "})()");
  await upload('m09c-old.pdf',originalPdf);
  await eventually(()=>evaluate("window.__m09c.held === true"));
  const loading=await evaluate("({busy:Boolean(document.querySelector('.step3-import-panel [role=status]')),cancelDisabled:"+cancelButton+".disabled})");
  assert.equal(loading.busy,true,'first real PDF must be in analysis');
  assert.equal(loading.cancelDisabled,false,'cancel must work while parsing');
  await evaluate(cancelButton+".click()");
  await eventually(()=>evaluate("(()=>({inputDisabled:document.querySelector('.step3-import-panel input[type=file]').disabled,"+
    "hasStatus:Boolean(document.querySelector('.step3-import-panel [role=status]')),"+
    "hasDraft:Boolean(document.querySelector('.step3-block-review'))}))()"),
    v=>v&&!v.inputDisabled&&!v.hasStatus&&!v.hasDraft);

  // New, different File is allowed while prior PDF.js continuation is still held.
  await upload('m09c-new.pdf',originalPdf);
  await eventually(()=>evaluate("(()=>({text:document.querySelector('.step3-import-panel')?.textContent,"+
    "blocks:document.querySelectorAll('.step3-block-review textarea').length}))()"),
    x=>x?.text?.includes('m09c-new.pdf')&&x.text.includes(MIXED_LAYOUT_MARKERS[0])&&x.blocks>1);
  const approval='.step3-import-panel > label.step3-confirm input';
  assert.equal(await evaluate("document.querySelector("+JSON.stringify(approval)+").checked"),false);
  assert.equal(await evaluate(saveButton+".disabled"),true);

  // The earlier read ends last. Its stale result must never replace the newer draft.
  await evaluate("window.__m09c.release()");
  await pause(4200);
  const state=await evaluate("(()=>({text:document.querySelector('.step3-import-panel')?.textContent,"+
    "fileCreates:window.__m09c.created.map(x=>x.name),released:window.__m09c.released,"+
    "approved:document.querySelector("+JSON.stringify(approval)+")?.checked,"+
    "saveDisabled:"+saveButton+".disabled}))()");
  assert.equal(state.released,true);
  assert.equal(state.fileCreates.includes('m09c-old.pdf'),false,'canceled source must never get an orphan Blob URL');
  assert.equal(state.fileCreates.filter(x=>x==='m09c-new.pdf').length,1);
  assert.ok(state.text.includes('m09c-new.pdf')&&!state.text.includes('m09c-old.pdf'),
    'late canceled result must not replace newer source');
  assert.equal(state.approved,false);
  assert.equal(state.saveDisabled,true);

  await evaluate(cancelButton+".click()");
  await eventually(()=>evaluate("!document.querySelector('.step3-block-review')"));
  const final=await evaluate("({newUrls:window.__m09c.created.filter(x=>x.name==='m09c-new.pdf').map(x=>x.url),"+
    "revoked:window.__m09c.revoked,hasDraft:Boolean(document.querySelector('.step3-block-review'))})");
  assert.equal(final.hasDraft,false);
  assert.ok(final.newUrls.every(url=>final.revoked.includes(url)),'cancel must revoke current source URL');
  const after=await snapshot();
  assert.deepEqual(after,before,'failure, cancel, retry and stale completion must not write V2 data');
  console.log('PASS M09-C CHROME/EDGE CANCEL/RETRY: malformed source rejected, parse cancel enabled, late old result ignored, new unapproved source preserved, URLs revoked, V2 unchanged');
}finally{
  if(ws)ws.close();
  await browser.close();
  try{rmSync(profile,{recursive:true,force:true,maxRetries:10,retryDelay:250});}
  catch(error){if(!['EBUSY','ENOTEMPTY','EPERM'].includes(error?.code))throw error;}
}
