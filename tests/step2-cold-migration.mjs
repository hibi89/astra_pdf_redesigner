// Cold-start: pre-existing real V1 localStorage, fresh Chrome profile,
// actual STEP2 initialization. Only synthetic text; no user files.
import assert from 'node:assert/strict';
import {launchBrowser} from './browser-process.mjs';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const chrome=process.env.CHROME_PATH||'chromium',url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const origin=new URL(url).origin,key='astra-pdf-redesigner:current:v1',dbName='astra-pdf-redesigner:v2';
const injectAbort=process.env.STEP2_INJECT_MIGRATION_ABORT==='1';
const dir=mkdtempSync(join(tmpdir(),'astra-v1-cold-'));
const browserSession=launchBrowser(chrome,dir,'STEP2 cold-migration '+(injectAbort?'abort':'normal'));
let ws,sequence=0,sessionId;
const pending=new Map(),delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function request(method,params={},session){
  return new Promise((resolve,reject)=>{
    const id=++sequence;pending.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(session?{sessionId:session}:{})}));
  });
}
async function until(fn,check=value=>Boolean(value),timeout=15000){
  const begin=Date.now();let last;
  while(Date.now()-begin<timeout){
    try{const v=await fn();last=v;if(check(v))return v;}
    catch(e){if(!/Cannot find context|Execution context was destroyed|navigated or closed/i.test(String(e)))throw e;}
    await delay(120);
  }
  throw Error('V1 migration timeout: '+JSON.stringify(last));
}
const source={
  schemaVersion:1,
  document:{
    title:'V1 원본 문서 · 제목 123',author:'작성자 가나다',date:'2026-09-25',
    learned:'  첫 줄\n\n둘째 줄 & <tag> 100% \t 숫자 001  ',
    difficult:'',solved:'https://example.org/q?a=1&b=2\n#태그 \u00a0 공백',
    reflection:'끝맺음 줄\n\n다음 계획: 검증 1/2/3',
  },
  design:{theme:'diary',accent:'#7d5b8a',textSize:'large',font:'serif'},
};
const original=JSON.stringify(source);
try{
  const endpoint=await browserSession.devtools();
  ws=new WebSocket(endpoint);
  await new Promise((resolve,reject)=>{
    ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});
  });
  ws.addEventListener('message',event=>{
    const m=JSON.parse(event.data);
    if(m.id&&pending.has(m.id)){
      const p=pending.get(m.id);pending.delete(m.id);
      if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result);
    }
  });
  // The application has not loaded: seed at document creation before its JS.
  const target=await request('Target.createTarget',{url:'about:blank'});
  ({sessionId}=await request('Target.attachToTarget',{targetId:target.targetId,flatten:true}));
  const send=(method,params={})=>request(method,params,sessionId);
  await send('Page.enable');await send('Runtime.enable');
  const evaluate=async(expr)=>{
    const r=await send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});
    if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  // Abort after queuing the document write but before the migration transaction
  // commits its document, active ID, and marker. The fault is one-shot and
  // affects only the migration's combined documents+meta readwrite transaction.
  const fault=injectAbort?
    "const orig=IDBObjectStore.prototype.put;let injected=false;IDBObjectStore.prototype.put=function(value,...args){const req=orig.call(this,value,...args);if(!injected&&this.name==='documents'&&this.transaction.objectStoreNames.contains('meta')){injected=true;const tx=this.transaction;queueMicrotask(()=>{window.__astraMigrationAbortTriggered=true;try{tx.abort()}catch(e){window.__astraMigrationAbortError=String(e)}finally{IDBObjectStore.prototype.put=orig}})}return req};":"";
  const seed="(()=>{if(location.origin!=="+JSON.stringify(origin)+")return;localStorage.setItem("+JSON.stringify(key)+","+JSON.stringify(original)+");window.__astraV1Preseeded=true;"+fault+"})()";
  const {identifier}=await send('Page.addScriptToEvaluateOnNewDocument',{source:seed});
  await send('Page.navigate',{url});
  await until(()=>evaluate('window.__astraV1Preseeded===true'));
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier});
  assert.equal(await evaluate('localStorage.getItem('+JSON.stringify(key)+')'),original);

  const snapshotExpr="(async()=>{"+
    "const db=await new Promise((resolve,reject)=>{const r=indexedDB.open("+JSON.stringify(dbName)+");r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});"+
    "const get=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});"+
    "try{const docs=await get(db.transaction('documents','readonly').objectStore('documents').getAll());"+
    "const meta=db.transaction('meta','readonly').objectStore('meta');const a=meta.get('activeDocumentId'),m=meta.get('v1MigrationFinished');"+
    "const [active,marker]=await Promise.all([get(a),get(m)]);"+
    "return {docs,active,marker,v1:localStorage.getItem("+JSON.stringify(key)+")}}finally{db.close()}})()";
  if(injectAbort){
    await until(()=>evaluate("window.__astraMigrationAbortTriggered===true"));
    await until(()=>evaluate("Boolean(document.querySelector('.warning[role=alert]')?.textContent)"));
    assert.equal(await evaluate("window.__astraMigrationAbortError"),undefined,'Failed to abort the intended IndexedDB transaction');
    const failed=await evaluate(snapshotExpr);
    assert.equal(failed.docs.length,0,'An aborted migration left a partial V2 document');
    assert.equal(failed.marker,undefined,'An aborted migration left a false completion marker');
    assert.equal(failed.active,undefined,'An aborted migration changed the active V2 document');
    assert.equal(failed.v1,original,'An aborted migration modified the V1 original');
    console.log('PASS STEP2 MIGRATION ROLLBACK: forced IDB abort leaves no migrated doc, marker or active ID and preserves exact V1 bytes');
    // On a fresh page the one-shot fault is gone; migration must retry safely.
    await send('Page.reload',{ignoreCache:true});
    await until(()=>evaluate("Boolean(document.querySelector('.project-paper')&&document.querySelector('.doc-list-item.active')&&document.querySelector('.save-chip')?.textContent==='저장됨')"));
  }else{
    await until(()=>evaluate("Boolean(document.querySelector('.project-paper')&&document.querySelector('.doc-list-item.active')&&document.querySelector('.save-chip')?.textContent==='저장됨')"));
  }
  const initial=await evaluate(snapshotExpr);
  assert.equal(initial.v1,original,'Original V1 localStorage bytes were changed');
  assert.equal(initial.docs.length,1,'Cold start created unexpected blank/duplicate V2 documents');
  assert.equal(initial.marker,true,'Migration success marker missing');
  const doc=initial.docs[0];
  assert.equal(initial.active,doc.id,'Migrated document is not the active V2 document');
  assert.equal(doc.schemaVersion,2);
  assert.equal(doc.content.title,source.document.title);
  assert.equal(doc.name,source.document.title);
  assert.equal(doc.content.author,source.document.author);
  assert.equal(doc.content.date,source.document.date);
  assert.deepEqual(doc.design,source.design);
  assert.deepEqual(doc.content.sections.map(s=>[s.title,s.blocks[0]?.text]),[
    ['오늘 배운 내용',source.document.learned],
    ['어려웠던 점',source.document.difficult],
    ['해결 과정',source.document.solved],
    ['느낀 점 및 다음 계획',source.document.reflection],
  ]);
  assert.ok(doc.content.sections.every(s=>s.blocks.length===1&&s.blocks[0].kind==='paragraph'));
  const ids=[doc.id,...doc.content.sections.flatMap(s=>[s.id,...s.blocks.map(b=>b.id)])];
  assert.equal(new Set(ids).size,ids.length,'Migrated V2 IDs not independent');
  assert.equal(await evaluate("document.querySelectorAll('.doc-list-item').length"),1);
  assert.equal(await evaluate("document.querySelector('.project-paper')?.textContent.includes("+JSON.stringify('둘째 줄')+")"),true);
  console.log('PASS STEP2 COLD MIGRATION: pre-existing V1 record becomes one V2 document; exact text, whitespace, metadata, 4 sections, theme preserved');
  console.log('PASS STEP2 COLD MIGRATION: migration marker, active ID, independent block IDs and byte-identical V1 localStorage');

  const reload=async()=>{
    let listener,timer;
    const loaded=new Promise((resolve,reject)=>{
      listener=e=>{
        const m=JSON.parse(e.data);
        if(m.method==='Page.loadEventFired'&&m.sessionId===sessionId){
          clearTimeout(timer);ws.removeEventListener('message',listener);resolve();
        }
      };
      ws.addEventListener('message',listener);
      timer=setTimeout(()=>{ws.removeEventListener('message',listener);reject(Error('Reload timed out'));},15000);
    });
    try{await send('Page.reload',{ignoreCache:true});await loaded;}
    finally{clearTimeout(timer);ws.removeEventListener('message',listener);}
  };
  await reload();
  await until(()=>evaluate("Boolean(document.querySelector('.doc-list-item.active')&&document.querySelector('.project-paper'))"));
  assert.deepEqual(await evaluate(snapshotExpr),initial,'Migration duplicated or rewrote existing V1/V2 data during reload');
  console.log(injectAbort?'PASS STEP2 MIGRATION ROLLBACK: retry creates exactly one document, commits marker, preserves V1 bytes and remains idempotent after reload':'PASS STEP2 COLD MIGRATION: reload does not duplicate migrated record or change legacy source');
}finally{
  if(ws)ws.close();
  await browserSession.close();
  try{rmSync(dir,{recursive:true,force:true,maxRetries:12,retryDelay:250});}
  catch(error){
    if(!['ENOTEMPTY','EBUSY','EPERM'].includes(error?.code))throw error;
    console.warn('WARN STEP2: temporary cold-start profile cleanup deferred ('+error.code+')');
  }
}
