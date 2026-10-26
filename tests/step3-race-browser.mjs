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
  assert.deepEqual(after,{...original,hasDraft:false},'stale async extract must not recreate a draft or mutate saved V2');
  console.log('PASS M09-B CHROME/EDGE STALE UNMOUNT: delayed real PDF bytes ignored after navigation, no original URL allocated, saved V2 unchanged');
}finally{
  if(ws)ws.close();
  await browser.close();
  try{rmSync(profile,{recursive:true,force:true,maxRetries:10,retryDelay:250});}
  catch(error){if(!['EBUSY','ENOTEMPTY','EPERM'].includes(error?.code))throw error;}
}
