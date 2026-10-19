// Synthetic IndexedDB v1 -> v2 upgrade regression; isolated Chrome profile.
import assert from 'node:assert/strict';
import {launchBrowser} from './browser-process.mjs';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const url=process.env.SMOKE_URL||'http://127.0.0.1:4173';
const dir=mkdtempSync(join(tmpdir(),'astra-idb-upgrade-'));
const browser=launchBrowser(process.env.CHROME_PATH||'chromium',dir,'IDB v1-to-v2');
let ws,sessionId,sequence=0;
const pending=new Map();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try {
  ws=await browser.connect();
  ws.addEventListener('message',event=>{
    const msg=JSON.parse(event.data);
    if(!msg.id||!pending.has(msg.id))return;
    const p=pending.get(msg.id);pending.delete(msg.id);
    msg.error?p.reject(Error(msg.error.message)):p.resolve(msg.result);
  });
  const request=(method,params={},sid)=>new Promise((resolve,reject)=>{
    const id=++sequence;pending.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})}));
  });
  const target=await request('Target.createTarget',{url:'about:blank'});
  ({sessionId}=await request('Target.attachToTarget',{targetId:target.targetId,flatten:true}));
  const send=(method,params={})=>request(method,params,sessionId);
  await send('Page.enable');await send('Runtime.enable');
  const evaluate=async expression=>{
    const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  // Install a pre-app script that creates a real v1 database, then allow app load
  // only after the v1 transaction commits. No production/user profile is used.
  const fixture=`(async()=>{
    const name='astra-pdf-redesigner:v2';
    const open=indexedDB.open(name,1);
    open.onupgradeneeded=()=>{
      const db=open.result;
      db.createObjectStore('documents',{keyPath:'id'});
      const assets=db.createObjectStore('assets',{keyPath:'id'});
      assets.createIndex('documentId','documentId',{unique:false});
      db.createObjectStore('meta');
    };
    const db=await new Promise((resolve,reject)=>{open.onsuccess=()=>resolve(open.result);open.onerror=()=>reject(open.error)});
    const tx=db.transaction(['documents','assets','meta'],'readwrite');
    tx.objectStore('documents').put({id:'ci-doc',name:'CI retained document',schemaVersion:2});
    tx.objectStore('assets').put({id:'ci-image',documentId:'ci-doc',bytes:new Uint8Array([0,1,127,255])});
    tx.objectStore('meta').put('ci-doc','activeDocumentId');
    tx.objectStore('meta').put(true,'v1MigrationFinished');
    await new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);tx.onerror=()=>reject(tx.error)});
    db.close();
    return true;
  })()`;
  // Navigate to origin with JavaScript disabled so application cannot initialize
  // before the v1 fixture is created.
  await send('Emulation.setScriptExecutionDisabled',{value:true});
  await send('Page.navigate',{url});
  await sleep(700);
  await send('Emulation.setScriptExecutionDisabled',{value:false});
  assert.equal(await evaluate(fixture),true);
  // Force an actual versionchange transaction abort. IndexedDB must restore
  // the old database version and stores, then allow the app to retry safely.
  const rollback=`(async()=>{
    const request=indexedDB.open('astra-pdf-redesigner:v2',2);
    request.onupgradeneeded=()=>{
      const db=request.result;
      db.createObjectStore('migrationAudit',{keyPath:'id'});
      request.transaction.abort();
    };
    const failure=await new Promise(resolve=>{
      request.onsuccess=()=>{request.result.close();resolve('unexpected-success')};
      request.onerror=()=>resolve(request.error?.name||'unknown-error');
    });
    const old=indexedDB.open('astra-pdf-redesigner:v2',1);
    const db=await new Promise((resolve,reject)=>{old.onsuccess=()=>resolve(old.result);old.onerror=()=>reject(old.error)});
    try {
      const get=req=>new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
      const docs=await get(db.transaction('documents').objectStore('documents').getAll());
      const assets=await get(db.transaction('assets').objectStore('assets').getAll());
      const active=await get(db.transaction('meta').objectStore('meta').get('activeDocumentId'));
      return {failure,version:db.version,stores:[...db.objectStoreNames],docs,assets:assets.map(a=>({...a,bytes:[...a.bytes]})),active};
    }finally{db.close()}
  })()`;
  const aborted=await evaluate(rollback);
  assert.equal(aborted.failure,'AbortError');
  assert.equal(aborted.version,1,'Aborted versionchange unexpectedly advanced DB version');
  assert.deepEqual(aborted.stores,['assets','documents','meta'],'Aborted versionchange left a new store');
  assert.deepEqual(aborted.docs,[{id:'ci-doc',name:'CI retained document',schemaVersion:2}]);
  assert.deepEqual(aborted.assets,[{id:'ci-image',documentId:'ci-doc',bytes:[0,1,127,255]}]);
  assert.equal(aborted.active,'ci-doc');
  console.log('PASS IDB v2 ROLLBACK: forced versionchange abort retained v1 schema, document, binary asset and active ID');
  await send('Page.reload',{ignoreCache:true});
  const inspect=`(async()=>{
    const open=indexedDB.open('astra-pdf-redesigner:v2');
    const db=await new Promise((resolve,reject)=>{open.onsuccess=()=>resolve(open.result);open.onerror=()=>reject(open.error)});
    const get=req=>new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
    try {
      const docs=await get(db.transaction('documents').objectStore('documents').getAll());
      const assets=await get(db.transaction('assets').objectStore('assets').getAll());
      const meta=await get(db.transaction('meta').objectStore('meta').get('activeDocumentId'));
      return {version:db.version,stores:[...db.objectStoreNames],docs,assets:assets.map(a=>({...a,bytes:[...a.bytes]})),meta};
    } finally {db.close()}
  })()`;
  let state;
  for(let i=0;i<80;i++){
    state=await evaluate(inspect);
    if(state.version===2)break;
    await sleep(200);
  }
  assert.equal(state.version,2);
  assert.deepEqual(state.stores,['assets','documents','meta','migrationAudit']);
  assert.deepEqual(state.docs,[{id:'ci-doc',name:'CI retained document',schemaVersion:2}]);
  assert.deepEqual(state.assets,[{id:'ci-image',documentId:'ci-doc',bytes:[0,1,127,255]}]);
  assert.equal(state.meta,'ci-doc');
  await send('Page.reload',{ignoreCache:true});
  await sleep(600);
  assert.deepEqual(await evaluate(inspect),state,'Second app launch changed preserved v1 records');
  console.log('PASS IDB v1 -> v2: documents, binary asset, active ID preserved; audit store added; reload idempotent');
} finally {
  if(ws)ws.close();
  await browser.close();
  // Browser process is gone, but Chrome helper processes may still release
  // profile files asynchronously. Cleanup must not turn a passed test red.
  try { rmSync(dir,{recursive:true,force:true,maxRetries:20,retryDelay:300}); }
  catch(error) { console.warn('WARN isolated Chrome profile cleanup:',error.message); }
}
