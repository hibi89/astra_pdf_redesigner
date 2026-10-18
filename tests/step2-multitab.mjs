// Real Chrome, two separate tabs sharing one browser profile and origin.
// Regression: Web Locks grant exactly one active editor; closing tab A then
// reloading tab B allows it to acquire the lease without corrupting documents.
import assert from 'node:assert/strict';
import {launchBrowser} from './browser-process.mjs';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const chrome=process.env.CHROME_PATH||'chromium';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const temp=mkdtempSync(join(tmpdir(),'astra-multitab-'));
const browserSession=launchBrowser(chrome,temp,'STEP2 multitab');
let ws, sequence=1;
const inflight=new Map();
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function rpc(method,params={},sessionId){
  return new Promise((resolve,reject)=>{
    const id=sequence++;
    inflight.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
}
async function until(fn,predicate=value=>Boolean(value),timeout=15000){
  const start=Date.now();let last;
  while(Date.now()-start<timeout){
    try{const value=await fn();last=value;if(predicate(value))return value;}
    catch(error){if(!/context was destroyed|Cannot find context|navigated or closed/i.test(String(error)))throw error;}
    await delay(120);
  }
  throw Error('Multi-tab condition timeout (last='+JSON.stringify(last)+')');
}
async function attach(){
  const {targetId}=await rpc('Target.createTarget',{url});
  const {sessionId}=await rpc('Target.attachToTarget',{targetId,flatten:true});
  const send=(method,params)=>rpc(method,params??{},sessionId);
  await send('Runtime.enable');
  await send('Page.enable');
  const evalJS=async(expression)=>{
    const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(response.exceptionDetails)throw Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  const reload=async()=>{
    // Listening before Page.reload avoids missing the load event.
    let handler;
    const loaded=new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{ws.removeEventListener('message',handler);reject(Error('Page reload timed out'));},15000);
      handler=event=>{
        const message=JSON.parse(event.data);
        if(message.sessionId===sessionId&&message.method==='Page.loadEventFired'){
          clearTimeout(timer);ws.removeEventListener('message',handler);resolve();
        }
      };
      ws.addEventListener('message',handler);
    });
    await send('Page.reload',{ignoreCache:true});
    await loaded;
  };
  return{targetId,sessionId,send,evalJS,reload};
}
try{
  const endpoint=await browserSession.devtools();
  ws=new WebSocket(endpoint);
  await new Promise((resolve,reject)=>{
    ws.addEventListener('open',resolve,{once:true});
    ws.addEventListener('error',reject,{once:true});
  });
  ws.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id&&inflight.has(message.id)){
      const item=inflight.get(message.id);inflight.delete(message.id);
      if(message.error)item.reject(Error(message.error.message));else item.resolve(message.result);
    }
  });

  const first=await attach();
  await until(()=>first.evalJS("Boolean(document.querySelector('.project-paper')&&document.querySelector('.doc-list-item.active')&&document.querySelector('.project-layout input'))"));
  assert.equal(await first.evalJS("Boolean(navigator.locks?.request&&navigator.locks?.query)"),true,'Real Web Locks API is required');
  assert.equal(await first.evalJS("(async()=>{const locks=await navigator.locks.query();return locks.held.filter(x=>x.name==='astra-pdf-redesigner-editor').length})()"),1);

  const unique='MULTITAB_PROTECTED_TEXT_20261019';
  await first.evalJS("(()=>{const input=document.querySelector('.section-editor .block-editor textarea');if(!input)throw Error('Document editor missing');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(input,"+JSON.stringify(unique)+");input.dispatchEvent(new Event('input',{bubbles:true}))})()");
  await until(()=>first.evalJS("document.querySelector('.save-chip')?.textContent"),value=>value==='저장됨');
  assert.equal(await first.evalJS("document.querySelector('.project-paper')?.textContent.includes("+JSON.stringify(unique)+")"),true);

  const second=await attach();
  await until(()=>second.evalJS("Boolean(document.querySelector('.warning[role=alert]')?.textContent.includes('다른 탭에서 문서함을 편집'))"));
  assert.equal(await second.evalJS("document.querySelector('.print-button')?.disabled"),true);
  assert.equal(await second.evalJS("document.querySelector('.section-editor .block-editor textarea')"),null);
  assert.equal(await second.evalJS("document.querySelectorAll('.doc-list-item.active').length"),0);
  assert.equal(await second.evalJS("(async()=>{const locks=await navigator.locks.query();return locks.held.filter(x=>x.name==='astra-pdf-redesigner-editor').length})()"),1);
  assert.equal(await first.evalJS("document.querySelector('.project-paper')?.textContent.includes("+JSON.stringify(unique)+")"),true);
  console.log('PASS STEP2 MULTITAB: first Chrome tab holds Web Lock; second shows read-only warning and cannot edit');

  // Close only the first tab; its Web Lock should be released by the browser.
  const closed=await rpc('Target.closeTarget',{targetId:first.targetId});
  assert.equal(closed.success,true);
  await until(()=>second.evalJS("(async()=>{const locks=await navigator.locks.query();return locks.held.filter(x=>x.name==='astra-pdf-redesigner-editor').length})()"),count=>count===0);
  await second.reload();
  await until(()=>second.evalJS("Boolean(document.querySelector('.section-editor .block-editor textarea')&&!document.querySelector('.warning[role=alert]')?.textContent.includes('다른 탭에서 문서함을 편집'))"));
  assert.equal(await second.evalJS("document.querySelector('.project-paper')?.textContent.includes("+JSON.stringify(unique)+")"),true,'Persisted data changed during lock handoff');
  assert.equal(await second.evalJS("(async()=>{const locks=await navigator.locks.query();return locks.held.filter(x=>x.name==='astra-pdf-redesigner-editor').length})()"),1);
  console.log('PASS STEP2 MULTITAB: closing owner releases Web Lock; second tab reload acquires exclusive edit access with original text');

  const edited='MULTITAB_HANDOFF_EDIT_20261019';
  await second.evalJS("(()=>{const el=document.querySelector('.section-editor .block-editor textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(el,"+JSON.stringify(edited)+");el.dispatchEvent(new Event('input',{bubbles:true}))})()");
  await until(()=>second.evalJS("document.querySelector('.save-chip')?.textContent"),value=>value==='저장됨');
  await second.reload();
  await until(()=>second.evalJS("document.querySelector('.project-paper')?.textContent.includes("+JSON.stringify(edited)+")"));
  assert.equal(await second.evalJS("(async()=>{const locks=await navigator.locks.query();return locks.held.filter(x=>x.name==='astra-pdf-redesigner-editor').length})()"),1);
  console.log('PASS STEP2 MULTITAB: new lock owner persists new edits after reload; no stale overwrite');
}finally{
  if(ws)ws.close();
  await browserSession.close();
  try{rmSync(temp,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
  catch(error){
    if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;
    console.warn('WARN STEP2 MULTITAB: temporary profile cleanup deferred ('+error.code+')');
  }
}
