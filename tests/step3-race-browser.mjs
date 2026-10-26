// M09-B: deterministic real Chrome/Edge unmount race using synthetic source PDF.
// The original file read is held until STEP2 workspace has unmounted; an old
// async extract completion must NOT create a new, unowned source Blob URL.
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {launchBrowser} from './browser-process.mjs';
import {makeMixedLayoutPdf} from './fixtures/step3-mixed-layout-pdf.mjs';

const profile=mkdtempSync(join(tmpdir(),'astra-m09b-'));
const browser=launchBrowser(process.env.CHROME_PATH||'chromium',profile,'M09-B stale PDF unmount');
let ws, sequence=0;
const waiting=new Map();
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function eventually(fn,predicate=Boolean,ms=45000){
  const until=Date.now()+ms;let last;
  while(Date.now()<until){last=await fn();if(predicate(last))return last;await pause(125);}
  throw Error('M09-B timeout: '+JSON.stringify(last));
}
try{
  ws=await browser.connect();
  ws.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id&&waiting.has(message.id)){
      const pending=waiting.get(message.id);waiting.delete(message.id);
      if(message.error)pending.reject(Error(message.error.message));
      else pending.resolve(message.result);
    }
  });
  const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
    const id=++sequence;waiting.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  const {targetId}=await send('Target.createTarget',{url:process.env.SMOKE_URL||'http://127.0.0.1:4173'});
  const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
  const evaluate=async expression=>{
    const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);
    if(response.exceptionDetails)throw Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  await send('Runtime.enable',{},sessionId);
  await send('Page.enable',{},sessionId);
  await eventually(()=>evaluate("Boolean(document.querySelector('.step3-import-panel input[type=file]') && document.querySelector('.doc-list-item.active'))"));
  const original=await evaluate("(()=>({count:document.querySelectorAll('.doc-list-item').length,active:document.querySelector('.doc-list-item.active strong')?.textContent}))()");
  assert.ok(original.count>=1&&original.active);
  // STEP1 legacy editor may create a v1 localStorage document. On returning
  // to STEP2, the existing automatic non-destructive V1->V2 migration can add
  // exactly one new document. Compare existing document IDs/content instead
  // of assuming the document count stays identical across that mode switch.
  const readStored=()=>evaluate("(()=>new Promise((resolve,reject)=>{"+
    "const req=indexedDB.open('astra-pdf-redesigner:v2');"+
    "req.onerror=()=>reject(Error('M09-B IndexedDB open failed'));"+
    "req.onsuccess=()=>{const db=req.result;"+
      "const tx=db.transaction(['documents','meta'],'readonly');"+
      "const documents=tx.objectStore('documents').getAll();"+
      "const migration=tx.objectStore('meta').get('v1MigrationFinished');"+
      "tx.oncomplete=()=>{db.close();resolve({docs:documents.result, migrated:migration.result===true});};"+
      "tx.onerror=()=>reject(Error('M09-B IndexedDB snapshot failed'));"+
    "};"+
  "}))()");
  const originalDb=await readStored();
  assert.equal(originalDb.docs.length,original.count);

  const source=makeMixedLayoutPdf();
  const data=JSON.stringify(source.toString('base64'));
  await evaluate("(()=>{"+
    "const target='m09b-held-source.pdf';"+
    "const originalRead=File.prototype.arrayBuffer;"+
    "const originalCreate=URL.createObjectURL;"+
    "window.__m09b={created:[],readStarted:false,released:false};"+
    "File.prototype.arrayBuffer=function(...args){"+
      "if(this.name!==target)return originalRead.apply(this,args);"+
      "window.__m09b.readStarted=true;"+
      "return new Promise((resolve,reject)=>{"+
        "window.__m09b.release=()=>{window.__m09b.released=true;"+
          "originalRead.apply(this,args).then(resolve,reject);};"+
      "});"+
    "};"+
    "URL.createObjectURL=function(blob){const url=originalCreate.call(URL,blob);"+
      "if(blob instanceof File && blob.name===target)window.__m09b.created.push(url);"+
      "return url;};"+
    "const bytes=Uint8Array.from(atob("+data+"),c=>c.charCodeAt(0));"+
    "const file=new File([bytes],target,{type:'application/pdf'});"+
    "const transfer=new DataTransfer();transfer.items.add(file);"+
    "const input=document.querySelector('.step3-import-panel input[type=file]');"+
    "input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));"+
  "})()");
  await eventually(()=>evaluate("window.__m09b?.readStarted === true"));
  assert.equal(await evaluate("Boolean(document.querySelector('.step3-import-panel [role=status]'))"),true);
  // Parent header remains enabled while child PDF importer is parsing.
  await evaluate("([...document.querySelectorAll('button')].find(b=>b.textContent.includes('기존 회고록 편집'))).click()");
  await eventually(()=>evaluate("Boolean(document.querySelector('.mode-bar'))"));
  // Deliberately release the real File.arrayBuffer() *after* unmount.
  await evaluate("window.__m09b.release()");
  await pause(4500);
  const leaked=await evaluate("({created:window.__m09b.created.length,released:window.__m09b.released})");
  assert.equal(leaked.released,true,'held original read must finish');
  assert.equal(leaked.created,0,'unmounted stale PDF must not allocate an orphan original source URL');

  await evaluate("([...document.querySelectorAll('.mode-bar button')].find(b=>b.textContent.includes('개인 문서 제작기로'))).click()");
  await eventually(()=>evaluate("Boolean(document.querySelector('.step3-import-panel input[type=file]') && document.querySelector('.doc-list-item.active'))"));
  const after=await evaluate("(()=>({count:document.querySelectorAll('.doc-list-item').length,active:document.querySelector('.doc-list-item.active strong')?.textContent,hasDraft:Boolean(document.querySelector('.step3-block-review'))}))()");
  const afterDb=await readStored();
  assert.equal(after.hasDraft,false,'stale async extract must not recreate its review draft');
  assert.equal(after.active,original.active,'original active project must remain selected');
  assert.equal(after.count,afterDb.docs.length,'document list must match persisted V2 records');
  for(const oldDoc of originalDb.docs){
    const persisted=afterDb.docs.find(doc=>doc.id===oldDoc.id);
    assert.deepEqual(persisted,oldDoc,'original V2 document must stay byte-for-byte equivalent');
  }
  assert.equal(afterDb.docs.some(doc=>JSON.stringify(doc).includes('STEP3_SOURCE_P1_BEGIN_901')),false,
    'unapproved stale source must not appear in any persisted V2 document');
  const added=afterDb.docs.length-originalDb.docs.length;
  assert.ok(added===0||(added===1&&!originalDb.migrated&&afterDb.migrated),
    'only the existing STEP1-to-STEP2 legacy migration may add one document');
  console.log('PASS M09-B CHROME/EDGE STALE UNMOUNT: delayed real PDF bytes ignored after navigation, no original URL allocated, original V2 unchanged (legacy migration allowed)');
}finally{
  if(ws)ws.close();
  await browser.close();
  try{rmSync(profile,{recursive:true,force:true,maxRetries:10,retryDelay:250});}
  catch(error){if(!['EBUSY','ENOTEMPTY','EPERM'].includes(error?.code))throw error;}
}
